import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { POLICY_SLUGS, FREE_POLICY_SLUGS } from "@/lib/policies"
import { isSubscriptionPaid } from "@/lib/stripe/entitlement"
import { getPlanAccess, STARTER_POLICY_LIMIT } from "@/lib/stripe/access"

/**
 * Server-side policy save. RLS only checks ownership, so without this
 * route any authenticated user could write any policy by hand-crafting a
 * Supabase request. This route additionally verifies that the requested
 * policy is within the user's entitlement before touching the database.
 */
export async function POST(request) {
  try {
    // Resolve the authenticated user (cookie session first, bearer token
    // fallback to match the other server routes in this project).
    let userId = null
    try {
      const supabase = await createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user?.id) userId = user.id
    } catch {
      // ignore
    }

    const service = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    if (!userId) {
      const authHeader = request.headers.get("authorization")
      if (authHeader) {
        const token = authHeader.replace("Bearer ", "")
        const {
          data: { user },
        } = await service.auth.getUser(token)
        if (user?.id) userId = user.id
      }
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse + validate request body
    const body = await request.json().catch(() => ({}))
    const { policySlug, policyData, companyInfo } = body

    if (!policySlug || !POLICY_SLUGS.includes(policySlug)) {
      return NextResponse.json({ error: "Invalid policy type" }, { status: 400 })
    }

    // Entitlement lookup. Fetch both in parallel and destructure errors.
    // A failed lookup returns 500 so a paid user never sees "upgrade
    // required" during a transient Supabase outage.
    const [
      { data: sub, error: subError },
      { data: purchases, error: purchaseError },
    ] = await Promise.all([
      service
        .from("subscriptions")
        .select("plan, status, current_period_end")
        .eq("user_id", userId)
        .maybeSingle(),
      service
        .from("one_time_purchases")
        .select("purchase_type, metadata")
        .eq("user_id", userId),
    ])

    if (subError || purchaseError) {
      console.error(
        "Policy entitlement lookup failed:",
        JSON.stringify(subError || purchaseError)
      )
      return NextResponse.json(
        { error: "Could not verify policy access. Please try again." },
        { status: 500 }
      )
    }

    const plan = sub?.plan || "free"
    const status = sub?.status || "inactive"
    const isPaid = isSubscriptionPaid(sub)
    // Merged access: plan grants + one-time purchase grants (docs_pack,
    // policy_bundle, etc). access.canAccessPolicies being true here means
    // the user has full-library access through ANY source.
    const access = getPlanAccess(plan, status, purchases || [])

    const isFreePolicy = FREE_POLICY_SLUGS.includes(policySlug)
    const hasIndividualPurchase = (purchases || []).some(
      (p) =>
        p.purchase_type === "individual_policy" &&
        p.metadata?.policy_slug === policySlug
    )

    // Always look up whether the user already has this policy. Used by
    // both the Starter pre-check and the post-insert race check below.
    const { data: existingPolicy, error: existingError } = await service
      .from("generated_policies")
      .select("id")
      .eq("user_id", userId)
      .eq("policy_type", policySlug)
      .maybeSingle()

    if (existingError) {
      console.error(
        "Failed to look up existing policy:",
        JSON.stringify(existingError)
      )
      return NextResponse.json(
        { error: "Could not verify policy access. Please try again." },
        { status: 500 }
      )
    }

    // Build the "NOT IN" clause used by both the pre-check and post-check
    // for non-free policies. If there are no free slugs, the filter is a
    // no-op (all policies count).
    async function countStarterPolicies() {
      let query = service
        .from("generated_policies")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
      if (FREE_POLICY_SLUGS.length > 0) {
        query = query.not(
          "policy_type",
          "in",
          `(${FREE_POLICY_SLUGS.map((s) => `"${s}"`).join(",")})`
        )
      }
      return query
    }

    let authorized = false
    if (isFreePolicy) {
      authorized = true
    } else if (hasIndividualPurchase) {
      authorized = true
    } else if (access.canAccessPolicies) {
      // Any source of full-library access: Protection / Agency subscription,
      // legacy Professional / MSP subscription, legacy Policy Bundle purchase,
      // or Documentation Pack purchase. getPlanAccess has already merged
      // these into a single flag, so this branch handles all of them.
      authorized = true
    } else if (isPaid && plan === "starter") {
      // Starter: 2 paid policies. Editing existing never counts.
      if (existingPolicy) {
        authorized = true
      } else {
        const { count, error: countError } = await countStarterPolicies()
        if (countError) {
          console.error(
            "Failed to count Starter policies:",
            JSON.stringify(countError)
          )
          return NextResponse.json(
            { error: "Could not verify policy access. Please try again." },
            { status: 500 }
          )
        }
        if ((count || 0) < STARTER_POLICY_LIMIT) {
          authorized = true
        }
      }
    }

    if (!authorized) {
      return NextResponse.json(
        { error: "Upgrade required to access this policy" },
        { status: 403 }
      )
    }

    // Save the policy (service role bypasses RLS; user_id is forced from
    // the authenticated session, never from the request body).
    const { data, error } = await service
      .from("generated_policies")
      .upsert(
        {
          user_id: userId,
          policy_type: policySlug,
          company_name: companyInfo?.companyName || "",
          policy_data: { companyInfo, selections: policyData },
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,policy_type" }
      )
      .select()
      .single()

    if (error) {
      console.error("Policy save failed:", error)
      return NextResponse.json({ error: "Could not save policy" }, { status: 500 })
    }

    // Race-condition mitigation for Starter limit. If we just inserted a
    // new (non-free, non-existing) policy as a Starter user, re-count
    // non-free policies. If the post-count exceeds the limit, another
    // concurrent save beat us to it: roll this row back and return 403.
    // Free policies, edits of existing rows, full-library users (via any
    // source: plan OR purchase), and individual buyers all skip this check
    // because they do not consume Starter quota.
    if (
      plan === "starter" &&
      !isFreePolicy &&
      !existingPolicy &&
      !hasIndividualPurchase &&
      !access.canAccessPolicies
    ) {
      const { count: postCount, error: postCountError } =
        await countStarterPolicies()

      if (postCountError) {
        console.error(
          "Post-insert Starter quota check failed:",
          JSON.stringify(postCountError)
        )
        // We cannot verify whether the save pushed the user over the
        // limit. Roll back the just-inserted row to be safe.
        const { error: rollbackError } = await service
          .from("generated_policies")
          .delete()
          .eq("user_id", userId)
          .eq("policy_type", policySlug)
        if (rollbackError) {
          console.error(
            "CRITICAL: Starter quota rollback also failed:",
            JSON.stringify(rollbackError),
            { userId, policySlug }
          )
        }
        return NextResponse.json(
          { error: "Could not verify policy quota. Please try again." },
          { status: 500 }
        )
      }

      if ((postCount || 0) > STARTER_POLICY_LIMIT) {
        const { error: rollbackError } = await service
          .from("generated_policies")
          .delete()
          .eq("user_id", userId)
          .eq("policy_type", policySlug)

        if (rollbackError) {
          // The insert succeeded but the rollback failed. The user is
          // now over the Starter limit. Log loudly and 500 so the client
          // surfaces a "contact support" message rather than silently
          // granting an extra policy.
          console.error(
            "CRITICAL: Failed to rollback over-limit Starter policy:",
            JSON.stringify(rollbackError),
            { userId, policySlug, postCount }
          )
          return NextResponse.json(
            {
              error:
                "Policy limit exceeded and cleanup failed. Please contact support.",
            },
            { status: 500 }
          )
        }

        return NextResponse.json(
          {
            error:
              "Your Starter plan's 2-policy limit is reached. Upgrade to the Documentation Pack to unlock all 9 policies.",
          },
          { status: 403 }
        )
      }
    }

    return NextResponse.json({ success: true, policy: data })
  } catch (err) {
    console.error("Policy save route error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
