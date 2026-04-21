export default function SchemaScript({ schema }) {
  const schemas = Array.isArray(schema) ? schema : [schema]
  return (
    <>
      {schemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Escape `<` so a `</script>` substring inside any string value
          // cannot close this tag early and allow injected HTML. JSON itself
          // has no need for a literal `<`, so the replacement is safe.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(s).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  )
}
