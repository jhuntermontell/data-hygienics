// Our own Verified record: the facts the rules are evaluated on, kept by
// hand by the owner. scripts/verified-seed-own.mjs reads this file, adds the
// live DNS lookup of the primary domain, runs lib/verified/evaluate.js and
// writes the result. Nothing here sets a state: a line passes only when the
// rule holds on these facts.
//
// Every proof carries `asOf`, the day it speaks for, and a comment saying
// where it came from. Facts are summaries (counts, states, dates), never
// names or raw responses. Write only what you can show: an owner statement
// (`attested`) is the owner's dated word and belongs here only when the
// owner typed it. Leave a control out and its line reads "Not yet".
//
// Shapes: the comment above each rule in lib/verified/rules.js.

export const RECORD = {
  slug: "data-hygienics",
  businessName: "Data Hygienics",
  // The domain shown on the page and looked up for email_auth.
  primaryDomain: "datahygienics.com",
  // The industry overlay (lib/verified/baseline.js OVERLAYS).
  industry: "general",
  // The verify page is on: /verify/data-hygienics.
  public: true,
}

export const CONTEXT = {
  // No Microsoft 365 or Google Workspace connector yet (build order step 4),
  // so `api` proof is not available and tenant lines wait.
  tenant: null,
  // Mail for datahygienics.com is handled by Google Workspace (the MX
  // lookup in scripts/email-check.mjs, 2026-11-05), so legacy_signin applies.
  cloudIdentity: true,
  // Not inventoried yet: the Hygienist's intake collects these in step 3.
  deviceCount: undefined,
  staffCount: undefined,
  overlay: "general",
  systems: [],
}

export const FACTS = {
  // email_auth.dns is filled by the live lookup in verified-seed-own.mjs on
  // every run (pass --no-lookup to skip it and leave the line as it was).
  //
  // Everything else waits for its evidence. Examples of the shape, for when
  // the owner has it:
  //
  // external_exposure: {
  //   attested: { asOf: "2026-11-05", registrarMfa: true },
  // },
}
