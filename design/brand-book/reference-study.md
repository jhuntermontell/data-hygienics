# Reference study: two sites, one translation

Studied 2026-10-27 in the browser pane, for the personality transition (`personality-transition-prompt.md`). Two references: Anduril Industries for confidence, voice and look, and Palantir for the menu and search. Nothing was downloaded or reused: no assets, text, layouts, typefaces or code. This file is internal and never ships; the public site names neither company.

Pages studied: anduril.com (homepage), a Lattice product page (Command and Control), the long-form essay at anduril.com/rebuild-the-arsenal; palantir.com (homepage, the navigation overlay, the search screen).

## Anduril: confidence, voice and look

| What they do | What it becomes for us |
|---|---|
| **A dark canvas.** Pure black behind everything on the homepage and product pages. | Brand navy `#0F172A` for statement surfaces only: homepage hero, hub heads, pricing head, the manifesto opening, the footer. Never pure black. |
| **Cinematic full-bleed video** of hardware in real places (sea, desert, sky). Almost no interface chrome around it. | We have no hardware and will not fake it. Our objects are paper: the card by the phone, the printed binder, the one-page AI rule. Shown large, flat and real. Until real photography exists, type and the mark's geometry carry the page. |
| **Uppercase display headlines** in a licensed grotesk (Helvetica Now Display, medium weight, tight tracking), stacked many lines deep on the homepage. | A free display face from Google Fonts (Inter Tight tested first) at large sizes. Uppercase only for statement lines of six words or fewer; everything longer stays sentence case, because long uppercase is hard to read and older readers are our people. |
| **A name, then an imperative.** Each product carries a proper name and two to four words beneath it, with no adjectives. | Every tool gets a name and one imperative line: Threat Check, "Hang up. Call back." Most of ours already exist; they just are not presented this way. |
| **One system under the products.** A single software platform is shown as the backbone that powers everything; products are presented as members of a family. | The Path is the backbone: the Threat Check ends in a Path step, Ask cites Path steps, the Audit produces steps, the Watch reopens steps. The catalog reads as one machine. |
| **Mono details as instrument readouts.** An "EST." date line, part numbers, small labels in a monospaced or tabular face. | Monospaced readouts for what proves rigor: reviewed dates, source counts, step counts, and the custody line ("Checked on your device. Nothing sent."). This is where our confidence is earned, so it is visible. |
| **The essay as a numbered document.** The manifesto opens on a black title screen with a part counter (part 0 of 5) and a document label, then turns to a **white reading surface**: a narrow centered column, short paragraphs, numbered footnote citations, and a vertical running label in the margin naming the part. | The manifesto at `/how-it-works` in three parts with a part counter, opening on navy and reading on white. Our `[^source]` citations are already the footnotes. Even the reference reads on white, which settles the night-and-day split. |
| **Navigation by domain,** five or six words across the top, very little else. | The bar already has the right shape: For Home, For Business, the Library, the Threat Check door, Members. Fewer words, more space, a search control. |
| **Restraint.** One accent color in places (a thin acid-yellow progress rule on a product page), no exclamation marks, no hedging, no stock photography, no testimonials. | Action Teal `#0F8F83` as the single accent on navy. No exclamation marks, no stock photography. |
| **Combat language** throughout: fight, arsenal, kill chain, own the edge. | Left behind entirely. Our certainty is about readiness and control: ready, in order, on record, checked, rehearsed, yours. |
| **Claims of scale** as the argument: dollar figures, factory size, counts of systems. | Our claims are sources and rules: every number cited, every rule stated. A bold line is allowed only when the same screen backs it with a source, a shipped tool or a rule. |

## Palantir: the menu block and the search

| What they do | What it becomes for us |
|---|---|
| **A compact header:** wordmark left; on the right, one outlined call to action and two square icon buttons (search, menu) with thin borders, flush together. | Wordmark left from `/logo.svg` (white mark on navy). Right: the Threat Check door as the one outlined action, then square Search and Menu buttons. On desktop the primary words (For Home, For Business, Library) stay visible; on phones only the door and the two squares. |
| **The menu is a full-screen overlay** on a near-black charcoal, laid out as three columns under thin horizontal rules, each with a tiny uppercase label (navigation, latest news, offerings). | The Library opens as a full-screen navy overlay in three columns: **Start** (For Home, For Business, Digital Sovereignty, Map your path), **Library** (threats, guides, toolkit, glossary, controls), **Tools** (Threat Check, Cyber Audit, Policy Library, IR Planner, Ask, pricing). Each column under a hairline rule with a mono label. |
| **Very large navigation items** (display size), with sub-items marked by a "↳" return arrow, so hierarchy is shown by a glyph instead of nesting boxes. | Large display-size links for the first column; the library and tools as medium-size names with their one-line imperative beneath. A return-arrow glyph for sub-items is a good device; ours uses the fold-rule notch instead, so it reads as ours. |
| **A live column inside the menu** (dated news items with "read here" links). | The newest two library entries, dated in mono, plus "Reviewed this month" counts. The menu becomes proof the library is maintained. |
| **Search opens as its own screen:** a full-width input directly under the header with a "Clear" control, a row of suggested searches beneath it, and a very large empty state. | Search as a full-screen sheet: a full-width field, suggested searches drawn from the Threat Check chips ("A text says I owe a toll"), then results grouped by kind (Verdict, Step, Guide, Threat, Glossary) with dates. |
| **Search failed in our test:** typing a term, and then clicking one of their own suggested searches, both returned "No results found," likely because the results come from an outside service that did not load. | Our search is built from our own published index, ships with the page, runs in the browser and never calls a third party. It always offers the closest verdicts and the Threat Check, so an empty result is never a dead end. That also honors the custody rule: queries never leave the device. |
| **Licensed typeface** (Alliance No.1 and No.2) and a cookie wall on arrival. | Free faces only. No cookie wall, because we load no trackers beyond the existing analytics. |

## What we will not take from either

- Their names, wording, layouts, typefaces, imagery, glyph treatments or color values.
- Anything that reads as defense, intelligence or surveillance. If a screen could be mistaken for either site, it is too close.
- Pure black, uppercase body copy, autoplay video, a cookie wall.
- Confidence that rests on scale or secrecy. Ours rests on sources, rules and tools anyone can use.

## What could not be verified

- The Anduril essay page and mission page render with client-side code that the text tools could not read, so the essay was studied from screenshots of its opening and first section only.
- Palantir's search returned no results in this browser, so its results layout could not be seen; only the input, suggestions and empty state were studied.
