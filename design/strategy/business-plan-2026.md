# Data Hygienics Business Plan

Oct 31, 2026 · @Hunter

Owner's decision, Nov 4, 2026: this plan governs. Where it conflicts with `five-year-value-roadmap.md`, the October pivot, or any strategy note in this folder, this plan wins. The reconciliation below records what that reverses and what it leaves alone.

## Status in the repository (Nov 4, 2026)

The plan was written from an older snapshot of the code. This section is the bridge between the plan and what is actually in the repository, so nobody builds from the wrong map.

**Live today:** the Cyber Audit (quick check and full assessment for healthcare, financial, general, government, nonprofit and retail, each with the shared AI Use section), the Policy Library (the AI Acceptable Use Policy free and first), the Controls Library, the IR Plan Builder with live incident mode, tabletop exercises, the threat library (healthcare and financial industry briefs plus AI-era threats), the Clear Path, Threat Check, Ask Data Hygienics for members, and the Home map (PR 10, pending).

**Removed in the October 2026 pivot and reinstated by this plan:** the insurance translation layer (carrier question mapping, the proof pack, drift against insurer answers) and vendor security facts. They return under this plan's language rules: say what was checked and when, never "insurance-ready" or "certified". The retired URLs under `/vendors*` and `/tools/vendor-scorecard*` still redirect to `/toolkit` until the new pages exist.

**Removed in the pivot and returning with the 17-control baseline:** the legal industry track for the Cyber Audit. `lib/questions/retired/legal.js` stays frozen for stored assessments until the rewritten baseline lands; new Legal assessments open then, not before.

**Still removed, and this plan agrees:** the per-client MSP plan and branded multi-client reports, paused until 2029 and only as a flat per-portfolio fee.

**Pricing today versus the plan:** the live catalog is the Membership (Home and Business) plus the Documentation Pack. Ongoing Protection is retired from sale in code. This plan prices it at $49 a month again; it returns to sale when the Verified catalog is created in Stripe, and stays retired until then. The Home membership has no place in this plan: existing Home members keep what they bought, and no new household paid offer is built in 2027.

**What this plan does not change:** the household work stays free and gets finished, not expanded (the Clear Path, Threat Check, the Home map and the rest of the Watch phase one). The brand personality that merged in October stays (see the design system in the appendix, corrected below). The custody rule for households from the roadmap stays: no household device lists, account maps or recovery notes on our side. Business evidence is different, and this plan holds it on purpose, under the data-handling rules in the legal section.

**Next, in order:** the November milestones (broker conversations, the CIS answer, an E&O quote, an hour of counsel, Supabase on a paid plan), then the free email spoofing check, the Texas SB 2610 page and the forced-moment articles, then the 17-control baseline and Data Hygienics' own verify page.

## The problem

Small business owners are increasingly asked to prove their security, and almost none of them can. The person asked is rarely technical: an office manager, a CFO, a firm partner or the owner, who inherited the job because nobody else would take it. We call this person the reluctant tech leader.

The requests come from outside the business, at moments the owner does not choose:

- **The insurer.** Cyber applications ask detailed questions about MFA, backups, endpoint protection and incident plans. In 2022 Travelers rescinded a policy after a ransomware claim because the insured's MFA answer turned out to be incomplete ([Lockton](https://global.lockton.com/us/en/news-insights/travelers-v-ics-underscores-need-to-respond-carefully-to-cyber-insurance)). Policies increasingly require that controls stay in place all year, not just on the day the application is signed.
- **The client.** Law firms now expect outside vendors to track and disclose AI use, and enterprise customers send security questionnaires to their small suppliers.
- **The regulator.** Tax preparers and CPA firms must keep a written information security plan under the FTC Safeguards Rule. Medical practices answer to HIPAA. Texas lets firms under 250 employees block punitive damages after a breach only if they can show a qualifying program existed at the time.
- **The criminal.** Business email compromise and funds transfer fraud were 58 percent of claims in Coalition's 2025 book ([Coalition](https://www.coalitioninc.com/announcements/2026-cyber-claims-report)). The defense is a procedure the staff actually follows, and proof that they do.

The owner's options are poor. Managed IT providers sell the products they recommend, so their advice carries a conflict of interest, and about 20 percent of small businesses use one at all. Compliance platforms such as Vanta start around $10,000 a year and are built for venture-backed software companies. Insurer tools are free but tied to one carrier. Free training badges prove only that someone watched a course.

The result is a confidence gap. Most owners believe they are covered, about a third have a current incident response plan, and the answers they give their insurer quietly stop being true as staff change and settings drift.

## The solution

Data Hygienics is the neutral record that proves a small business is as careful as it says. It helps the owner put the right controls in place, checks them where software can, and keeps a dated evidence record the owner can hand to an insurer, client, regulator or buyer. It never sells security products, takes referral fees or partners with vendors, so its findings carry no hidden agenda.

**Built and live today at [datahygienics.com](https://datahygienics.com):**

| Tool | What it does |
| --- | --- |
| Cyber Audit | A 12-question quick check and a full assessment for seven industries, mapped to NIST CSF and CIS Controls, with plain-English rubrics and step-by-step remediation |
| Policy Library | Nine insurance-ready policies generated through a wizard and exported as PDFs |
| Controls Library | 30 controls explained in plain English, free and public |
| Vendor Security Scorecards | Neutral security reviews of ten common small-business tools, such as QuickBooks, Microsoft 365 and Clio. Removed in October 2026; returns under this plan |
| Incident Response Plan Builder | A role-aware plan with five playbooks and a live incident mode that logs every action with timestamps |
| Tabletop Exercises | Scored scenario walkthroughs with completion records |
| Insurance Translation Layer | Maps assessment answers to the application questions of Coalition, Cowbell, Travelers and Beazley, flags denial risks, and builds an evidence proof pack. Removed in October 2026; returns under this plan |
| Threat Library | Industry threat pages for healthcare and financial firms plus AI-era threats, sourced from FBI IC3, Verizon DBIR and CISA. The legal page returns with the legal track |

**Next: Data Hygienics Verified (2027).** The core paid product is a checked evidence record across 17 controls. Each control on the public verify page shows how it was proven: checked by API, document reviewed, or owner attested.

- **Read-only checks** of Microsoft 365 or Google Workspace settings, such as phishing-resistant MFA, admin accounts, legacy sign-in and connected apps.
- **Public DNS checks** of email spoofing protection.
- **AI-reviewed evidence** for backups, endpoint protection, training and plans, with a human review queue.
- **Drift alerts** when a live setting contradicts an answer the owner gave their insurer.
- **An evidence binder,** a carrier application pack, and a public verify page.
- **The Hygienist,** an AI guide that explains each step in plain English and collects evidence, but can never mark a control passed. A rules engine decides every pass.

**Add-ons on the same record:** a payment verification module with a dated fraud drill; a connected apps and AI connector inventory; a Texas safe harbor evidence pack with a framework revision watch; training with completion records and continuing-education credit; and a flat-fee submission pack for insurance agencies.

**Later (2028 to 2031):** a client trust page and questionnaire answer library with an AI-use statement, an AI tools policy and agent register, a HIPAA business associate verification kit, a handover pack for staff turnover and business sales, and a consented evidence feed for insurers once one accepts it.

## Why now

Proof demands on small businesses are rising faster than federal rules, and the tools to check evidence cheaply only just arrived.

- **Insurers want proof, not promises.** Carriers now tell insureds to keep dated configuration reports, logs and training records, and some policies require controls to stay in place mid-term ([National Law Review](https://natlawreview.com/article/client-alert-tightening-gate-how-cyber-insurance-carriers-are-raising-bar), September 2026). Producer E&O guidance tells agents to document that clients verified their technical answers.
- **States and clients moved while Washington stalled.** The HIPAA Security Rule update slipped to a July 2027 target and CMMC third-party audits were suspended in 2026. Meanwhile Texas's safe harbor took effect in September 2025, 24 states have privacy laws, and 82 percent of general counsel expect outside firms to track and share AI use.
- **Attacks outgrew the old checklist.** Token theft and adversary-in-the-middle phishing more than doubled in early 2026, defeating ordinary MFA. Frontier AI models now find and exploit software flaws for under $1,000 per exploit ([Anthropic](https://www.anthropic.com/research/mythos-preview)), so patch windows have effectively closed.
- **Platforms made basic checks cheap.** Microsoft Graph and the Google Admin SDK expose MFA, sign-in and connected-app data through read-only permissions, so one developer can verify settings that once took a consultant's afternoon.
- **AI collapsed the cost of guidance.** A guided evidence review costs a few dollars of model time per customer, which makes a $468 product viable where a consultant would charge thousands.
- **AI use created a new proof gap.** About six in ten small business owners say staff use public AI tools, but only about a third have a written AI policy. AI agents connected to business email and files are the next unmanaged risk.

## Competition and positioning

No US company sells a neutral, owner-facing, checked evidence record to small businesses for a few hundred dollars a year. The market splits into five camps, and each leaves the reluctant tech leader underserved.

| Camp | Examples | Price | What it proves | Why it misses our buyer |
| --- | --- | --- | --- | --- |
| Enterprise compliance platforms | Vanta, Drata, Secureframe | About $7,500 to $30,000+ a year | Audit-ready SOC 2 and ISO evidence | Built for venture-backed software sellers; priced 20 to 40 times higher |
| Insurer tools | Coalition Control, Cowbell 365, At-Bay | Free or bundled | External scan results for one carrier | Not neutral; tied to buying that carrier's policy |
| MSP compliance platforms | Cynomi, ControlMap (ScalePad), Guardz | Sold per client through MSPs | Whatever the MSP chooses to show | Only about 20 percent of small firms use an MSP, and the MSP also sells the fixes |
| Self-attested certificates | CyberCert (SMB1001) | From about AU$95 to AU$395 a year for lower tiers | A director signed a form | No audit at the cheap tiers; no published US insurer acceptance found |
| Vertical point tools | Medcurity, Accountable, Compliancy Group, Verito | About $499 to $8,000 a year | One regulation (HIPAA or WISP) | One rule at a time; no insurance or client view |

Free education such as the Cyber Readiness Institute's program anchors the value of a badge near zero, which is why Data Hygienics does not sell a badge.

**Positioning: the neutral proof and trust layer.** For owners: "the record that proves your business is as careful as you say." We scored four possible positions against the research, and this one led clearly. A pure insurance-readiness tool would miss the roughly half of small firms with no cyber policy, and a broad "digital hygiene" platform is the right destination for 2031 but too early to sell today.

**What we are not:** not a managed IT provider, not a reseller, not a certification body, not a GRC suite for venture-backed startups, and not an insurance agency.

**Defensibility comes from four things competitors cannot easily copy:**

1. Structural neutrality, since no revenue depends on what the owner buys.
2. The evidence record itself. A dated history of drift and fixes grows more valuable each month and does not transfer to a competitor.
3. Curated knowledge bases nobody else maintains, such as vendor security facts and a versioned insurance question taxonomy.
4. Practitioner credibility. The founder has incident response, federal and MSP experience, plus CompTIA Security+, NIST CSF and CIS Controls work.

**The biggest competitive threat** is platform absorption: Microsoft or Google shipping an insurer-ready posture export. The defense is a record that covers what no single platform sees, such as payment procedures, vendors, training, plans and people.

## Business model and pricing

Data Hygienics earns money only from customers paying for access: an annual subscription for small businesses, a one-time entry pack, and a flat subscription for insurance agencies. Prices sit just above a signature-only certificate and far below compliance platforms.

| Offer | Price | Who buys | What it includes |
| --- | --- | --- | --- |
| Free tools | $0 | Anyone | Quick audit, controls library, vendor scorecards, threat pages, email spoofing check, Texas tier checker |
| Documentation Pack | $299 one-time | An owner facing a forced moment now | Full assessment, all policies, IR plan, insurance readiness report; full credit toward a Verified year within 60 days |
| Ongoing Protection, monthly | $49 a month | Owners who want tools without a public record | Everything except the public verify page, which requires a 12-month term |
| Verified, under 20 staff | $468 a year | Small firms, the core plan | Checked evidence record, verify page, binder, carrier pack, drift alerts, fraud drill, bundled CE |
| Verified, 20 to 99 staff (to test) | About $948 a year | Larger firms with client and Texas pressure | Verified plus the Texas evidence pack, connected-app checks, and later the trust page |
| Texas evidence pack | $299 one-time, or inside the $948 tier | Texas firms of 20 to 99 staff | Time-stamped IG1 control log, written program, framework revision watch |
| Agency plan | Flat $99 to $199 a month per agency | Independent insurance agencies | Four-carrier submission pack, client readiness dashboard; never priced per policy |
| MSP portfolio seat | Paused until 2029 | Quality MSPs | Returns as a flat per-portfolio fee with neutrality guardrails |

**Why these prices.** Vertical tools charge $499 for a HIPAA risk assessment, $999 for a WISP and up to $2,028 a year for HIPAA software ([Medcurity](https://medcurity.com/hipaa-compliance), [Verito](https://www.verito.com/buy-written-information-security-plan), [Accountable](https://www.accountablehq.com/pricing)), each covering a single rule. Verified covers several rules plus insurance and client proof for less. At the low end, 53 percent of businesses under 10 employees spend under 1 percent of their budget on security, so $468 is the ceiling for the smallest firms, not the floor.

**What is never sold:** leads, referrals, sponsored placements, customer data, or anything priced by what an owner buys from someone else. Anonymized benchmark reports come only after about 2,000 customers, and only in aggregate.

**Continuing-education credit** (IRS first, at $700 a year for provider registration) is bundled to raise retention among tax preparers and CPAs. It is not a standalone revenue line, because market prices run about $2 to $10 per credit hour.

## Go-to-market plan

Owners do not shop for cybersecurity; they buy it when someone forces them to prove it. So Data Hygienics markets to those forced moments and gets introduced by the people already in the room. In the Fed's 2026 survey of 6,525 employer firms, cyber does not appear among owners' top challenges, which is why broad awareness campaigns are excluded from this plan.

**The forced moments we target:** an insurance renewal or first quote, a client security questionnaire, a Texas contract clause, PTIN renewal season for tax preparers, a payer or OCR request for a practice, a near-miss fraud attempt, and the sale of a business.

**Channels, in priority order:**

| # | Channel | How it works | First move | Confidence |
| --- | --- | --- | --- | --- |
| 1 | Forced-moment content and free tools | Pages that answer the exact question an owner searches at that moment, plus free no-login tools: an email spoofing check, the quick audit, a Texas safe harbor tier checker. Written as dated, sourced facts to earn AI-search citations | Publish the spoofing check, a Texas SB 2610 page, and 10 forced-moment articles | Moderate |
| 2 | Verify pages that spread | Each Verified customer shows its public verify page to its own clients, many of whom are small businesses | Launch with Data Hygienics' own verify page live | Low to moderate until proven |
| 3 | Professional associations | State CPA societies, dental and medical associations, small-firm sections of bar associations. Free CE-eligible webinars and a member discount, with no per-sale payments | Pitch one Florida association a free webinar | Moderate |
| 4 | Independent insurance agencies | A free agent class on avoiding cyber application mistakes opens the door; a flat-fee submission pack removes re-keying across carriers | Call five South Florida agencies, then run a 20-agency Florida and Texas pilot | Moderate; brokers have no software budget |
| 5 | Founder-led local selling | South Florida chambers, the Broward SBDC (whose cyber-trained advisors can refer for free), and live tabletop workshops for practice managers | Host one workshop | Moderate |

**Messaging.**

- **Core line:** "The record that proves your business is as careful as you say."
- **Fraud hook:** "Would your office manager wire $40,000 if the boss called asking?" Pair it with a free fraud drill.
- **Insurance hook:** "What you told your insurer has to stay true all year. We tell you when it stops."
- **Words to avoid:** "certified," scare statistics without a primary source, and FTC fine threats.

**Calendar.**

| When | Focus |
| --- | --- |
| October to December | Tax preparers during PTIN renewal (the WISP requirement); Cybersecurity Awareness Month content |
| January to April | Avoid tax firms during filing season; focus on practices and law firms |
| Year-round | Insurance renewals, reached 60 to 90 days ahead; Texas firms |
| July 2027 | HIPAA final rule target date; prepare content in advance |

**Excluded:** broad paid advertising, cold email blasts, bought lists, affiliate or referral deals, and generic social posting. A small paid-search test (about $200) on high-intent queries such as "WISP for tax preparer" is the one exception.

**Measurement:** record the forced moment that brought in every customer. After the first 25, put most of the effort into the top one.

## Product roadmap

Every year adds a new way to use the same evidence record, and no year starts until the gate before it passes.

&#91;embedded content: product roadmap · five years, one gate each\]

**2027 detail.** Before launch, the baseline is rewritten from 14 to 17 controls: MFA in three tiers ending at phishing-resistant MFA for everyone, plus new controls for payment verification, connected apps and AI connectors, and external exposure. Security Defaults counts as a pass for tenants without Conditional Access, so the smallest firms are not shut out. Data Hygienics' own verify page goes live first.

**Held for later:** the AI readiness tool and glossary stay in the "later" slot, because the AI connector inventory (2027) and AI tools policy (2028) deliver most of the value sooner on engines already built. The per-client MSP plan returns in 2029 only as a flat per-portfolio fee.

## Operations, technology and team

One founder runs the company part-time with AI coding agents, and the operating model is designed so that founder time, not infrastructure, is the only scarce resource. Infrastructure costs stay small at every scale (see the financial plan).

**Team today.** Hunter is the founder, product owner and developer, with incident response, federal and MSP security experience. Claude Code handles architectural and multi-file builds, Codex handles targeted edits, and Claude chat is the planning and review layer. Outside help is bought by the hour: a lawyer for terms and insurance regulatory review, and an insurance broker for E&O.

**First hires, in order, once revenue allows:**

1. A part-time evidence reviewer and support person, needed at roughly 500 to 1,000 customers, when the review queue would otherwise outgrow evenings.
2. A part-time partnerships lead for associations and agencies, once one channel is proven.
3. A second developer only after renewal holds above 70 percent.

**Technology.** Next.js 16 on Vercel Pro, Supabase Pro for auth and data, Stripe for billing, Cloudflare for DNS and proxy, Google Workspace for email, the Claude API for the Hygienist and evidence review, and @react-pdf/renderer for documents. Evidence files move to Cloudflare R2 at scale because it charges no egress fees ($0.015 per GB-month).

**AI cost per customer.** Claude Sonnet 5.5 runs at $2 per million input tokens and $10 per million output; Haiku 5.5 at $0.10 and $0.50. A full year of guidance and review is about $1.50 to $3 per customer on Sonnet with batching, and about $0.15 on Haiku ([Claude pricing](https://platform.claude.com/docs/en/about-claude/pricing), October 2026, high confidence).

**Integrations.**

- **Microsoft:** a verified Partner Center account takes 3 to 5 business days. After that, publisher verification is free and takes minutes, and customers grant read-only admin consent. Microsoft 365 Certification is voluntary and deferred until a buyer asks.
- **Google:** read-only Admin SDK Directory and Reports scopes appear not to be restricted, so expect free verification within about 10 days and no paid security assessment. Drive scopes are avoided entirely, since they would trigger one (moderate confidence).

**The weekly operating rhythm, once live:**

- Clear the evidence review queue within five business days.
- Answer support within one business day.
- Ship one product improvement.
- Publish one forced-moment article or dataset update.
- Review drift alerts and the quarterly signals list.

**Security of Data Hygienics itself.** The company holds sensitive evidence, so it practices what it sells:

- Read-only scopes, encrypted tokens, no password collection.
- Strict evidence retention.
- Phishing-resistant MFA on every admin account.
- A published security page with a subprocessor list and incident summary.
- A CSA CAIQ Lite self-assessment in place of SOC 2. Small buyers at self-serve prices generally accept these; a first-year SOC 2 runs $25,000 to $50,000 all-in and is deferred until a buyer requires it.

## Financial plan

The plan is built to survive the low case and earn the base case. Revenue depends almost entirely on whether one acquisition channel works, so the financial plan is three scenarios tested by the milestones above, not a single forecast.

&#91;embedded content: Data Hygienics cohort model, October 2026 · assumptions in the table below\]

**Read the base rates first.** Among self-reported independent software businesses, about 21 percent ever reach $10,000 a year, 5.7 percent reach $100,000, and 0.5 percent reach $1 million (BigIdeasDB, mid-2026, moderate confidence). Small-price SaaS loses customers fast: ChartMogul's median annual retention is 60 to 66 percent for products at $10 to $100 a month, and only 55 percent for companies under $300,000 a year ([ChartMogul](https://chartmogul.com/reports/saas-retention-report/2023/saas-retention-report-2023.pdf), 2023 report, high confidence). The low case is the most likely outcome for any new product of this kind.

**Odds by 2029 (judgment, low confidence):** about 60 percent below $100,000 a year; about 25 percent between $100,000 and $500,000; about 12 percent between $500,000 and $1.5 million; about 3 percent above.

**Model assumptions:**

| Assumption | Low | Base | High |
| --- | --- | --- | --- |
| What has to happen | Content only; no channel takes off | One channel works (brokers, associations or Texas) | An association or carrier formally adopts the record |
| New small-business customers per year, 2027 to 2031 | 40 rising to 100 | 150 rising to 1,000 | 400 rising to 4,000 |
| Annual customer churn | 45 percent | 38 percent improving to 30 percent | 30 percent improving to 22 percent |
| Insurance agencies paying at year five | 0 | About 50 | About 230 |
| Customers at year five | About 190 | About 2,000 | About 8,100 |
| Team | Founder only | Founder plus a part-time reviewer from 2029 | Small team; requires hiring from 2028 |

Revenue per customer is a blended $612 a year (70 percent at $468, 30 percent at $948); agencies average $1,800 a year; $299 packs are counted as one-time revenue.

**Unit economics per small-business customer, per year:**

| Item | Amount |
| --- | --- |
| Revenue | $612 blended |
| Stripe card, billing and tax fees (about 4.1 percent plus $0.30) | About $25 |
| AI model cost | About $1.50 to $3 |
| Hosting and storage | Under $5 at scale |
| Contribution before founder time | About $580, or roughly 95 percent |
| Acquisition cost ceiling for a 12-month payback | About $580 |

Bootstrapped companies average about $5,000 to acquire a customer (Capchase, 2023, secondary), which is impossible at this price. Acquisition must therefore come from near-zero-cost channels: free tools, content, associations, agencies and verify pages. Paid acquisition is excluded.

**Annual operating costs, excluding Stripe fees and founder time (October 2026 prices):**

| Scale | Annual cost | What dominates |
| --- | --- | --- |
| 50 customers | About $5,300 to $8,600 | E&O and cyber insurance ($2,000 to $5,000), IRS CE ($700), paid Supabase and Vercel |
| 500 customers | About $11,000 to $15,500 | Insurance, CIS licensing (up to $3,600), NASBA if added, storage |
| 2,000 customers | About $19,500 to $28,000 | Insurance, licensing, compute and evidence storage |

Infrastructure stays below 3 percent of revenue at every scale. The real cost is people: a part-time reviewer and support hire at roughly 500 to 1,000 customers, at an estimated $25,000 to $40,000 a year.

**What it means for income.** In the low case the business covers its costs from about 20 customers and becomes a profitable side income of roughly $80,000 to $110,000 a year by 2031. In the base case, operating profit after a part-time hire is roughly $500,000 in 2029 and over $1 million in 2031, and the founder can leave the day job once revenue holds above a level Hunter sets. The high case needs outside help or capital, because one person cannot serve 8,000 customers.

**One-time setup budget before launch:** about $3,000 to $6,000, covering insurance deposit, a terms and privacy review (about $790 flat-fee average), a USPTO service mark ($350 per class), insurance regulatory review in Florida and Texas (three to five attorney hours per state at about $400 an hour), and the first year of IRS CE registration.

## Risks and mitigations

The two risks most likely to sink the plan are weak demand outside forced moments and founder time. Both are tested early and cheaply in the validation plan.

| Risk | Likelihood | Impact | Mitigation | Early warning |
| --- | --- | --- | --- | --- |
| Owners only pay when forced, and forced moments are infrequent | High | High | Market to every forced moment with one shared record; never build separate products per audience | Fewer than 10 paid customers within 90 days of launch |
| Founder time: one part-time person handles building, review, support and sales | High | High | Automate checks first; AI-assisted review with human spot checks; concierge only for the first customers; cap features | Review queue older than five business days |
| US insurers drop control questions for small firms, as Coalition did in Australia in June 2026 | Moderate | High | Anchor on keeping controls in place mid-term, claim evidence, client proof and Texas; insurance is one audience of four | Coalition or another carrier announces a no-questions US small-business application |
| Platform absorption: Microsoft or Google ships an insurer-ready posture export | Moderate | High | Cover what platforms cannot see: payments, vendors, training, plans, people; stay cross-platform and neutral | A carrier accepts a platform posture report directly |
| Brokers do not adopt or pay | Moderate | Moderate | Flat fee; free view for brokers when the owner pays; associations as a parallel channel | Fewer than five of 20 pilot agencies use the pack three or more times in six months |
| Owners will not grant tenant access | Moderate | Moderate | Read-only scopes explained plainly; DNS and document checks work without access; MSP-friendly invite flow | Under 40 percent of Verified customers connect a tenant within 90 days |
| Liability: a Verified customer is breached and blames the record | Low to moderate | High | Words state only what was checked and when; terms cap liability at fees; E&O insurance before revenue; evidence type always visible | Any claim or legal letter |
| Data Hygienics itself is breached | Low to moderate | Very high | Read-only scopes, encrypted tokens, no password collection, evidence retention limits, paid Supabase, published security page | Any security incident or vendor advisory affecting the stack |
| AI reviewer errors pass weak evidence | Moderate | High | Rules engine decides passes; reviewer must agree with the founder on at least 95 of 100 test items before automatic passes; random human re-review of one in 20 | Disagreement rate above 5 percent |
| CIS licensing blocks publishing an IG1 mapping | Moderate | Moderate | Write the baseline in original words; apply for the CIS Supporter license; use NIST CSF (public domain) for public mappings | CIS declines or prices above $5,000 a year |
| Price resistance at $468 | Moderate | Moderate | Free tools and the $299 pack as entry; test a $948 tier for larger firms where incumbents prove willingness to pay | Trial-to-paid conversion well below benchmarks |

## Legal, compliance and neutrality guardrails

Every public statement Data Hygienics makes about a customer states what was checked and when, and nothing more. None of this section is legal advice; each item gets a lawyer's review before the first paid Verified record.

**Neutrality rules (non-negotiable):**

- Revenue comes only from customers paying for access. No affiliate links, referral fees, sponsored scorecards, revenue shares, or carrier-funded free tiers.
- Recommendations may name products and license upgrades, because neutrality means no commission, not no recommendation. Free options are shown first.
- No partnership whose economics depend on what the owner buys. This is why the CyberCert partnership was declined in favor of a free published crosswalk.

**Language rules:**

- Say "Verified" and "checked evidence," never "certified" or "certification." Accredited certification has a specific meaning under ISO/IEC 17024.
- Never imply endorsement by an insurer, CIS, NIST or any government body. Frameworks are named only as references the baseline maps to.
- Safe harbor language stays narrow: the record helps a firm show it maintained a program; it does not guarantee a defense, and in Texas it only limits punitive damages.
- Never repeat a statistic without a primary source.

**Insurance regulation (Florida and Texas):** Data Hygienics is not an insurance agency and never places, sells or recommends policies. Agency pricing is a flat subscription, never tied to policies bound, which keeps it clear of Florida Statute 626.112 and Texas Insurance Code 4005.053 limits on referral payments. Wording comparisons explain carrier questions and never recommend a policy. A Florida and Texas insurance regulatory review happens before the agency product launches.

**Customer terms:** owners confirm the accuracy of what they submit; liability is capped at fees paid; no warranty against a breach; evidence types are always shown.

**Data handling:** read-only integration scopes; encrypted tokens; Data Hygienics never asks for or stores passwords; uploaded files are treated as data, never as instructions to the AI; evidence deleted 30 days after a record lapses unless the owner keeps it; production runs on paid infrastructure, not free tiers.

**Setup items:** technology E&O and cyber liability insurance before revenue; a service mark filing for "Data Hygienics Verified"; Microsoft publisher verification and Google OAuth verification for the integrations; CIS Supporter license application; IRS continuing education provider registration; published terms, privacy policy and security page.

## Milestones and validation plan

Each milestone has a pass bar and a decision if it misses. Nothing big gets built before the cheap test in front of it passes.

| When | Milestone | Pass bar | If it misses |
| --- | --- | --- | --- |
| Nov 2026 | Broker conversations | 2 of 5 South Florida agencies would show the evidence record to clients | Drop brokers as an early channel; lead with associations and content |
| Nov 2026 | Setup | CIS license answer in writing, E&O quote, one-hour counsel review, Supabase on a paid plan | Rewrite the baseline without CIS references if refused |
| Dec 2026 | Free tools live | Email spoofing check, Texas SB 2610 page and 10 forced-moment articles published | Keep publishing; no product build is gated on this |
| Q1 2027 | Rewritten 17-control baseline and verify page live, with Data Hygienics' own record first | `npm run build` passes; no tenant detail reachable from public pages | Fix before any sale |
| Q1 to Q2 2027 | 10 concierge Verified customers | 10 paid at $468 within 90 days of launch | Reprice, or change the lead buyer or forced moment |
| Q2 2027 | AI reviewer accuracy | Agrees with the founder on at least 95 of 100 evidence items | Keep human review on every item |
| Q2 2027 | Microsoft and Google integrations approved | Publisher verification and OAuth verification complete | Launch with DNS and document checks only |
| Q3 2027 | Broker pilot | At least 5 of 20 agencies use the pack three or more times in six months | Stop the agency product; keep the free agent class |
| End 2027 | 100 paying customers | 100 Verified or Ongoing Protection subscribers | Reassess the channel mix; stay in the low scenario plan |
| 2028 | Renewal | At least 70 percent of first-year customers renew | Fix drift alerts and onboarding before new features |
| 2028 | First outside acceptance | One broker, client or carrier accepts the evidence binder on a real application or questionnaire | Treat the insurance story as unproven in all marketing |
| 2029 | Solo ceiling review | Revenue supports a first hire or contractor for review and support | Raise prices or narrow the audience |

**Signals worth watching every quarter:** whether Coalition brings its no-questions application to the US; Microsoft or Google insurer-facing exports; a SIG-lite questionnaire for small vendors; carriers adding AI or agent questions; the HIPAA final rule.

## Appendix: operating principles and context for AI collaborators

This appendix is written for any AI model or person working on Data Hygienics. Read it before proposing features, writing copy or changing code. When this plan conflicts with an older chat or note, this plan wins.

### Who and what

- **Company:** Data Hygienics, a single-member LLC in Florida, website [datahygienics.com](https://datahygienics.com).
- **Founder:** Hunter, a South Florida frontend developer with incident response experience for a tribal nation, federal cybersecurity work with a government contractor, and MSP work across law firms, hospitals, nonprofits and small businesses. Holds CompTIA Security+; works with NIST CSF and CIS Controls v8. Public copy refers to him as Hunter only.
- **Buyer:** the reluctant tech leader at a US firm of 5 to 249 staff. Priority verticals: healthcare practices, law firms, accounting and tax firms, government subcontractors. First states: Florida and Texas.
- **Position:** the neutral proof and trust layer, "the record that proves your business is as careful as you say."

### Non-negotiable principles

1. Structural neutrality: no affiliate links, referral fees, vendor partnerships or revenue tied to what the owner buys.
2. Sell the record, not the badge. Every product renders the same evidence record for a different asker. No separate modules per audience.
3. The AI guide never decides that a control passed; a deterministic rules engine does.
4. Show free options before paid ones, and state cost versus reliability tradeoffs plainly.
5. Clean, maintainable solutions over quick fixes or workarounds in production code.
6. Never use a statistic without a primary source and a date.

### Technology and architecture

- **Stack:** Next.js 16 (App Router, Turbopack), Supabase (auth, database, storage), Stripe (hosted checkout), Vercel hosting, Cloudflare DNS and proxy, Google Workspace email, Claude API, @react-pdf/renderer for PDFs.
- **Content-first data layer:** research content is pure-data modules under `lib/content/`, validated by `npm run validate` (sources, citations, links, tone). Every statistic carries a cited, dated source or the build fails.
- **Entitlement:** `getPlanAccess(plan, status, purchases, isAdmin)` in `lib/stripe/access.js` is the single source of truth for access. An `is_admin` flag on `profiles` grants full access.
- **Reliability rules:** Supabase write errors return 500 so callers retry; unknown entitlement shows a retry screen, never a lockout; synchronous in-flight refs (not React state) guard double submits.
- **Stripe:** `NEXT_PUBLIC_STRIPE_MODE` switches the test and live price catalogs in `lib/stripe/prices.js`; placeholders fail closed; the legacy catalog covers grandfathered subscribers. Products and prices are created by `node scripts/stripe-setup.mjs`.
- **Known issue:** the Supabase free tier pauses on inactivity and causes 504s. Production must run on a paid plan before Verified launches.

### Build workflow

Plan and decide in Claude chat, write a detailed Claude Code prompt, run it in Claude Code (architectural and multi-file work) or Codex (targeted, spec-driven edits), verify with `npm run build`, push to GitHub, and deploy on Vercel. Content is drafted in chat and approved by Hunter before it goes into code. Hunter prefers short, sequential steps and quick, clearly framed choices.

### Design system

The brand personality in `design/brand-book/personality.md` (merged October 2026) governs: night surfaces in navy `#0F172A` for statements, day surfaces in Field White `#F8FAFC` for reading; cobalt `#1D4ED8` for Business, teal `#0F766E` for Home body text and buttons; Inter for body, Inter Tight for display, IBM Plex Mono for readouts. The wordmark is never retyped (`/logo.svg`, `BrandMark.jsx`). The earlier "light mode only, Carta and Plaid" direction is superseded.

### Writing standards (enforced everywhere, including code comments)

- No em dashes, ever.
- No groups of three for rhythm, and no staccato sentence patterns.
- No AI filler such as "robust," "comprehensive" or "in today's digital landscape."
- Active voice, plain English, specific numbers over general claims.
- A warm expert voice, never salesy, with practitioner stories from real scenarios.

### Key decisions log

| Decision | Status |
| --- | --- |
| Insurance translation layer is a strategic wedge; Coalition, Cowbell, Travelers and Beazley mapped | Live |
| AI-search citation is the primary content strategy, ahead of classic SEO | Active |
| Verified is an evidence record with a visible mark; one paid level, not Bronze to Diamond tiers | Decided |
| Baseline expands from 14 to 17 controls, with tiered phishing-resistant MFA | Decided |
| No CyberCert partnership; publish a free SMB1001 crosswalk instead | Decided |
| No ISO 17024 accreditation for now | Decided |
| Training produces multi-rule completion records; CE credit is a bundled perk, not a revenue line | Decided |
| Brokers are one channel; associations are a parallel neutral channel | Decided |
| Per-client MSP plan paused until 2029 | Decided |
| No consumer identity protection, no scanning of customer files, no deepfake detection | Cut |
| This plan governs over the October pivot and the household roadmap; insurance layer and vendor facts return, legal track returns with the 17-control baseline, MSP stays paused | Decided Nov 4, 2026 |
| Household work (Clear Path, Threat Check, Home map, Watch phase one) stays free and gets finished; no new household paid offer in 2027 | Decided Nov 4, 2026 |
| The October 2026 brand personality stays; this appendix's design section is corrected to match | Decided Nov 4, 2026 |

### Glossary

- **Evidence record:** the dated history of each control's status, how it was proven, and any drift.
- **Drift alert:** a warning when a live setting contradicts an earlier answer, such as one given to an insurer.
- **Forced moment:** an outside request for proof, such as a renewal, questionnaire, contract, audit or sale.
- **The Hygienist:** the AI guide that explains and collects but never approves.
- **Proof pack:** the carrier-specific bundle of answers and evidence for an insurance application.
