// The statement headline: the display face, uppercase, very large. Rules
// (design/brand-book/personality.md): six words or fewer, night surfaces
// only, no trailing period. Longer headlines use sentence case instead.
export default function Statement({ as: Tag = "h1", className = "", children, ...props }) {
  return (
    <Tag
      className={`font-display font-semibold uppercase text-[2.75rem] sm:text-[4rem] lg:text-[5.5rem] leading-[0.95] tracking-[-0.035em] text-balance ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
