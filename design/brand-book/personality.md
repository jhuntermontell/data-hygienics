# Personality: the governing spec

Phase 0 of the personality transition, written 2026-10-27. Draft for the owner's approval; nothing here is in production yet. It refines `personality-transition-prompt.md` with what `reference-study.md` found. Where this spec and `CLAUDE.md` disagree, `CLAUDE.md` wins until the owner changes it on purpose.

## 1. In one line

The calm, certain voice of someone who has already done the reading and knows the next step.

## 2. Traits, each with its limit

- **Certain, never arrogant.** We state. We never sneer at other companies, at their customers or at anyone who got scammed.
- **Specific, never clever for its own sake.** The headline may be creative. The instruction under it is literal.
- **Unapologetic about independence.** No referral fees, no affiliates, no sponsors, no detection claims, no custody of household data. Said as facts, often, without defensiveness and without attacking anyone who does take referral money.
- **On your side.** Second person, plain English, short paragraphs, acronyms translated on first use. Self-assured is not cold.
- **Quiet under pressure.** The worse the moment, the shorter and steadier the words. A verdict page has the fewest adjectives on the site.

**The proof rule.** Every bold line must be backed on the same screen by a source, a shipped tool or a stated rule. "Four rules we don't break" is allowed because the four rules are right under it. "The best security guide in America" is never allowed, because nothing on any screen can back it.

## 3. Headline rules

1. At most eight words.
2. A fact, a claim the same screen backs, or an instruction.
3. No questions, except where the user's own question is the title (verdict pages keep the message people typed).
4. No trailing period on a single-clause title. A two-sentence title keeps both periods ("Hang up. Call back."), which the validator's title rule already allows because the title has an internal period.
5. Uppercase only for statement lines of six words or fewer, and only on night surfaces (section 8, decision 3).
6. No exclamation marks anywhere.
7. Name, then imperative. Every tool and service carries its name and one imperative line.

## 4. Words

**Use:** ready, in order, on record, checked, settled, covered, rehearsed, yours, the next step, call back, before you act, in writing, on your device, sourced, dated, reviewed.

**Never use in marketing copy:** fight, war, weapon, arsenal, kill, battle, enemy, attack surface (say "what's exposed"), threat actor (say "scammer" or "criminal"), defend, mission-critical, military-grade, bank-grade, bulletproof, guarantee, unprecedented, lurking, rapidly evolving, cutting-edge, revolutionary, AI-powered (say what it does), tips, hacks, might, could help, we hope, MSP (say "IT provider"), SI (except where `CLAUDE.md` allows it), detect or "spot the fake" (we never claim detection).

**Hedges** appear only where evidence is uncertain, and then precisely: "the FBI calls this figure a floor," never "experts say."

## 5. Before and after

Twenty-eight real strings from the site, rewritten. Strings marked *keep* already fit. Nothing here is applied until Phase 4.

| # | Where | Now | Proposed |
|---|---|---|---|
| 1 | `SITE.headline`, homepage h1 | Your digital life, in order | *Keep.* It is already a claim the page backs. |
| 2 | Homepage subhead (`FrontDoor`) | Independent, plain-English security for homes and small businesses living alongside AI. | Security for homes and businesses of 1 to 50, in the order that protects the most. |
| 3 | Homepage readout (new) | (none) | NO SPONSORS · NO REFERRAL FEES · EVERY NUMBER SOURCED |
| 4 | `SITE.tagline`, footer | Live securely alongside AI. | Security, in order. |
| 5 | `SITE.kicker` | Digital hygiene for the AI era | The field guide for the AI era |
| 6 | `SITE.description`, metadata | Independent, researched guidance for households and small businesses living and working alongside AI: the threats, the fixes, and the tools worth using. | Independent security for homes and businesses of 1 to 50: what's reaching people now, what to do in order, and the tools worth using. Every number sourced. |
| 7 | `MEMBERSHIP.headline`, pricing h1 | Keep your digital life in order, with someone to ask | Answers from our research, for $8 a month |
| 8 | `MEMBERSHIP.subhead` | Members get answers drawn only from our research, a Path that follows them to every device, and a guide that sells nothing but this. | Ask answers from our published research and shows you the page. Your Path follows you to every device. We sell nothing else. |
| 9 | Proof: ask | Ask, and get our answer, not a sales pitch | Ask. Get the answer, with the source |
| 10 | Proof: path | Your Path, everywhere | One Path, every device |
| 11 | Proof: independent | Independent, by rule | Paid by members. Nobody else |
| 12 | Proof: free | Free stays free | *Keep.* |
| 13 | Proof: leave | Yours to leave | Leave in two clicks |
| 14 | `MembershipBand` headline | Someone to ask, when a message doesn't feel right | A message feels wrong. Ask before you act |
| 15 | Path reveal headline | Keep this path, and get someone to ask | Save this path. Add someone to ask |
| 16 | Member nudge | Three down. Members get someone to ask when the next one raises a question. | Three done. When the next one raises a question, members ask us. |
| 17 | `OurPromise` h2 | The Data Hygienics promise | Four rules we don't break |
| 18 | Promise item | Free to use | Free means free |
| 19 | Promise item | Every number has a source | *Keep.* |
| 20 | `HowThePathWorks` step 1 | Tell us what matters | Name what you'd hate to lose |
| 21 | `HowThePathWorks` step 3 | You take the next step | Take the next step |
| 22 | `AudienceSplit` eyebrow | Rather browse? | The library |
| 23 | Sovereignty door title | Take control of your digital life | Own your data, identity and choices |
| 24 | Nav: Threat Library | What's actually hitting homes and businesses | What's reaching homes and businesses now |
| 25 | Nav: Toolkit | Tools we'd actually use. No referral fees. | Tools we'd use ourselves. No referral fees |
| 26 | Nav: Cyber Audit | Score your security, including AI use | Find the gaps. Close them |
| 27 | Nav: IR Planner | A plan for when it goes wrong | Rehearse the bad day |
| 28 | Nav: Ask | Answers from our research, for members | Get the answer, with the source |
| 29 | Nav door: Threat Check (tagline, new) | (none) | Check it before you act |
| 30 | Footer pill | No sponsors. No referral fees. No affiliate links. | Readout: NO SPONSORS · NO REFERRAL FEES · NO AFFILIATE LINKS |
| 31 | Pricing: free block | What's free, always | Free, always |

**Most sure:** 9 (the claim and its proof in five words), 26 (a name and two imperatives, exactly the pattern), 3 and 30 (the independence rule as a readout), 17 (backed by the four rules beneath it), 24 ("actually hitting" sounded defensive).

**Least sure:**
- **7.** Putting the price in the headline is the prompt's direction ("what the member gets and what it costs"), but `membership.js` keeps formatting in components. The price must be injected from `MEMBERSHIP.prices`, never typed, and the founding rate complicates it.
- **27.** "Rehearse the bad day" is vivid, and "bad day" could read as alarm to an anxious owner. Fallback: "A plan you've practiced."
- **29.** The Threat Check covers texts, emails and calls, so "Hang up. Call back." only fits calls. "Check it before you act" is broader and plainer, and it is weaker.
- **11.** "Paid by members. Nobody else" is the strongest independence line. It is also the most likely to read as a jab at competitors.
- **2.** "1 to 50" is precise but reads like a spec. Fallback: "for homes and small businesses."

## 6. Color tokens and contrast

All ratios computed with the WCAG 2.x formula on 2026-10-27. AA requires 4.5:1 for body text, and 3:1 for large text (24px, or 18.66px bold) and for interface parts and focus rings.

**Night surface** (canvas `#0F172A`, brand navy, Judgment)

| Role | Color | On navy | Use |
|---|---|---|---|
| Primary text | `#FFFFFF` | 17.85 | Headlines, body |
| Secondary text | `#CBD5E1` | 12.02 | Body, captions |
| Readout text | `#94A3B8` | 6.96 | Mono readouts, labels |
| Accent | `#0F8F83` Action Teal | 4.49 | Rules, the fold notch, focus ring, active marks, large type only. **Fails body text by 0.01**, so never small text. |
| Accent text | `#5EEAD4` | 12.07 | The only teal text on navy, for small accents. Already in the codebase (`WhyItMatters`). |
| Links | `#FFFFFF`, underlined | 17.85 | Cobalt `#1D4ED8` on navy is 2.66 and fails, so links on night go white. |
| Hairlines | `#1E293B`, `#334155` | 1.22, 1.72 | Decorative dividers only, never the sole boundary of a control. |
| Primary button | Navy text on white fill | 17.85 | One per screen. |
| Secondary button | White text, 1px white outline | 17.85 | |

**Day surface** (canvas `#FFFFFF`, with `#F8FAFC` Field White for bands)

| Role | Color | On white | On Field White | Use |
|---|---|---|---|---|
| Primary text | `#0F172A` | 17.85 | 17.06 | Headlines, body |
| Secondary text | `#475569` | 7.58 | 7.24 | Body, captions |
| Readout text | `#64748B` | 4.76 | 4.55 | Mono readouts. Replaces `#94A3B8` (2.56, fails) for any text that carries meaning. |
| Links, Business | `#1D4ED8` cobalt | 6.70 | 6.41 | |
| Home, teal text | `#0F766E` | 5.47 | 5.23 | As `CLAUDE.md` requires |
| Action Teal | `#0F8F83` | 3.98 | | Fills, icons, rules and large type only |
| Buttons | White on `#1D4ED8` / on `#0F766E` | 6.70 / 5.47 | | Business / Home |

`#94A3B8` on white stays only for disabled states and decoration. The Phase 1 token file adds these as `--night-*` and `--day-*` variables beside the existing ones; no existing token is renamed.

## 7. Type

**Faces, all from Google Fonts, loaded through `next/font`.**

- **Body:** Inter, unchanged.
- **Display:** Inter Tight is the recommendation (decision 2). It is Inter's own tighter cut, so headlines and body read as one family, which keeps us recognizably ourselves rather than borrowed. The mockups' type specimen sets it beside Geist and Archivo.
- **Readouts:** IBM Plex Mono is the recommendation. It is warmer and more legible at 12 to 13px than JetBrains Mono, which reads as a code editor. Both are in the specimen.

**Scale** (desktop / phone)

| Role | Face | Size | Weight | Leading | Tracking | Case |
|---|---|---|---|---|---|---|
| Statement | Display | 88px (5.5rem) / 44px | 600 | 0.95 | -0.035em | Upper, six words max, night only |
| H1 | Display | 64px / 40px | 600 | 1.0 | -0.03em | Sentence |
| H2 | Display | 40px / 30px | 600 | 1.08 | -0.02em | Sentence |
| H3 | Display | 24px / 21px | 600 | 1.2 | -0.01em | Sentence |
| Lede | Inter | 21px / 18px | 400 | 1.5 | 0 | Sentence |
| Body | Inter | 17px / 17px | 400 | 1.65 | 0 | Sentence |
| Small | Inter | 15px | 400 | 1.55 | 0 | Sentence |
| Readout | Plex Mono | 13px / 12px | 500 | 1.4 | 0.06em | Upper |
| Label | Plex Mono | 12px | 500 | 1.3 | 0.1em | Upper |

Body text never drops below 15px. Reading columns stay at 68 characters or fewer.

## 8. Layout and graphic language

- **Grid.** 12 columns, 1200px content width, 24px gutters on desktop; one column with a 16px gutter on phones. Statement surfaces use six or eight columns for the headline and leave the rest empty on purpose.
- **Rhythm.** Sections are 128px apart on desktop and 72px on phones. Fewer, larger elements: no screen carries more than one primary action.
- **The fold rule.** A 1px hairline that begins with a short teal segment ending in a 30-degree notch, taken from the angle of the mark's faces (`lib/brand/mark.js`). It divides sections, heads menu columns and sits above every readout. It is ours: neither reference uses a notch.
- **The clean cut.** The mark's upper-right cut, used as a crop on artifact cards (a corner clipped at the cut's angle). Used sparingly: on artifacts only.
- **Artifacts as products.** The card by the phone, the safe-word card and the one-page AI rule are shown at large size, flat, with a soft shadow, as the objects they are.
- **No** stock photography, hooded figures, padlocks, shields, binary, glowing networks, renders, gradients behind headlines or blurred color blobs. The current homepage's blurred cobalt and teal circles and its dot grid are retired.

## 9. Motion

- Durations of 160 to 320ms, ease-out. Things arrive; nothing bounces.
- Allowed: a fade of 8px or less, a fold rule drawing left to right once on entry, the menu overlay fading in.
- Not allowed: parallax, scroll-jacking, autoplay video, looping animation, counters that tick up to a number.
- `prefers-reduced-motion: reduce` turns every transition into an instant change.

## 10. The menu and search

Following the reference study's Palantir notes, translated.

**Header (every page).** Wordmark left. On desktop, three words: For Home, For Business, Library. Right side: the Threat Check door as the one outlined action, then two 40px square buttons, Search and Menu, flush together, with 1px borders. On phones: wordmark, the door, the two squares. The header sits on navy on night pages and on white on day pages, with the matching lockup.

**The menu.** A full-screen navy overlay that keeps the header in place, in three columns under fold rules, each with a mono label:

- **Start:** For Home, For Business, Digital Sovereignty, Map your path. Display size.
- **Library:** Threat Library, Guides, Toolkit, Glossary, Controls Library, each with its one-line description.
- **Tools:** Threat Check, Cyber Audit, Policy Library, Incident Response Planner, Ask, Pricing, each as a name and imperative.

Beneath, a live strip: the two newest published entries, dated in mono, so the menu itself shows the library is maintained. Members and Sign in sit at the foot. Escape closes it; focus is trapped inside while open and returns to the Menu button on close.

**Search.** A full-screen sheet: a full-width field directly under the header with a Clear control; suggested searches drawn from the Threat Check chips; results grouped by kind (Verdict, Step, Guide, Threat, Explainer, Glossary), each with its title, its one-line summary and its reviewed date in mono. The index is built at build time from published entries only, shipped as a static file, and searched in the browser. Queries never leave the device, and the sheet says so in a readout. An empty result never dead-ends: it offers the Threat Check and the three closest verdicts. Search is new functionality, so it needs the owner's yes (section 11) and ships in Phase 1 with the header.

## 11. Decisions for the owner

1. **Night and day, or night everywhere?** Recommendation: night and day. The reference itself reads its manifesto on white, and our readers include older people and people who print.
2. **Display face.** Recommendation: Inter Tight, after viewing the specimen.
3. **Uppercase on reading surfaces?** Recommendation: night surfaces only. Day pages use sentence case throughout.
4. **A name for the system under the products.** Recommendation: the Path, as the name already in use, with its own page at `/how-it-works` part 1 rather than a new route. A new platform name would be one more word to learn.
5. **Photography.** Recommendation: stay typographic through Phases 1 to 3; commission one shoot of the paper artifacts in real kitchens and offices before Phase 4's share cards.
6. **The manifesto's parts.** Recommendation: Part 1, Procedure beats detection. Part 2, Independence is the product. Part 3, Your home stays yours. Part 3 must describe today's Path honestly: it lives in the browser and syncs to an account only if the member signs in.
7. **Search.** Recommendation: yes, built in the browser from our own index, in Phase 1.
