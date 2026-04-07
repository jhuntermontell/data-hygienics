import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { createClient } from '@supabase/supabase-js'
import { PRICE_TO_PLAN } from '@/lib/stripe/prices'

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
        // Retrieve the full session with subscription expanded
        const session = await stripe.checkout.sessions.retrieve(
          event.data.object.id,
          { expand: ['subscription', 'subscription.items.data'] }
        )
        const userId = session.metadata?.supabase_user_id

        if (!userId) {
          console.error('checkout.session.completed: no supabase_user_id in metadata')
          break
        }

        if (session.mode === 'subscription') {
          const subscription = typeof session.subscription === 'string'
            ? await stripe.subscriptions.retrieve(session.subscription, {
                expand: ['items.data'],
              })
            : session.subscription

          if (!subscription) {
            console.error('checkout.session.completed: subscription is null for session', session.id)
            break
          }

          const priceId = subscription.items?.data?.[0]?.price?.id
          const plan = PRICE_TO_PLAN[priceId] || 'free'

          console.log('Webhook: activating subscription', {
            userId,
            subscriptionId: subscription.id,
            priceId,
            plan,
            customerId: session.customer,
          })

          const { error } = await supabase
            .from('subscriptions')
            .upsert({
              user_id: userId,
              stripe_customer_id: typeof session.customer === 'string'
                ? session.customer
                : session.customer?.id,
              stripe_subscription_id: subscription.id,
              stripe_price_id: priceId,
              plan,
              status: 'active',
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' })

          if (error) {
            console.error('Supabase upsert error (subscription):', error)
          }
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

          const { error } = await supabase
            .from('one_time_purchases')
            .insert({
              user_id: userId,
              stripe_payment_intent_id: typeof paymentIntent === 'string' ? paymentIntent : paymentIntent?.id,
              stripe_price_id: priceId || '',
              purchase_type: purchaseType,
              metadata: session.metadata || {},
            })

          if (error) {
            console.error('Supabase insert error (purchase):', error)
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object
        const userId = subscription.metadata?.supabase_user_id

        if (!userId) {
          // Fall back: look up by stripe_subscription_id
          const priceId = subscription.items?.data?.[0]?.price?.id
          const plan = PRICE_TO_PLAN[priceId] || 'free'

          const { error } = await supabase
            .from('subscriptions')
            .update({
              stripe_price_id: priceId,
              plan,
              status: subscription.status === 'active' ? 'active' : subscription.status,
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', subscription.id)

          if (error) console.error('Supabase update error (sub.updated, no userId):', error)
          break
        }

        const priceId = subscription.items?.data?.[0]?.price?.id
        const plan = PRICE_TO_PLAN[priceId] || 'free'

        const { error } = await supabase
          .from('subscriptions')
          .update({
            stripe_price_id: priceId,
            plan,
            status: subscription.status === 'active' ? 'active' : subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId)

        if (error) console.error('Supabase update error (sub.updated):', error)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object

        const { error } = await supabase
          .from('subscriptions')
          .update({
            plan: 'free',
            status: 'canceled',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)

        if (error) console.error('Supabase update error (sub.deleted):', error)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object

        if (invoice.subscription) {
          const { error } = await supabase
            .from('subscriptions')
            .update({
              status: 'past_due',
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', typeof invoice.subscription === 'string'
              ? invoice.subscription
              : invoice.subscription.id)

          if (error) console.error('Supabase update error (invoice.failed):', error)
        }
        break
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
