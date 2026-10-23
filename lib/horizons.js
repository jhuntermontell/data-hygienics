// Time horizons shared by the glossary and Clear Path. Content tags terms and
// steps with a key ("now" | "next" | "future"); this is how each one reads.
//
// The colors follow the Continuous Fold read from the far horizon back to
// today: navy (Judgment) for the Long View, cobalt (Clarity) for Next, teal
// (Action) for Now. The Long View year is always five years out, never
// hard-coded. Horizons are directions, not deadlines: no dates on to-dos.

export const LONG_VIEW_YEARS = 5

export function longViewYear(now = new Date()) {
  return now.getFullYear() + LONG_VIEW_YEARS
}

export const HORIZONS = {
  now: {
    key: "now",
    label: "Now",
    verb: "Do",
    window: "This month",
    description: "Here today and widely used, or widely exploited. Worth doing now.",
  },
  next: {
    key: "next",
    label: "Next",
    verb: "Prepare",
    window: "In the next year or two",
    description: "Arriving for ordinary homes and small businesses soon. Worth preparing for.",
  },
  future: {
    key: "future",
    label: "Long View",
    verb: "Know",
    window: "Over the next five years",
    description: "Further out. Learn the word now and make choices that keep your options open.",
  },
}

export const HORIZON_ORDER = ["now", "next", "future"]

// Full class strings so Tailwind can see them.
export const HORIZON_STYLES = {
  now: { chip: "bg-[#F0FDFA] text-[#0F766E] border-[#0F8F83]/30", dot: "bg-[#0F8F83]", solid: "bg-[#0F8F83] text-white" },
  next: { chip: "bg-[#EFF6FF] text-[#1D4ED8] border-[#1D4ED8]/30", dot: "bg-[#1D4ED8]", solid: "bg-[#1D4ED8] text-white" },
  future: { chip: "bg-[#F1F5F9] text-[#0F172A] border-[#0F172A]/20", dot: "bg-[#0F172A]", solid: "bg-[#0F172A] text-white" },
}
