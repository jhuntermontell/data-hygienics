// DKIM selectors we try when the person doesn't type one. A selector is the
// name a sending service publishes its key under, at
// <selector>._domainkey.<domain>. Nothing in DNS lists a domain's selectors,
// so a check can only try names that services are known to use. Services that
// generate a random selector per customer (Amazon SES, for one) can't be found
// this way, which is why the page asks for the selector and never reports DKIM
// as missing.
//
// These are the defaults each service uses for most customers. A domain can
// pick other names, and services change their defaults: keep this list short
// and update it when a service's setup guide changes.
export const COMMON_SELECTORS = [
  { selector: "google", service: "Google Workspace" },
  { selector: "selector1", service: "Microsoft 365" },
  { selector: "selector2", service: "Microsoft 365" },
  { selector: "k1", service: "Mailchimp" },
  { selector: "k2", service: "Mailchimp" },
  { selector: "s1", service: "SendGrid" },
  { selector: "s2", service: "SendGrid" },
  { selector: "fm1", service: "Fastmail" },
  { selector: "protonmail", service: "Proton Mail" },
  { selector: "mailjet", service: "Mailjet" },
  { selector: "default", service: null },
  { selector: "dkim", service: null },
  { selector: "mail", service: null },
]

export function serviceForSelector(selector) {
  return COMMON_SELECTORS.find((entry) => entry.selector === selector)?.service || null
}
