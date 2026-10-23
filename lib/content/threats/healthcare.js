// Industry brief: healthcare practices (medical, dental, behavioral health).
// Ported from lib/threats.js on main and re-verified 2026-10-23. Pure data, import-free.
// Citations: [^source-id] markers inside `content` and `tldr`; sources live in
// lib/content/sources/ (mostly landscape.js). ctaText/ctaLink are kept for the legacy detail page.

const healthcare = {
  kind: "industry-brief",
  slug: "healthcare",
  title: "Cybersecurity threats for healthcare practices",
  metaTitle: "Healthcare Practice Threats and AI Risks | Data Hygienics",
  metaDescription:
    "Ransomware, phishing, vendor risk and AI-era fraud for medical, dental and behavioral health practices, with 2025-2026 data and what to do first.",
  audience: ["business"],
  pillars: ["threats"],
  tldr: "Small practices hold the same patient data as hospitals with far fewer people defending it, and attackers pick targets by that profile. In 2025 the FBI received more ransomware complaints tied to healthcare than to any other critical infrastructure sector, and AI now makes convincing impersonation calls and emails cheap to produce.[^fbi-ic3-2025] Most of the fix is basics done well: multi-factor authentication (MFA), offline backups, fast patching, a callback rule for money and password requests, and a written rule for which AI tools may touch patient data.",
  datePublished: "2026-04-08",
  lastReviewed: "2026-10",
  status: "published",
  featured: false,
  industry: "Healthcare",
  industryDescription:
    "Ransomware, phishing, vendor risk and AI-era fraud explained for medical practices, dental offices and behavioral health clinics.",
  content: `<h2>What to do first</h2>
<ul>
<li><strong>Turn on multi-factor authentication (MFA)</strong> for email, your electronic health record (EHR), remote access and payer portals. (See: <a href="/controls/multi-factor-authentication">Multi-Factor Authentication</a>)</li>
<li><strong>Keep one backup copy offline</strong> and test a full restore this quarter. (See: <a href="/controls/backup-testing">Backup Testing</a>)</li>
<li><strong>Adopt a callback rule.</strong> Any request to change bank details, send money, or reset a password or MFA device gets confirmed by calling a number you already had on file. (See: <a href="/guides/two-channel-verification-for-payments">Two-channel verification for payments</a>)</li>
<li><strong>Write a one-page AI rule.</strong> Patient information goes only into AI tools your practice has approved and has a business associate agreement (BAA) for. (See: <a href="/guides/one-page-ai-use-rule-for-your-team">One-page AI use rule</a>)</li>
<li><strong>List every vendor that touches patient data</strong> and confirm a signed BAA is on file for each one.</li>
</ul>

<h2>Why small practices are targeted</h2>
<p>Attackers rarely pick a practice by name. A five-provider clinic holds the same kinds of data as a hospital, including Social Security numbers, insurance details, diagnoses and payment information, usually with no dedicated security staff.</p>
<p>IBM's 2026 Cost of a Data Breach study notes that criminals prize patient records because they can be used for identity theft and insurance fraud.[^ibm-breach-cost-2026] Healthcare had the highest average breach cost of any industry for the 13th year running, at $6.64 million, down from $7.42 million the year before.[^ibm-breach-cost-2026]</p>
<p>In 2025, the FBI's Internet Crime Complaint Center (IC3) logged 460 ransomware complaints and 182 data breach complaints tied to the Healthcare and Public Health sector, the highest ransomware count of any critical infrastructure sector.[^fbi-ic3-2025] Verizon's 2026 Data Breach Investigations Report (DBIR) reviewed 1,438 confirmed healthcare breaches: 81% involved outside attackers and 99% were financially motivated.[^verizon-dbir-2026-healthcare]</p>

<h2>Threat #1: Ransomware</h2>
<h3>What it is</h3>
<p>Ransomware locks your files and systems, then demands payment to unlock them. Many groups copy your data first and threaten to publish it. In a practice, that can mean no EHR, no schedule, no billing and no access to medication or allergy lists.</p>
<h3>What it looks like</h3>
<p>The front desk can't open the EHR one morning, and a ransom note is on the server screen. Appointments get canceled while staff try to work out who to call and whether anyone should pay. A written incident response plan answers those questions before the day comes. (See: <a href="/controls/incident-response-plan">Incident Response Plan</a>)</p>
<p>Verizon's 2026 DBIR found ransomware in 48% of all breaches it studied, and says system intrusions in healthcare are largely driven by ransomware.[^verizon-dbir-2026-exec-summary][^verizon-dbir-2026-healthcare] The median ransom paid fell to $139,875, and 69% of victims didn't pay at all.[^verizon-dbir-2026-exec-summary] The larger costs are downtime, breach notification and patients who go elsewhere.</p>
<h3>How it gets in</h3>
<p><strong>Unpatched internet-facing equipment.</strong> Exploiting software flaws is now the most common way in, at 31% of breaches where the entry point was known, and 20% in healthcare.[^verizon-dbir-2026-exec-summary][^verizon-dbir-2026-healthcare] Organizations fully fixed only 26% of the most critical known-exploited flaws, and the median fix took 43 days.[^verizon-dbir-2026-exec-summary]</p>
<p><strong>Stolen passwords and phishing.</strong> Phishing (14%) and credential abuse (11%) were the next most common ways into healthcare organizations.[^verizon-dbir-2026-healthcare] UnitedHealth Group's CEO told the Senate that the 2024 Change Healthcare attack began through a server that did not have MFA turned on.[^therecord-change-healthcare-ransom-2024]</p>
<p><strong>Remote access left open.</strong> Remote Desktop Protocol (RDP) or remote-support tools exposed to the internet without a virtual private network (VPN) and MFA are easy for automated scanners to find. Remote access set up in a hurry is worth a second look.</p>
<h3>What stops it</h3>
<p><strong>Offline, tested backups.</strong> The FBI recommends offline or off-site backups that are encrypted, can't be altered or deleted, and cover all your data.[^fbi-ic3-2025] A backup you have never restored from is a guess, so test it. (See: <a href="/controls/data-backup">Data Backup and Recovery</a>)</p>
<p><strong>MFA on every remote login.</strong> That includes the EHR, email, VPN and any remote desktop connection. With MFA on, a stolen password is no longer enough on its own. (See: <a href="/controls/multi-factor-authentication">Multi-Factor Authentication</a>)</p>
<p><strong>Patch edge devices fast.</strong> Firewalls, VPN appliances and other internet-facing equipment should get critical updates within days, starting with flaws known to be exploited. If your IT provider doesn't do this by default, ask why. (See: <a href="/controls/patch-management">Patch Management</a>)</p>
<p><strong>Endpoint detection and response (EDR) on every workstation.</strong> EDR watches for ransomware-like behavior and can stop encryption partway through. Cyber insurers commonly ask about MFA, offline backups, EDR and an incident response plan, so these controls do double duty. (See: <a href="/controls/endpoint-protection">Endpoint Protection</a>)</p>

<h2>Threat #2: Phishing and phone pretexting</h2>
<h3>What it is</h3>
<p>Phishing is a message, usually email or text, built to make someone click a link, open a file or type a password into a fake page. Pretexting is the phone version: a caller with a believable story who wants a password reset, a new phone enrolled for MFA, or a payment detail changed.</p>
<p>Phishing and spoofing topped the FBI's 2025 complaint list at 191,561 complaints, more than double the next category.[^fbi-ic3-2025]</p>
<h3>What it looks like in a practice</h3>
<p>Billing staff get a fake "remittance advice" from a payer that leads to a lookalike login page. The practice manager gets a fake security notice from the EHR vendor. Someone calls the front desk claiming to be IT, a physician or the clearinghouse, and needs a code right now.</p>
<p>In Verizon's 2026 phishing simulations, voice and text lures got a median click rate 40% higher than email.[^verizon-dbir-2026-exec-summary] In healthcare, phishing was the most common social engineering tactic, followed by pretexting.[^verizon-dbir-2026-healthcare]</p>
<h3>What stops it</h3>
<p><strong>Training built on your real workflows.</strong> Show billing staff a fake payer portal and the front desk a fake patient-portal notice, then run short simulations each quarter. Make reporting easy and blame-free. (See: <a href="/controls/security-training">Security Awareness Training</a>)</p>
<p><strong>Email filtering with attachment sandboxing.</strong> Most business email plans can open attachments in an isolated space before delivery; make sure yours is switched on. (See: <a href="/controls/email-filtering">Email Security</a>)</p>
<p><strong>DMARC, SPF and DKIM on your domain.</strong> These email authentication records make it much harder for someone to send mail that appears to come from your practice. (See: <a href="/controls/email-authentication">Email Authentication</a>)</p>
<p><strong>No resets on a phone call alone.</strong> Tell your IT provider in writing that password and MFA resets require a callback to the number on file, or an in-person check. (See: <a href="/controls/out-of-band-verification">Out-of-Band Verification</a>)</p>

<h2>Threat #3: Insider mistakes and misuse</h2>
<h3>What it is</h3>
<p>Insider risk comes from people inside your practice. It is usually an honest mistake and sometimes deliberate misuse, and both create exposure under the Health Insurance Portability and Accountability Act (HIPAA), the federal health privacy law.</p>
<h3>What it looks like</h3>
<p>Internal actors were involved in 19% of healthcare breaches in Verizon's 2026 data, and staff errors have been a top-three healthcare breach pattern every year since 2014.[^verizon-dbir-2026-healthcare] The most common errors were records sent to the wrong person, lost devices or media that weren't encrypted, and systems misconfigured so they were open to the internet.[^verizon-dbir-2026-healthcare]</p>
<p>Deliberate misuse looks like a departing employee copying a patient list, or someone browsing records they have no reason to see. A newer risk sits in between: a well-meaning staff member pasting patient details into a personal AI chatbot to save time. The AI section below covers that one.</p>
<h3>What stops it</h3>
<p><strong>Role-based access in your EHR.</strong> Each person sees only the records their job needs. The front desk doesn't need clinical notes, and billing doesn't need psychotherapy notes. (See: <a href="/controls/access-control-policy">Access Control</a>)</p>
<p><strong>Audit logs someone actually reads.</strong> Review EHR access logs monthly for after-hours access, bulk record views and lookups of patients who aren't on the schedule.</p>
<p><strong>Same-day offboarding.</strong> When someone leaves, their EHR, email, payer-portal and shared-drive access ends that day. (See: <a href="/controls/employee-offboarding">Employee Offboarding</a>)</p>
<p><strong>Encrypted devices and limited USB use.</strong> Encrypt every laptop and restrict copying patient data to removable drives. (See: <a href="/controls/device-encryption">Device Encryption</a>)</p>

<h2>Threat #4: Vendor and third-party risk</h2>
<h3>What it is</h3>
<p>Your EHR vendor, clearinghouse, billing service, cloud storage, IT provider and AI tools all touch your data or your systems. If one of them is breached, your patients can be exposed even when your own systems are fine.</p>
<h3>What it looks like</h3>
<p>Third parties were involved in 32% of healthcare breaches in Verizon's 2026 data, partly because of widespread attacks on a flaw in Oracle's business software.[^verizon-dbir-2026-healthcare] Across all industries, third-party involvement rose 60% in a year, to 48% of breaches.[^verizon-dbir-2026-exec-summary]</p>
<p>The February 2024 ransomware attack on Change Healthcare, a claims and payment processor, showed how far one vendor's outage reaches.[^techtarget-change-healthcare-count-2025] At a Senate hearing, UnitedHealth Group's CEO confirmed the company paid a $22 million ransom, and senators described hospitals working through weeks of backed-up claims.[^therecord-change-healthcare-ransom-2024] The company later put the number of people affected at about 192.7 million.[^techtarget-change-healthcare-count-2025]</p>
<p>The same logic applies closer to home. If your outside IT company's remote-management tool is compromised, every client it serves can be exposed at once.</p>
<h3>What stops it</h3>
<p><strong>Know who has your data.</strong> Keep a list of every vendor that touches patient data or your systems, including your EHR, IT provider, billing service, cloud storage, shredding company and any AI tools. (See: <a href="/controls/vendor-risk-management">Vendor Risk Management</a>)</p>
<p><strong>Get a BAA before sharing patient data.</strong> HIPAA lets an outside company handle patient information for you only after you have written assurances that it will protect it, usually a business associate agreement.[^ecfr-hipaa-business-associates] If a vendor won't sign one, it doesn't get patient data. (See: <a href="/controls/vendor-agreements">Vendor Agreements</a>)</p>
<p><strong>Ask your IT provider how it protects its own tools.</strong> Ask what MFA protects its remote-management tool, whether it has a SOC 2 report (an independent auditor's review of its security controls), and what happens to you if it is breached. Write down the answers.</p>
<p><strong>Plan for a vendor outage.</strong> Decide how you would see patients and bill if your clearinghouse or cloud EHR went down for two weeks, including paper fallback forms.</p>

<h2>Threat #5: Business email compromise (BEC)</h2>
<h3>What it is</h3>
<p>Business email compromise is a targeted scam in which someone poses as a person you trust, usually by email, to get money or sensitive data. The FBI's 2025 report counted 24,768 BEC complaints and about $3.05 billion in losses.[^fbi-ic3-2025]</p>
<h3>What it looks like in a practice</h3>
<p>A message that looks like it's from your equipment supplier asks you to update its bank details. Or a physician's hacked mailbox asks the office manager to pay a conference fee today because the doctor is in clinic. The thread looks real because the attacker read your real email first.</p>
<h3>What stops it</h3>
<p><strong>Verify every payment change and wire.</strong> Call a known number, never one from the email, and have a second person approve new payees. Write it down as policy and follow it every time. (See: <a href="/controls/out-of-band-verification">Out-of-Band Verification</a>)</p>
<p><strong>MFA on all email accounts.</strong> If attackers can't get into your mailbox, they can't study your conversations or send mail as you. (See: <a href="/controls/multi-factor-authentication">Multi-Factor Authentication</a>)</p>
<p><strong>Check forwarding rules monthly.</strong> Attackers who get into a mailbox often add a hidden rule that copies mail to an outside address. Your email admin console lists these rules. (See: <a href="/controls/email-filtering">Email Security</a>)</p>

<h2>The AI era: What changes for practices</h2>
<h3>Staff using AI tools with patient information</h3>
<p>AI tools are already in your building, approved or not. Verizon's 2026 DBIR found 45% of employees now use AI regularly on work devices, up from 15% a year earlier, and about two-thirds of AI users there signed in with non-corporate accounts.[^verizon-dbir-2026-exec-summary] IBM's 2026 study found 43% of the breached organizations it examined reported security incidents involving staff use of unapproved AI tools, often called shadow AI, up from 20%.[^ibm-breach-cost-2026]</p>
<p>HIPAA already covers this. An AI company that receives or stores patient information for your practice needs the same written assurances as any other vendor, usually a BAA.[^ecfr-hipaa-business-associates] If an AI tool's maker won't sign one, patient information doesn't go into it, and personal chatbot accounts are never the place for it.</p>
<p>In its January 2025 proposal to update the HIPAA Security Rule, the Department of Health and Human Services (HHS) said patient information a practice keeps for its covered work stays protected by HIPAA when it ends up in AI training data, prediction models or algorithms.[^hhs-hipaa-security-nprm-2025] HHS also said practices using AI should include those tools in their risk analysis: what patient data each tool can reach, who receives it, and who gets the output.[^hhs-hipaa-security-nprm-2025]</p>
<p>That proposal is not final. The federal regulatory agenda now lists it as a long-term action with a target of July 2027, and the current Security Rule still applies.[^reginfo-hipaa-security-2026] The current rule already requires a risk analysis, so adding your AI tools to it makes sense either way. (See: <a href="/controls/ai-acceptable-use">AI Acceptable Use</a> and our free <a href="/tools/policies/ai-acceptable-use-policy">AI Acceptable Use Policy</a>; free account required)</p>
<p>One AI-related rule is already in force. Since May 2025, health programs covered by Section 1557 of the Affordable Care Act (generally those receiving federal financial assistance from HHS) must make reasonable efforts to find clinical decision support tools, automated or not, that use race, color, national origin, sex, age or disability as inputs, and reduce the risk of discrimination from them.[^ecfr-hhs-1557-decision-support]</p>
<h3>Deepfake and voice fraud against practices</h3>
<p>AI makes impersonation cheap. The FBI warns that criminals use AI-generated audio to pose as relatives or authority figures, and AI-generated video in live calls to pose as company executives.[^fbi-psa-genai-fraud-2024] In 2025, businesses reported more than $30 million in BEC losses involving AI to the FBI.[^fbi-ic3-2025]</p>
<p>IBM's 2026 study found that more than one in four organizations hit by a malicious attack said it was AI-driven, and deepfake impersonation was the most common kind, at 45% of those attacks.[^ibm-breach-cost-2026]</p>
<p>In a practice, that could be a call that sounds exactly like the physician owner asking for an urgent wire, or a "vendor" on video asking staff to skip a normal step. You don't need to spot the fake. You need a rule that money moves and passwords reset only after a callback to a number you already had.</p>
<ul>
<li><strong>Call back on a known number</strong> before any payment change, wire, gift card purchase, or password or MFA reset. (See: <a href="/controls/out-of-band-verification">Out-of-Band Verification</a>)</li>
<li><strong>Use two approvers</strong> for any new payee or bank-detail change.</li>
<li><strong>Tell staff in writing</strong> that slowing down a request to verify it will never get them in trouble, even if the caller sounds like the boss.</li>
</ul>
<p>For how these scams work and what to do if one gets through, see <a href="/threats/voice-cloning-and-deepfake-scams">Voice cloning and deepfake scams</a>.</p>

<h2>How healthcare is different: HIPAA</h2>
<p>Everything above applies to any small business. What sets healthcare apart is HIPAA.</p>
<p>A breach of unsecured patient information means notifying affected patients without unreasonable delay and no later than 60 days after discovery.[^ecfr-hipaa-breach-notification] Breaches affecting 500 or more people must also be reported to HHS at the same time, and to local media when more than 500 residents of a state are affected.[^ecfr-hipaa-breach-notification] The HHS Office for Civil Rights (OCR) investigates every reported breach affecting 500 or more people and lists reported breaches on its public breach portal.[^hhs-ocr-breach-portal]</p>
<p>Civil penalties are tiered by how culpable a practice was. Under the 2025 inflation adjustment, they start at $145 per violation, and the highest yearly cap for violations of the same requirement is $2,190,294.[^ecfr-hipaa-penalties]</p>
<p>The HIPAA Security Rule requires administrative, physical and technical safeguards for electronic patient information, starting with a risk analysis. Many controls on this page map directly to it.</p>
<p>In January 2025, HHS proposed requiring encryption and MFA with limited exceptions, dropping the "addressable" label that HHS says some organizations misread as optional, and requiring a written inventory of technology assets.[^hhs-hipaa-security-nprm-2025] As of October 2026 that rule is not final, and its target date is July 2027.[^reginfo-hipaa-security-2026] Practices that adopt MFA and encryption now won't need to scramble if it lands.</p>

<h2>Take the next step</h2>
<p>This page gives you the picture. Our free Quick Check shows where your practice stands against each of these threats, including how your team uses AI tools.</p>`,
  faqs: [
    {
      question: "Can my staff use ChatGPT or other AI chatbots with patient information?",
      answer:
        "Only in a tool your practice has approved and whose maker has signed a business associate agreement with you, set up the way that agreement requires. Personal chatbot accounts are never the place for patient information. HHS has also said practices should include AI tools that touch patient data in their HIPAA risk analysis, so write down which tools are allowed and what may go into them.",
    },
    {
      question: "Do small medical practices actually get hacked?",
      answer:
        "Yes. In the FBI's most recent annual report, healthcare drew more ransomware complaints than any other critical infrastructure sector. Attackers usually aren't after you by name; they look for any organization with valuable data and thin defenses, and small practices often fit that profile.",
    },
    {
      question: "Someone called saying they're from IT and need to reset my MFA. What should I do?",
      answer:
        "Hang up and call your IT provider back on the number you already have for them. Never reset a password, enroll a new MFA device, or change payment details based only on an incoming call, email or video request, even if the voice sounds familiar. AI can now copy voices and faces convincingly.",
    },
    {
      question: "Is the new HIPAA Security Rule in effect?",
      answer:
        "No. HHS proposed major updates in January 2025, including required MFA and encryption, but as of October 2026 they have not been finalized and the federal regulatory agenda targets July 2027. The current Security Rule still applies, and it already requires a risk analysis and reasonable safeguards.",
    },
    {
      question: "What is the first thing I should do after reading this?",
      answer:
        "Turn on multi-factor authentication for every email account today. It takes a few minutes per account and means a stolen password is no longer enough to get in. Then agree on a callback rule for payment and password requests, and take our free Quick Check to see where your practice stands.",
    },
  ],
  sourceIds: [
    "fbi-ic3-2025",
    "fbi-psa-genai-fraud-2024",
    "verizon-dbir-2026-exec-summary",
    "verizon-dbir-2026-healthcare",
    "ibm-breach-cost-2026",
    "therecord-change-healthcare-ransom-2024",
    "techtarget-change-healthcare-count-2025",
    "hhs-hipaa-security-nprm-2025",
    "reginfo-hipaa-security-2026",
    "ecfr-hipaa-business-associates",
    "ecfr-hipaa-breach-notification",
    "ecfr-hipaa-penalties",
    "ecfr-hhs-1557-decision-support",
    "hhs-ocr-breach-portal",
  ],
  related: {
    threats: ["voice-cloning-and-deepfake-scams", "ai-powered-phishing-and-bec", "ai-chatbot-data-leaks"],
    guides: ["one-page-ai-use-rule-for-your-team", "two-channel-verification-for-payments", "digital-hygiene-for-your-business"],
    explainers: [],
    controls: [
      "multi-factor-authentication",
      "data-backup",
      "backup-testing",
      "patch-management",
      "endpoint-protection",
      "security-training",
      "email-filtering",
      "email-authentication",
      "access-control-policy",
      "employee-offboarding",
      "device-encryption",
      "vendor-risk-management",
      "vendor-agreements",
      "incident-response-plan",
      "ai-acceptable-use",
      "out-of-band-verification",
    ],
    glossary: ["ransomware", "deepfake", "voice-cloning", "shadow-ai", "social-engineering"],
    toolkit: [],
  },
  ctaText: "Start the free Quick Check",
  ctaLink: "/tools/cyber-audit",
}

export default healthcare
