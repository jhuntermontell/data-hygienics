import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import {
  isConfiguredPriceId,
  isNewCheckoutPriceId,
  isSubscriptionPriceId,
  isOneTimePriceId,
  isPerSeatPriceId,
} from '@/lib/stripe/prices'

// Agency Plan minimum seat count. Enforced server-side so a client cannot
// talk itself down to fewer seats than the published pricing promises.
const AGENCY_MIN_SEATS = 5
const AGENCY_MAX_SEATS = 500

export async function POST(request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.id

    // Parse the body but only trust priceId. mode/successUrl/cancelUrl are
    // ignored. Any client-supplied metadata is whitelisted below.
    const body = await request.json().catch(() => ({}))
    const priceId = typeof body.priceId === 'string' ? body.priceId : null

    if (!priceId) {
      return NextResponse.json({ error: 'Missing priceId' }, { status: 400 })
    }

    // ----- Reject placeholders and obviously-malformed IDs up-front ---------
    // Belt-and-suspenders: lib/stripe/prices.js filters placeholders out of
    // every allow-list, so this check is almost redundant — but an explicit
    // reject here keeps the error message crisp ("not configured" vs.
    // generic "invalid") and survives any future refactor of the helpers.
    if (!isConfiguredPriceId(priceId)) {
      return NextResponse.json(
        { error: 'Price ID is not configured for this environment' },
        { status: 400 }
      )
    }

    // ----- Allow-list: new-catalog SKUs only --------------------------------
    // Legacy Starter / Professional / MSP / Assessment Bundle / Policy Bundle /
    // Individual Policy IDs are deliberately NOT reachable through this
    // route even though isSubscriptionPriceId() / isOneTimePriceId() still
    // recognize them elsewhere. Grandfathered subscribers update their
    // existing subscriptions through the Stripe billing portal, not through
    // a fresh checkout session. Accepting a legacy ID here would let a
    // crafted POST body resurrect the old catalog for new signups.
    if (!isNewCheckoutPriceId(priceId)) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 })
    }

    // ----- Mode is forced based on the priceId, never trusted from client ---
    // isSubscriptionPriceId / isOneTimePriceId both return true for the
    // subset we just allow-listed, so this detection is exact.
    const isSub = isSubscriptionPriceId(priceId)
    const isOneTime = isOneTimePriceId(priceId)
    if (!isSub && !isOneTime) {
      // Defensive: isNewCheckoutPriceId above should guarantee one of
      // these is true, but fail closed if it ever does not.
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 })
    }
    const mode = isSub ? 'subscription' : 'payment'

    // ----- Per-seat quantity for Agency Plan -------------------------------
    // Only the Agency priceId accepts a quantity; every other SKU is
    // forced to quantity 1 regardless of what the client sends. The
    // minimum seat count is enforced server-side so a crafted request
    // cannot start a $29/mo subscription instead of the $145/mo minimum.
    let quantity = 1
    if (isPerSeatPriceId(priceId)) {
      const requested = Number.parseInt(body.quantity, 10)
      if (!Number.isFinite(requested) || requested < AGENCY_MIN_SEATS) {
        return NextResponse.json(
          {
            error: `Agency Plan requires at least ${AGENCY_MIN_SEATS} client seats.`,
          },
          { status: 400 }
        )
      }
      if (requested > AGENCY_MAX_SEATS) {
        return NextResponse.json(
          {
            error: `Agency Plan is capped at ${AGENCY_MAX_SEATS} client seats per account. Contact us for larger deployments.`,
          },
          { status: 400 }
        )
      }
      quantity = requested
    }

    // ----- Whitelist client metadata. Add new keys explicitly here. ---------
    const allowedClientMetadata = {}
    if (typeof body.policySlug === 'string' && body.policySlug.length > 0) {
      allowedClientMetadata.policy_slug = body.policySlug.slice(0, 100)
    }

    // ----- Get or create Stripe customer ------------------------------------
    const serviceSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Check for an existing local record first
    const { data: existingSub } = await serviceSupabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .maybeSingle()

    let customerId = null
    let needsLocalUpsert = false
    if (existingSub?.stripe_customer_id) {
      // Verify the Stripe customer still exists and was not deleted
      try {
        const existingCustomer = await stripe.customers.retrieve(
          existingSub.stripe_customer_id
        )
        if (existingCustomer && !existingCustomer.deleted) {
          customerId = existingSub.stripe_customer_id
        }
      } catch {
        // Customer missing or unreadable; we'll create a fresh one
        customerId = null
      }
    }

    if (!customerId) {
      // Before creating a new customer, check Stripe for an existing one
      // tied to this email. This handles the orphan case where a previous
      // attempt created the customer but failed to save the row locally.
      // Pull a small page (not just limit:1) so we can pick the best match
      // when multiple customers share an email.
      try {
        const existingCustomers = await stripe.customers.list({
          email: user.email,
          limit: 10,
        })

        let mappedCustomer = null
        let orphanCustomer = null
        for (const c of existingCustomers.data) {
          if (c.metadata?.supabase_user_id === userId) {
            mappedCustomer = c
            break
          }
          if (!c.metadata?.supabase_user_id && !orphanCustomer) {
            orphanCustomer = c
          }
        }

        if (mappedCustomer) {
          // Already mapped to this user; reuse it.
          customerId = mappedCustomer.id
          needsLocalUpsert = true
        } else if (orphanCustomer) {
          // Legacy/orphaned customer with no user mapping. Claim it.
          await stripe.customers.update(orphanCustomer.id, {
            metadata: { supabase_user_id: userId },
          })
          customerId = orphanCustomer.id
          needsLocalUpsert = true
        }
        // If every result is mapped to a DIFFERENT user, we deliberately
        // do nothing and create a fresh customer below.
      } catch (err) {
        console.error('Failed to search for existing Stripe customer:', err.message)
        // Fall through to creating a new customer; better to risk a duplicate
        // than to block checkout entirely.
      }
    }

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: userId },
      })
      customerId = customer.id
      needsLocalUpsert = true
    }

    // Persist locally only when we changed state (new customer or recovered
    // orphan). If we cannot track the customer in our DB, fail closed so the
    // next attempt has a chance to recover via the orphan-search branch.
    if (needsLocalUpsert) {
      const { error: upsertError } = await serviceSupabase
        .from('subscriptions')
        .upsert(
          {
            user_id: userId,
            stripe_customer_id: customerId,
            plan: 'free',
            status: 'inactive',
          },
          { onConflict: 'user_id' }
        )

      if (upsertError) {
        console.error('Failed to save Stripe customer locally:', upsertError)
        return NextResponse.json(
          { error: 'Unable to initialize checkout. Please try again.' },
          { status: 500 }
        )
      }
    }

    // ----- Build redirect URLs from the request origin (server-side only) --
    const origin = new URL(request.url).origin
    const success_url = `${origin}/tools/cyber-audit/dashboard?welcome=true`
    const cancel_url = `${origin}/pricing`

    // ----- Build session params. supabase_user_id is the LAST field set so
    //       any client-side spread cannot override it. For payment mode the
    //       webhook reads session.metadata.price_id to derive purchase_type,
    //       so price_id MUST live on session.metadata (not only on
    //       payment_intent_data.metadata, which is a separate Stripe bucket).
    // -----------------------------------------------------------------------
    const sessionParams = {
      customer: customerId,
      line_items: [{ price: priceId, quantity }],
      mode,
      success_url,
      cancel_url,
      metadata: {
        ...allowedClientMetadata,
        ...(mode === 'payment' ? { price_id: priceId } : {}),
        supabase_user_id: userId,
      },
    }

    if (mode === 'subscription') {
      sessionParams.subscription_data = {
        metadata: { supabase_user_id: userId },
      }
      // For Agency Plan, allow the user to adjust seat count from the
      // Stripe-hosted checkout page. Billing portal updates flow through
      // the webhook's subscription.updated handler, which re-reads the
      // current quantity and persists it to our row.
      if (isPerSeatPriceId(priceId)) {
        sessionParams.line_items[0].adjustable_quantity = {
          enabled: true,
          minimum: AGENCY_MIN_SEATS,
          maximum: AGENCY_MAX_SEATS,
        }
      }
    } else {
      // payment_intent_data.metadata is duplicated for Stripe dashboard
      // searches; the webhook uses session.metadata above.
      sessionParams.payment_intent_data = {
        metadata: {
          ...allowedClientMetadata,
          price_id: priceId,
          supabase_user_id: userId,
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
