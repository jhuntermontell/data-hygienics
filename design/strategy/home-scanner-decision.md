# Decision: how the home map learns what is in the house

Written 2026-10-29. Owner asked that the "simple scanner app or one line in the
terminal" option be exhausted before the home map (the Watch's device half in
`five-year-value-roadmap.md`) settles on an interview. This is that exhaustion.

Goal, in the owner's words: make the member's life easier and simpler, not
introduce anxiety. Every option below is judged on three things: what it can
actually see, what it asks the member to do, and whether it breaks a rule we
already keep (no household data on our side; no detection or assurance claims;
never teach a behavior scammers use).

## What a scan can and cannot see, whatever runs it

A probe on the home Wi-Fi can learn: which addresses answer, their hardware
address and so the maker (not on iPhone, see below), Bonjour and UPnP names,
open ports, and, for many routers, the model and sometimes the firmware version
from the router's own UPnP description or admin page.

It cannot learn: the firmware or update state of cloud-managed devices (Nest
cameras and thermostats, Ring, most smart plugs: the maker patches them and the
device tells the network nothing), anything about devices on Bluetooth, Thread
or Z-Wave (most locks, the smart safe), and nothing at all about the account
that controls each device: recovery, passkeys, who else has access, whether a
second copy of the photos exists. The account is where household risk sits, so
the best scan still leaves the questions that matter.

Where a scan genuinely helps: the router (model and support status, the single
biggest household risk per the roadmap), network storage drives, cameras that
speak UPnP, and simply listing what is on the network so the member does not
have to type it.

## Options, exhausted

### 1. "Paste this line into Terminal or PowerShell." No.

This is ClickFix, the fastest-growing infection method of 2025 and 2026. The
Swiss NCSC reports a rise in cases where a site puts a command on the clipboard
and tells the visitor to paste it; Apple added a "Don't Paste / Paste Anyway"
warning to Terminal in macOS 26.4 (March 2026) specifically to interrupt it;
secondhand figures from Microsoft's 2026 Digital Defense Report put devices that
ran such commands above a million in a single quarter. A security brand asking
members to paste a command from a web page trains the exact reflex the attack
depends on, and our own Threat Check would have to say "never do this." It also
fails the simplicity test: most members do not know what Terminal is, and
Windows and macOS need different scripts. Ruled out regardless of how safe our
script is.

### 2. A downloadable app for Mac and Windows. Not in year one.

Feasible to build. Not feasible to keep. It needs a $99 Apple developer account
and notarization, Windows signing (about $10 a month through Microsoft's signing
service, or $150 to $400 a year for a certificate) and even signed apps show
"Windows protected your PC" until they earn reputation, which for a small
publisher takes months. Two builds to maintain, a device-recognition database
to grow (Fing has spent over a decade on that alone), and the support load of
"it didn't see my camera" and "macOS asked me something scary." macOS 15 and
later also gate local-network access per app with a prompt. And at the end of
it the app still cannot see the accounts (above). Revisit in 2028 only if
members ask for it by name.

### 3. A phone app. Worse than the desktop app.

iPhone apps have not been able to read hardware addresses since iOS 11, so
there is no maker lookup; Fing's own help says it indexes by IP on iOS for that
reason. App Store review, two platforms, same support load. Ruled out.

### 4. A security box in the house. Graveyard.

Norton Core (retired 2022), F-Secure Sense (support ended December 2023),
Bitdefender Box (v1 end of life July 2021, no v3 planned). Vendors with
hundreds of engineers left the category. Ruled out.

### 5. The browser asks permission to look at the local network. Research only.

Chrome now has a Local Network Access permission (rolling out since Chrome 142,
default enforcement reportedly landing October 2026). With it, a page can send
requests to private addresses, but responses from routers and devices stay
opaque unless the device opts in with CORS headers, which consumer devices do
not. That leaves liveness probing and fingerprinting by guessing known image
paths: fragile, Chrome-only, and the prompt ("this site wants to find devices on
your network") is exactly the kind of thing we tell people to decline. Keep as
a one-day research spike later; do not build on it.

### 6. Scan without a scanner. Yes.

Three intakes that cost the member nothing to install and that we process
without keeping:

- **Photograph the label.** The router's sticker carries the model and often
  the hardware version. A photo, read by the model, gives the catalog match
  (support status, known exploited flaws, "your provider patches this"). Works
  for the NAS, cameras and anything with a sticker. No install, no permission
  beyond the camera, and nothing the member has to know.
- **Screenshot the Wi-Fi app's device list.** eero, Google Home, Xfinity,
  Nighthawk, Deco and most ISP apps already list every connected device with a
  name and often a maker. The member screenshots it; we read it into the map.
  Many routers also export the list as a file. This is the inventory a scanner
  would produce, from the device that already did the scanning.
- **Import a Fing export** for members who already use it. Optional, no
  endorsement, no referral.

The image and text are sent with the request, read, and discarded. The
resulting map lives in the member's browser, as a saved file and on paper,
under the custody rule. Nothing about the house is stored on our side.

## What the interview becomes

With the three intakes, the interview is not a quiz about devices. It is the
part no scan can do, asked one room at a time, with the map already drawn:
which account controls this, is that account on a passkey or two-step, who else
can get in, where is the second copy. Five to ten minutes. The anxiety in an
interview comes from blank forms and jargon; a pre-drawn map with three plain
questions per item is the opposite.

## Decision

Build the home map with the label photo, the device-list screenshot and the
Fing import as its intake, and the account walk-through as its interview. No
terminal commands, ever. No installable app or phone app in year one. Browser
local-network access is a later research spike, not a plan.
