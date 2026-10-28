// Phase 0 mockups only: the proposed header, menu overlay and search sheet.
// The index below uses real published titles; production builds it from
// lib/ at build time and searches it in the browser. Queries never leave the page.
(function () {
  const ICON = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 7h18M3 12h18M3 17h18"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19"/></svg>',
  }
  const INDEX = [
    ["Verdict", "A text says I owe a toll", "Real toll agencies don't text for payment.", "2026-10"],
    ["Verdict", "A call sounded like my child or grandchild and asked for money", "Treat it as a scam until you reach them yourself.", "2026-10"],
    ["Verdict", "A call or text says it's my bank's fraud department", "Hang up and call the number on your card.", "2026-10"],
    ["Verdict", "A text says my package couldn't be delivered", "Check the order where you placed it, not in the text.", "2026-10"],
    ["Verdict", "I clicked a link and I'm not sure what happens now", "The next two minutes, in order.", "2026-10"],
    ["Verdict", "A vendor emailed us new bank details", "Confirm on a number you already have before you pay.", "2026-10"],
    ["Step", "Agree on a family safe word and the callback rule", "Home Path, foundation", "2026-10"],
    ["Step", "Lock the email account that resets everything", "Home Path, foundation", "2026-10"],
    ["Step", "Hang up on 'your bank' and call the number on your card", "Home Path, money", "2026-10"],
    ["Step", "Freeze your credit at all three bureaus", "Home Path, foundation", "2026-10"],
    ["Step", "Lock your phone number to your phone", "Home Path, sign-in", "2026-10"],
    ["Step", "Set a budget and an approval step before AI pays for you", "Home Path, money", "2026-10"],
    ["Guide", "The family safe word and callback rule", "Set it up in one conversation.", "2026-10"],
    ["Guide", "Help an older relative stay ahead of AI phone scams", "For the people you look out for.", "2026-10"],
    ["Guide", "Two-channel verification for payments", "For any business that pays invoices.", "2026-10"],
    ["Guide", "Lock down your AI assistants", "Settings, memory and connected apps.", "2026-10"],
    ["Guide", "A one-page AI use rule for your team", "One page your team can follow.", "2026-10"],
    ["Threat", "Voice cloning and deepfake scams", "How it works and what stops it.", "2026-10"],
    ["Threat", "AI-powered phishing and business email compromise", "What's reaching small businesses now.", "2026-10"],
    ["Threat", "Prompt injection and AI agent hijacking", "When an AI assistant takes orders from a stranger.", "2026-10"],
    ["Threat", "AI chatbot data leaks and shadow AI", "What gets pasted, and where it goes.", "2026-10"],
  ]
  const SUGGEST = ["A text about an unpaid toll", "A call that sounded like family", "My bank's fraud department called", "Safe word"]

  function header(surface) {
    const logo = surface === "night" ? "../assets/logo-horizontal-white.svg" : "../assets/logo-horizontal-color.svg"
    return `<div class="wrap row">
      <a class="brand" href="home.html"><img src="${logo}" alt="Data Hygienics" width="142" height="34"></a>
      <nav class="primary" aria-label="Main"><a href="#">For Home</a><a href="#">For Business</a><a href="#" data-open="menu">Library</a></nav>
      <div class="actions">
        <a class="door" href="verdict.html"><span class="dot" aria-hidden="true"></span>Threat Check</a>
        <div class="sq-pair">
          <button class="sq" type="button" data-open="search" aria-label="Search">${ICON.search}</button>
          <button class="sq" type="button" data-open="menu" aria-label="Menu" aria-expanded="false">${ICON.menu}</button>
        </div>
      </div>
    </div>`
  }

  const overlayHeader = (which) => `<div class="hdr night" style="position:static"><div class="wrap row">
      <a class="brand" href="home.html"><img src="../assets/logo-horizontal-white.svg" alt="Data Hygienics" width="142" height="34"></a>
      <div class="actions"><a class="door" href="verdict.html"><span class="dot" aria-hidden="true"></span>Threat Check</a>
        <div class="sq-pair"><button class="sq" type="button" data-close aria-label="Close ${which}">${ICON.close}</button></div></div>
    </div></div>`

  const menu = `<div class="overlay" id="menu" role="dialog" aria-modal="true" aria-label="Menu">${overlayHeader("menu")}
    <div class="wrap">
      <div class="menu-grid">
        <div class="menu-col"><hr class="fold"><span class="label">Start</span>
          <ul class="big-links"><li><a href="#">For Home</a></li><li><a href="#">For Business</a></li><li><a href="#">Digital Sovereignty</a></li><li><a href="home.html#start">Map your path</a></li></ul></div>
        <div class="menu-col"><hr class="fold"><span class="label">Library</span>
          <ul class="named">
            <li><a href="#"><span class="n">Threat Library</span><br><span class="i">What's reaching homes and businesses now</span></a></li>
            <li><a href="#"><span class="n">Guides</span><br><span class="i">Setups, step by step, in plain English</span></a></li>
            <li><a href="#"><span class="n">Toolkit</span><br><span class="i">Tools we'd use ourselves. No referral fees</span></a></li>
            <li><a href="#"><span class="n">Glossary</span><br><span class="i">AI and security terms, decoded</span></a></li>
            <li><a href="#"><span class="n">Controls Library</span><br><span class="i">The safeguards behind the advice</span></a></li>
          </ul></div>
        <div class="menu-col"><hr class="fold"><span class="label">Tools</span>
          <ul class="named">
            <li><a href="verdict.html"><span class="n">Threat Check</span><br><span class="i">Check it before you act</span></a></li>
            <li><a href="#"><span class="n">Cyber Audit</span><br><span class="i">Find the gaps. Close them</span></a></li>
            <li><a href="#"><span class="n">Policy Library</span><br><span class="i">Your rules, in writing</span></a></li>
            <li><a href="#"><span class="n">Incident Response Planner</span><br><span class="i">A plan you've practiced</span></a></li>
            <li><a href="#"><span class="n">Ask</span><br><span class="i">Get the answer, with the source</span></a></li>
            <li><a href="pricing.html"><span class="n">Pricing</span><br><span class="i">What's free, and what members get</span></a></li>
          </ul></div>
      </div>
      <div class="live">
        <div><hr class="fold"><span class="label" style="color:var(--night-readout);display:block;margin-top:14px">New · Verdict · Oct 2026</span><a href="verdict.html">A call sounded like my child or grandchild and asked for money</a></div>
        <div><hr class="fold"><span class="label" style="color:var(--night-readout);display:block;margin-top:14px">New · Verdict · Oct 2026</span><a href="#">A vendor emailed us new bank details</a></div>
        <div><hr class="fold"><span class="label" style="color:var(--night-readout);display:block;margin-top:14px">The library</span><a href="#">6 verdicts · 7 guides · 7 threats · every number sourced</a></div>
      </div>
      <div class="menu-foot"><a href="pricing.html">Members</a><a href="#">Sign in</a><a href="#">How we work</a></div>
    </div></div>`

  const search = `<div class="overlay" id="search" role="dialog" aria-modal="true" aria-label="Search">${overlayHeader("search")}
    <div class="wrap">
      <div class="search-field"><label for="q" class="label" style="position:absolute;left:-9999px">Search the library</label>
        <input id="q" type="search" placeholder="What happened, or what do you want to set up?" autocomplete="off"><button type="button" id="clear">Clear</button></div>
      <div class="suggest"><span class="label">Try</span>${SUGGEST.map((s) => `<button type="button" data-q="${s}">${s}</button>`).join("")}</div>
      <p class="readout" style="margin:14px 0 0">Searched on your device. Nothing sent.</p>
      <div class="results" id="results" aria-live="polite"></div>
    </div></div>`

  function render(q) {
    const out = document.getElementById("results")
    const words = q.toLowerCase().split(/\s+/).filter((w) => w.length > 2)
    if (!words.length) { out.innerHTML = ""; return }
    const hits = INDEX.map((e) => [e, words.filter((w) => (e[1] + " " + e[2]).toLowerCase().includes(w)).length]).filter((x) => x[1] > 0).sort((a, b) => b[1] - a[1])
    if (!hits.length) {
      out.innerHTML = `<p class="empty">Nothing by that name yet</p><p class="lede" style="color:var(--night-ink-2)">If something just happened, start with the Threat Check.</p>` +
        group("Closest verdicts", INDEX.filter((e) => e[0] === "Verdict").slice(0, 3))
      return
    }
    const kinds = ["Verdict", "Step", "Guide", "Threat"]
    out.innerHTML = kinds.map((k) => { const g = hits.filter((h) => h[0][0] === k).map((h) => h[0]); return g.length ? group(k === "Step" ? "Path steps" : k + "s", g) : "" }).join("")
  }
  const group = (title, list) => `<div class="group"><hr class="fold"><p class="label" style="margin:14px 0 4px">${title}</p>` +
    list.map((e) => `<a class="hit" href="${e[0] === "Verdict" ? "verdict.html" : "#"}"><span class="t">${e[1]}</span><span class="r readout">Reviewed ${e[3] === "2026-10" ? "Oct 2026" : e[3]}</span><span class="d">${e[2]}</span></a>`).join("") + `</div>`

  document.addEventListener("DOMContentLoaded", () => {
    const hdr = document.querySelector(".hdr")
    if (hdr) hdr.innerHTML = header(hdr.classList.contains("night") ? "night" : "day")
    document.body.insertAdjacentHTML("beforeend", menu + search)
    let opener = null
    const open = (id) => { opener = document.activeElement; const el = document.getElementById(id); el.classList.add("open"); document.body.style.overflow = "hidden"; (el.querySelector("input") || el.querySelector("[data-close]")).focus() }
    const close = () => { document.querySelectorAll(".overlay.open").forEach((o) => o.classList.remove("open")); document.body.style.overflow = ""; opener && opener.focus() }
    document.addEventListener("click", (ev) => {
      const o = ev.target.closest("[data-open]"); if (o) { ev.preventDefault(); open(o.dataset.open) }
      if (ev.target.closest("[data-close]")) close()
      const s = ev.target.closest("[data-q]"); if (s) { const i = document.getElementById("q"); i.value = s.dataset.q; render(i.value); i.focus() }
    })
    document.addEventListener("keydown", (ev) => { if (ev.key === "Escape") close() })
    document.getElementById("q").addEventListener("input", (e) => render(e.target.value))
    document.getElementById("clear").addEventListener("click", () => { const i = document.getElementById("q"); i.value = ""; render(""); i.focus() })
    const p = new URLSearchParams(location.search).get("open"); if (p) { open(p); const q = new URLSearchParams(location.search).get("q"); if (q) { document.getElementById("q").value = q; render(q) } }
  })
})()
