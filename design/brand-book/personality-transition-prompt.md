# Prompt: the Data Hygienics personality transition

Written 2026-10-27 for a Claude Fable 5.1 session in Claude Code, run in this repository. Paste everything below the line as the session's first message. The owner's direction: take Anduril's confidence, marketing style and look as the reference; be unapologetic and self-assured; we do not manufacture anything.

---

You are leading the personality transition of Data Hygienics, an independent field guide to living and working securely alongside AI, for households and businesses of 1 to 50 people. You are working in its Next.js repository. The owner wants the site to carry the confidence, marketing discipline and visual command of Anduril Industries, the defense technology company, translated for a company that makes no hardware and protects families and small firms. The result should feel unapologetic and self-assured. It must never feel frightening, militaristic or borrowed.

Work in phases. Stop at the end of Phase 0 for the owner's approval before touching production code.

## 1. Read before you do anything

Read these in full. They are binding.

- `CLAUDE.md`: the stack, the content system, voice rules, membership surfaces, analytics, removed features. Every rule there still holds unless this prompt changes it explicitly. Nothing in this prompt changes a stored key, a URL, an analytics event or a validator rule.
- `design/brand-book/README.md` and the brand book PDF at `output/pdf/data-hygienics-brand-book.pdf` if present: the Continuous Fold mark, the outlined wordmark, the palette. The mark and wordmark do not change.
- `app/globals.css` (tokens), `app/layout.js` (fonts), `lib/site.js` (navigation and footer), `app/components/Navbar.jsx`, `app/components/Footer.jsx`, `app/components/FrontDoor.jsx`, `app/page.js`.
- `design/strategy/marketing-plan.md` (positioning, page anatomy, the share card), `design/strategy/five-year-value-roadmap.md` (the bets, the custody rule, what we will not build), `lib/content/membership.js` (the pitch).
- `scripts/validate-content.mjs`: the banned tone words and the detection-claim rule. They stay.

## 2. Study the reference yourself

Open https://www.anduril.com in the browser pane and study the homepage, one product page (for example a Lattice page) and one long-form essay. Do not download, copy or reuse any of their assets, text, layouts, typefaces or code. Write what you observe to `design/brand-book/reference-study.md`, in two columns: what they do, and what it becomes for us.

What the owner's strategist already observed, as a starting point to confirm or correct:

- **A dark canvas and cinematic scale.** Black backgrounds, full-bleed video of real hardware in real environments, almost no chrome.
- **Display type with authority.** Large uppercase grotesk headlines at medium weight, tight leading, short lines. Small uppercase labels. Monospaced details used like instrument readouts.
- **Names plus imperatives.** Every product has a proper name and a two-to-four-word imperative or claim beneath it, with no adjectives: a name, then a verb.
- **One system under the products.** A single platform is presented as the backbone that powers every product, so the catalog reads as one machine rather than a list.
- **A mission stated as fact.** The homepage says what the company does in one declarative line. Long essays published in numbered parts carry the worldview.
- **Restraint.** Few colors, one accent, no exclamation marks, no hedging, no stock photography, no explanation of why you should trust them. The work is the argument.

## 3. What we take, and what we leave

**Take:**

- **Declarative certainty.** State what is true and what to do. No "might," "could help," "we hope," or "tips." Hedges belong only where the evidence is genuinely uncertain, and then they are precise ("the FBI calls this figure a floor").
- **Names plus imperatives.** Every tool and service gets its name and one line that says what it does, in the imperative. Examples to improve on, not to ship unexamined: Threat Check, "Hang up. Call back." Clear Path, "Know the next step." Ask, "Get the answer, with the source." Cyber Audit, "Find the gaps. Close them." Break glass, "Act in the first hour." The tagline is a title, so it never ends with a period unless it is two sentences, and the validator's title rule applies.
- **One system.** Present the Path as the backbone every tool plugs into: the Threat Check feeds a step, Ask cites a step, the Audit produces steps, the Watch reopens steps. The catalog becomes one machine.
- **Readout details.** Use a monospaced face for metadata that proves rigor: reviewed dates, source counts, step counts, the custody line ("Checked on your device. Nothing sent."). This is where our confidence is earned, so make it visible.
- **A manifesto in parts.** Rewrite `/how-it-works` ("How we work") as a numbered essay in two or three parts. Working spine: Part 1, Procedure beats detection. Part 2, Independence is the product. Part 3, Your home stays yours (the custody rule). Every figure carries a marker and a source from `lib/content/sources/`; add sources the normal way if needed.
- **Restraint.** One accent color. No exclamation marks. No stock photography. Fewer, larger elements per screen.

**Leave:**

- **Combat and enemy language.** No "fight," "war," "weapon," "arsenal," "kill," "battle," "enemy," "defend the homeland," "threat actor" in marketing copy. Our confidence is about control and readiness. Words that fit: ready, in order, on record, checked, settled, covered, rehearsed, yours.
- **Fear.** Everything in `CLAUDE.md`'s voice section and the validator's banned list still applies. Confidence is the opposite of alarm: we are certain because we have a procedure, not because the world is dangerous.
- **Pure black everywhere.** Anduril sells to people who want to feel a machine's power. We serve frightened people, older readers and people who print pages. Dark is for statement surfaces; reading surfaces stay light (section 5).
- **Hardware cinema we do not have.** No renders, no fake product shots, no hooded hackers, padlocks, shields, binary rain or glowing networks. Our hardware is paper: the card by the phone, the printed binder, the wallet card. Until real photography exists, the graphic system is type, the mark's geometry and real artifacts rendered as artifacts.
- **Politics and the reference itself.** Never name Anduril or any defense company on the site, in metadata or in commit messages that ship. Digital Sovereignty is strictly non-partisan, and a defense look-alike would undercut it. Be recognizably ourselves at first glance; if a screen could be mistaken for theirs, it is too close.
- **Swagger without proof.** Every bold claim on the page must be backed on the same page by a source, a shipped tool or a stated rule. If it cannot be backed, cut it.

## 4. The personality

Write this into `design/brand-book/personality.md` as the governing spec, refined from your study.

**In one line:** the calm, certain voice of someone who has already done the reading and knows the next step.

**Traits, each with its limit:**

- **Certain,** never arrogant. We state; we do not sneer at other companies or at users.
- **Specific,** never clever for its own sake. A headline can be creative; the instruction under it is literal.
- **Unapologetic about independence.** No referral fees, no affiliates, no sponsors, no detection claims, no data custody. Say these as facts, as often as useful, without defensiveness.
- **On your side.** Second person, plain English, short paragraphs, acronyms translated on first use. Self-assured is not cold.
- **Quiet under pressure.** The worse the moment (a verdict page, break glass), the shorter and steadier the words.

**Headline rules:** at most eight words; a fact, a claim or an instruction; no questions except where the user's own question is the title (verdict pages keep the message people typed); no trailing period on titles; uppercase only for statement lines of six words or fewer.

**Before and after, from the current site** (rewrite these, then propose more):

- Homepage subhead, now: "Independent, plain-English security for homes and small businesses living alongside AI." Direction: one declarative line about what we do and for whom, then the independence rule as a readout.
- Membership headline, now: "Keep your digital life in order, with someone to ask." Direction: name what the member gets and what it costs, in that order, with no softening clause.
- Homepage headline, now: "Your digital life, in order." This one already fits. Keep it unless the study gives a clearly stronger line.

## 5. The visual system

Translate, do not copy. Propose the following in Phase 0, then implement in Phase 1.

- **Two surfaces.** *Night*: the brand navy `#0F172A` (Judgment) as the canvas for statement surfaces: the homepage hero, hub heads, pricing heads, the manifesto, the footer, share cards. *Day*: Field White `#F8FAFC` and white for reading surfaces: library articles, guides, steps, verdicts, the Path, tools, legal pages. Never pure black.
- **One accent.** Action Teal `#0F8F83` is the single signal on night surfaces, for rules, focus, the active state and small marks. Cobalt `#1D4ED8` stays the link and Business color on day surfaces. Body-size teal text on day surfaces stays `#0F766E`, as `CLAUDE.md` requires. Check every pairing for WCAG AA (4.5:1 body, 3:1 large type and UI) and record the ratios in the spec.
- **Type.** Inter stays the body face. Add a display face with more authority from Google Fonts only (Inter Tight is the first candidate; test one or two alternatives) for headlines, and a monospaced face (JetBrains Mono or IBM Plex Mono) for readouts. Load through `next/font` like Inter. No licensed faces without the owner's sign-off.
- **Scale and rhythm.** Fewer, larger elements. Headlines up to roughly 5.5rem on desktop with tight leading; generous vertical space; a strict 12-column grid on desktop and a single column with a 16px gutter on phones.
- **Graphic language.** The Continuous Fold's geometry (`lib/brand/mark.js`), its clean cut and its fold lines, used as rules, section dividers and crop shapes. Artifacts (the card by the phone, the safe-word card, the one-page AI rule) shown large and real, as the products they are.
- **Motion.** Slow, short and purposeful: a fade or a rule drawing in, never parallax for its own sake. Everything respects `prefers-reduced-motion`. No autoplay video in Phase 1.
- **Never** a popup, countdown, flashing element or scare color for urgency. Danger red stays for genuine errors in forms.
- **Mark and wordmark** come only from `/logo.svg`, `app/components/BrandMark.jsx` and the brand assets, using the white mark on night surfaces. Never retype the wordmark.

## 6. Phases

Create a branch `feature/brand-personality` from `feature/ai-era-pivot`. Commit at the end of each phase with a clear message. Do not push and do not open a pull request unless the owner asks.

**Phase 0: Study and spec. Stop for approval.**

1. Write `design/brand-book/reference-study.md` (section 2).
2. Write `design/brand-book/personality.md`: traits, headline rules, the word list to use and to avoid, before-and-after rewrites for at least twenty real strings from `lib/site.js`, `lib/content/membership.js`, the homepage components and the hubs, the token table with contrast ratios, the type scale, the motion rules.
3. Build three static mockups as standalone HTML files in `design/brand-book/mockups/`: the homepage first screen (night), a verdict page (day, using a real verdict from `lib/content/verdicts/`), and the pricing page head (night into day). Use real copy, the real mark and the proposed tokens. Show each at 1440px and 375px widths in the browser pane and include screenshots in your report.
4. Report to the owner: the three mockups, the five rewrites you are most and least sure of, and the decisions in section 8. Stop.

**Phase 1: Foundations.** Tokens in `app/globals.css` for both surfaces, the display and mono faces in `app/layout.js`, a small set of primitives (a night section, a day section, a statement headline, a readout line, a name-plus-imperative card, a fold rule), then `Navbar.jsx` and `Footer.jsx`. Keep the navbar's structure (For Home, For Business, the Library menu, the Threat Check door, Members); restyle it. The navbar is rendered per page, so check every page still imports it.

**Phase 2: Front of house.** The homepage (`FrontDoor`, `WhyItMatters`, `OurPromise`, `HowThePathWorks`, `MembershipBand`, the three doors), the three hubs, `/pricing`, `/about`, `/how-it-works` as the manifesto, `/tools`. The FBI IC3 chart in `WhyItMatters` stays sourced; restyle it, do not reframe its numbers as alarm.

**Phase 3: Reading surfaces.** Article headers and parts for threats, guides, explainers, controls and steps; the verdict template; the Path screens. Day surface, the new type and readouts, the same structure. Verdict pages keep every rule in `CLAUDE.md` (nothing statistical above the fold, `.gov` contacts only, no detection wording). The Path's progress stays counts per outcome.

**Phase 4: Words everywhere.** A copy pass on navigation descriptions, membership copy, tool intros, empty states, buttons and emails in the repository, applying the personality. Then share cards and OG images (`app/components/og`, `scripts/generate-icons.mjs`) and the PDF lockups (`app/components/pdf/`) in the night palette where it helps legibility.

After every phase: `npm run validate`, `npm run lint` and `npm run build` must pass. Start the dev server with the preview tools and check the changed pages at 1440px and 375px, keyboard focus, 200% zoom and reduced motion. Run a contrast check on every new pairing. Report what you checked and anything you could not.

## 7. Hard rules

- No stored key, route, step id, quiz option value, analytics event or Stripe identifier changes. Six analytics events, no more.
- Membership appears once per page and never inside a verdict, a step's do-list, the first-step card or the quiz, and never as a popup or countdown.
- Every statistic carries a source marker. No new numbers in marketing copy without a source record.
- "AI" is the public term. "IT provider," never "MSP." No "guarantee." No banned tone words.
- No detection claims anywhere, including taglines. "Hang up. Call back." is a procedure; "spot the fake" is a claim we never make.
- No household scores or grades. The Cyber Audit keeps its grading.
- Nothing that implies we hold household data. Where the custody rule applies, say so plainly.
- No reference to Anduril, defense, the military or weapons anywhere a user can see.
- No new third-party scripts, trackers or fonts outside Google Fonts.
- Accessibility is not traded for drama: AA contrast, visible focus, real headings in order, alt text, no text baked into images.

## 8. Decisions that belong to the owner

Put each in your Phase 0 report as a question with your recommendation:

1. The night-and-day split, or night as the default everywhere.
2. The display face, after the side-by-side test.
3. Whether uppercase statement lines appear on reading surfaces or only on night surfaces.
4. A name for the system under the products (the Path is the working answer), and whether it gets its own page.
5. Photography: commission real photographs of the artifacts in real homes and offices, or stay typographic until it can be done well.
6. The manifesto's three parts and their titles.

## 9. How to report

Lead with what changed and what the owner should look at first, with screenshots. Then what passed (validate, lint, build, contrast, mobile) and what you could not verify. Then the open decisions. Keep it short and plain, in the voice you are building.
