import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { createClient } from '@supabase/supabase-js'
import { getActivePriceToPlan, getPurchaseTypeForPrice } from '@/lib/stripe/prices'

function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error(`Missing Supabase env vars: url=${!!url}, key=${!!key}`)
  }
  return createClient(url, key)
}

function planForPriceId(priceId) {
  return getActivePriceToPlan()[priceId] || 'free'
}

/**
 * Cross-check the supabase_user_id claimed in event metadata against the
 * user that owns this Stripe customer in our DB. If a record exists for the
 * customer under a different user, refuse to write entitlements: this is the
 * signal that someone tried to spoof metadata to grant themselves another
 * user's plan.
 */
async function verifyCustomerOwnership(supabase, customerId, claimedUserId) {
  if (!customerId || !claimedUserId) return false
  const { data: existing } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .maybeSingle()
  if (!existing) return true // No prior mapping; first-time customer for this user
  if (existing.user_id !== claimedUserId) {
    console.error(
      'WEBHOOK SECURITY: customer/user mismatch',
      { customerId, claimedUserId, dbUserId: existing.user_id }
    )
    return false
  }
  return true
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
          // Could be a timing issue with metadata propagation. Ask Stripe
          // to retry rather than permanently dropping the event.
          console.error('No supabase_user_id in session metadata')
          return NextResponse.json(
            { error: 'Missing user_id; will retry' },
            { status: 500 }
          )
        }

        // Cross-check: customer must belong to this user (or be brand new).
        // This is a deliberate security rejection; retrying will not change
        // the outcome, so we return 200 to stop Stripe from retrying.
        const ownsCustomer = await verifyCustomerOwnership(supabase, customerId, userId)
        if (!ownsCustomer) {
          console.error('Refusing to apply entitlements: customer/user mismatch')
          break
        }

        if (session.mode === 'subscription') {
          const subId = typeof session.subscription === 'string'
            ? session.subscription
            : session.subscription?.id

          if (!subId) {
            console.error('No subscription ID found on session', session.id)
            return NextResponse.json(
              { error: 'Missing subscription ID; will retry' },
              { status: 500 }
            )
          }

          // Always retrieve the current canonical state from Stripe so we
          // never overwrite newer state with stale event data.
          let subscription
          try {
            subscription = await stripe.subscriptions.retrieve(subId, {
              expand: ['items.data'],
            })
          } catch (stripeErr) {
            console.error('Failed to retrieve subscription from Stripe:', stripeErr.message)
            return NextResponse.json(
              { error: 'Stripe retrieve failed; will retry' },
              { status: 500 }
            )
          }

          const priceId =
            subscription.items?.data?.[0]?.price?.id ||
            (subscription.plan && subscription.plan.id) ||
            null
          const plan = planForPriceId(priceId)
          const periodEnd = subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000).toISOString()
            : null
          // Per-seat billing: Agency Plan subscribers carry a quantity that
          // determines their client cap. Other plans are always quantity 1.
          // subscription.items.data[0].quantity is the canonical source.
          const quantity =
            subscription.items?.data?.[0]?.quantity ||
            subscription.quantity ||
            1

          const upsertPayload = {
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subId,
            stripe_price_id: priceId,
            plan,
            status: subscription.status,
            current_period_end: periodEnd,
            quantity,
            updated_at: new Date().toISOString(),
          }

          // Guard against retried/stale checkout events overwriting a newer
          // subscription. Read the user's existing row first; if it points
          // at a different subscription that is still alive, refuse to
          // overwrite. Replays for the SAME subscription are still applied
          // (idempotent), and rows that point at a definitively dead
          // subscription are safe to replace.
          const { data: existingRow, error: existingRowError } = await supabase
            .from('subscriptions')
            .select('stripe_subscription_id, status')
            .eq('user_id', userId)
            .maybeSingle()

          if (existingRowError) {
            console.error(
              'Failed to read existing subscription for guard check:',
              JSON.stringify(existingRowError)
            )
            return NextResponse.json(
              { error: 'Supabase read failed; will retry' },
              { status: 500 }
            )
          }

          if (existingRow?.stripe_subscription_id) {
            if (existingRow.stripe_subscription_id !== subId) {
              const terminalStatuses = ['canceled', 'incomplete_expired', 'unpaid']
              if (!terminalStatuses.includes(existingRow.status)) {
                console.warn(
                  `checkout.session.completed: ignoring subscription ${subId} for user ${userId} ` +
                    `because they already have active subscription ${existingRow.stripe_subscription_id} (status: ${existingRow.status})`
                )
                break
              }
              // Existing subscription is terminal, safe to replace.
            }
            // Same subscription ID → idempotent replay, fall through.
          }

          console.log('Upserting subscription:', JSON.stringify(upsertPayload))

          const { error } = await supabase
            .from('subscriptions')
            .upsert(upsertPayload, { onConflict: 'user_id' })

          if (error) {
            console.error('Supabase upsert FAILED:', error.message, error.code, error.details)
            return NextResponse.json(
              { error: 'Supabase write failed; will retry' },
              { status: 500 }
            )
          }
        }

        if (session.mode === 'payment') {
          const paymentIntent = typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent?.id
          const priceId = session.metadata?.price_id

          const purchaseType = priceId ? getPurchaseTypeForPrice(priceId) : 'unknown'

          if (!paymentIntent) {
            console.error('Cannot record purchase without payment_intent', session.id)
            return NextResponse.json(
              { error: 'Missing payment_intent; will retry' },
              { status: 500 }
            )
          }

          // Preserve the whole session metadata object (which may include
          // price_id, supabase_user_id, and policy_slug for individual
          // policy purchases). The hub + server save route read
          // metadata.policy_slug to grant access to the specific policy
          // the user paid for.
          const purchaseMetadata = { ...(session.metadata || {}) }

          // Idempotent on payment_intent_id (unique constraint added in
          // 003_subscriptions.sql). Replayed events become no-ops.
          const { error } = await supabase
            .from('one_time_purchases')
            .upsert(
              {
                user_id: userId,
                stripe_payment_intent_id: paymentIntent,
                stripe_price_id: priceId || '',
                purchase_type: purchaseType,
                metadata: purchaseMetadata,
              },
              {
                onConflict: 'stripe_payment_intent_id',
                ignoreDuplicates: true,
              }
            )

          if (error) {
            console.error('Supabase upsert error (purchase):', JSON.stringify(error))
            return NextResponse.json(
              { error: 'Supabase write failed; will retry' },
              { status: 500 }
            )
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const eventSub = event.data.object
        const subId = eventSub.id
        const customerId = typeof eventSub.customer === 'string'
          ? eventSub.customer
          : eventSub.customer?.id || null

        // Retrieve canonical state from Stripe so out-of-order events do not
        // overwrite newer state.
        let subscription
        try {
          subscription = await stripe.subscriptions.retrieve(subId, {
            expand: ['items.data'],
          })
        } catch (stripeErr) {
          console.error('Failed to retrieve subscription on update:', stripeErr.message)
          return NextResponse.json(
            { error: 'Stripe retrieve failed; will retry' },
            { status: 500 }
          )
        }

        const priceId = subscription.items?.data?.[0]?.price?.id || null
        const plan = planForPriceId(priceId)
        // Per-seat billing: persist quantity changes so Agency Plan seat
        // upgrades/downgrades from the Stripe billing portal reach our DB.
        const quantity =
          subscription.items?.data?.[0]?.quantity ||
          subscription.quantity ||
          1

        const updatePayload = {
          stripe_price_id: priceId,
          plan,
          status: subscription.status,
          current_period_end: subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000).toISOString()
            : null,
          quantity,
          updated_at: new Date().toISOString(),
        }

        // PRIMARY: scope to the specific subscription. This prevents a late
        // event from a canceled subscription from overwriting the user's
        // current (newer) subscription.
        const { data: updated, error: updateError } = await supabase
          .from('subscriptions')
          .update(updatePayload)
          .eq('stripe_subscription_id', subId)
          .select('id')

        if (updateError) {
          console.error('Supabase update error (sub.updated):', JSON.stringify(updateError))
          return NextResponse.json(
            { error: 'Supabase write failed; will retry' },
            { status: 500 }
          )
        }

        if (updated && updated.length > 0) {
          break
        }

        // FALLBACK: no row matched on stripe_subscription_id. This happens
        // when the user just completed checkout and we have a row keyed on
        // stripe_customer_id but no subscription_id yet. Only attach if the
        // existing row has no subscription_id, OR if it already references
        // this same subscription. No-row branches are deliberate ignores.
        if (!customerId) break

        const { data: existingRow, error: existingError } = await supabase
          .from('subscriptions')
          .select('stripe_subscription_id')
          .eq('stripe_customer_id', customerId)
          .maybeSingle()

        if (existingError) {
          console.error(
            'Supabase read error (sub.updated, fallback):',
            JSON.stringify(existingError)
          )
          return NextResponse.json(
            { error: 'Supabase read failed; will retry' },
            { status: 500 }
          )
        }

        if (!existingRow) break

        if (
          !existingRow.stripe_subscription_id ||
          existingRow.stripe_subscription_id === subId
        ) {
          const { error: attachError } = await supabase
            .from('subscriptions')
            .update({ ...updatePayload, stripe_subscription_id: subId })
            .eq('stripe_customer_id', customerId)
          if (attachError) {
            console.error(
              'Supabase update error (sub.updated, attach):',
              JSON.stringify(attachError)
            )
            return NextResponse.json(
              { error: 'Supabase write failed; will retry' },
              { status: 500 }
            )
          }
        } else {
          console.warn(
            `Ignoring update for old subscription ${subId}; user has newer subscription ${existingRow.stripe_subscription_id}`
          )
        }
        break
      }

      case 'customer.subscription.deleted': {
        // Subscription is gone in Stripe; no retrieve possible. Set free/canceled.
        const subscription = event.data.object

        const { error } = await supabase
          .from('subscriptions')
          .update({
            plan: 'free',
            status: 'canceled',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)

        if (error) {
          console.error('Supabase update error (sub.deleted):', JSON.stringify(error))
          return NextResponse.json(
            { error: 'Supabase write failed; will retry' },
            { status: 500 }
          )
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        const subId = typeof invoice.subscription === 'string'
          ? invoice.subscription
          : invoice.subscription?.id

        if (!subId) break

        // Confirm current status from Stripe before writing past_due.
        let subscription
        try {
          subscription = await stripe.subscriptions.retrieve(subId)
        } catch (stripeErr) {
          console.error('Failed to retrieve subscription on payment_failed:', stripeErr.message)
          return NextResponse.json(
            { error: 'Stripe retrieve failed; will retry' },
            { status: 500 }
          )
        }

        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subId)

        if (error) {
          console.error('Supabase update error (invoice.failed):', JSON.stringify(error))
          return NextResponse.json(
            { error: 'Supabase write failed; will retry' },
            { status: 500 }
          )
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
