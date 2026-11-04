// Home map: what the law now asks of the makers of connected devices. Pure
// data, import-free. Dated and sourced; written as a fact about makers, never
// as a deadline for the member. Shown beside the readout as context, so the
// text carries no figures (the date lives in `date`).
//
// Item: { id, audience, date: "YYYY-MM-DD", title, text, sourceIds, status }
// - id is a stable key; never rename one.

export const FUTURE = [
  {
    id: "uk-psti-in-force",
    audience: ["home"],
    date: "2024-04-29",
    title: "UK law sets security basics for smart products",
    text: "Makers selling smart products in the UK can no longer ship them with one default password for every device. They must also say how to report a security problem and how long the product will get security updates.",
    sourceIds: ["uk-psti-regime"],
    status: "published",
  },
  {
    id: "eu-cra-reporting",
    audience: ["home"],
    date: "2026-09-11",
    title: "Makers selling in the EU must report flaws used in attacks",
    text: "Under the EU Cyber Resilience Act, makers of products with digital parts sold in the EU must report flaws that are being actively used in attacks.",
    sourceIds: ["eu-cra-commission"],
    status: "published",
  },
  {
    id: "eu-cra-full",
    audience: ["home"],
    date: "2027-12-11",
    title: "EU security rules for connected products take full effect",
    text: "The main duties of the EU Cyber Resilience Act apply from this date: makers of products with digital parts sold in the EU must build security in from design to upkeep and handle flaws for the life of the product.",
    sourceIds: ["eu-cra-commission"],
    status: "published",
  },
]
