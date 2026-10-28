# Phase 0 mockups

Static mockups for the personality transition. Not production code. The tokens, type and copy follow `../personality.md`; the reasoning is in `../reference-study.md`.

- `home.html`: the homepage first screen on navy, with the card by the phone, the first Path question and the tools as one system. Open the menu and search from the header.
- `verdict.html`: a real verdict (`lib/content/verdicts/family-voice-call.js`) on the light reading surface, with the figure and sources below the fold.
- `pricing.html`: the pricing head on navy running into the two plans and "Free, always" on white.
- `type-specimen.html`: the three display faces and two readout faces side by side.

Shortcuts: `home.html?open=menu`, `home.html?open=search&q=toll`.

**To view:** the logos load from `../assets`, so serve the brand-book folder rather than opening the files directly:

```bash
python3 -m http.server 4310 --directory design/brand-book
```

Then open http://localhost:4310/mockups/home.html.

`screenshots/` holds the captures at 1440px and 375px wide. The fold rule's draw-in and the menu's fade are shown as static states here, because the preview pane pauses animations; the motion rules are in the spec.
