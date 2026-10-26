# Roadmap: from a good idea to a site people want to belong to

Written 2026-10-26, after the single front door landed (commit 3c243ba).

The shape of the brand is a calm club, not a hype machine. People join a
cause when it has a clear enemy (complexity and fear-selling), a clear
practice (the Path), a visible promise (independent, sourced, yours), and
artifacts they can carry (the safe-word card, the mark). Everything below
serves one of those four.

Items marked with a star are the 20% that carry most of the value. Do
those first within each horizon.

## Now (the next four to six weeks)

### Measure, so the 80% stops being a guess
- ★ Enable Vercel Web Analytics (cookie-free) and add `@vercel/analytics`. There is no traffic data today.
- ★ Google Search Console and Bing Webmaster Tools: verify, submit the sitemap, watch index coverage and the queries people actually type.
- Track four events only: chip clicked, path completed, step marked done, path saved.

### Finish the front door's promise (the Path is the product)
- ★ First click pays: after a chip, show the first step immediately and offer "make it fit" for the remaining questions.
- ★ Lead each stage with its end state ("Anyone in your family can check a voice request without spotting the fake"), step count beneath.
- ★ The "Something just happened" door: a free, calm triage for home and business (sent money, shared a code, clicked a link), three steps per answer, reachable from the navbar. Highest-intent moment on the site.
- The "Worth adding" layer: the five or six tools that remove work (password manager, passkeys, call screening, automatic backup, one AI assistant with limits), each with what it takes off your plate. The positive half of the vision.
- Nav to five items: Home, Business, Library, Business tools, Continue my path. Glossary becomes inline definitions (tap a term) rather than a destination.
- Hubs become the browse layer; the sourced "what changed" figures move into the threat sections where they have context.
- Industry depth: deepen general, healthcare, financial and professional services; the government-contractor stage points to the right authority instead of carrying CMMC.

### Trust basics a security site must pass itself
- `security.txt`, security headers and a content security policy; publish a short "how this site is secured" note.
- Accessibility pass to WCAG AA. The site serves older relatives and the people helping them.
- Privacy policy that matches the real data flows (local-first path, Supabase for saved paths, Stripe for business tools) and an explicit email-consent line.

## Next (the following quarter)

### Google search friendly
- ★ Make every Path step its own indexable page (`/steps/<id>`) with the four tellings and links to the sourced library. 132 steps are the largest untapped search asset on the site; today they live inside the quiz and are not indexed.
- ★ One intent per URL, with titles written the way people type ("Is this call from my bank real?", "Someone pasted client data into ChatGPT, now what?").
- Six to ten answer pages for the moments people search in a panic: bank callback, gift card demand, cloned voice, "did I get hacked", changed bank details on an invoice, a chatbot that knows too much.
- Structured data everywhere it is honest: Article with author and dates, FAQPage on guides, HowTo on steps, Organization with `sameAs`, BreadcrumbList.
- Internal linking rule: every threat links to the steps that stop it, every step links back to the threat and the guide.
- Visible "reviewed on" dates and a quarterly review rota; freshness is a ranking signal and a trust signal.
- Core Web Vitals check on the homepage and hubs (font loading, framer-motion weight, image policy).

### AI search reliable (ChatGPT, Perplexity, Google AI Overviews, Claude)
- ★ Short answer first on every page: two sentences at the top that answer the question, with the citation inline. Extraction engines quote the top.
- ★ Named authors with real bios and credentials on every article, a real About page with faces, and a consistent organization identity across the web. AI engines weight the same trust signals Google does.
- `llms.txt` at the root and a public `/sources` index with dates, so engines can see the citation trail. Robots already allows GPTBot, ClaudeBot and PerplexityBot; keep that stance and state it publicly as part of the sovereignty position.
- One-sentence quotable definitions in the glossary. Definitions get cited.
- One small original study a year (for example, how 1 to 50 person businesses actually use AI tools). Original data is what engines and journalists cite.
- Corrections policy and a public content changelog. Being correctable is a trust signal.

### The club
- ★ Name the free member account (it already exists for saved paths via magic link) and make it one account across home and business.
- ★ The monthly note: "What changed, and whether your path changed." One screen, calm, dated. The thing that brings people back and the honest content of any future subscription.
- Member progress as counts per outcome, no streaks and no guilt: "your home at a glance."
- Printable artifacts: the family safe-word card, the "when a call feels wrong" card by the phone, the one-page AI rule, the emergency kit. These carry the brand into kitchens and break rooms.
- A questions inbox answered in public once a month (a calm FAQ), and a quarterly live call. No forum yet; moderation is the cost that kills small communities.
- Identity objects: the mark on stickers and hats (the hat mockup already exists), an "independent, no referral fees" badge members can show, and one phrase people repeat ("Start with what you'd hate to lose").

### Monetization with a clear path
- ★ Keep the Documentation Pack as the one paid product. Smooth the route: free Quick Check, free AI policy, then the pack.
- Hide the Ongoing Protection tier until its recurring value exists (the monthly note plus the quarterly reassessment plus policy updates). Then relaunch it as what it really is.
- Decide the home side: free forever and funded by business, or a one-time Family Pack (printable kit, elder setup, emergency kit). Separately, a "keep it independent" supporter tier that buys nothing but independence, the way reader-funded publications work.
- Remove legacy plan mentions from any public page.

## The Long View (six to eighteen months)

- Brand feel: one illustration system from the brand book, warm real-life photography or calm abstraction, no hoodies and padlocks. A single motion rule, mostly none.
- Naming: the Path's stages and the monthly note get names. Naming creates belonging.
- The annual Long View letter: once a year, where we think this is heading and what we changed. A ritual members wait for.
- Distribution through the places the 80% already trust: libraries, senior centers, accountants, churches and parishes, small-business associations. The printable cards are the handoff.
- One channel done well (a monthly email plus one of LinkedIn or short video), not every channel.
- Pitch the original study to press; local news covers elder scams.
- Business tools as members' tools: the Cyber Audit and the Path share one account and one "where you stand."
