// Glossary of AI and security terms, rendered A-Z on /glossary with
// #term-<slug> anchors.
import { GLOSSARY } from "./content/glossary.js"

export const glossary = [...GLOSSARY].sort((a, b) =>
  a.term.localeCompare(b.term, "en", { sensitivity: "base" })
)

export function getTermBySlug(slug) {
  return glossary.find((t) => t.slug === slug)
}
