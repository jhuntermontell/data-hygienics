# Data Hygienics Verified: the 17-control baseline

Written 2026-11-04. Status: draft for the owner's approval. Nothing in this document is built. It follows `design/strategy/business-plan-2026.md`, which governs, and it is the first of the Verified specs. Later specs cover the evidence review queue, the connectors, the carrier pack and the agency plan; this one defines what Verified checks.

The plan's sentence that this spec serves: "The core paid product is a checked evidence record across 17 controls. Each control on the public verify page shows how it was proven: checked by API, document reviewed, or owner attested."

## 1. What the baseline is

The baseline is a fixed, versioned list of seventeen controls. A Verified record is that list, filled in for one business, with a dated state and a proof type on every line. Version `2027.1` is the launch baseline. Control ids are stored keys and public anchors, so they are never renamed; a control that changes meaning gets a new id and the old one is retired with a date.

Each control carries:

- `id`, `name`, `group`, and a one-sentence `promise` in the owner's voice: what is true when it passes.
- `question`: the one plain-English question the Hygienist asks first.
- `proof`: the proof methods accepted, strongest first. When a stronger method is available to this business (a connected tenant, a generated document), a weaker one is not accepted for that control.
- `rule`: the deterministic pass condition, written as a predicate over facts. Facts come from checks, from reviewed evidence, or from an attestation. The rules engine evaluates the rule; nothing else decides a pass.
- `validity`: how long a pass stands before it expires without fresh proof.
- `drift`: which live check can contradict the state, and so flip it to `drifted`.
- `refs`: NIST CSF 2.0 subcategory and CIS Controls v8 IG1 safeguard, named as references the control maps to, in our own words. CIS numbers appear on public pages only after the CIS license answer (a November milestone); NIST CSF is public domain and always shown.
- `library`: the control explainer and guide the line links to.
- `insurer`: reserved for the carrier pack. Empty in `2027.1`.

States per control:

| State | Meaning | Shown on the verify page as |
|---|---|---|
| `passed` | the rule holds on current facts | the proof type and date |
| `open` | no proof yet, or the rule does not hold | "Not yet" |
| `expired` | the last pass is older than `validity` | "Needs fresh proof" |
| `drifted` | a live check now contradicts the last pass | "Changed since last check" |
| `not_applicable` | allowed only where the control says so, with a stated reason | the reason, in one line |

There is no score, grade, percentage or tier for the record as a whole. The page shows seventeen lines and the MFA tier reached. The Cyber Audit keeps grading; Verified never does.

Proof types, from strongest to weakest, and how each is named in public:

| `proof` | What it is | Public label |
|---|---|---|
| `api` | a read-only check of a connected Microsoft 365 or Google Workspace tenant | Checked by API |
| `dns` | a public DNS or TLS lookup of a domain the owner has proven they control | Checked by lookup |
| `generated` | a document made and dated inside Data Hygienics (an IR plan, a policy, a drill record, a training record) | Made and dated here |
| `document` | an uploaded document or screenshot, facts extracted by the Hygienist, extraction confirmed by a person in the review queue | Document reviewed |
| `attested` | the owner's dated statement, allowed only where the control lists it | Owner attested |

The Hygienist (the AI guide) explains each control, asks for evidence, and extracts facts from documents with a pointer to where in the document each fact came from. It never produces a state. The reviewer in the queue confirms or corrects the extracted facts; they do not pass or fail the control either. The rules engine does, from the facts.

## 2. The seventeen controls

Grouped the way the verify page shows them. "Rec" marks a recommendation that the owner can change.

### Sign-in

**1. `mfa` Multi-factor authentication, in three tiers.**
Promise: nobody signs in to our email, files or admin tools with a password alone.
Question: when someone signs in to your email from a new device, what happens after the password?
Tiers:
- Tier 1: MFA enforced for every user on the identity provider (Microsoft 365 or Google Workspace) and on every admin account. Microsoft Security Defaults count as a pass, as the plan requires, so tenants without Conditional Access are not shut out. Google: 2-Step Verification enforced for all organizational units with no exempt users.
- Tier 2: Tier 1, plus MFA on every other system that offers it: remote access, banking and payment portals, the password manager, payroll, the practice or case management system, and legacy sign-in blocked (control 3).
- Tier 3: phishing-resistant MFA for everyone: passkeys or FIDO2 security keys, Windows Hello for Business, or certificate-based sign-in, enforced through a Conditional Access authentication strength or Google's security-key-only setting.
Proof: `api` for the tenant (enforcement state, exempt users, authentication strengths); `document` for the systems outside the tenant (a settings page screenshot per system); `attested` only when no tenant is connected, and then the line says so.
Rule: Tier 1 passes when the tenant reports enforcement for all users and admins with zero exemptions, or Security Defaults on. Tier 2 adds reviewed proof for each system the owner listed in control 10's inventory as supporting MFA. Tier 3 adds the authentication strength or key-only policy covering all users.
Validity: 90 days; the tenant check re-runs weekly.
Drift: the tenant check (an exemption added, Security Defaults turned off, a strength policy removed).
Refs: NIST CSF 2.0 PR.AA-03; CIS v8 6.3, 6.4, 6.5. Library: `multi-factor-authentication`.
Rec: the record passes at Tier 1 in 2027 with the tier reached shown on the page, and the minimum rises to Tier 2 on a date announced a year ahead. The plan's target of Tier 3 for everyone is the direction, shown as the top of the ladder.

**2. `admin_accounts` Admin accounts are separate, few and named.**
Promise: the accounts that can change everything are not the accounts we read email on, and we know whose they are.
Question: who can change settings for everyone, and do they use a separate account to do it?
Proof: `api` (global admin and super admin count, whether those accounts also hold a mailbox or license, last sign-in); `document` for systems outside the tenant; `attested` only with no tenant.
Rule: at most four global admins (Microsoft's published guidance recommends fewer than five; cite the page and its date before this number appears anywhere public), none shared, each a dedicated account without a mailbox, or a break-glass account documented as such, and every admin at MFA Tier 1 or above.
Validity: 90 days; weekly check. Drift: the tenant check.
Refs: PR.AA-05; CIS 5.4. Library: `access-control-policy`, `access-review`.

**3. `legacy_signin` Old sign-in methods are blocked.**
Promise: nothing can sign in with just a password through an old protocol that skips MFA.
Question: can an old email app or scanner still sign in with only a password?
Proof: `api` (Microsoft: basic authentication and legacy protocol state, or Security Defaults on; Google: less secure app access and app passwords disabled); `attested` only with no tenant, and then it is `not_applicable` for businesses with no cloud identity provider.
Rule: legacy authentication blocked tenant-wide with no per-user exceptions.
Validity: 90 days; weekly check. Drift: the tenant check.
Refs: PR.AA-03; CIS 6.3. Library: `multi-factor-authentication`.

### Email

**4. `email_auth` Email that claims to be from us can be checked.**
Promise: other mail systems can tell our real mail from forgeries, and we told them to reject the forgeries.
Question: what is your domain's DMARC policy?
Proof: `dns` only, using the lookup code from `lib/email-check/` against every sending domain the owner has proven they control (a one-time TXT challenge per domain).
Rule: SPF published with a single record ending in `-all` or `~all`; DMARC published with `p=quarantine` or `p=reject` at `pct=100` and a reporting address; DKIM found for at least one selector of the primary sending service.
Validity: continuous; checked weekly. Drift: the lookup.
Refs: PR.DS-02; CIS 9.5. Library: `email-authentication`.

**5. `email_protection` Phishing and dangerous attachments are filtered before people see them.**
Promise: a filter that checks links and attachments sits in front of every mailbox, and staff can report a suspicious message with one click.
Question: what checks a message for bad links or attachments before it reaches an inbox?
Proof: `api` (Microsoft Defender for Office 365 Safe Links and Safe Attachments policies, or Exchange Online Protection defaults with the preset security policy applied; Google: enhanced pre-delivery scanning and attachment protection on; the report-message feature state); `document` for a third-party filter (its policy page); `attested` only with neither.
Rule: a link and attachment scanning policy applied to all users, and a reporting path shown.
Validity: 90 days; weekly check where `api`. Drift: the tenant check.
Refs: PR.PS-05; CIS 9.6, 9.7. Library: `email-filtering`, `email-reporting`.

### Devices

**6. `endpoint_protection` Every computer runs managed protection.**
Promise: each computer we work on runs protection that someone can see from one console, and we know how many computers there are.
Question: how many computers does the business use, and what shows you they are all protected?
Proof: `document` (the protection console's device list with counts and last-seen dates, against the device inventory the Hygienist collects); `api` later, when Intune or Google endpoint management is connected (not in `2027.1`); `attested` is not accepted for this control.
Rule: the console count equals the inventory count, every device seen in the last 30 days, no device with protection off.
Validity: 180 days. Drift: none until a device-management connector exists.
Refs: DE.CM-09; CIS 10.1, 10.2. Library: `endpoint-protection`.

**7. `patching` Updates install on their own, and nothing unsupported is in use.**
Promise: operating systems and browsers update automatically, and we run nothing the maker stopped supporting.
Question: how do updates get installed, and is anything in use that its maker no longer supports?
Proof: `document` (the same console's OS version list, or a device-management report); `attested` for businesses under five devices, with the device inventory listed line by line.
Rule: every device on a supported OS version with automatic updates on; no device more than 60 days behind the current release.
Validity: 180 days. Drift: none in `2027.1`.
Refs: PR.PS-02; CIS 7.3, 7.4. Library: `patch-management`.

**8. `device_encryption` Lost devices keep their data.**
Promise: a lost laptop or phone gives up nothing, and we can wipe it.
Question: if a laptop were left in a taxi tonight, what could the finder read?
Proof: `document` (BitLocker or FileVault status from the console, mobile device management enrollment with remote wipe); `attested` for businesses under five devices, line by line.
Rule: every laptop encrypted, every phone that holds business mail enrolled with remote wipe available.
Validity: 180 days. Drift: none in `2027.1`.
Refs: PR.DS-01; CIS 3.6. Library: `device-encryption`, `remote-wipe`.

### Data

**9. `backups` Backups exist off-site and have been restored on purpose.**
Promise: a copy of what matters lives somewhere ransomware on our network cannot reach, and we have proved we can get it back.
Question: when did you last restore a file from backup to prove it works?
Proof: `document` (a backup job report dated within 30 days showing an off-site or immutable destination, and a restore test record dated within 12 months); `generated` for the restore test when it is logged through the Hygienist's restore-test checklist.
Rule: an off-site or immutable copy with a successful job in the last 30 days, and a restore test in the last 12 months.
Validity: the job report, 90 days; the restore test, 12 months. Drift: none.
Refs: PR.DS-11, RC.RP-03; CIS 11.2, 11.3, 11.4, 11.5. Library: `data-backup`, `backup-testing`.

### People and access

**10. `access_lifecycle` Access is granted on purpose and removed on time.**
Promise: when someone leaves, their access ends within one business day, and every quarter we look at who still has what.
Question: when the last person left, how long did their email keep working?
Proof: `api` (accounts disabled in the period, last sign-in of disabled accounts, a list of enabled accounts for the review); `generated` (the quarterly access review completed through the Hygienist, listing every account and the owner's decision); `document` (an offboarding checklist with dates); `attested` not accepted.
Rule: a completed access review in the last 90 days covering every enabled account in the tenant, and no account for a departed person enabled more than one business day after their end date (the review asks).
Validity: 90 days. Drift: the tenant check (an account enabled that the last review marked for removal).
Refs: PR.AA-01, PR.AA-05; CIS 5.1, 5.3, 6.1, 6.2. Library: `employee-offboarding`, `access-review`.

**11. `credentials` Passwords are unique and kept in a manager.**
Promise: nobody reuses a password across systems, because a manager makes each one and remembers it.
Question: where do staff keep the passwords they cannot remember?
Proof: `document` (the password manager's admin console showing seats and enrollment); `attested` for businesses under five people, naming the manager.
Rule: a business password manager with every staff member enrolled, and the manager itself at MFA Tier 1 or above.
Validity: 12 months. Drift: none.
Refs: PR.AA-01; CIS 5.2. Library: `password-management`.

**12. `training` Everyone has been trained in the last year, and we can show the record.**
Promise: every person who works here finished security training in the last twelve months, and we keep the completion record.
Question: when did the most recently hired person do their security training?
Proof: `generated` (completion records from Data Hygienics training, a 2027 add-on); `document` (completion records from another provider, with names and dates, matched against the staff list from control 10).
Rule: a completion in the last 12 months for every active account holder, and within 30 days of start for anyone hired in the period.
Validity: 12 months, rolling per person. Drift: the tenant check (a new account with no completion after 30 days).
Refs: PR.AT-01; CIS 14.1 to 14.6. Library: `security-training`, `security-onboarding`, `phishing-training`.

### Plans and papers

**13. `incident_plan` A written plan exists, with names, and was exercised this year.**
Promise: if something happens at 9 p.m., the people who need to act know the plan and have practiced it.
Question: who is the first person called when something looks wrong, and when did you last walk through the plan?
Proof: `generated` (an IR plan from the IR Plan Builder with named roles and contacts, and a tabletop completion record from its exercises); `document` (another plan, reviewed for the same fields).
Rule: a plan dated or reviewed in the last 12 months with at least two named roles, outside contacts, and a tabletop or live exercise in the last 12 months.
Validity: 12 months. Drift: none.
Refs: GV.RR-01, RS.MA-01; CIS 17.1 to 17.4. Library: `incident-response-plan`, `emergency-contacts`.

**14. `written_program` The written security program matches the business.**
Promise: the policies we are asked for exist, say what we actually do, and were reviewed this year.
Question: which written policy would you hand a client who asked for one?
Proof: `generated` (policies from the Policy Library: at minimum the information security policy, the acceptable use policy and the AI acceptable use policy, plus the industry one the overlay names: the WISP for tax and accounting firms, the HIPAA risk analysis and policies for practices); `document` (equivalent policies from elsewhere, reviewed for the required sections).
Rule: the required set for the business's industry overlay, each dated or reviewed in the last 12 months and acknowledged by staff where the policy requires it.
Validity: 12 months. Drift: none.
Refs: GV.PO-01, GV.PO-02; CIS 14.1 (the policy element). Library: `ai-acceptable-use`, `data-classification`, `byod-policy`.

### Money

**15. `payment_verification` Nobody moves money on an email alone, and we have practiced saying no.**
Promise: a change of bank details or a new payee is confirmed by a call to a number we already had, every time, and we have drilled it.
Question: if the owner emailed the bookkeeper today asking for an urgent wire, what would the bookkeeper do?
Proof: `generated` (the written rule from the payment verification module and a dated fraud drill record with the outcome); `document` (a written procedure from elsewhere, plus the drill record); `attested` not accepted, because the drill is the point.
Rule: a written two-channel rule covering new payees and changed details, named approvers, and a drill in the last 12 months in which the test request was stopped.
Validity: 12 months. Drift: none.
Refs: GV.RR-04, PR.AA-06; CIS 14.2 (training element). Library: `out-of-band-verification`, guide `two-channel-verification-for-payments`.

### What's connected

**16. `connected_apps` We know every app and AI tool with access to our mail and files.**
Promise: every third-party app and AI connector that can read our mail, files or calendar is on a list we reviewed, and nobody can add one without an admin.
Question: which apps and AI tools can read your email or files right now, without anyone typing a password?
Proof: `api` (Microsoft: enterprise applications and user consent settings, with granted permissions; Google: connected third-party apps and the setting that restricts unreviewed apps); `generated` (the AI tools inventory completed through the Hygienist, from the Cyber Audit's AI Use section); `attested` only with no tenant, for the inventory alone.
Rule: user consent to new apps requires an admin (Microsoft) or unreviewed apps are blocked (Google), every app holding mail or file read scopes appears in the reviewed inventory with an owner and a reason, and the inventory was reviewed in the last 90 days.
Validity: 90 days; weekly check. Drift: the tenant check (a new grant with mail or file scopes, or the consent setting loosened).
Refs: ID.AM-02, PR.AA-05, GV.SC-04; CIS 2.1, 2.3, 15.1. Library: `vendor-risk-management`, `ai-acceptable-use`, `lock-down-your-ai-assistants` (guide).

### Outside view

**17. `external_exposure` Nothing of ours is open to the internet that should not be.**
Promise: no remote desktop, file share or admin page of ours answers to strangers, and our domain and website are locked down.
Question: can someone on the internet reach a remote desktop or file share of yours by typing an address?
Proof: `dns` and outside-in lookups against domains and addresses the owner has proven they control, and only those: TLS on the website, security headers, the registrar lock state, DNS records that point at remote access services, and a port check of the business's own public address for remote desktop, SMB, database and VNC ports, run only after a consent step that names the address; `attested` for the registrar account's MFA.
Rule: no listening remote desktop, SMB, database or VNC port on the proven addresses; HTTPS on the website with a valid certificate; registrar lock on and registrar MFA attested.
Validity: continuous; checked weekly. Drift: the lookup.
Refs: ID.AM-01, PR.IR-01; CIS 4.4, 12.2, 13.10 (reference only; the ports list is ours). Library: `firewall-management`, `vpn-remote-access`, `network-monitoring`.
Rec: this control never scans anything the owner has not proven they control, never scans third parties, and never claims to have found everything. The page says "checked for these ports on this date".

## 3. The tenant checks, named

Read-only scopes only, listed in plain English on the connection screen and on the public security page. `2027.1` reads:

| Fact | Microsoft 365 (Graph, read-only) | Google Workspace (Admin SDK, read-only) |
|---|---|---|
| MFA enforcement, exemptions, authentication strength | Security Defaults state; Conditional Access policies and their authentication strengths; per-user MFA state; authentication methods policy | 2-Step Verification enforcement per OU, exempt users, enforcement method |
| Admin accounts | directory role members for Global Administrator and privileged roles; mailbox and license on each; last sign-in | super admins and delegated admins; last sign-in |
| Legacy sign-in | authentication policies, Security Defaults | less secure apps setting; app passwords |
| Email protection | Defender for Office 365 Safe Links and Safe Attachments policies; preset security policies; report message setting | enhanced pre-delivery scanning; attachment protection; spoofing protection settings |
| Accounts for the access review | enabled and disabled users, last sign-in, created date | users, suspended state, last login |
| Connected apps | service principals with granted permissions; user consent setting | OAuth tokens by app with scopes; API access control settings |

What is never requested: mail content, file content, Drive scopes (the plan excludes them to avoid Google's paid security assessment), calendar content, Teams or Chat content, write permissions of any kind.

What is stored from a check: the facts in the table above, as a summary (counts, states, policy names, dates), the time of the check, and a hash of the raw response for dispute. Not the raw response, not user lists beyond what the access review needs, and nothing from a tenant ever reaches a public page.

## 4. The verify page

Lives at `/verify/<slug>`, indexable, one per Verified record whose owner turned the page on. Data Hygienics' own page goes live first and is the first real record.

Shows: the business name and the primary domain the owner chose to show; "Checked evidence as of <date>" with the baseline version; seventeen lines, each with the state, the public proof label and the date; the MFA tier reached, with the three tiers named; one line per control on what it means; a dated line on what the record is ("a dated history of what Data Hygienics checked and how") and what it is not ("not a certification, not a warranty, not a statement that this business cannot be breached"); a link to the method page that explains every proof type.

Never shows: tenant names or ids, user or device counts, admin names, lists of apps, IP addresses, raw evidence, the owner's name, which carrier the business applied to, or any statistic. The plan's Q1 2027 pass bar is "no tenant detail reachable from public pages"; a public projection with only the allowed columns enforces it at the database, not in the page code.

Words on the page follow the plan: "Verified" and "checked evidence", never "certified", "compliant", "secure", "protected" or "safe". The page carries the site's night header and reads on a day surface like a library entry.

## 5. The data model

One Verified record per account in `2027.1`. The owner's account is the business. Organizations with several users arrive with the agency plan in 2028 and are a separate spec. New tables, all with row-level security:

- `verified_records`: `id`, `user_id`, `business_name`, `slug`, `primary_domain`, `industry` (the overlay), `baseline_version`, `public` (the verify page on or off), `status` (`active`, `lapsed`), `lapsed_at`, timestamps.
- `verified_controls`: `record_id`, `control_id`, `state`, `tier` (MFA only), `proof_type`, `facts` (jsonb, the facts the rule was evaluated on), `passed_at`, `valid_until`, `evaluated_at`, `reason` (for `not_applicable`).
- `verified_evidence`: `record_id`, `control_id`, `kind`, `storage_path` (private bucket), `uploaded_at`, `extracted_facts` (jsonb, with pointers), `review_status` (`pending`, `confirmed`, `corrected`, `rejected`), `reviewed_by`, `reviewed_at`, `retention_until`.
- `verified_checks`: `record_id`, `control_id`, `source` (`m365`, `google`, `dns`, `external`), `checked_at`, `facts` (jsonb summary), `raw_hash`, `changed` (true when the facts differ from the previous check).
- `verified_connections`: `record_id`, `provider`, `tenant_ref` (an opaque id, not the tenant name), `scopes`, `token_ciphertext` (encrypted with a server-side key, never the Supabase key), `granted_at`, `revoked_at`, `last_check_at`.
- `insurer_answers` (lands with the carrier pack, reserved here): `record_id`, `carrier`, `question_id`, `answer`, `answered_at`; drift alerts compare a check's facts against these.
- `verified_public`: a view projecting only the columns in section 4; the only thing the verify page reads.

Retention: evidence files are deleted 30 days after a record lapses unless the owner exports them; check summaries and control states are kept as the record's history. Entitlement: `canAccessVerified` in `lib/stripe/access.js`, for new plans `verified` and `verified_plus`, with every grandfathered paid plan excluded unless the owner decides otherwise; `profiles.is_admin` reaches the review queue.

## 6. The rules engine

A pure module with relative imports so a Node harness runs it: `lib/verified/baseline.js` (the seventeen controls as data, exactly the fields in section 1), `lib/verified/rules.js` (one predicate per control over a facts object), `lib/verified/evaluate.js` (record plus facts in, control states out, with `valid_until` and the MFA tier), `lib/verified/drift.js` (previous facts, new facts and insurer answers in, drift events out). `scripts/verified-check.mjs` runs fixtures: every control in every state, each MFA tier, Security Defaults as a Tier 1 pass, an exemption as drift, an expired restore test, a connected tenant that disallows `attested` for control 1.

The validator gains a Verified section: every control has every field, every `library` slug resolves, every `refs` entry is well-formed, no public label contains a banned word, and ids never change between baseline versions (a retired id stays in the file with `retiredAt`).

The Hygienist's extraction is `lib/verified/extract/` prompts that return facts with pointers and a confidence; it is called from the evidence route and nowhere else, and the queue shows the pointer beside each fact so the reviewer can confirm in seconds. The plan's gate before automatic confirmation: the extraction agrees with the founder on at least 95 of 100 test items; until then every extraction is confirmed by a person.

## 7. What changes elsewhere

- The Cyber Audit keeps its full assessments and grades. Its free quick check (thirteen questions today) becomes the seventeen baseline questions, answered as self-reported and shown as "Where you stand on the seventeen", with no grade and no state, leading to Verified. Rec: yes, so the free tool and the paid record speak the same language.
- The legal industry track returns as a question bank built on the seventeen questions plus the legal overlay notes; `lib/questions/retired/legal.js` stays frozen for stored assessments.
- The industry overlays (healthcare, financial and tax, legal, government contractor, retail, general) add notes and the required policy set to the same seventeen controls. No overlay adds a control in `2027.1`.
- Cleanup found while reading: `lib/questions/quick.js` points at control slugs that do not exist in `lib/controls.js` (`endpoint-detection-response`, `data-backup-recovery`, `email-security`, `security-awareness-training`, `privileged-access-management`, `network-security`, `device-management`, `ai-tool-inventory`, `ai-data-handling`, `ai-vendor-features`). Fix with the quick check rewrite.
- The controls library stays as education and gains nothing new for `2027.1`; `connected_apps` and `payment_verification` link to existing explainers and guides.

## 8. Build order for Q1 2027

Each step is one pull request and ships behind nothing the step before has not proved.

1. `lib/verified/` with the baseline data, rules, evaluation, drift and the harness; the validator section. No UI, no tables.
2. The migration for the tables in section 5 and the `verified_public` view; our own record created by a script; the verify page at `/verify/data-hygienics` with `generated`, `dns`, `document` and `attested` proof only. Pass bar: the build passes and no tenant detail is reachable from any public page.
3. The Hygienist's intake for the seventeen questions, evidence upload to a private bucket, extraction with pointers, and the review queue for admins. Every extraction confirmed by a person.
4. The Microsoft Graph connector after publisher verification, then the Google Admin SDK connector after OAuth verification (the plan's Q2 milestone). If either slips, launch with steps 1 to 3 and say "document reviewed" on those lines.
5. Drift: weekly re-checks, the `changed` flag, owner alerts by email; `insurer_answers` and the carrier pack return here as their own spec.
6. The `verified` and `verified_plus` plans in `scripts/stripe-setup.mjs` and `lib/stripe/prices.js`, the pricing page door, the Documentation Pack credit within 60 days, and `canAccessVerified`.

The first ten customers are concierge: the founder runs the intake with them, which is where the questions and the rules get corrected before anyone else sees them.

## 9. Decisions that are the owner's

Each with a recommendation. The spec is written as if the recommendation holds.

1. The minimum MFA tier to pass in 2027. Rec: Tier 1, with the tier shown, and Tier 2 as the announced minimum from a 2028 date.
2. One record per account, with organizations deferred to the agency plan. Rec: yes.
3. Where `attested` is allowed. Rec: as listed per control, and never for control 1, 2, 3, 5 or 16 when a tenant is connected, never for 6, 10 or 15 at all.
4. The scope of `external_exposure`. Rec: proven domains and addresses only, with a named consent step before any port check, and no third-party scanning ever.
5. The quick check becomes the seventeen questions. Rec: yes.
6. The public labels: "Checked by API", "Checked by lookup", "Made and dated here", "Document reviewed", "Owner attested", "Not yet", "Needs fresh proof", "Changed since last check". Rec: these, pending your ear.
7. CIS safeguard numbers on public pages. Rec: only after the license answer; NIST CSF 2.0 references always.
8. What `verified_plus` at about $948 adds. Rec: the Texas evidence pack, the connected-app checks on more than one tenant, and the client trust page when it exists; confirm against the plan's pricing table before the Stripe setup.

## 10. What this spec leaves to later specs

The evidence review queue's screens and the reviewer's day; the connector consent screens and the Microsoft and Google verification steps; the carrier pack and `insurer_answers`; the agency plan and organizations; the training module and its completion records; the Texas evidence pack; the binder export. Each will cite this document and its baseline version.
