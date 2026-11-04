// Home map finding rules. Pure data, import-free; lib/map.js `assess` reads
// them. Each rule turns what the member told us (and what the catalog says
// about a model) into one finding that points at a public Path step.
//
// Rule: { id, audience, scope: "item" | "map", when, outcome, severity,
//   title, body, stepId, stepIdByCategory?, exclusive? }
// - id: stored in saved maps (the `handled` keys are `${ruleId}:${itemId}`).
//   Never rename one.
// - outcome: a Path outcome key (lib/path.js OUTCOMES). severity: "weak" |
//   "watch" | "ok". There is no score: findings are only ever counted.
// - stepId: a Home step id (lib/content/path/home.js). stepIdByCategory
//   overrides it for one category.
// - title and body carry no numbers or statistics (rules have no sources) and
//   never claim to know the member's actual device: only what they told us
//   and what the catalog says about the model.
//
// `when` for scope "item" is an object (every field must match) or an array
// of objects (any one must match). Fields:
//   kind: "device" | "account"
//   category: [category ids]          group: [group ids]
//   catalog: { supportStatus: [..], ispManaged: bool, exploited: bool, matched: bool }
//     An item with no catalog match is read as { matched: false,
//     supportStatus: "unknown", ispManaged: false, exploited: false }.
//   answer: { [questionId]: [values] }
//   controlledBy: "none"              no controlling account chosen
//   brand: "generic"                  brand missing or a no-name label
// `when` for scope "map":
//   minDevicesInGroups: { groups: [..], min: n }
//   routerAnswer: { [questionId]: [values] }   any network item's answer
//   minAccounts: n
//   exportedAt: "null"                never saved as a file or printed
//
// Precedence for the router's status (exclusive: "router-status"): rules in
// one exclusive group are tried in the order listed and only the first match
// fires for an item. The order is: ended, then exploited, then provider
// managed, then supported with updates on, then unknown. So a router whose
// support has ended shows only "ended", never also "exploited".

export const RULES = [
  // ── Router status (first match wins) ────────────────────────────────
  {
    id: "router-ended",
    audience: ["home"],
    scope: "item",
    exclusive: "router-status",
    when: { group: ["network"], catalog: { supportStatus: ["ended"] } },
    outcome: "break-in",
    severity: "weak",
    title: "This router no longer gets security fixes",
    body: "The maker says support for this model has ended, so new flaws in it stay open for good. Replacing it is the one fix that lasts.",
    stepId: "dev-retire-unsupported",
  },
  {
    id: "router-exploited",
    audience: ["home"],
    scope: "item",
    exclusive: "router-status",
    when: { group: ["network"], catalog: { exploited: true } },
    outcome: "break-in",
    severity: "weak",
    title: "Attackers have used a flaw in this model",
    body: "A flaw in this model is on the government's list of flaws used in real attacks. Install the latest update and turn off remote management, so your router has the fix.",
    stepId: "home-router",
  },
  {
    id: "router-isp",
    audience: ["home"],
    scope: "item",
    exclusive: "router-status",
    when: { group: ["network"], catalog: { ispManaged: true } },
    outcome: "break-in",
    severity: "ok",
    title: "Your provider patches this",
    body: "Your internet company sends updates to this box for you. The step covers the settings that are still yours: the admin password, the Wi-Fi password and remote access.",
    stepId: "home-router",
  },
  {
    id: "router-fine",
    audience: ["home"],
    scope: "item",
    exclusive: "router-status",
    when: { group: ["network"], catalog: { supportStatus: ["supported"] }, answer: { autoUpdates: ["on"] } },
    outcome: "break-in",
    severity: "ok",
    title: "Supported and updating itself",
    body: "The maker still sends security fixes for this model and you said it installs them on its own. The step covers the few settings worth a once-a-year look.",
    stepId: "home-router",
  },
  {
    id: "router-unknown",
    audience: ["home"],
    scope: "item",
    exclusive: "router-status",
    when: { group: ["network"], catalog: { supportStatus: ["unknown"], ispManaged: false } },
    outcome: "break-in",
    severity: "watch",
    title: "We don't know yet if this router still gets fixes",
    body: "We couldn't find this model's support status. The step shows where the maker lists it and what to change while you check.",
    stepId: "home-router",
  },

  // ── Any device ──────────────────────────────────────────────────────
  {
    id: "updates-off",
    audience: ["home"],
    scope: "item",
    when: { kind: "device", catalog: { ispManaged: false }, answer: { autoUpdates: ["off", "unsure"] } },
    outcome: "break-in",
    severity: "watch",
    title: "Updates aren't automatic yet",
    body: "Security fixes only help once they're installed. Turning on automatic updates means you never have to remember.",
    stepId: "f-updates",
  },

  // ── Cameras ─────────────────────────────────────────────────────────
  {
    id: "camera-account",
    audience: ["home"],
    scope: "item",
    when: [
      { group: ["camera"], controlledBy: "none" },
      { group: ["camera"], answer: { others: ["unknown"] } },
    ],
    outcome: "break-in",
    severity: "weak",
    title: "Lock the account that runs this camera",
    body: "Whoever signs in to the camera's app sees what it sees. A strong sign-in on that account, and a check of who else has access, keeps it yours.",
    stepId: "home-camera-accounts",
  },
  {
    id: "camera-indoors",
    audience: ["home"],
    scope: "item",
    when: { category: ["camera-indoor", "baby-monitor"] },
    outcome: "control",
    severity: "watch",
    title: "Decide what this indoor camera records",
    body: "A camera inside the home sees private moments. Choose when it records, where the video goes and how long it is kept.",
    stepId: "home-camera-privacy",
  },

  // ── Whole home ──────────────────────────────────────────────────────
  {
    id: "iot-network",
    audience: ["home"],
    scope: "map",
    when: { minDevicesInGroups: { groups: ["tv", "plug-bulb", "camera"], min: 3 }, routerAnswer: { guestNetwork: ["no", "unsure"] } },
    outcome: "break-in",
    severity: "watch",
    title: "Smart gadgets share a network with your laptop",
    body: "TVs, plugs and cameras rarely get the care a laptop does. A separate network for them keeps a weak gadget away from the devices you bank on.",
    stepId: "home-iot-network",
  },
  {
    id: "tv-box-generic",
    audience: ["home"],
    scope: "item",
    when: { category: ["tv-box"], brand: "generic" },
    outcome: "break-in",
    severity: "weak",
    title: "A no-name TV box is hard to trust",
    body: "Boxes with no well-known maker often get no security fixes and can come with unwanted software. A streamer from a maker that publishes updates is the safer swap.",
    stepId: "home-buy-supported",
  },

  // ── Accounts ────────────────────────────────────────────────────────
  {
    id: "account-password-only",
    audience: ["home"],
    scope: "item",
    when: { kind: "account", answer: { twoStep: ["no", "unsure"] } },
    outcome: "break-in",
    severity: "weak",
    title: "A password alone opens this account",
    body: "Anyone with the password gets in. Adding a passkey or a code from an app means a stolen password stops being enough.",
    stepId: "sign-in-cleanup",
    // The email account everything recovers through gets its own step.
    stepIdByCategory: { "email-root": "f-email-key" },
  },
  {
    id: "account-no-recovery",
    audience: ["home"],
    scope: "item",
    when: { kind: "account", answer: { recovery: ["no", "unsure"] } },
    outcome: "recover",
    severity: "weak",
    title: "Getting back in could be hard",
    body: "If you're locked out, the recovery phone and email are how you get back. Checking them now, and writing them down on paper, makes a bad day short.",
    stepId: "legacy-paper-kit",
  },
  {
    id: "account-shared-unknown",
    audience: ["home"],
    scope: "item",
    when: { kind: "account", answer: { others: ["unknown"] } },
    outcome: "control",
    severity: "watch",
    title: "Check who else can sign in",
    body: "Old devices and shared logins can stay signed in for years. The step shows where to see every signed-in device and remove the ones you don't know.",
    stepId: "sign-in-cleanup",
  },
  {
    id: "photos-one-copy",
    audience: ["home"],
    scope: "item",
    when: { category: ["photo-cloud"], answer: { secondCopy: ["no"] } },
    outcome: "recover",
    severity: "weak",
    title: "Your photos live in one place",
    body: "If this account is lost or locked, the photos go with it. A second copy somewhere else keeps them safe.",
    stepId: "memories-second-copy",
  },
  {
    id: "photos-unsure",
    audience: ["home"],
    scope: "item",
    when: { category: ["photo-cloud"], answer: { secondCopy: ["unsure"] } },
    outcome: "recover",
    severity: "watch",
    title: "Find out where your photos are kept",
    body: "Photos often end up spread across phones and accounts. Knowing where they all are is the first step to keeping a second copy.",
    stepId: "memories-find",
  },

  // ── Phones and computers ────────────────────────────────────────────
  {
    id: "phone-lock",
    audience: ["home"],
    scope: "item",
    when: { group: ["phone", "computer"], answer: { screenLock: ["no"] } },
    outcome: "break-in",
    severity: "weak",
    title: "Anyone holding it can open it",
    body: "A phone or laptop with no lock opens your email, photos and money apps to whoever picks it up. A code, fingerprint or face fixes that.",
    stepId: "dev-screen-lock",
  },
  {
    id: "phone-backup",
    audience: ["home"],
    scope: "item",
    when: { group: ["phone"], answer: { backup: ["no", "unsure"] } },
    outcome: "recover",
    severity: "weak",
    title: "A lost phone would take its contents with it",
    body: "Without a backup, photos, messages and contacts on this phone exist only on the phone. Turning on automatic backup means a new phone picks up where the old one left off.",
    stepId: "f-phone-backup",
  },

  // ── The map itself ──────────────────────────────────────────────────
  {
    id: "inventory-unsaved",
    audience: ["home"],
    scope: "map",
    when: { minAccounts: 1, exportedAt: "null" },
    outcome: "recover",
    severity: "watch",
    title: "This map lives only in this browser",
    body: "If this device is lost or the browser is cleared, the map goes too. Save a copy as a file or print it, and keep it with your other papers.",
    stepId: "legacy-inventory",
  },
]
