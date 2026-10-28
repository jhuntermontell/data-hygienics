"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Menu, Search, ChevronDown, LayoutDashboard, FileText, ShieldCheck, LogOut } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { clearSubscriptionCache, getSubscription } from "@/lib/stripe/subscription"
import { clearAccountPaths } from "@/lib/path/storage"
import { NAV } from "@/lib/site"
import { DoorLink, SquareButton } from "./nav/HeaderParts"
import SiteMenu from "./nav/SiteMenu"
import SiteSearch from "./nav/SiteSearch"

// The header (design/brand-book/personality.md, section 10). Wordmark left;
// For Home, For Business and Library on desktop; on the right the Threat
// Check door as the one outlined action, the account links, then two square
// buttons for Search and Menu. The Library and Menu open one full-screen
// sheet (Start, Library, Tools); Search opens another that searches a static
// index in the browser. Links come from lib/site.js NAV.
//
// `surface` is "day" (white, the default) or "night" (brand navy) for pages
// whose first screen is a night surface.

const FOCUSABLE = "a[href], button:not([disabled])"

// The member slot: signed-out visitors see a quiet "Members" link
// (NAV.members); a Home member sees "My path".
const MY_PATH_LINK = { href: "/path/home", label: "My path" }
const isHomeMember = (plan) => typeof plan === "string" && plan.startsWith("member_home")

const SURFACES = {
  day: {
    bar: "bg-white text-[#0F172A]",
    border: "border-[#E2E8F0]",
    logo: "/logo.svg",
    link: "text-[#334155] hover:text-[#0F172A]",
    current: "text-[#0F172A] underline",
  },
  night: {
    bar: "bg-night text-white",
    border: "border-night-line",
    logo: "/brand/logo-horizontal-white.svg",
    link: "text-night-ink-2 hover:text-white",
    current: "text-white underline",
  },
}

function isActive(pathname, href) {
  if (!pathname) return false
  return pathname === href || pathname.startsWith(`${href}/`)
}

function Dropdown({ id, label, open, onToggle, onClose, align = "left", panelClassName = "", buttonClassName = "", children }) {
  const reduce = useReducedMotion()
  const wrapRef = useRef(null)
  const buttonRef = useRef(null)
  const panelRef = useRef(null)
  const panelId = `${id}-panel`

  useEffect(() => {
    if (!open) return
    const outside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) onClose()
    }
    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose()
        buttonRef.current?.focus()
      }
    }
    document.addEventListener("pointerdown", outside)
    document.addEventListener("focusin", outside)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", outside)
      document.removeEventListener("focusin", outside)
      document.removeEventListener("keydown", onKey)
    }
  }, [open, onClose])

  const items = () => Array.from(panelRef.current?.querySelectorAll(FOCUSABLE) || [])

  const focusItem = (index) => {
    const list = items()
    if (list.length) list[(index + list.length) % list.length].focus()
  }

  const handleButtonKeyDown = (e) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return
    e.preventDefault()
    if (!open) onToggle()
    // The panel is unhidden on the next commit; focus after it paints.
    requestAnimationFrame(() => focusItem(e.key === "ArrowDown" ? 0 : -1))
  }

  const handlePanelKeyDown = (e) => {
    const list = items()
    const index = list.indexOf(document.activeElement)
    if (e.key === "ArrowDown") {
      e.preventDefault()
      focusItem(index + 1)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      focusItem(index - 1)
    } else if (e.key === "Home") {
      e.preventDefault()
      focusItem(0)
    } else if (e.key === "End") {
      e.preventDefault()
      focusItem(list.length - 1)
    }
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        onKeyDown={handleButtonKeyDown}
        className={`flex items-center gap-1 whitespace-nowrap text-sm font-medium px-2 xl:px-3 py-2 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F8F83] ${buttonClassName}`}
      >
        {label}
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      <motion.div
        ref={panelRef}
        id={panelId}
        hidden={!open}
        initial={false}
        animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
        transition={{ duration: reduce ? 0 : 0.14 }}
        onKeyDown={handlePanelKeyDown}
        className={`absolute top-full mt-2 z-50 bg-white border border-[#E2E8F0] shadow-lg overflow-hidden ${
          align === "right" ? "right-0" : "left-0"
        } ${panelClassName}`}
      >
        {children}
      </motion.div>
    </div>
  )
}

export default function Navbar({ surface = "day" }) {
  const supabase = getSupabaseBrowserClient()
  const pathname = usePathname()
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  // The plan from the cached subscription (getSubscription), signed in only.
  const [plan, setPlan] = useState(null)
  const [ready, setReady] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  // The user dropdown ("user" or null) and the two full-screen sheets.
  const [openMenu, setOpenMenu] = useState(null)
  const [sheet, setSheet] = useState(null) // "menu" | "search" | null
  const [showNameModal, setShowNameModal] = useState(false)
  const [nameInput, setNameInput] = useState("")
  const [savingName, setSavingName] = useState(false)
  const [nameError, setNameError] = useState("")
  // Tracks the user ID we currently care about. Profile queries that finish
  // after the user signs out or switches accounts compare against this and
  // discard their results, preventing stale data from leaking into UI.
  const currentUserIdRef = useRef(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      setReady(true)
      currentUserIdRef.current = s?.user?.id || null
      if (s?.user) {
        loadProfile(s.user.id)
        loadPlan(s.user.id)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === "SIGNED_OUT") {
        currentUserIdRef.current = null
        setSession(null)
        setProfile(null)
        setPlan(null)
        setShowNameModal(false)
        setReady(true)
        return
      }
      setSession(s)
      setReady(true)
      currentUserIdRef.current = s?.user?.id || null
      if (s?.user) {
        loadProfile(s.user.id)
        loadPlan(s.user.id)
      } else {
        setProfile(null)
        setPlan(null)
      }
    })

    return () => subscription.unsubscribe()
    // Subscribes once on mount by design; the client and loader are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadProfile(userId) {
    const requestUserId = userId
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", userId)
      .maybeSingle()

    // Stale-result guard: if auth changed (sign-out, account switch) while
    // this query was in flight, discard the result.
    if (currentUserIdRef.current !== requestUserId) return

    if (error) {
      // A failed query is NOT the same as "no profile exists". Don't trigger
      // the name modal in this case; greet generically and move on.
      console.error("Failed to load profile:", error)
      return
    }
    setProfile(data)
    if (!data?.full_name) {
      setShowNameModal(true)
    }
  }

  // Reads the plan through the same five-minute cache the rest of the site
  // uses, so the navbar adds no query on most page views.
  async function loadPlan(userId) {
    const sub = await getSubscription(userId)
    if (currentUserIdRef.current !== userId) return
    setPlan(sub?.plan || null)
  }

  async function saveFirstName() {
    if (!nameInput.trim() || !session?.user) return
    setSavingName(true)
    setNameError("")
    const { error } = await supabase.from("profiles").upsert(
      {
        id: session.user.id,
        full_name: nameInput.trim(),
      },
      { onConflict: "id" }
    )
    if (error) {
      console.error("Failed to save profile name:", error)
      setNameError("Could not save your name. Please try again.")
      setSavingName(false)
      return
    }
    setProfile({ full_name: nameInput.trim() })
    setShowNameModal(false)
    setSavingName(false)
  }

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    handler()
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  // A route change closes any open sheet or dropdown.
  useEffect(() => {
    setSheet(null)
    setOpenMenu(null)
  }, [pathname])

  const closeMenu = useCallback(() => setOpenMenu(null), [])
  const toggleMenu = (key) => setOpenMenu((current) => (current === key ? null : key))
  const closeSheet = useCallback(() => setSheet(null), [])

  const handleSignOut = async () => {
    setOpenMenu(null)
    setSheet(null)
    clearSubscriptionCache()
    // Paths saved to this account shouldn't stay on a shared browser.
    clearAccountPaths()
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  const user = session?.user
  let firstName = null
  if (profile?.full_name) firstName = profile.full_name.split(" ")[0]
  else if (user?.user_metadata?.full_name) firstName = user.user_metadata.full_name.split(" ")[0]

  const memberSlot = !ready ? null : user ? (isHomeMember(plan) ? MY_PATH_LINK : null) : NAV.members
  const s = SURFACES[surface] || SURFACES.day
  const tone = surface === "night" ? "night" : "day"
  const textLink = `whitespace-nowrap text-sm font-medium px-2 py-2 underline-offset-[6px] decoration-1 hover:underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F8F83] ${s.link}`

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 border-b ${s.bar} ${s.border} ${scrolled ? "shadow-[0_1px_3px_0_rgb(0_0_0/0.06)]" : ""}`}>
        <nav aria-label="Main" className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3 lg:gap-7">
          <Link href="/" className="flex items-center shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F8F83]">
            <Image src={s.logo} alt="Data Hygienics" width={919} height={220} loading="eager" unoptimized className="h-7 sm:h-9 w-auto" />
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {NAV.primary.map((link) => {
              const active = isActive(pathname, link.href)
              return (
                <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined} className={`${textLink} ${active ? s.current : ""}`}>
                  {link.label}
                </Link>
              )
            })}
            <button
              type="button"
              onClick={() => setSheet("menu")}
              aria-haspopup="dialog"
              aria-expanded={sheet === "menu"}
              aria-controls="site-menu"
              className={`${textLink} cursor-pointer`}
            >
              Library
            </button>
          </div>

          <div className="ml-auto flex items-center gap-2 lg:gap-3 min-w-0">
            <DoorLink tone={tone} current={isActive(pathname, NAV.door.href)} />

            <div className="hidden lg:flex items-center">
              {!ready ? (
                <div className="w-32 h-9" />
              ) : user ? (
                <>
                  {memberSlot ? (
                    <Link href={memberSlot.href} aria-current={isActive(pathname, memberSlot.href) ? "page" : undefined} className={textLink}>
                      {memberSlot.label}
                    </Link>
                  ) : null}
                  <Dropdown
                    id="nav-user"
                    label={`Hi, ${firstName || "there"}`}
                    open={openMenu === "user"}
                    onToggle={() => toggleMenu("user")}
                    onClose={closeMenu}
                    align="right"
                    panelClassName="w-52 text-[#0F172A]"
                    buttonClassName={s.link}
                  >
                    <Link href="/tools/cyber-audit/dashboard" onClick={closeMenu}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#475569] hover:bg-[#F8FAFC] hover:text-[#1D4ED8] focus-visible:bg-[#F1F5F9] focus-visible:outline-none transition-colors">
                      <LayoutDashboard className="w-4 h-4" aria-hidden="true" /> Dashboard
                    </Link>
                    <Link href="/tools/cyber-audit/results" onClick={closeMenu}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#475569] hover:bg-[#F8FAFC] hover:text-[#1D4ED8] focus-visible:bg-[#F1F5F9] focus-visible:outline-none transition-colors">
                      <FileText className="w-4 h-4" aria-hidden="true" /> My Assessments
                    </Link>
                    <Link href="/tools/policies" onClick={closeMenu}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#475569] hover:bg-[#F8FAFC] hover:text-[#1D4ED8] focus-visible:bg-[#F1F5F9] focus-visible:outline-none transition-colors">
                      <ShieldCheck className="w-4 h-4" aria-hidden="true" /> My Policies
                    </Link>
                    <div className="border-t border-[#F1F5F9]" />
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#DC2626] hover:bg-[#FEF2F2] focus-visible:bg-[#FEF2F2] focus-visible:outline-none transition-colors w-full text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" aria-hidden="true" /> Sign out
                    </button>
                  </Dropdown>
                </>
              ) : (
                <>
                  <Link href="/tools/cyber-audit/login" className={textLink}>
                    Sign in
                  </Link>
                  <Link href={NAV.members.href} aria-current={isActive(pathname, NAV.members.href) ? "page" : undefined} className={textLink}>
                    {NAV.members.label}
                  </Link>
                </>
              )}
            </div>

            <div className="flex">
              <SquareButton tone={tone} label="Search" onClick={() => setSheet("search")} expanded={sheet === "search"} controls="site-search">
                <Search className="w-[18px] h-[18px]" strokeWidth={1.6} aria-hidden="true" />
              </SquareButton>
              <SquareButton tone={tone} label="Menu" onClick={() => setSheet("menu")} expanded={sheet === "menu"} controls="site-menu" className="-ml-px">
                <Menu className="w-[18px] h-[18px]" strokeWidth={1.6} aria-hidden="true" />
              </SquareButton>
            </div>
          </div>
        </nav>
      </header>

      <SiteMenu
        open={sheet === "menu"}
        onClose={closeSheet}
        pathname={pathname}
        ready={ready}
        user={user}
        firstName={firstName}
        memberSlot={memberSlot}
        onSignOut={handleSignOut}
      />
      <SiteSearch open={sheet === "search"} onClose={closeSheet} />

      {/* Name modal */}
      <AnimatePresence>
        {showNameModal && user && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setShowNameModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-sm bg-white rounded-xl border border-[#E2E8F0] shadow-xl p-8"
            >
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">What should we call you?</h3>
              <p className="text-sm text-[#475569] mb-5">Just your first name is fine.</p>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="First name"
                autoFocus
                className="w-full h-11 rounded-lg border border-[#E2E8F0] bg-white px-4 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] mb-3"
                onKeyDown={(e) => e.key === "Enter" && saveFirstName()}
              />
              {nameError && (
                <p className="text-[#DC2626] text-xs mb-3">{nameError}</p>
              )}
              <button
                onClick={saveFirstName}
                disabled={!nameInput.trim() || savingName}
                className="w-full bg-[#1D4ED8] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[#1E40AF] transition-colors disabled:opacity-50"
              >
                {savingName ? "Saving..." : "Save"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
