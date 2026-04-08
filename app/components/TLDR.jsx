export default function TLDR({ summary }) {
  return (
    <div
      className="tldr-block"
      role="note"
      aria-label="Summary"
    >
      <span className="tldr-label">TL;DR</span>
      <p>{summary}</p>
    </div>
  )
}
