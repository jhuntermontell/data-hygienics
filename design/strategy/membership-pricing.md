# Membership pricing

Market analyst role, 2026-10-26. Prices below were checked on that date through secondary sources where the vendor page was not reachable; each figure names its source. Treat first-year promotional rates and renewal rates as different numbers, because in this category they usually are.

## 1. The comparison set

**Consumer identity and security subscriptions** (per person or per household, usually quoted at the annual rate)

| Product | Price | What it includes | Source |
|---|---|---|---|
| Aura Individual | about $9 to $12 a month; annual plans quoted at $9 to $10 a month | identity monitoring, credit, VPN, antivirus, $1M insurance | [Cybernews, 2026](https://cybernews.com/identity-theft-protection/aura-review/aura-pricing/), [Security.org, 2026](https://www.security.org/identity-theft/aura/) |
| Aura Couple | about $17 to $20 a month | same, two adults | [Cyberinsider, 2026](https://cyberinsider.com/?p=287645) |
| Aura Family | about $25 to $30 a month | same, up to five adults plus kids | same |
| LifeLock family | $19 to $48 a month depending on tier and term; renewals up to 52% higher | monitoring and insurance, two adults | [Cybernews, verified Aug 31 2026](https://cybernews.com/identity-theft-protection/lifelock-review/lifelock-cost/), [Safehome, 2026](https://www.safehome.org/identity-theft-protection/lifelock) |
| Bitwarden Families | $47.88 a year for six people ($3.99 a month) | password manager | [Technobezz, Sept 2026](https://www.technobezz.com/bitwarden-vs-1password-for-individuals-and-families) |
| 1Password Families | $53.88 first year, $71.88 after, billed yearly ($4.49 to $5.99 a month) | password manager, five people | [CostBench, Sept 2026](https://www.costbench.com/compare/1password-vs-bitwarden/) |

**Reader-funded independents** (the closest analog to what we are)

| Product | Price | Source |
|---|---|---|
| Consumer Reports Digital | $39 a year ($3.25 a month); monthly $10; All Access $64 a year | [consumerreports.org plan pages, undated](https://www.consumerreports.org/sem/ranges/) |
| Wirecutter (standalone, at 2021 launch) | $5 a month or $40 a year | [Nieman Lab, Aug 2021](https://www.niemanlab.org/2021/08/wirecutter-which-makes-money-when-you-shop-is-going-behind-the-new-york-times-paywall/) |
| 404 Media Supporter | $10 a month or $100 a year; Superfan $100 a month | [404media.co/membership](https://404media.co/membership) |
| Paid newsletters, platform median | $10 a month or $100 a year, unchanged since 2024 | [beehiiv State of Paid Newsletters 2026, via Letter Operators](https://letteroperators.beehiiv.com/p/paid-newsletter-revenue-is-climbing-fast) |

**AI assistants people already pay for:** ChatGPT Plus $20 a month (monthly only), Claude Pro $20 a month or $17 billed annually, Perplexity Pro $20 a month ([Notebookcheck, July 2026](https://www.notebookcheck.net/What-AI-subscriptions-cost-in-2026-and-which-one-is-worth-it.1341432.0.html), [CloudZero, Sept 2026](https://www.cloudzero.com/blog/perplexity-pricing)). This matters because our member assistant is a narrow, cited version of something a household may already pay $20 for.

**Small-business security, 1 to 50 people**

| Product | Price | Source |
|---|---|---|
| Security awareness training (KnowBe4, Hook, SafeInstinct) | $1.50 to $3.50 per user per month; Hook $999 a year flat under 50 seats | [Consilien, 2025](https://consilien.com/news/how-much-does-security-awareness-training-cost-in-2025), [Hook Security](https://www.hooksecurity.co/security-awareness-training-for-small-business) |
| Endpoint protection | $2.25 to $5.83 per endpoint per month | [CostBench, 2026](https://costbench.com/software/cybersecurity/compare-all/) |
| Managed security provider | $50 to $350 per user per month | [Digacore, 2026](https://digacore.com/blog/2026-managed-security-services-provider-budget-guide/) |
| Ours today: Documentation Pack | $299 one-time | pricing page (not purchasable; Stripe placeholders) |
| Ours today: Ongoing Protection | $49 a month or $468 a year | pricing page (not purchasable) |

## 2. Willingness to pay

- **Households.** A 5,000-adult US survey fielded January to February 2026 found 71% willing to pay for privacy protection, with a median acceptable price of $9.99 a month ([Cloaked, 2026](https://www.cloaked.com/research-hub/state-of-consumer-privacy-2026); a vendor, so discount it). Framed as a concrete trade-off the number collapses: one in four Americans would pay a subscription to keep otherwise-free services ([Center for Data Innovation](https://datainnovation.org/?p=10078)), and 65% say they are unlikely to pay a company not to track them ([SurveyMonkey/Axios](https://www.surveymonkey.com/curiosity/surveymonkey-axios-poll-privacy-deep-dive/)). Read together: people will pay about $10 a month for something that feels like protection, and almost nothing for abstract privacy. Our pitch has to feel like protection and belonging, not privacy.
- **Conversion reality.** Reader-funded media converts a median 0.62% of free readers to paid; top-decile lists convert 20% or more ([beehiiv 2026, via Letter Operators](https://letteroperators.beehiiv.com/p/paid-newsletter-revenue-is-climbing-fast)). Only 17% of people across 20 countries pay for any online news ([Reuters Institute Digital News Report 2026, via Voxbooster](https://voxbooster.com/blog/newsletter-paid-subscriber-conversion-statistics-2026)). Plan on 1 to 3% of saved-path members converting, not 10%.
- **Small businesses.** The average incident costs firms under 250 people about $52,000 and 32 hours of disruption, and 29% had at least one successful attack in the past year ([Hiscox Cyber Readiness Report, Sept 2026](https://itbrief.co.uk/story/hiscox-cyber-attacks-cost-small-firms-usd-52-000)). Nearly half of small and mid-sized firms expect a larger security budget next year, and training is the top priority at 42% ([ESET SMB Cyber Readiness Index 2026](https://www.eset.com/us/business/smb-cyber-readiness-index/)). The owner who "got handed IT" benchmarks against per-seat training tools at $2 to $3 a seat, not against managed providers.

## 3. Our cost floor

- **Assistant.** The harness measured about $0.0225 per question on Sonnet 5.5 with the system prompt cached (12 questions, $0.27). The monthly cap of 250,000 tokens works out to roughly 12 questions a month per member at the measured 20,000 tokens per exchange, so the ceiling is about $0.30 per member per month, and the realistic average (a few questions a month) is $0.05 to $0.10. Note for the architect: the token cap, not the 40-a-day message cap, is the binding limit, and it is tight.
- **Monthly note.** One sourced note a month at about eight hours of research and writing: about $600 a month fixed at a $75 an hour rate, spread across members.
- **Stripe.** 2.9% plus $0.30 per charge, plus 0.7% of volume for Billing ([DevToolLab, checked Oct 15 2026](https://devtoollab.com/blog/stripe-alternatives), [Flexprice, 2026](https://flexprice.io/blog/stripe-pricing-breakdown-2026)). On an $8 monthly charge that is $0.59 (7%); on a $69 annual charge it is $2.78 a year, or $0.23 a month. Annual billing roughly halves fee drag.
- **Support.** Assume 2% of members write in each month at 15 minutes each: about $0.15 per member.
- **Hosting.** Negligible until a few thousand members; then Vercel Pro and analytics at about $40 a month.

| Members | Fixed note cost per member | Assistant | Support | Stripe (monthly billing) | Total per member per month |
|---|---|---|---|---|---|
| 100 | $6.00 | $0.30 | $0.15 | $0.59 | about $7.04 |
| 1,000 | $0.60 | $0.30 | $0.15 | $0.59 | about $1.64 |
| 5,000 | $0.12 | $0.30 | $0.15 | $0.59 | about $1.16 |

The first hundred members do not pay for the note; the business side and the founder's time do. From a few hundred members on, gross margin at any price above $5 is over 70%.

## 4. Price points

**Home membership** (one price covers the household; no per-person tiers, which is a deliberate contrast with Aura and LifeLock)

| | Monthly | Annual | Line it sits on | Positioning |
|---|---|---|---|---|
| Low | $5 | $48 ($4 a month) | a password manager family plan | "less than Bitwarden Families"; cheap enough to feel like a tip, too cheap to signal value |
| **Recommended** | **$8** | **$69 ($5.75 a month)** | under one streaming service, under Aura Individual, about Consumer Reports All Access | an independent guide plus an assistant plus a monthly note for the price of a sandwich |
| High | $12 | $99 ($8.25 a month) | the paid-newsletter median | defensible only once the monthly note and the assistant have a track record |

**Business membership** (one price per organization up to 50 people, not per seat)

| | Monthly | Annual | Line it sits on | Positioning |
|---|---|---|---|---|
| Low | $29 | $290 | under per-seat training for a ten-person team | undercuts; leaves money on the table for 20 to 50 person firms |
| **Recommended** | **$39** | **$390 (two months free)** | under $40; about $4 a seat at ten people, $1 a seat at forty; less than one hour of an IT provider | the written rules, the plan, the audit, the assistant and the note for less than awareness training alone |
| High | $59 | $590 | our current Ongoing Protection price | the recurring value has to exist first |

**A single price with two doors is not viable.** Business willingness to pay is roughly five times household, and the business product includes paid documents the home side never needs. What is viable, and recommended, is a single *home* price that covers everyone at the address, and a single *business* price that covers everyone at the organization.

## 5. Recommendation

- **Home membership: $8 a month or $69 a year** (about 28% off, one line: "two months free"). Lead with the annual price on the page, because annual billing cuts Stripe drag by more than half and churn with it.
- **Business membership: $39 a month or $390 a year** (two months free). It replaces Ongoing Protection, which was the same promise without the recurring value; grandfather nothing, since nobody could buy it. Everything in Ongoing Protection (quarterly reassessment, policy updates) stays in the business membership as the promise that the assistant and the monthly note now make honest.
- **Documentation Pack: keep at $299 one-time.** It is the right product for the owner who wants it in writing once and will not subscribe. Business membership includes the pack's contents; a pack buyer who upgrades within 90 days gets the first year at $299 off, or simpler, the pack converts to the first year of membership at no charge. Pick the simpler rule.
- **Founding member price.** For the first 90 days, sell the annual plans only at a founding rate ($59 home, $349 business), labeled as such, locked for life. It rewards the cult-following behavior the owner wants, creates a reason to act now without a countdown, and gives a clean before-and-after read on price sensitivity.

## 6. Risks and the two signals

**Risks.** The $8 price is above Consumer Reports' $3.25 a month for a far larger research operation; the assistant and the note must be visibly better than a magazine. The assistant's token cap limits members to about a dozen questions a month, which will feel stingy to the heaviest users; raise the cap or the output budget before a member hits it in anger. First-year promotional pricing is the norm in this category, so a "no renewal games" promise is itself a selling point and must be kept. Business membership at $39 undercuts our own retired $49 tier; anyone who paid more is already grandfathered and should be told their plan now includes the assistant.

**Change the price within 90 days if:**
1. Fewer than 1% of saved-path members convert after the monthly note has gone out twice. That is a value or pitch problem before it is a price problem; test the founding rate against the list price before cutting.
2. The annual share of new members falls below 40%, or business checkouts stall on the pricing page while Documentation Pack sales continue. The first says the annual discount is not registering; the second says $39 recurring is reading as more than $299 once, and the business price should move to $29 or the pack should fold into year one.
