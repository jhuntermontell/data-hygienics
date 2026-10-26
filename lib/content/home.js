// Homepage "What changed" strip: four calm, sourced facts about everyday security
// in the AI era. Pure data, import-free. Sources live in
// lib/content/sources/landscape.js; each item carries its own sourceId and locator.

export const WHAT_CHANGED = [
  {
    figure: "$15.9 billion",
    text: "People reported $15.9 billion in fraud losses to the Federal Trade Commission in 2025, up from more than $12 billion in 2024.",
    sourceId: "ftc-jec-fraud-testimony-2026",
    locator: "FTC press release of March 25, 2026, paragraph summarizing 2025 Consumer Sentinel fraud reports",
  },
  {
    figure: "$893 million",
    text: "The FBI logged 22,364 complaints with an AI connection in 2025, carrying $893 million in reported losses.",
    sourceId: "fbi-ic3-2025",
    locator: "2025 IC3 Annual Report, pp. 7-8 ('AI Related' descriptor) and p. 39",
  },
  {
    figure: "$7.7 billion",
    text: "People 60 and older reported $7.7 billion in losses to the FBI in 2025, up 59% from 2024.",
    sourceId: "fbi-ic3-2025",
    locator: "2025 IC3 Annual Report, p. 44 (Elder Fraud highlights)",
  },
  {
    figure: "45%",
    text: "In Verizon's 2026 breach-report data, 45% of employees used AI regularly on work devices, up from 15% a year earlier, and about two-thirds of AI users signed in with non-corporate accounts.",
    sourceId: "verizon-dbir-2026-exec-summary",
    locator: "2026 DBIR Executive Summary, p. 12 (Shadow AI policy violations)",
  },
]

// Homepage "Why it matters" chart: losses reported to the FBI's Internet Crime
// Complaint Center (IC3), by year. Reported losses only, never a projection.
// Values are USD billions as the FBI printed them; each point names the report
// and page it came from. The hero repeats the latest point in words.
export const LOSSES_BY_YEAR = {
  title: "Losses reported to the FBI's Internet Crime Complaint Center, by year",
  unit: "USD billions",
  points: [
    { year: 2020, value: 4.2, sourceId: "fbi-ic3-2023", locator: "2023 IC3 Annual Report, p. 7 (five-year chart)" },
    { year: 2021, value: 6.9, sourceId: "fbi-ic3-2023", locator: "2023 IC3 Annual Report, p. 7 (five-year chart)" },
    { year: 2022, value: 10.3, sourceId: "fbi-ic3-2023", locator: "2023 IC3 Annual Report, p. 7 (five-year chart)" },
    { year: 2023, value: 12.5, sourceId: "fbi-ic3-2023", locator: "2023 IC3 Annual Report, pp. 3 and 7" },
    { year: 2024, value: 16.6, sourceId: "fbi-ic3-2024", locator: "2024 IC3 Annual Report, p. 4" },
    { year: 2025, value: 20.877, sourceId: "fbi-ic3-2025", locator: "2025 IC3 Annual Report, pp. 4 and 6" },
  ],
  hero: {
    figure: "$20.9 billion",
    text: "reported lost to online crime in 2025, about five times 2020.",
    sourceId: "fbi-ic3-2025",
    locator: "2025 IC3 Annual Report, pp. 4 and 6",
  },
}
