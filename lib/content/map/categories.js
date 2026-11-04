// Home map categories: the kinds of devices and accounts a household lists,
// and the few plain questions asked about each. Pure data, import-free;
// logic lives in lib/map.js.
//
// Category: { id, audience, kind: "device" | "account", label, group, hint,
//   questions: [{ id, text, options: [{ value, label }] }] }
// - At most three questions per category. Question ids are shared across
//   categories (autoUpdates, others, ...) so rules can ask "any device whose
//   updates are off".
// - Category ids, question ids and option values are stored keys in saved
//   maps and files people keep: never rename one. Add, don't rename.
// - Copy rules (CLAUDE.md): plain English, second person, no statistics, no
//   fear words, labels never end with a period.

// Shared questions. Each category takes a copy so a later edit to one
// category's wording never changes another's by accident.
const AUTO_UPDATES = {
  id: "autoUpdates",
  text: "Does it update itself?",
  options: [
    { value: "on", label: "Yes, updates are automatic" },
    { value: "off", label: "No, or I update it by hand" },
    { value: "unsure", label: "I'm not sure" },
  ],
}

const DEVICE_OTHERS = {
  id: "others",
  text: "Who can sign in to it or its app?",
  options: [
    { value: "household", label: "Only people in our household" },
    { value: "unknown", label: "I'm not sure" },
  ],
}

const GUEST_NETWORK = {
  id: "guestNetwork",
  text: "Do smart gadgets use a separate guest network?",
  options: [
    { value: "yes", label: "Yes, they have their own network" },
    { value: "no", label: "No, everything shares one network" },
    { value: "unsure", label: "I'm not sure" },
  ],
}

const SCREEN_LOCK = {
  id: "screenLock",
  text: "Does it need a code, fingerprint or face to open?",
  options: [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No, it opens straight away" },
  ],
}

const BACKUP = {
  id: "backup",
  text: "Does it back itself up?",
  options: [
    { value: "yes", label: "Yes, automatically" },
    { value: "no", label: "No" },
    { value: "unsure", label: "I'm not sure" },
  ],
}

const TWO_STEP = {
  id: "twoStep",
  text: "What does it take to sign in besides the password?",
  options: [
    { value: "passkey", label: "A passkey or security key" },
    { value: "app", label: "A code from an app or a prompt on my phone" },
    { value: "sms", label: "A code by text message" },
    { value: "no", label: "Nothing, just the password" },
    { value: "unsure", label: "I'm not sure" },
  ],
}

const RECOVERY = {
  id: "recovery",
  text: "Are the recovery phone and email up to date?",
  options: [
    { value: "yes", label: "Yes, I checked them" },
    { value: "no", label: "No, or they're old" },
    { value: "unsure", label: "I'm not sure" },
  ],
}

const ACCOUNT_OTHERS = {
  id: "others",
  text: "Who else can sign in to it?",
  options: [
    { value: "me", label: "Just me" },
    { value: "household", label: "People in our household" },
    { value: "unknown", label: "I'm not sure" },
  ],
}

const SECOND_COPY = {
  id: "secondCopy",
  text: "Is there a second copy of the photos somewhere else?",
  options: [
    { value: "yes", label: "Yes, a drive or another service" },
    { value: "no", label: "No, this is the only copy" },
    { value: "unsure", label: "I'm not sure" },
  ],
}

const copy = (q) => ({ ...q, options: q.options.map((o) => ({ ...o })) })
const DEVICE_QUESTIONS = () => [copy(AUTO_UPDATES), copy(DEVICE_OTHERS)]
const NETWORK_QUESTIONS = () => [copy(AUTO_UPDATES), copy(GUEST_NETWORK), copy(DEVICE_OTHERS)]
// Phones and computers drop "others" to stay at three questions.
const PERSONAL_QUESTIONS = () => [copy(AUTO_UPDATES), copy(SCREEN_LOCK), copy(BACKUP)]
const ACCOUNT_QUESTIONS = () => [copy(TWO_STEP), copy(RECOVERY), copy(ACCOUNT_OTHERS)]

const device = (id, group, label, hint, questions = DEVICE_QUESTIONS()) => ({
  id,
  audience: ["home"],
  kind: "device",
  label,
  group,
  hint,
  questions,
})

const account = (id, label, hint, questions = ACCOUNT_QUESTIONS()) => ({
  id,
  audience: ["home"],
  kind: "account",
  label,
  group: "account",
  hint,
  questions,
})

export const CATEGORIES = [
  // Network
  device("router", "network", "Router", "The box your internet plugs into, or the main Wi-Fi unit", NETWORK_QUESTIONS()),
  device("mesh", "network", "Mesh Wi-Fi system", "Several matching units that spread Wi-Fi around the house", NETWORK_QUESTIONS()),
  device("isp-gateway", "network", "Internet provider's box", "The modem and Wi-Fi box your internet company gave you", NETWORK_QUESTIONS()),
  // Storage
  device("nas", "storage", "Network storage drive", "A drive on your network that keeps files or backups"),
  // Cameras
  device("camera-indoor", "camera", "Indoor camera", "A camera that looks into a room"),
  device("camera-outdoor", "camera", "Outdoor camera", "A camera on the porch, yard or driveway"),
  device("doorbell", "camera", "Video doorbell", "A doorbell with a camera"),
  device("baby-monitor", "camera", "Baby monitor", "A camera or audio monitor in a child's room"),
  // Locks
  device("smart-lock", "lock", "Smart lock", "A door lock you can open from an app or keypad"),
  device("garage", "lock", "Garage door opener", "A garage door you can open from an app"),
  // Climate
  device("thermostat", "climate", "Thermostat", "Heating and cooling you control from an app"),
  // TV
  device("tv", "tv", "Smart TV", "A TV with apps built in"),
  device("streamer", "tv", "Streaming stick or box", "A Roku, Fire TV, Apple TV, Chromecast or similar"),
  device("tv-box", "tv", "Other TV box", "A TV box from a marketplace, often with no well-known brand"),
  // Computers and phones
  device("computer", "computer", "Computer", "A laptop or desktop", PERSONAL_QUESTIONS()),
  device("phone", "phone", "Phone", "A smartphone", PERSONAL_QUESTIONS()),
  device("tablet", "phone", "Tablet", "An iPad or other tablet", PERSONAL_QUESTIONS()),
  // Small gadgets
  device("plug-bulb", "plug-bulb", "Smart plug or bulb", "Plugs, bulbs and switches you control from an app"),
  device("smart-safe", "safe", "Smart safe", "A safe that opens with an app, code or fingerprint"),
  device("printer", "printer", "Printer", "A printer on your Wi-Fi"),
  device("speaker", "speaker", "Smart speaker or display", "A speaker or screen you talk to"),

  // Accounts: the hubs that control the devices
  account("email-root", "The email account everything else recovers through", "The address password resets go to"),
  account("google", "Google account", "Gmail, Android, Nest, YouTube and Google Photos sign in here"),
  account("apple", "Apple Account", "iPhone, iPad, Mac, iCloud and HomeKit sign in here"),
  account("amazon", "Amazon account", "Shopping, Alexa, Ring, Blink and eero sign in here"),
  account("microsoft", "Microsoft account", "Windows, Outlook, Xbox and OneDrive sign in here"),
  account("camera-brand", "Camera maker's account", "The app account for Ring, Arlo, Wyze, Eufy and so on"),
  account("photo-cloud", "Photo storage account", "Where your photos are kept online", [copy(TWO_STEP), copy(SECOND_COPY), copy(ACCOUNT_OTHERS)]),
  account("password-manager", "Password manager", "The app that keeps your passwords"),
  account("backup-service", "Backup service", "An online service that backs up your computer or phone"),
  account("other-account", "Other account", "Any other account that controls a device at home"),
]

// Display grouping. Accounts come first because they are the hubs every
// device hangs off; devices follow in the order of DEVICE_RANK.
export const CATEGORY_GROUPS = [
  { id: "account", label: "Accounts", order: 0 },
  { id: "network", label: "Wi-Fi and internet", order: 1 },
  { id: "storage", label: "Storage", order: 2 },
  { id: "camera", label: "Cameras and monitors", order: 3 },
  { id: "lock", label: "Locks and doors", order: 4 },
  { id: "computer", label: "Computers", order: 5 },
  { id: "phone", label: "Phones and tablets", order: 6 },
  { id: "safe", label: "Safes", order: 7 },
  { id: "climate", label: "Heating and cooling", order: 8 },
  { id: "tv", label: "TV", order: 9 },
  { id: "speaker", label: "Speakers and displays", order: 10 },
  { id: "printer", label: "Printers", order: 11 },
  { id: "plug-bulb", label: "Plugs and bulbs", order: 12 },
]

// Device groups in the order they are drawn and sorted. A smart plug or bulb
// is listed last on purpose and is never ranked beside a router: the router
// guards everything on the network, a bulb guards a lamp.
export const DEVICE_RANK = ["network", "storage", "camera", "lock", "computer", "phone", "safe", "climate", "tv", "speaker", "printer", "plug-bulb"]
