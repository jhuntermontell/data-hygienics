import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { createClient } from '@supabase/supabase-js'
import { PRICE_TO_PLAN } from '@/lib/stripe/prices'

function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error(`Missing Supabase env vars: url=${!!url}, key=${!!key}`)
  }
  return createClient(url, key)
}

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

  const supabase = getServiceSupabase()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.metadata?.supabase_user_id
        const customerId = typeof session.customer === 'string'
          ? session.customer
          : session.customer?.id || null

        console.log('checkout.session.completed:', {
          sessionId: session.id,
          mode: session.mode,
          userId,
          customerId,
          subscriptionRaw: session.subscription,
        })

        if (!userId) {
          console.error('No supabase_user_id in session metadata')
          break
        }

        if (session.mode === 'subscription') {
          const subId = typeof session.subscription === 'string'
            ? session.subscription
            : session.subscription?.id

          if (!subId) {
            console.error('No subscription ID found on session', session.id)
            break
          }

          let subscription
          try {
            subscription = await stripe.subscriptions.retrieve(subId)
          } catch (stripeErr) {
            console.error('Failed to retrieve subscription from Stripe:', stripeErr.message)
            break
          }

          let priceId = subscription.items?.data?.[0]?.price?.id
          if (!priceId && subscription.plan) {
            priceId = subscription.plan.id
          }

          const plan = PRICE_TO_PLAN[priceId] || 'free'
          const periodEnd = subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000).toISOString()
            : null

          const upsertPayload = {
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subId,
            stripe_price_id: priceId,
            plan,
            status: 'active',
            current_period_end: periodEnd,
            updated_at: new Date().toISOString(),
          }

          console.log('Upserting subscription:', JSON.stringify(upsertPayload))

          const { data, error, status, statusText } = await supabase
            .from('subscriptions')
            .upsert(upsertPayload, { onConflict: 'user_id' })
            .select()

          console.log('Supabase upsert response:', {
            data: JSON.stringify(data),
            error: JSON.stringify(error),
            status,
            statusText,
          })

          if (error) {
            console.error('Supabase upsert FAILED:', error.message, error.code, error.details)
          }
        }

        if (session.mode === 'payment') {
          const paymentIntent = typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent?.id
          const priceId = session.metadata?.price_id

          let purchaseType = 'unknown'
          if (priceId) {
            if (priceId.includes('elN')) purchaseType = 'assessment_bundle'
            else if (priceId.includes('emd')) purchaseType = 'policy_bundle'
            else if (priceId.includes('enL')) purchaseType = 'individual_policy'
          }

          const { data, error } = await supabase
            .from('one_time_purchases')
            .insert({
              user_id: userId,
              stripe_payment_intent_id: paymentIntent || 'unknown',
              stripe_price_id: priceId || '',
              purchase_type: purchaseType,
              metadata: session.metadata || {},
            })
            .select()

          if (error) {
            console.error('Supabase insert error (purchase):', JSON.stringify(error))
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object
        const userId = subscription.metadata?.supabase_user_id

        const priceId = subscription.items?.data?.[0]?.price?.id
        const plan = PRICE_TO_PLAN[priceId] || 'free'

        const updatePayload = {
          stripe_price_id: priceId,
          plan,
          status: subscription.status === 'active' ? 'active' : subscription.status,
          current_period_end: subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000).toISOString()
            : null,
          updated_at: new Date().toISOString(),
        }

        // Try by user_id first, fall back to stripe_subscription_id
        if (userId) {
          const { error } = await supabase
            .from('subscriptions')
            .update(updatePayload)
            .eq('user_id', userId)

          if (error) console.error('Supabase update error (sub.updated):', JSON.stringify(error))
        } else {
          const { error } = await supabase
            .from('subscriptions')
            .update(updatePayload)
            .eq('stripe_subscription_id', subscription.id)

          if (error) console.error('Supabase update error (sub.updated, by subId):', JSON.stringify(error))
        }
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

        if (error) console.error('Supabase update error (sub.deleted):', JSON.stringify(error))
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        const subId = typeof invoice.subscription === 'string'
          ? invoice.subscription
          : invoice.subscription?.id

        if (subId) {
          const { error } = await supabase
            .from('subscriptions')
            .update({
              status: 'past_due',
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', subId)

          if (error) console.error('Supabase update error (invoice.failed):', JSON.stringify(error))
        }
        break
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err.message, err.stack)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
