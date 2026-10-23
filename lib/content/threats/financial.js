// Industry brief: small financial services firms (accountants, bookkeepers, tax
// preparers, financial advisors). Ported from lib/threats.js on main and re-verified
// 2026-10-23. Pure data, import-free. Citations: [^source-id] markers inside `content`
// and `tldr`; sources live in lib/content/sources/ (mostly landscape.js). ctaText/ctaLink are
// kept for the legacy detail page.

const financial = {
  kind: "industry-brief",
  slug: "financial",
  title: "Cybersecurity threats for financial services",
  metaTitle: "Financial Firm Threats and AI Fraud Risks | Data Hygienics",
  metaDescription:
    "BEC, deepfake payment fraud, ransomware and FTC Safeguards duties for accountants, tax preparers, bookkeepers and advisors, with 2025-2026 data.",
  audience: ["business"],
  pillars: ["threats"],
  tldr: "If you prepare taxes, run payroll, keep books or advise clients, you move money and hold the data criminals want, and federal rules may treat you as a financial institution. Business email compromise cost victims $3.05 billion in 2025 according to the FBI, and AI-made voices, videos and ID documents are now part of the playbook.[^fbi-ic3-2025][^fincen-deepfake-alert-2024] Start with multi-factor authentication (MFA) everywhere, a callback rule for every payment change, and a written security plan that covers how your team uses AI.",
  datePublished: "2026-04-08",
  lastReviewed: "2026-10",
  status: "published",
  featured: false,
  industry: "Financial Services",
  industryDescription:
    "BEC, deepfake fraud, ransomware and regulatory duties explained for accountants, bookkeepers, tax preparers and financial advisors.",
  content: `<h2>What to do first</h2>
<ul>
<li><strong>Turn on multi-factor authentication (MFA)</strong> for email, accounting and tax software, payroll systems and client portals. (See: <a href="/controls/multi-factor-authentication">Multi-Factor Authentication</a>)</li>
<li><strong>Adopt a callback rule.</strong> Every payroll, direct-deposit or payment-routing change gets confirmed by calling a number you already had on file, and a second person approves it. (See: <a href="/guides/two-channel-verification-for-payments">Two-channel verification for payments</a>)</li>
<li><strong>Check whether the Federal Trade Commission (FTC) Safeguards Rule applies to you</strong>, and if it does, write or update your written information security plan (WISP).</li>
<li><strong>Write a one-page AI rule</strong> that says which AI tools may touch client data and which never may. (See: <a href="/guides/one-page-ai-use-rule-for-your-team">One-page AI use rule</a>)</li>
<li><strong>Test an offline backup restore</strong> before your busiest season, not during it. (See: <a href="/controls/backup-testing">Backup Testing</a>)</li>
</ul>

<h2>Why small financial firms are targeted</h2>
<p>This page isn't about big banks. It's for the two-person bookkeeping firm running payroll for a few dozen small businesses, the solo tax preparer, the independent financial advisor and the small certified public accounting (CPA) practice with a server in the back room.</p>
<p>You hold Social Security numbers, bank account numbers and income details for people who trust you, and your daily work moves money. That combination is exactly what fraud crews look for.</p>
<p>IBM's 2026 Cost of a Data Breach study put the average financial-services breach at $6.29 million, second only to healthcare and up from $5.56 million the year before.[^ibm-breach-cost-2026] IBM also found that financial services and energy were the sectors most targeted by AI-driven attacks.[^ibm-breach-cost-2026]</p>
<p>In 2025, the FBI's Internet Crime Complaint Center (IC3) logged 258 ransomware complaints and 189 data breach complaints tied to the financial services sector.[^fbi-ic3-2025] Verizon's 2026 Data Breach Investigations Report (DBIR) counted 1,300 confirmed breaches in finance and insurance, 98% of them financially motivated.[^verizon-dbir-2026-exec-summary]</p>

<h2>Threat #1: Business email compromise (BEC)</h2>
<h3>What it is</h3>
<p>Business email compromise is a targeted scam in which someone poses as a client, vendor or colleague to redirect money or steal data. The FBI counted about $3.05 billion in BEC losses in 2025, second only to investment fraud.[^fbi-ic3-2025]</p>
<h3>What it looks like at a small firm</h3>
<p>The classic is payroll redirection. A client's email, hacked or convincingly faked, asks you to change one employee's direct deposit, and the next paycheck lands in the criminal's account. By the time the employee asks where the pay went, the money may already be gone.</p>
<p>A tax-season version: an attacker takes over a preparer's real mailbox and sends every client a "verify your information" link to a fake login page. Because the email really does come from the preparer's address, filters may miss it and clients trust it.</p>
<h3>How it gets in</h3>
<p>BEC often starts with a stolen password, from phishing or from a password reused on a site that was breached. In Verizon's 2026 data for finance and insurance, phishing (20%) and credential abuse (15%) were among the top ways in, behind exploited software flaws (22%).[^verizon-dbir-2026-exec-summary]</p>
<p>Once inside, attackers read your mail to learn which clients send payroll changes, which vendors you pay and when deadlines make people rush. Then they strike when a routine request is least likely to be questioned.</p>
<h3>What stops it</h3>
<p><strong>Callback verification for every change.</strong> Call the client at a number you already have, never one from the email, before changing direct deposit, payment routing or vendor bank details. Write it into your procedures and follow it every time. (See: <a href="/controls/out-of-band-verification">Out-of-Band Verification</a>)</p>
<p><strong>MFA on every account.</strong> Email, accounting software, tax platform, payroll and every client portal. If attackers can't get into your email, they can't study your clients or send mail as you. (See: <a href="/controls/multi-factor-authentication">Multi-Factor Authentication</a>)</p>
<p><strong>Forwarding rule audits.</strong> Attackers often add a hidden rule that copies every incoming message to an outside address. Check forwarding and mail-flow rules monthly in your Microsoft 365 or Google Workspace admin console. (See: <a href="/controls/email-filtering">Email Security</a>)</p>

<h2>Threat #2: Phishing and credential theft</h2>
<h3>What it is</h3>
<p>Phishing is a fraudulent message built to get someone to enter a password on a fake site, click a malicious link or open an infected file. It is a threat on its own and often the first step in the other attacks on this page.</p>
<p>Phishing and spoofing topped the FBI's 2025 complaint list at 191,561 complaints.[^fbi-ic3-2025]</p>
<h3>What it looks like at a small firm</h3>
<p>Tax season brings lookalike IRS notices, fake e-file and tax software alerts, and fake client "document shares," mixed in with the real ones. Year-round, expect fake accounting-software notifications and fake bank portal alerts.</p>
<p>Lures are moving off email, too. In Verizon's 2026 phishing simulations, voice and text lures got a median click rate 40% higher than email.[^verizon-dbir-2026-exec-summary]</p>
<h3>What stops it</h3>
<p><strong>A password manager for the whole firm.</strong> Every login gets a unique, randomly generated password stored in the manager. Where a service offers passkeys or another phishing-resistant sign-in, use it. (See: <a href="/controls/password-management">Password Management</a>)</p>
<p><strong>Simulated phishing that looks like your inbox.</strong> Use fake IRS notices, software alerts and client document shares, especially before tax season. Debrief without shaming anyone. (See: <a href="/controls/security-training">Security Awareness Training</a>)</p>
<p><strong>DMARC, SPF and DKIM on your domain.</strong> These email authentication records make it much harder for someone to send mail that appears to come from your firm to your clients. (See: <a href="/controls/email-authentication">Email Authentication</a>)</p>

<h2>Threat #3: Ransomware and data theft</h2>
<h3>What it is</h3>
<p>Ransomware locks your files and demands payment for the key, and many groups steal the data first so they can threaten to publish it. Even a firm that restores from backup may still face a data breach.</p>
<h3>What it looks like at a small firm</h3>
<p>Your tax software, client files, document storage and email are all locked a few weeks before a filing deadline. Clients can't reach their portal, and backups kept on the same network are locked too. Downtime in March costs a tax practice far more than downtime in July.</p>
<p>Verizon's 2026 DBIR found ransomware in 48% of all breaches it studied.[^verizon-dbir-2026-exec-summary] The median ransom paid fell to $139,875, and 69% of victims didn't pay.[^verizon-dbir-2026-exec-summary]</p>
<p>Data theft alone is costly. In late February 2025, Legacy Professionals LLP, an Illinois CPA firm serving organizations with employee benefit plans, began notifying 216,752 people that files had been taken from its servers after a 2024 intrusion.[^ismg-legacy-professionals-2025] At least five proposed class actions were filed within about 10 days.[^ismg-legacy-professionals-2025]</p>
<h3>What stops it</h3>
<p><strong>Offline backups, tested quarterly.</strong> Keep at least one copy disconnected from your network, because ransomware can reach backups and synced cloud folders it can see. Test a restore before you need one. (See: <a href="/controls/data-backup">Data Backup and Recovery</a>)</p>
<p><strong>Endpoint detection and response (EDR) on every workstation.</strong> EDR watches for ransomware-like behavior and can stop it in progress. (See: <a href="/controls/endpoint-protection">Endpoint Protection</a>)</p>
<p><strong>Network segmentation.</strong> Keep client data systems separate from the general office network, so malware on the front-desk computer can't reach your tax server. (See: <a href="/controls/network-segmentation">Network Segmentation</a>)</p>
<p><strong>Fast patching, starting with internet-facing devices.</strong> Organizations fully fixed only 26% of the most critical known-exploited flaws in Verizon's 2026 data, and the median fix took 43 days.[^verizon-dbir-2026-exec-summary] Firewalls and virtual private network (VPN) appliances come first. (See: <a href="/controls/patch-management">Patch Management</a>)</p>

<h2>Threat #4: Insider mistakes and departing staff</h2>
<h3>What it is</h3>
<p>Insider risk comes from people inside your firm: a departing employee who takes client files, a staff member who opens records they shouldn't, or an honest mistake that exposes client data. Internal actors were involved in 12% of finance and insurance breaches in Verizon's 2026 data.[^verizon-dbir-2026-exec-summary]</p>
<h3>What it looks like at a small firm</h3>
<p>A bookkeeper leaving to start a practice copies client contacts and payroll records on the way out. A staff accountant emails a finished return to the wrong address, or shares a cloud folder as "anyone with the link."</p>
<p>A newer version: someone pastes a client's financial statements into a personal AI chatbot to draft a summary. The AI section below covers how to handle that.</p>
<h3>What stops it</h3>
<p><strong>Role-based access.</strong> Staff see only the clients they actively work on, across your practice management software, tax platform and file storage. (See: <a href="/controls/access-control-policy">Access Control</a>)</p>
<p><strong>Same-day offboarding.</strong> Email, accounting and tax software, document storage and client portals all end on the last day. (See: <a href="/controls/employee-offboarding">Employee Offboarding</a>)</p>
<p><strong>Data loss prevention (DLP) rules on email.</strong> Flag or block outgoing messages containing Social Security numbers, employer identification numbers or bank account numbers. Check which DLP features your business email plan includes.</p>

<h2>Threat #5: Vendor and third-party risk</h2>
<h3>What it is</h3>
<p>Your tax software, cloud accounting platform, payroll processor, document portal, IT provider and AI tools all hold or reach client data. If one of them is breached, your clients can be exposed even when your own systems are fine.</p>
<h3>What it looks like</h3>
<p>Third parties were involved in 34% of finance and insurance breaches in Verizon's 2026 data, and in 48% of breaches across all industries.[^verizon-dbir-2026-exec-summary] If your outside IT company's remote-management tool is compromised, the attacker can reach every client it serves, including you.</p>
<h3>What stops it</h3>
<p><strong>Keep a vendor inventory and review it yearly.</strong> List every vendor with access to client data or your systems, including AI tools. (See: <a href="/controls/vendor-risk-management">Vendor Risk Management</a>)</p>
<p><strong>Put security expectations in the contract.</strong> If the Safeguards Rule applies to you, it requires you to choose service providers that can protect customer information, require safeguards by contract and reassess them periodically.[^ecfr-ftc-safeguards-rule] (See: <a href="/controls/vendor-agreements">Vendor Agreements</a>)</p>
<p><strong>Ask your IT provider how it protects its own tools.</strong> Ask what MFA protects its remote-access tools, whether it has a SOC 2 report (an independent auditor's review of its security controls), and what its plan is if it is breached. Write down the answers.</p>

<h2>The AI era: Deepfakes, synthetic identities and your obligations</h2>
<h3>Deepfake wire and payment fraud</h3>
<p>Criminals now use AI to sound and look like people you trust. The FBI warns that they generate audio of relatives or authority figures and real-time video of "executives" to get payments approved.[^fbi-psa-genai-fraud-2024]</p>
<p>The Financial Crimes Enforcement Network (FinCEN), the Treasury bureau that fights financial crime, says criminals have used AI tools to impersonate executives or trusted employees and tell staff to send large payments.[^fincen-deepfake-alert-2024] Its alert points to a 2024 case reported by CNN in which a finance employee sent about $25 million (HK$200 million) after a video meeting with an AI-faked chief financial officer.[^fincen-deepfake-alert-2024][^guardian-arup-deepfake-2024]</p>
<p>In 2025, businesses reported more than $30 million in BEC losses involving AI to the FBI.[^fbi-ic3-2025] The FBI also notes that many victims don't realize how much AI was part of the scam.[^fbi-ic3-2025]</p>
<p>The defense is the same callback rule as above, applied to calls and video too: a familiar face or voice is not proof. Money moves only after a second channel you already trusted confirms it. (See: <a href="/controls/out-of-band-verification">Out-of-Band Verification</a> and <a href="/threats/voice-cloning-and-deepfake-scams">Voice cloning and deepfake scams</a>)</p>
<h3>Synthetic identities and know-your-customer (KYC) fraud</h3>
<p>FinCEN's November 2024 alert, FIN-2024-Alert004, says suspicious activity reports describing deepfake media rose starting in 2023.[^fincen-deepfake-alert-2024] Many involved altered or AI-generated identity documents used to get past identity checks, including when opening accounts.[^fincen-deepfake-alert-2024]</p>
<p>Red flags FinCEN lists include:[^fincen-deepfake-alert-2024]</p>
<ul>
<li>A photo that looks altered or doesn't match the customer's stated age.</li>
<li>Identity documents that don't agree with each other.</li>
<li>A third-party webcam plugin, or repeated "technical glitches," during live video verification.</li>
<li>A customer who declines to use MFA.</li>
<li>A new account with a burst of rapid transactions, or large payments to risky payees such as gambling sites or crypto exchanges.</li>
</ul>
<p>If your firm files suspicious activity reports (SARs) under the Bank Secrecy Act, FinCEN asks you to use the key term "FIN-2024-DEEPFAKEFRAUD" in related reports.[^fincen-deepfake-alert-2024] If you're an advisor, preparer or bookkeeper who onboards clients remotely, the same red flags deserve a second look before you open an account or file anything.</p>
<h3>The FTC Safeguards Rule and GLBA</h3>
<p>The Gramm-Leach-Bliley Act (GLBA) is the federal law behind the FTC's Safeguards Rule. The rule names tax preparation firms, mortgage brokers, credit counselors, collection agencies and investment advisers not required to register with the Securities and Exchange Commission (SEC) among the businesses it covers.[^ecfr-ftc-safeguards-rule][^ftc-safeguards-guide-2024] The IRS says tax and accounting professionals count as financial institutions under GLBA and must keep a written information security plan.[^irs-wisp-2026]</p>
<p>The rule doesn't mention AI, but its existing requirements reach your AI tools:</p>
<ul>
<li><strong>MFA</strong> for anyone accessing customer information on your systems, unless your designated Qualified Individual approves an equivalent control in writing.[^ftc-safeguards-guide-2024][^ecfr-ftc-safeguards-rule]</li>
<li><strong>Service provider oversight.</strong> Any company that receives, stores or processes customer information for you counts as a service provider, and that includes an AI vendor.[^ecfr-ftc-safeguards-rule] Choose capable providers, put safeguards in the contract and reassess them.</li>
<li><strong>A risk assessment</strong> that covers how staff actually use AI with client data. Firms with information on 5,000 or more consumers must put the assessment in writing.[^ecfr-ftc-safeguards-rule]</li>
<li><strong>Breach reporting.</strong> Since May 2024, a security event exposing unencrypted information of at least 500 consumers must be reported to the FTC no later than 30 days after discovery.[^ftc-safeguards-guide-2024][^ecfr-ftc-safeguards-rule]</li>
</ul>
<p>Firms with information on fewer than 5,000 consumers are exempt from four requirements: a written risk assessment, continuous monitoring or periodic penetration testing, a written incident response plan, and the annual written report to leadership.[^ecfr-ftc-safeguards-rule] Everything else still applies, including MFA, encryption, service provider oversight and naming a Qualified Individual. If you're unsure whether you're covered, get a legal or compliance review.</p>
<h3>Registered investment advisers: Regulation S-P</h3>
<p>If you're an SEC-registered investment adviser or a broker-dealer, the SEC's amended Regulation S-P applies to you. Its compliance schedule gave larger firms until December 3, 2025, and smaller firms until June 3, 2026.[^sec-reg-sp-guide-2024]</p>
<p>It requires a written incident response program and notice to affected customers no later than 30 days after you learn of unauthorized access.[^sec-reg-sp-guide-2024] It also requires oversight of service providers, including making sure they notify you within 72 hours of a breach of systems they run for you.[^sec-reg-sp-guide-2024]</p>
<h3>Staff using AI with client data</h3>
<p>Verizon's 2026 DBIR found 45% of employees now use AI regularly on work devices, up from 15% a year earlier, and about two-thirds of AI users there signed in with non-corporate accounts.[^verizon-dbir-2026-exec-summary] IBM found that 68% of breached organizations lacked governance to manage AI use or detect unapproved tools.[^ibm-breach-cost-2026]</p>
<p>A one-page AI rule settles the basics: which tools are approved, what client data never goes into them, and who to ask. Approved tools should be business accounts covered by a contract, never personal logins. (See: <a href="/controls/ai-acceptable-use">AI Acceptable Use</a>, <a href="/threats/ai-chatbot-data-leaks">AI chatbot data leaks</a> and our free <a href="/tools/policies/ai-acceptable-use-policy">AI Acceptable Use Policy</a>; free account required)</p>

<h2>Take the next step</h2>
<p>This page gives you the picture. Our free Quick Check shows where your firm stands against these threats, including how your team uses AI tools.</p>`,
  faqs: [
    {
      question: "Does the FTC Safeguards Rule apply to my firm?",
      answer:
        "It may: the rule covers businesses significantly engaged in financial activities and names tax preparation firms, credit counselors, mortgage brokers and investment advisers that don't register with the SEC as examples. The IRS says tax and accounting professionals are financial institutions under the Gramm-Leach-Bliley Act and must keep a written information security plan. Smaller firms are exempt from a few requirements, not the core ones, so get a legal or compliance review if you're unsure.",
    },
    {
      question: "Could a deepfake really fool my staff on a phone or video call?",
      answer:
        "Yes. The FBI and FinCEN both warn that criminals use AI-generated voices and live video to pose as executives, clients and family members and ask for payments. Don't rely on spotting the fake; require a callback to a number you already had, plus a second approver, before any payment or bank-detail change.",
    },
    {
      question: "Can we use AI tools with client data?",
      answer:
        "Only approved business tools under a contract that protects the data, never personal chatbot accounts. If the Safeguards Rule applies to you, an AI vendor that handles customer information is a service provider you must vet, bind by contract and review. Write a one-page AI rule so staff know which tools are allowed and what never goes into them.",
    },
    {
      question: "What should we do if we wire money to a scammer?",
      answer:
        "Call your bank immediately and ask it to recall or freeze the transfer, then file a complaint with the FBI at ic3.gov. Speed matters: the FBI says its recovery team can do the most when complaints are filed quickly. Then work through your incident response plan, including any notice you owe clients or regulators.",
    },
    {
      question: "What is the most important thing to do first?",
      answer:
        "Turn on multi-factor authentication for every account at your firm: email, accounting software, tax platform, payroll and client portals. Then put the callback rule for payment changes in writing, and check whether you have the written information security plan the FTC Safeguards Rule requires.",
    },
  ],
  sourceIds: [
    "fbi-ic3-2025",
    "fbi-psa-genai-fraud-2024",
    "fincen-deepfake-alert-2024",
    "guardian-arup-deepfake-2024",
    "verizon-dbir-2026-exec-summary",
    "ibm-breach-cost-2026",
    "ismg-legacy-professionals-2025",
    "ecfr-ftc-safeguards-rule",
    "ftc-safeguards-guide-2024",
    "irs-wisp-2026",
    "sec-reg-sp-guide-2024",
  ],
  related: {
    threats: ["ai-powered-phishing-and-bec", "voice-cloning-and-deepfake-scams", "ai-chatbot-data-leaks"],
    guides: ["two-channel-verification-for-payments", "one-page-ai-use-rule-for-your-team", "digital-hygiene-for-your-business"],
    explainers: [],
    controls: [
      "multi-factor-authentication",
      "password-management",
      "out-of-band-verification",
      "ai-acceptable-use",
      "email-filtering",
      "email-authentication",
      "security-training",
      "data-backup",
      "backup-testing",
      "endpoint-protection",
      "network-segmentation",
      "patch-management",
      "access-control-policy",
      "employee-offboarding",
      "vendor-risk-management",
      "vendor-agreements",
      "incident-response-plan",
    ],
    glossary: ["deepfake", "voice-cloning", "ransomware", "social-engineering", "shadow-ai"],
    toolkit: [],
  },
  ctaText: "Start the free Quick Check",
  ctaLink: "/tools/cyber-audit",
}

export default financial
