import Link from "next/link"

export default function AuthorByline({ showFull = false, lastReviewed }) {
  return (
    <div className="author-byline" itemScope itemType="https://schema.org/Person">
      <span itemProp="name">Hunter Montell</span>
      {" · "}
      <Link
        href="https://www.credly.com/badges/f70e05cc-50bd-4ce5-b60c-639e4386ea0e/public_url"
        target="_blank"
        rel="noopener noreferrer"
        itemProp="hasCredential"
        title="Verify CompTIA Security+ certification"
      >
        CompTIA Security+
      </Link>
      {showFull && (
        <>{" · "}NIST CSF{" · "}CIS Controls v8</>
      )}
      {" · "}
      <span>Last reviewed: {lastReviewed}</span>
      {" · "}
      <Link href="/about">Author bio</Link>
    </div>
  )
}
