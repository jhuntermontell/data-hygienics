# Auth email templates

The sign-in, sign-up and password emails Supabase sends, in the Data Hygienics voice and look (design/brand-book/personality.md). Supabase hosts these in the dashboard, not in this repository, so changing a file here changes nothing until it is pasted in.

To apply: Supabase dashboard, Authentication, Emails, Templates. Paste each file's HTML into the matching template and set the subject.

| File | Template | Subject |
|---|---|---|
| `magic-link.html` | Magic Link | Your Data Hygienics sign-in link |
| `confirm-signup.html` | Confirm signup | Confirm your email for Data Hygienics |
| `reset-password.html` | Reset Password | Reset your Data Hygienics password |

Each uses `{{ .ConfirmationURL }}`, which Supabase fills in. The logo loads from `https://datahygienics.com/brand/logo-horizontal-color.png`, a PNG copy of the master lockup, because most email clients do not show SVG. Plain tables and inline styles only, so they render in Gmail and Outlook.
