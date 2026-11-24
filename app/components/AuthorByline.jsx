export default function AuthorByline({ lastReviewed }) {
  return (
    <div className="author-byline">
      <span>Data Hygienics research</span>
      {" · "}
      <span>Last reviewed: {lastReviewed}</span>
    </div>
  )
}
