import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import {
  isSubscriptionPriceId,
  isOneTimePriceId,
} from '@/lib/stripe/prices'

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

    // ----- Validate priceId against the active environment's price list -----
    const isSub = isSubscriptionPriceId(priceId)
    const isOneTime = isOneTimePriceId(priceId)
    if (!isSub && !isOneTime) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 })
    }

    // ----- Mode is forced based on the priceId, never trusted from client ---
    const mode = isSub ? 'subscription' : 'payment'

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
      line_items: [{ price: priceId, quantity: 1 }],
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
