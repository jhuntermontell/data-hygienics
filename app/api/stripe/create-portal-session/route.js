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

    const serviceSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { data: sub } = await serviceSupabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    if (!sub?.stripe_customer_id) {
      return NextResponse.json({ error: 'No billing account found' }, { status: 404 })
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: `${request.headers.get('origin')}/tools/cyber-audit/dashboard`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Portal session error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
