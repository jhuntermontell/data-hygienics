import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { createClient } from '@supabase/supabase-js'
import { PRICE_TO_PLAN, ONE_TIME_PRICES } from '@/lib/stripe/prices'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.metadata?.supabase_user_id

        if (!userId) break

        if (session.mode === 'subscription') {
          const subscription = await stripe.subscriptions.retrieve(session.subscription)
          const priceId = subscription.items.data[0]?.price?.id
          const plan = PRICE_TO_PLAN[priceId] || 'free'

          await supabase
            .from('subscriptions')
            .upsert({
              user_id: userId,
              stripe_customer_id: session.customer,
              stripe_subscription_id: session.subscription,
              stripe_price_id: priceId,
              plan,
              status: 'active',
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' })
        }

        if (session.mode === 'payment') {
          const paymentIntent = session.payment_intent
          const priceId = session.metadata?.price_id

          let purchaseType = 'unknown'
          if (priceId) {
            if (priceId.includes('elN')) purchaseType = 'assessment_bundle'
            else if (priceId.includes('emd')) purchaseType = 'policy_bundle'
            else if (priceId.includes('enL')) purchaseType = 'individual_policy'
          }

          await supabase
            .from('one_time_purchases')
            .insert({
              user_id: userId,
              stripe_payment_intent_id: typeof paymentIntent === 'string' ? paymentIntent : paymentIntent.id,
              stripe_price_id: priceId || '',
              purchase_type: purchaseType,
              metadata: session.metadata || {},
            })
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object
        const userId = subscription.metadata?.supabase_user_id

        if (!userId) break

        const priceId = subscription.items.data[0]?.price?.id
        const plan = PRICE_TO_PLAN[priceId] || 'free'

        await supabase
          .from('subscriptions')
          .update({
            stripe_price_id: priceId,
            plan,
            status: subscription.status === 'active' ? 'active' : subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object

        await supabase
          .from('subscriptions')
          .update({
            plan: 'free',
            status: 'canceled',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object

        if (invoice.subscription) {
          await supabase
            .from('subscriptions')
            .update({
              status: 'past_due',
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', invoice.subscription)
        }
        break
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err)
  }

  return NextResponse.json({ received: true })
}
