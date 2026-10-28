// Night and day surfaces. Night (brand navy) is for statement surfaces: the
// homepage hero, hub heads, pricing heads, the manifesto, the footer. Day
// (white or Field White) is for everything people read. Each wraps its
// content in the site's content width with a 16px gutter on phones.
const WIDTH = "max-w-7xl mx-auto px-4 sm:px-6"

export function NightSection({ as: Tag = "section", className = "", innerClassName = "", children, ...props }) {
  return (
    <Tag className={`bg-night text-night-ink ${className}`} {...props}>
      <div className={`${WIDTH} ${innerClassName}`}>{children}</div>
    </Tag>
  )
}

export function DaySection({ as: Tag = "section", field = false, className = "", innerClassName = "", children, ...props }) {
  return (
    <Tag className={`${field ? "bg-[#F8FAFC]" : "bg-white"} text-[#0F172A] ${className}`} {...props}>
      <div className={`${WIDTH} ${innerClassName}`}>{children}</div>
    </Tag>
  )
}
