import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

export async function POST(request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { priceId, mode, successUrl, cancelUrl, metadata } = await request.json()

    if (!priceId || !mode) {
      return NextResponse.json({ error: 'Missing priceId or mode' }, { status: 400 })
    }

    // Get or create Stripe customer
    const serviceSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { data: sub } = await serviceSupabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    let customerId = sub?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id

      await serviceSupabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          stripe_customer_id: customerId,
          plan: 'free',
          status: 'inactive',
        }, { onConflict: 'user_id' })
    }

    const sessionParams = {
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode,
      success_url: successUrl || `${request.headers.get('origin')}/tools/cyber-audit/dashboard?welcome=true`,
      cancel_url: cancelUrl || `${request.headers.get('origin')}/pricing`,
      metadata: {
        supabase_user_id: user.id,
        ...metadata,
      },
    }

    if (mode === 'subscription') {
      sessionParams.subscription_data = {
        metadata: { supabase_user_id: user.id },
      }
    }

    if (mode === 'payment') {
      sessionParams.payment_intent_data = {
        metadata: {
          supabase_user_id: user.id,
          price_id: priceId,
          ...metadata,
        },
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (err) {
    console.error('Checkout session error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
