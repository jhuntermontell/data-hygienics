"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Menu, X, ChevronDown, LayoutDashboard, FileText, ShieldCheck, LogOut, ArrowRight } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { clearSubscriptionCache } from "@/lib/stripe/subscription"
import { NAV } from "@/lib/site"

// Links come from lib/site.js NAV. Dropdowns follow the disclosure pattern:
// a button with aria-expanded/aria-controls toggles a panel of links. Panels
// close on Escape (focus returns to the button), on a click or focus outside,
// and after a link is chosen. Arrow keys, Home and End move between links.

const ALL_TOOLS_LINK = { href: "/tools", label: "All business tools" }

// Color key: teal is Home, blue is Business, the blend is Digital Sovereignty.
const PRIMARY_DOTS = {
  "/household": "bg-[#0F8F83]",
  "/business": "bg-[#1D4ED8]",
  "/digital-sovereignty": "bg-gradient-to-br from-[#1D4ED8] to-[#0F8F83]",
}

const FOCUSABLE = "a[href], button:not([disabled])"

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
        className={`flex items-center gap-1 text-sm font-medium px-2 xl:px-3 py-2 rounded-lg transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] ${
          open ? "text-[#0F172A] bg-[#F1F5F9]" : "text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
        } ${buttonClassName}`}
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
        className={`absolute top-full mt-2 z-50 rounded-xl bg-white border border-[#E2E8F0] shadow-lg overflow-hidden ${
          align === "right" ? "right-0" : "left-0"
        } ${panelClassName}`}
      >
        {children}
      </motion.div>
    </div>
  )
}

function DropdownLinks({ links, pathname, onNavigate }) {
  return (
    <ul className="py-2 list-none m-0 p-0">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            onClick={onNavigate}
            aria-current={isActive(pathname, link.href) ? "page" : undefined}
            className="block px-4 py-2.5 hover:bg-[#F8FAFC] focus-visible:bg-[#F1F5F9] focus-visible:outline-none transition-colors"
          >
            <span className="block text-sm font-semibold text-[#0F172A]">{link.label}</span>
            {link.description ? (
              <span className="block text-xs text-[#64748B] mt-0.5 leading-snug">{link.description}</span>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default function Navbar() {
  const supabase = getSupabaseBrowserClient()
  const pathname = usePathname()
  const reduce = useReducedMotion()
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [ready, setReady] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  // Which desktop dropdown is open: "library" | "tools" | "user" | null.
  const [openMenu, setOpenMenu] = useState(null)
  // Which mobile accordion is open: "library" | "tools" | null.
  const [mobileSection, setMobileSection] = useState(null)
  const [showNameModal, setShowNameModal] = useState(false)
  const [nameInput, setNameInput] = useState("")
  const [savingName, setSavingName] = useState(false)
  const [nameError, setNameError] = useState("")
  const mobileToggleRef = useRef(null)
  // Tracks the user ID we currently care about. Profile queries that finish
  // after the user signs out or switches accounts compare against this and
  // discard their results, preventing stale data from leaking into UI.
  const currentUserIdRef = useRef(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      setReady(true)
      currentUserIdRef.current = s?.user?.id || null
      if (s?.user) loadProfile(s.user.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === "SIGNED_OUT") {
        currentUserIdRef.current = null
        setSession(null)
        setProfile(null)
        setShowNameModal(false)
        setReady(true)
        return
      }
      setSession(s)
      setReady(true)
      currentUserIdRef.current = s?.user?.id || null
      if (s?.user) loadProfile(s.user.id)
      else setProfile(null)
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

  // Escape closes the mobile drawer and returns focus to its toggle.
  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMobileOpen(false)
        mobileToggleRef.current?.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [mobileOpen])

  const closeMenu = useCallback(() => setOpenMenu(null), [])
  const toggleMenu = (key) => setOpenMenu((current) => (current === key ? null : key))
  const closeMobile = () => setMobileOpen(false)

  const handleSignOut = async () => {
    setOpenMenu(null)
    setMobileOpen(false)
    clearSubscriptionCache()
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  const user = session?.user
  let firstName = null
  if (profile?.full_name) firstName = profile.full_name.split(" ")[0]
  else if (user?.user_metadata?.full_name) firstName = user.user_metadata.full_name.split(" ")[0]

  const toolsLinks = NAV.businessTools
  // Identical props on server and client; reduced motion only zeroes the
  // duration, so the SSR style never gets stranded after hydration.
  const drawerMotion = {
    initial: false,
    animate: mobileOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 },
    transition: { duration: reduce ? 0 : 0.16 },
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md transition-shadow duration-300 ${
          scrolled || mobileOpen
            ? "shadow-[0_1px_3px_0_rgb(0_0_0/0.06)] border-b border-[#E2E8F0]"
            : "border-b border-transparent"
        }`}
      >
        <nav aria-label="Main" className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center shrink-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1D4ED8]">
            <Image src="/logo.svg" alt="Data Hygienics" width={919} height={220} loading="eager" unoptimized className="h-9 xl:h-10 w-auto" />
          </Link>

          {/* Desktop center nav */}
          <div className="hidden lg:flex items-center gap-0.5 xl:gap-1.5">
            {NAV.primary.map((link) => {
              const active = isActive(pathname, link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex items-center gap-2 text-sm font-medium px-2 xl:px-3 py-2 rounded-lg transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] ${
                    active ? "text-[#0F172A] bg-[#F1F5F9]" : "text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                  }`}
                >
                  <span aria-hidden="true" className={`hidden xl:inline-block w-1.5 h-1.5 rounded-full ${PRIMARY_DOTS[link.href] || "bg-[#94A3B8]"}`} />
                  {link.label}
                </Link>
              )
            })}

            <span aria-hidden="true" className="hidden xl:block mx-1.5 h-5 w-px bg-[#E2E8F0]" />

            <Dropdown
              id="nav-library"
              label="Library"
              open={openMenu === "library"}
              onToggle={() => toggleMenu("library")}
              onClose={closeMenu}
              panelClassName="w-80"
            >
              <DropdownLinks links={NAV.library} pathname={pathname} onNavigate={closeMenu} />
            </Dropdown>

            <Dropdown
              id="nav-tools"
              label="Business Tools"
              open={openMenu === "tools"}
              onToggle={() => toggleMenu("tools")}
              onClose={closeMenu}
              panelClassName="w-80"
            >
              <p className="px-4 pt-3 text-[11px] font-semibold tracking-[0.08em] uppercase text-[#1D4ED8]">
                For businesses
              </p>
              <DropdownLinks links={toolsLinks} pathname={pathname} onNavigate={closeMenu} />
              <div className="border-t border-[#F1F5F9] bg-[#F8FAFC]">
                <Link
                  href={ALL_TOOLS_LINK.href}
                  onClick={closeMenu}
                  className="flex items-center justify-between px-4 py-3 text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF] focus-visible:bg-[#F1F5F9] focus-visible:outline-none"
                >
                  {ALL_TOOLS_LINK.label}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </Dropdown>
          </div>

          {/* Desktop right: auth-aware */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {!ready ? (
              <div className="w-44 h-9" />
            ) : user ? (
              <Dropdown
                id="nav-user"
                label={`Hi, ${firstName || "there"}`}
                open={openMenu === "user"}
                onToggle={() => toggleMenu("user")}
                onClose={closeMenu}
                align="right"
                panelClassName="w-52"
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
            ) : (
              <>
                <Link href="/tools/cyber-audit/login"
                  className="text-[#475569] hover:text-[#0F172A] text-sm font-medium px-3 py-2 rounded-lg transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]">
                  Sign in
                </Link>
                <Link href={NAV.start.href}
                  className="inline-flex items-center bg-[#0F172A] text-white text-sm font-semibold px-4 xl:px-5 py-2.5 rounded-lg hover:bg-[#1E293B] transition-colors duration-150 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]">
                  {NAV.start.label}
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            ref={mobileToggleRef}
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden -mr-2 p-2 rounded-lg text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </nav>

        {/* Mobile drawer: mirrors the desktop structure */}
        <motion.div
          id="mobile-menu"
          hidden={!mobileOpen}
          {...drawerMotion}
          className="lg:hidden border-t border-[#F1F5F9] bg-white max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain"
        >
          <nav aria-label="Mobile" className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col">
            <ul className="list-none m-0 p-0">
              {NAV.primary.map((link) => {
                const active = isActive(pathname, link.href)
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={closeMobile}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-3 py-3 text-base font-semibold border-b border-[#F1F5F9] ${
                        active ? "text-[#0F172A]" : "text-[#334155] hover:text-[#0F172A]"
                      }`}
                    >
                      <span aria-hidden="true" className={`w-2 h-2 rounded-full ${PRIMARY_DOTS[link.href] || "bg-[#94A3B8]"}`} />
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>

            {[
              { key: "library", label: "Library", links: NAV.library },
              { key: "tools", label: "Business Tools", links: toolsLinks, extra: ALL_TOOLS_LINK },
            ].map((group) => {
              const open = mobileSection === group.key
              const panelId = `mobile-${group.key}`
              return (
                <div key={group.key} className="border-b border-[#F1F5F9]">
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setMobileSection(open ? null : group.key)}
                    className="w-full flex items-center justify-between py-3 text-base font-semibold text-[#334155] hover:text-[#0F172A] cursor-pointer"
                  >
                    {group.label}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                  <ul id={panelId} hidden={!open} className="list-none m-0 p-0 pb-3 pl-3 border-l-2 border-[#F1F5F9]">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={closeMobile}
                          aria-current={isActive(pathname, link.href) ? "page" : undefined}
                          className="block py-2 pl-2"
                        >
                          <span className="block text-sm font-medium text-[#0F172A]">{link.label}</span>
                          {link.description ? (
                            <span className="block text-xs text-[#64748B] mt-0.5">{link.description}</span>
                          ) : null}
                        </Link>
                      </li>
                    ))}
                    {group.extra ? (
                      <li>
                        <Link
                          href={group.extra.href}
                          onClick={closeMobile}
                          className="inline-flex items-center gap-1 py-2 pl-2 text-sm font-semibold text-[#1D4ED8]"
                        >
                          {group.extra.label}
                          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </Link>
                      </li>
                    ) : null}
                  </ul>
                </div>
              )
            })}

            {user ? (
              <div className="mt-4">
                <p className="text-[#0F172A] text-sm font-medium mb-2">Hi, {firstName || "there"}</p>
                <Link href="/tools/cyber-audit/dashboard" onClick={closeMobile} className="block text-[#475569] text-sm py-1.5">Dashboard</Link>
                <Link href="/tools/cyber-audit/results" onClick={closeMobile} className="block text-[#475569] text-sm py-1.5">My Assessments</Link>
                <Link href="/tools/policies" onClick={closeMobile} className="block text-[#475569] text-sm py-1.5">My Policies</Link>
                <button type="button" onClick={handleSignOut} className="text-[#DC2626] text-sm py-1.5 cursor-pointer">Sign out</button>
              </div>
            ) : (
              <div className="flex gap-3 mt-5">
                <Link href="/tools/cyber-audit/login" onClick={closeMobile}
                  className="flex-1 text-center border border-[#E2E8F0] text-[#475569] text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[#F8FAFC] transition-colors">
                  Sign in
                </Link>
                <Link href={NAV.start.href} onClick={closeMobile}
                  className="flex-1 text-center bg-[#0F172A] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[#1E293B] transition-colors">
                  {NAV.start.label}
                </Link>
              </div>
            )}
          </nav>
        </motion.div>
      </header>

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
