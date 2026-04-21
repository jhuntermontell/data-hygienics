// Threat library entries for /threats/* pages.
// Control references use slugs from lib/controls.js where a match exists.
// The following referenced controls have no matching slug and are left as plain text:
//   Audit Logging, Removable Media Controls, Business Continuity Planning,
//   Financial Controls, Data Loss Prevention.

const healthcare = {
  slug: "healthcare",
  title: "Cybersecurity Threats for Healthcare Practices",
  metaTitle: "Cybersecurity Threats for Healthcare Practices | Data Hygienics",
  metaDescription:
    "Ransomware, phishing, insider threats, and vendor risk explained for medical practices, dental offices, and behavioral health clinics.",
  lastReviewed: "2026-04",
  datePublished: "2026-04-08",
  industry: "Healthcare",
  industryDescription:
    "Ransomware, phishing, insider threats, and vendor risk explained for medical practices, dental offices, and behavioral health clinics.",
  tldr: "Small medical and dental practices are targeted more often than hospitals because they hold the same valuable data with a fraction of the defenses. The FBI received 238 ransomware complaints from healthcare organizations in 2024, and the Verizon DBIR found ransomware present in 88% of breaches involving small and mid-sized businesses. This page covers the threats that actually hit practices your size, in the order they are most likely to cause damage, with authoritative explanations of how each one works and how to stop it.",
  content: `<h2>Why Healthcare Is a Target</h2>
<p>There is a insistent belief among small practice owners that attackers only go after hospitals and health systems. That belief is wrong, and it is dangerous.</p>
<p>Attackers target small practices for the same reason burglars prefer houses without alarm systems or large dogs. A five-physician orthopedic group and a 400-bed hospital hold the same type of data: Social Security numbers, insurance billing records, dates of birth, diagnostic codes, and payment information. A complete medical record sells for more on the dark web than a credit card number because a credit card can be canceled in minutes, but a medical identity can be exploited for years. The difference is that the hospital has a security operations center, a CISO, and a seven-figure security budget. The orthopedic group has an overworked office manager who also juggles IT.</p>
<p>The numbers bear this out. The FBI's Internet Crime Complaint Center received 238 ransomware complaints and 206 data breach reports from healthcare and public health sector organizations in 2024 alone. The Verizon 2025 Data Breach Investigations Report analyzed 1,710 security incidents and 1,542 confirmed breaches in healthcare, with 67% attributed to external attackers and 30% to insiders. The financial motive drove 90% of attacks. And the one finding that should keep every practice administrator awake is that ransomware was present in 88% of breaches at small and mid-sized businesses across all industries. Healthcare SMBs are no exception to that trend.</p>
<p>If you run a medical practice, dental office, behavioral health clinic, physical therapy group, or any organization that touches protected health information, you are a target. It's not because someone is specifically after you, it's because you fit a profile that works.</p>

<h2>Threat #1: Ransomware</h2>
<h3>What It Is</h3>
<p>Ransomware is software that encrypts your files so you cannot access them, then demands payment (usually in cryptocurrency) to unlock them. In a medical practice, this typically means your EHR goes dark, your scheduling system stops, your billing freezes, and your staff cannot access patient records. You are functionally shut down.</p>
<h3>What It Looks Like When It Happens</h3>
<p>Here is a scenario that plays out regularly and is closer to reality than most practice owners realize.</p>
<p>It is a Tuesday morning at a four-provider family medicine practice. The front desk opens the EHR and an error pops up. The practice manager tries from her workstation and gets the same thing. Someone walks back to the server closet and finds a text file on the screen: "Your files have been encrypted. Pay 4.5 Bitcoin to the following address within 72 hours or your data will be published." That is roughly $350,000 at current prices. The practice has 11 employees, annual revenue around $2 million, and no incident response plan.</p>
<p>What happens next is worse than the ransom itself. Patients cannot be seen because the practice cannot access their records, medication lists, or allergy information. Appointments for the day are canceled. The practice manager calls their IT person, who says he has never dealt with ransomware before. Someone suggests calling the FBI. Someone else suggests just paying. Nobody knows which option is right.</p>
<p>I have seen variations of this scenario at practices ranging from medical device companies to mid-sized specialty groups. The attackers do not care about your specialty. They care that you will pay because you cannot function without your data.</p>
<h3>How It Gets In</h3>
<p>Ransomware enters healthcare practices through a handful of predictable paths:</p>
<p><strong>Phishing emails</strong> are the most common. An employee clicks a link or opens an attachment that installs malware. The malware sits quietly for days or weeks, mapping the network and identifying backup locations, before deploying the encryption payload. This delay is deliberate. The attackers want to make sure your backups are compromised before they lock you out.</p>
<p><strong>Remote Desktop Protocol (RDP) exposed to the internet</strong> is the second most common. If your IT setup allows remote access to workstations or servers through RDP without a VPN and MFA, you are leaving a door open that automated scanning tools find in minutes. During COVID, many practices set up remote access quickly and haven't looked back since.</p>
<p><strong>Unpatched VPN appliances and edge devices</strong> accounted for a growing share of attacks in 2024. The Verizon DBIR found that exploitation of vulnerabilities surged 34%, with zero-day attacks on VPNs and edge devices making up 22% of all vulnerability exploitation, up from 3% the year before. If your practice uses a firewall or VPN appliance that has not been updated in the last 90 days, this is your risk.</p>
<h3>What It Costs</h3>
<p>The median ransom payment dropped to $115,000 in 2024 according to the Verizon DBIR, and 64% of victims did not pay. But the ransom is not the real cost. The real cost is the downtime, the HIPAA breach notification process, the lost patients, and the potential OCR investigation.</p>
<p>A small practice that is offline for two weeks loses revenue, pays for emergency IT services, potentially pays for credit monitoring for affected patients, and faces the administrative burden of notifying HHS and every affected individual. The Change Healthcare ransomware attack in 2024 disrupted claims processing for thousands of practices nationwide, and the eventual ransom payment was $22 million. Your practice does not need to be the direct target to feel the impact of a healthcare ransomware event.</p>
<h3>What Stops It</h3>
<p>These aren't aspirational recommendations, but tested controls that actually prevent ransomware from succeeding:</p>
<p><strong>Offline backups tested monthly.</strong> Your backups need to be disconnected from your network so ransomware cannot encrypt them. And you need to test restoring from them regularly. A backup you have never tested is not a backup. It is a hope and hope is not a strategy. (See: <a href="/controls/data-backup">Data Backup and Recovery</a> in the Controls Library)</p>
<p><strong>MFA on every account</strong> that accesses your systems remotely. This includes your EHR, your email, your VPN, and any remote desktop connections. MFA stops the credential theft that precedes most ransomware deployments. (See: <a href="/controls/multi-factor-authentication">Multi-Factor Authentication</a> in the Controls Library)</p>
<p><strong>Patch your edge devices.</strong> Your firewall, VPN appliance, and any internet-facing equipment need to be updated within 48 hours of a critical patch release. If your IT provider does not do this automatically, ask them why. (See: <a href="/controls/patch-management">Patch Management</a> in the Controls Library)</p>
<p><strong>Endpoint detection and response (EDR) on every workstation.</strong> Traditional antivirus is not sufficient anymore. Modern EDR tools monitor behavior and establish a user's baseline to better detect ransomware deployment in progress, often stopping encryption before it completes. (See: <a href="/controls/endpoint-protection">Endpoint Protection</a> in the Controls Library)</p>
<h3>What Your Insurance Carrier Will Ask</h3>
<p>Every cyber insurance application for a healthcare practice will ask whether you have MFA enabled for remote access, whether you maintain offline backups, whether you have an incident response plan, and whether you use EDR. If the answer to any of these is no, you will either be denied coverage or your premium will reflect the risk. Carriers are rejecting approximately 41% of first-time SMB applications, and the most common reason is a missing MFA or EDR control.</p>

<h2>Threat #2: Phishing</h2>
<h3>What It Is</h3>
<p>Phishing is a fraudulent message, almost always an email, designed to trick someone into clicking a link, opening an attachment, or providing credentials. It is the most reported crime to the FBI, with 193,407 complaints in 2024, more than double the next category.</p>
<h3>What It Looks Like in Healthcare</h3>
<p>In a medical practice, phishing attacks tend to target three roles: the billing coordinator, the practice manager, and the physician.</p>
<p>The billing coordinator gets an email that appears to be from a major insurance payer with an "updated remittance advice" attached as a PDF. The PDF either contains malware or links to a credential harvesting page that mimics the payer's login portal. Once the attacker has the billing coordinator's credentials, they can access the payer portal, redirect payments, or use that foothold to move deeper into the practice's network.</p>
<p>The practice manager gets an email that appears to be from the EHR vendor about a mandatory security update. The link goes to a page that looks identical to the EHR login screen. The practice manager enters her credentials, which now belong to the attacker.</p>
<p>The physician gets an email from what appears to be a colleague at a referring practice, with a shared patient document attached. The attachment is a weaponized Word file.</p>
<p>I worked with a practice where the billing manager received an email that looked exactly like a routine Availity login notification. She entered her credentials on the spoofed page. Within a few hours, the attacker had submitted three weeks of claims to a different bank account. The practice did not discover the redirection for 22 days. The total loss was over $40,000, and the insurance payer took the position that the practice was responsible because the compromise originated on their end.</p>
<h3>How It Gets In</h3>
<p>Phishing works because it exploits trust and routine. A billing coordinator who processes insurance remittances every day is not going to scrutinize every email from Humana. A practice manager who gets regular emails from the EHR vendor is not going to hover over every link to check the URL. Attackers know this and design their messages to blend into the daily workflow.</p>
<p>The technical defenses matter (email filtering, DMARC, SPF records), but the human element is where phishing succeeds or fails. The 2025 Verizon DBIR found that 60% of people who fell for phishing emails clicked within the first hour of receiving them, and the median time to click was under 30 seconds. People are not failing because they are careless. They are failing because the emails are good and the pace of a medical office does not allow for careful inspection of every message.</p>
<h3>What Stops It</h3>
<p><strong>Security awareness training that is specific to your practice.</strong> Generic "don't click suspicious links" training does not work. Training that shows your billing staff a fake Compass login page, or your front desk a fake patient portal notification, works. Run simulated phishing tests quarterly. (See: <a href="/controls/security-training">Security Awareness Training</a> in the Controls Library)</p>
<p><strong>Email filtering with attachment sandboxing.</strong> Your email provider should be scanning attachments in a virtual environment before delivering them. The best at this is Mimecast, but Google Workspace and Microsoft 365 both offer this on higher-tier plans. (See: <a href="/controls/email-filtering">Email Security</a> in the Controls Library)</p>
<p><strong>DMARC, SPF, and DKIM configured on your domain.</strong> These email authentication protocols prevent attackers from sending emails that appear to come from your practice's domain. If you have not configured these, someone can send an email that appears to be from your office to your patients, your payers, or your staff. (See: <a href="/controls/email-authentication">Email Security</a> in the Controls Library)</p>
<h3>What Your Insurance Carrier Will Ask</h3>
<p>Carriers will ask whether you conduct security awareness training, how frequently, and whether you run simulated phishing campaigns. They will also ask whether you have MFA on your email accounts. A practice that answers "no" to both is telling the carrier that the most common attack vector in cybercrime has a clear path into the organization.</p>

<h2>Threat #3: Insider Threat</h2>
<h3>What It Is</h3>
<p>An insider threat is a security risk that comes from within the organization. It can be malicious (a disgruntled employee stealing patient data) or accidental (a well-meaning staff member emailing a spreadsheet of patient information to the wrong address). In healthcare, both types create HIPAA exposure.</p>
<h3>What It Looks Like in Healthcare</h3>
<p>The Verizon DBIR attributed 30% of healthcare breaches to insiders, which is significantly higher than most other industries. This is not because healthcare employees are inherently less trustworthy, it's because healthcare workflows require broad access to sensitive data, and the controls around that access are often weak.</p>
<p>Here is one I read about that sticks with me. A specialty practice had a medical records clerk who had been with the practice for nine years. She was trusted, well-liked, and had access to every patient record in the system. After a dispute with management over scheduling, she downloaded a spreadsheet containing the names, dates of birth, Social Security numbers, and insurance information of approximately 3,200 patients onto a personal USB drive. She did not do anything with the data immediately. The practice discovered the download six weeks later during a routine access log review that their new compliance officer had implemented. By then, the employee had resigned.</p>
<p>The practice had to notify 3,200 patients, report the breach to HHS, and deal with the reputational fallout in a small community where word travels fast. The entire incident could have been prevented with USB port restrictions and a data loss prevention policy.</p>
<p>The accidental version is more common and almost as costly. A front desk employee emails a patient's insurance verification form to the wrong fax-to-email address. A medical assistant forwards a lab result to a patient's family member without confirming authorization. A billing coordinator uploads a batch file to a shared Dropbox folder that a former contractor still has access to. None of these people intended to cause a breach, yet all of them did.</p>
<h3>What Stops It</h3>
<p><strong>Role-based access controls in your EHR.</strong> Every staff member should have access to only the patient records they need for their specific job function. The front desk does not need access to clinical notes. The billing department does not need access to psychotherapy notes. Configure your EHR permissions to enforce this. (See: <a href="/controls/access-control-policy">Access Control Management</a> in the Controls Library)</p>
<p><strong>Audit logging reviewed monthly.</strong> Your EHR should log every access to every patient record. Someone should be reviewing those logs for anomalies: after-hours access, bulk record views, access to records of patients not on the schedule. (See: Audit Logging in the Controls Library)</p>
<p><strong>Offboarding procedures that actually work.</strong> When an employee leaves, their access to the EHR, email, payer portals, and any shared drives should be terminated the same day. Not the same week. The same day. I have seen practices where former employees retained access to patient records for months after departure because nobody updated the credentials. (See: <a href="/controls/employee-offboarding">Account Management</a> in the Controls Library)</p>
<p><strong>USB and removable media restrictions.</strong> Most modern endpoint management tools can disable USB ports or restrict them to approved devices. For a medical practice, there is rarely a legitimate reason for an employee to copy patient data to a personal USB drive. (See: Removable Media Controls in the Controls Library)</p>

<h2>Threat #4: Vendor and Third-Party Risk</h2>
<h3>What It Is</h3>
<p>Vendor risk is the security exposure that comes from the other companies your practice depends on: your EHR vendor, your billing clearinghouse, your IT managed service provider, your cloud storage provider, your shredding company. If any of these vendors is compromised, your patient data may be exposed even though your own systems were never breached.</p>
<h3>What It Looks Like in Healthcare</h3>
<p>The 2025 Verizon DBIR found that third-party involvement in breaches doubled year over year, from 15% to 30%. In healthcare, this trend is especially concerning because the vendor ecosystem is large and the BAA compliance chain is only as strong as its weakest link.</p>
<p>The Change Healthcare ransomware attack in February 2024 is the most visible example. Change Healthcare processes approximately 15 billion healthcare transactions annually, touching an estimated one in three patient records in the United States. When the attack took down their claims processing infrastructure, thousands of practices across the country could not submit claims, receive payments, or verify patient eligibility. Practices that had no direct relationship with Change Healthcare were affected because their clearinghouse or their payer depended on Change Healthcare's systems. The breach exposed the protected health information of approximately 100 million individuals and resulted in a $22 million ransom payment.</p>
<p>Your practice did not need to have weak security for this to hurt you. You just needed to be connected to the healthcare ecosystem, which you are.</p>
<p>On a smaller scale, I have seen practices affected by IT provider compromises where the MSP's remote management tool was breached, giving attackers access to every client the MSP served. One compromised MSP can mean 40 or 50 small practices are exposed simultaneously. The attacker does not need to target each practice individually. They target the one vendor that connects to all of them.</p>
<h3>What Stops It</h3>
<p><strong>Know who has access to your data and under what terms.</strong> Maintain a list of every vendor that touches patient data or has access to your systems. This includes your EHR vendor, your IT provider, your billing service, your cloud storage, and your document shredding company. (See: <a href="/controls/vendor-risk-management">Vendor Risk Management</a> in the Controls Library)</p>
<p><strong>Require a BAA from every vendor that handles PHI.</strong> This is not optional under HIPAA. If a vendor will not sign a BAA, they should not have access to your patient data. Period.</p>
<p><strong>Ask your IT provider how they secure their own systems.</strong> If your MSP uses a remote monitoring and management tool to access your workstations, ask them what MFA they use on that tool, whether they have a SOC 2 report, and what their incident response plan looks like if they are breached. If they cannot answer these questions clearly, that is information you need.</p>
<p><strong>Have a plan for vendor outages.</strong> The Change Healthcare incident proved that even well-run practices can be paralyzed by a vendor failure. Can your practice operate for two weeks if your clearinghouse goes down? If your EHR is cloud-based and the vendor has an outage, do you have paper-based fallback procedures? (See: Business Continuity Planning in the Controls Library)</p>

<h2>Threat #5: Business Email Compromise (BEC)</h2>
<h3>What It Is</h3>
<p>BEC is a targeted attack where an attacker impersonates a trusted person, usually via email, to trick someone into sending money or sensitive information. Unlike phishing, which casts a wide net, BEC is researched and specific. The attacker knows who the practice manager is, who the physicians are, and how the practice communicates.</p>
<h3>What It Looks Like in Healthcare</h3>
<p>BEC caused $2.77 billion in losses in 2024 according to the FBI. In healthcare, BEC typically targets the person who handles accounts payable.</p>
<p>The attack often starts with a compromised email account, either yours or someone you work with. The attacker monitors email conversations to understand payment patterns, vendor relationships, and communication style. When the timing is right, they insert themselves into a thread and redirect a payment.</p>
<p>For a medical practice, this might look like an email from what appears to be your medical equipment supplier with "updated bank information for future payments." The email thread looks legitimate because it was extracted from a real conversation. The practice manager updates the payment information and sends next month's lease payment to an account controlled by the attacker.</p>
<p>In another common scenario, the attacker compromises a physician's email account and sends a request to the practice manager: "I need you to process a wire transfer for a conference registration. Here is the payment information. Please handle this today, I am in clinic and cannot do it myself." The practice manager knows the physician is in clinic and cannot be interrupted so she processes the payment without a second thought.</p>
<h3>What Stops It</h3>
<p><strong>Verification procedures for any payment change or wire transfer.</strong> Any request to change payment information for a vendor, and any wire transfer request, should be verified by a phone call to a known number (not the number in the email). This is a policy, not a technology. You have to write it down, present it, and enforce it. (See: Financial Controls in the Controls Library)</p>
<p><strong>MFA on all email accounts.</strong> If an attacker cannot get into your email, they cannot monitor your conversations, extract vendor information, or impersonate you. This is the single most effective technical control against BEC.</p>
<p><strong>Email forwarding rules reviewed regularly.</strong> Attackers who compromise an email account often set up forwarding rules that send copies of all incoming mail to an external address. Check your email forwarding rules monthly. (See: <a href="/controls/email-filtering">Email Security</a> in the Controls Library)</p>

<h2>How Healthcare Is Different: The Regulatory Context</h2>
<p>Everything above applies to businesses in every industry. What makes healthcare different is HIPAA.</p>
<p>When a law firm has a data breach, they face reputational damage, potential malpractice claims, and client attrition. When a medical practice has a data breach involving PHI, they face all of that plus mandatory breach notification to HHS and every affected individual, potential investigation by the Office for Civil Rights, and civil monetary penalties that range from $100 to $50,000 per violation, with an annual maximum of $2,067,813 per violation category.</p>
<p>The HIPAA Security Rule requires administrative, physical, and technical safeguards for electronic PHI. Most of the controls described on this page are either explicitly required or strongly implied by the Security Rule. Implementing them is not just good security practice. It is a legal obligation.</p>
<p>The proposed January 2025 HIPAA Security Rule changes would eliminate the "addressable" designation for several controls (including encryption and MFA), making them mandatory rather than risk-dependent. If those changes are finalized, practices that have been treating MFA and encryption as optional will need to comply or face enforcement.</p>
<p>For a plain-English walkthrough of what HIPAA requires from your practice, see our HIPAA Compliance Checklist.</p>

<h2>Take the Next Step</h2>
<p>This page gives you the picture. Our free cybersecurity assessment tells you where your practice specifically stands against each of these threats.</p>`,
  faqs: [
    {
      question: "Do small medical practices actually get hacked?",
      answer:
        "Yes. The FBI received 238 ransomware complaints from healthcare organizations in 2024. The Verizon DBIR documented 1,542 confirmed healthcare breaches. Small practices are targeted more frequently than large health systems because they have weaker defenses and the same valuable data.",
    },
    {
      question: "What is the average cost of a healthcare data breach?",
      answer:
        "According to IBM's Cost of a Data Breach Report, the average cost of a healthcare data breach has exceeded $9 million for the past several years, the highest of any industry. For a small practice, the costs are lower in absolute terms but often higher relative to revenue, and can include breach notification, credit monitoring, legal fees, OCR fines, and lost patients.",
    },
    {
      question: "Does my practice need cyber insurance?",
      answer:
        "If your practice stores or processes PHI electronically, then absolutely. Cyber insurance covers breach notification costs, legal defense, regulatory fines (in some policies), business interruption losses, and ransom payments. Without it, a single ransomware event or data breach can be an existential financial event for a small practice.",
    },
    {
      question: "What is the first thing I should do after reading this?",
      answer:
        "Enable MFA on your email accounts today. It takes less than 10 minutes per account and blocks the most common attack vector for phishing, BEC, and credential theft. Then take our free cybersecurity assessment to see where your practice stands across all these threat categories.",
    },
    {
      question: "What does HIPAA actually require for cybersecurity?",
      answer:
        "The HIPAA Security Rule requires a risk assessment, access controls, audit controls, integrity controls, and transmission security for electronic PHI. It does not prescribe specific products or vendors, but it does require that you evaluate your risks and implement reasonable and appropriate safeguards. Our HIPAA Compliance Checklist breaks down each requirement in plain English.",
    },
  ],
  sources: [
    "FBI Internet Crime Complaint Center 2024 Annual Report",
    "Verizon 2025 Data Breach Investigations Report",
    "IBM Cost of a Data Breach Report 2024",
    "HHS Office for Civil Rights Breach Portal",
  ],
  ctaText: "Start Your Free Assessment",
  ctaLink: "/tools/cyber-audit",
};

const legal = {
  slug: "legal",
  title: "Cybersecurity Threats for Law Firms",
  metaTitle: "Cybersecurity Threats for Law Firms | Data Hygienics",
  metaDescription:
    "BEC, ransomware, phishing, and insider threats explained for small and mid-sized law firms, with ABA ethics context.",
  lastReviewed: "2026-04",
  datePublished: "2026-04-08",
  industry: "Legal",
  industryDescription:
    "BEC, ransomware, phishing, and insider threats explained for small and mid-sized law firms, with ABA ethics context.",
  tldr: "Law firms are the fourth most targeted industry by cybercriminals, and attacks nearly doubled in 2025 according to BakerHostetler's incident response data. The threats that hit firms hardest are business email compromise (particularly in real estate transactions), ransomware, and phishing. Your ethical duty to protect client data under ABA Model Rule 1.6 is not just a professional standard, but a cybersecurity imperative, and state bars are starting to treat it that way.",
  content: `<h2>Why Law Firms Are a Target</h2>
<p>If you run a small or mid-sized law firm, there is a good chance you think of cybersecurity as something that happens to big corporations. That very assumption puts your firm and your license at risk.</p>
<p>Law firms are enticing targets for a specific reason that does not apply to most other small businesses: you hold other people's most sensitive information, and you move their money. A three-attorney personal injury firm has settlement funds in trust. A five-person real estate practice handles escrow accounts with six-figure wire transfers on a weekly basis. A solo family law practitioner has custody agreements, financial disclosures, and Social Security numbers for whole families sitting in their case files and it's as good as gold on the dark web.</p>
<p>The 2024 ABA Cybersecurity Tech Report found that 36% of law firms experienced a security incident in the prior year. The average cost of a data breach for law firms in 2024 was $5.08 million, a 10% increase from the previous year. And 2024 set a record with 45 confirmed ransomware attacks on law firms, compromising more than 1.5 million records.</p>
<p>But here is the number that should reframe how you think about this: BakerHostetler, one of the largest law firms specializing in incident response, reported handling more than 1,250 cyber incidents in 2025, and law firm incidents specifically nearly doubled from the previous year. A threat group known interchangeably as Chatty Spider, Silent Ransomware, or Luna Moth emerged in 2025 and specifically targeted law firms by calling attorneys directly, posing as IT support, gaining remote access to their machines, and exfiltrating client files before issuing ransom demands. The demands ranged from $500,000 to $21 million.</p>
<p>This is not a hypothetical. This is what is happening right now to firms your size.</p>

<h2>Threat #1: Business Email Compromise (BEC)</h2>
<h3>What It Is</h3>
<p>BEC is a targeted attack where someone impersonates a trusted person via email to redirect money or extract sensitive information. The FBI documented $2.77 billion in BEC losses in 2024 across 21,442 complaints. Unlike spray-and-pray phishing, BEC is well researched, exceedingly patient, and highly specific. The attacker knows who you are, who your clients are, and when money is supposed to move.</p>
<h3>What It Looks Like at a Law Firm</h3>
<p>BEC hits law firms harder than almost any other business type because law firms sit at the intersection of large wire transfers, deadline pressure, and trusted professional relationships. Competent attackers exploit all three.</p>
<p>The most common scenario involves real estate closings. An attacker compromises the email account of someone in the transaction chain: the buyer's agent, the title company, or the attorney's office. They monitor the email thread, watching for the closing date and the moment wire instructions are sent. When that moment arrives, the attacker intercepts the legitimate wire instructions and replaces them with their own. The buyer, who is already stressed about making a deadline, wires their down payment or purchase funds to an account controlled by the attacker. In 2024, the FBI received 9,359 real estate and rental fraud complaints with losses exceeding $173 million. Seventeen percent of title companies reported sending client funds to fraudulent accounts.</p>
<p>I worked with a real estate attorney in Southwest Florida whose paralegal received what appeared to be updated wire instructions from a title company they had worked with on dozens of closings. The email address was one letter off from the real one. The paralegal processed a $300,000 wire to the fraudulent account. By the time the error was discovered the next morning, the money had been moved through two intermediary accounts and was gone. They called the FBI, but at this stage, nothing could be done. The attorney's malpractice carrier covered a portion of the loss, but the client relationship was destroyed, and the firm spent the next six months dealing with a state bar grievance.</p>
<p>Beyond real estate, BEC targets firms through the managing partner impersonation play. The attacker spoofs the managing partner's email and sends a message to the bookkeeper or office manager: "I need you to process a wire for a settlement payment. Details attached. Handle this before end of day, I'm in depositions." The tone is authoritative and urgent. The request is plausible. The bookkeeper processes it.</p>
<h3>How It Gets In</h3>
<p>BEC almost always starts with a compromised email account, either yours or someone you correspond with. The attacker gains access through phishing (a fake login page), credential stuffing (reusing a password from a previous breach), or by purchasing stolen credentials from a dark web marketplace. Once inside, they do not act immediately. They sit in the inbox, reading emails, learning communication patterns, identifying upcoming transactions, and waiting for the right moment to intervene.</p>
<h3>What Stops It</h3>
<p><strong>A verbal verification policy for every wire transfer, no exceptions.</strong> Before your firm sends or receives wire instructions, someone must call a verified phone number (not a number from the email in question) and confirm the instructions with a live human being. This policy needs to be written, posted, talked about, and ruthlessly enforced with the same seriousness as conflict checks. (See: Financial Controls in the Controls Library)</p>
<p><strong>MFA on every email account at the firm.</strong> If an attacker cannot get into your email, they cannot monitor your transactions. This is the single most impactful technical control against BEC. Every attorney, paralegal, legal assistant, and administrative staff member needs MFA on their email. No exceptions for partners who find it inconvenient. (See: <a href="/controls/multi-factor-authentication">Multi-Factor Authentication</a> in the Controls Library)</p>
<p><strong>Email forwarding rule audits.</strong> Attackers who compromise a mailbox often set up a forwarding rule that copies all incoming mail to an external address. This lets them maintain access even after a password change. Check forwarding rules on all firm email accounts monthly. (See: <a href="/controls/email-filtering">Email Security</a> in the Controls Library)</p>
<p><strong>Dual authorization for trust account disbursements.</strong> No single person should be able to initiate and approve a wire transfer from your trust account. Two people, two approvals, every time.</p>
<h3>What Your Insurance Carrier Will Ask</h3>
<p>Cyber insurance applications for law firms will ask specifically about wire transfer verification procedures, MFA on email, and whether you have dual authorization for trust account transactions. If you handle real estate closings or settlement disbursements and cannot document these controls, your application will face scrutiny. Some carriers now require written wire verification policies as a condition of coverage.</p>

<h2>Threat #2: Ransomware</h2>
<h3>What It Is</h3>
<p>Ransomware encrypts your files and demands payment to restore access. For law firms, this means case files, client documents, billing records, and your practice management system are all locked simultaneously. Many ransomware groups now use double extortion: they steal your data before encrypting it and threaten to publish client files on the dark web if you do not pay.</p>
<h3>What It Looks Like at a Law Firm</h3>
<p>The double extortion model is particularly devastating for law firms because of client confidentiality obligations. When an attacker says, "pay us or we publish your client files," they are not just threatening your firm, they are threatening every client whose privileged information is in those files. You now have an ethical obligation under Model Rule 1.6 to notify affected clients, and potentially an obligation to notify courts if ongoing litigation is affected.</p>
<p>In 2024, ransomware attacks on law firms hit a record of 45 confirmed incidents. The BakerHostetler DSIR reported that the average initial ransom demand for law firms and professional services was just under $2 million, with the average amount actually paid landing around $450,000 and the highest payout reaching $1.9 million.</p>
<p>The Chatty Spider threat group, which emerged in 2025, demonstrated a particularly effective method. A member of the group would call an attorney directly, claim to be from the firm's IT department, and request remote access to the attorney's machine for a "security update." Once connected, they would exfiltrate as many files as possible before issuing the ransom demand. No malware installation, no phishing email, no technical exploit. Just a phone call and a plausible story. This approach bypassed every email filter and endpoint protection tool because it exploited trust rather than technology.</p>
<p>I met with a managing partner at a small litigation firm who had been using the same password across multiple websites for years. The password appeared in a data breach from an unrelated site, an attacker used it to access the firm's remote desktop server (which had no MFA), and deployed ransomware on a Saturday night. By Monday morning, every workstation and the file server were encrypted. The firm had backups, but the backups were stored on the same network and were encrypted too. They paid $85,000 in Bitcoin because they had a trial starting in three weeks and could not access their case files.</p>
<h3>How It Gets In</h3>
<p>For law firms specifically, the entry points are phishing emails (an attachment that looks like a court filing, a shared document from opposing counsel, or a fake e-filing notification), exposed Remote Desktop Protocol with no MFA, compromised credentials reused from other breaches, and increasingly, social engineering phone calls like the Chatty Spider approach.</p>
<h3>What Stops It</h3>
<p><strong>Offline backups tested quarterly.</strong> Your backups must be disconnected from your network. Test restoring from them regularly. The firm I described above had backups, they just were not the right kind. (See: <a href="/controls/data-backup">Data Backup and Recovery</a> in the Controls Library)</p>
<p><strong>MFA on everything, particularly remote access.</strong> RDP, VPN, practice management software, document management, cloud storage. If it can be accessed remotely, it needs MFA. (See: <a href="/controls/multi-factor-authentication">Multi-Factor Authentication</a> in the Controls Library)</p>
<p><strong>Staff training that includes phone-based social engineering.</strong> The Chatty Spider attacks worked because attorneys are accustomed to following IT instructions without questioning whether the caller is legitimate. Train your staff to verify any request for remote access by calling IT back at a known number. (See: <a href="/controls/security-training">Security Awareness Training</a> in the Controls Library)</p>
<p><strong>An incident response plan that addresses client notification.</strong> If ransomware hits your firm, you need to know within hours who to call: your cyber insurance carrier, your incident response counsel, the FBI (ic3.gov), and potentially every affected client. Having this plan written and accessible (not stored only on the encrypted server) saves critical time. (See: <a href="/controls/incident-response-plan">Incident Response Planning</a> in the Controls Library)</p>
<h3>What Your Insurance Carrier Will Ask</h3>
<p>Carriers will ask about MFA, EDR, offline backups, and whether you have an incident response plan. They will also ask about your RDP exposure. If you have RDP exposed to the internet without MFA and a VPN, many carriers will decline to write the policy.</p>

<h2>Threat #3: Phishing</h2>
<h3>What It Is</h3>
<p>Phishing is a fraudulent message designed to trick someone into clicking a link, opening an attachment, or entering credentials on a fake website. It was the most reported crime to the FBI in 2024 with 193,407 complaints.</p>
<h3>What It Looks Like at a Law Firm</h3>
<p>Law firms face an industry-specific phishing risk that most other businesses do not: GootLoader. This threat uses search engine optimization (SEO) poisoning to place malicious content at the top of search results for legal terms. An attorney or paralegal searching for a specific contract template, a legal precedent, or a court form may find the top result leading to a file infected with malware. The group behind GootLoader has seeded malicious content linked to over 3.5 million search terms, a significant percentage of which are legal terminology.</p>
<p>Beyond GootLoader, the standard phishing scenarios apply. An email that looks like an e-filing notification from the court's CM/ECF system. A shared document that appears to come from opposing counsel. A fake invoice from Westlaw or LexisNexis. A DocuSign notification for a document you are expecting to receive. All of these are common phishing lures targeting law firms specifically.</p>
<p>At a firm I consulted with, an associate received an email that appeared to be a CM/ECF notification for a case she was working on. The link went to a page that looked identical to the PACER login screen. She entered her credentials, which the attacker then used to access the firm's Microsoft 365 environment (because she used the same password). The attacker had access to client emails, case documents and settlement negotiations for six days before anyone noticed.</p>
<h3>What Stops It</h3>
<p><strong>Unique passwords for every service, enforced by a password manager.</strong> The scenario above happened because one reused password gave the attacker access to everything. A solid password manager greatly reduces this risk. (See: <a href="/controls/password-management">Password Management</a> in the Controls Library)</p>
<p><strong>Email filtering that scans attachments and links before delivery.</strong> Both Microsoft 365 Defender and Google Workspace's advanced protection offer attachment sandboxing and URL rewriting. These should be enabled on your firm's email. (See: <a href="/controls/email-filtering">Email Security</a> in the Controls Library)</p>
<p><strong>Simulated phishing tests.</strong> Run them quarterly, using lures that mimic what your firm receives, such as fake CM/ECF notifications, fake DocuSign requests, fake Westlaw invoices. The click rates will drop dramatically after the second round if you take the time to debrief the results with staff rather than just reporting them. (See: <a href="/controls/security-training">Security Awareness Training</a> in the Controls Library)</p>

<h2>Threat #4: Insider Threat</h2>
<h3>What It Is</h3>
<p>An insider threat is a security risk from within the organization: a departing attorney who takes client files, a disgruntled staff member who accesses records they should not, or an honest mistake that exposes confidential information.</p>
<h3>What It Looks Like at a Law Firm</h3>
<p>The departing attorney scenario is the most common insider threat at law firms and is often treated as a business dispute rather than a security incident. An attorney leaves the firm and takes electronic copies of client files, contacts, and work product. Sometimes this is authorized. Often it is not clearly addressed by the partnership agreement. And sometimes the departing attorney takes files for clients they are not entitled to represent.</p>
<p>The more dangerous version involves non-attorney staff. A legal assistant with access to the document management system downloads client files related to a high-profile case, either to sell the information or to use as leverage in a personal dispute. The firm discovers it weeks later when a reporter calls asking about case details that were never made public.</p>
<p>The accidental insider threat is the most common of all. An attorney emails a draft settlement agreement to the wrong email address. A paralegal uploads a confidential exhibit to the wrong matter folder in the DMS. A legal assistant sends a client intake form containing Social Security numbers via unencrypted email. None of these people intended to cause harm, but all of them created a potential breach.</p>
<h3>What Stops It</h3>
<p><strong>Matter-level access controls in your DMS and practice management system.</strong> Not everyone at the firm should have access to every client matter. Configure your systems so that access is limited to the team working on each case. This is not just good security. For firms with potential conflict situations, it is an ethical obligation. (See: <a href="/controls/access-control-policy">Access Control Management</a> in the Controls Library)</p>
<p><strong>Offboarding procedures that include same-day access revocation.</strong> When an attorney or staff member leaves the firm, their access to the DMS, email, practice management system, billing system, and any cloud services should be revoked on their last day. Not the following week, and not when IT gets around to it. (See: <a href="/controls/employee-offboarding">Account Management</a> in the Controls Library)</p>
<p><strong>Data Loss Prevention (DLP) policies on email.</strong> Configure your email system to flag or block outgoing messages that contain Social Security numbers, credit card numbers, or other sensitive patterns. Both Microsoft 365 and Google Workspace offer DLP features on business plans. (See: Data Loss Prevention in the Controls Library)</p>

<h2>Threat #5: Vendor and Third-Party Risk</h2>
<h3>What It Is</h3>
<p>Vendor risk is the security exposure that comes from the companies your firm depends on: your practice management vendor, your IT managed service provider, your cloud storage provider, your e-discovery platform, and your billing software.</p>
<h3>What It Looks Like at a Law Firm</h3>
<p>The managed service provider (MSP) compromise is the scenario that should concern every small firm. Your MSP uses a remote monitoring and management tool to access your workstations and servers. If that tool is compromised, the attacker gains access to every client the MSP serves. One breached MSP can mean 30 or 40 law firms get exposed all at the same time.</p>
<p>CTS, a managed IT service provider to law firms, was breached in November 2023, affecting dozens of firms, particularly in the real estate sector. The incident demonstrated exactly how vendor dependency creates cascading risk across an entire sector.</p>
<p>Third-party involvement in breaches doubled from 15% to 30% in the 2025 Verizon DBIR. For law firms where nearly every operational system involves a third-party vendor, this trend is especially relevant.</p>
<h3>What Stops It</h3>
<p><strong>Ask your IT provider the hard questions.</strong> What MFA do they use on their remote access tools? Do they have a SOC 2 report? What is their incident response plan if they are breached? What notification timeline do they commit to? If they cannot answer clearly, you need to evaluate whether they are the right partner for a firm handling privileged client data. (See: <a href="/controls/vendor-risk-management">Vendor Risk Management</a> in the Controls Library)</p>
<p><strong>Maintain a vendor inventory.</strong> List every vendor that has access to your systems or your client data. Review it annually. Include your practice management vendor, DMS provider, e-discovery platform, IT provider, cloud storage, email hosting, VoIP provider, and shredding service.</p>
<p><strong>Require cyber liability documentation from key vendors.</strong> Your IT provider should carry their own cyber liability insurance. Ask for a certificate of insurance.</p>

<h2>How Law Firms Are Different: The Ethical and Regulatory Context</h2>
<p>The security obligations for law firms extend beyond data protection into professional ethics. ABA Model Rule 1.6(c) requires attorneys to "make reasonable efforts to prevent the inadvertent or unauthorized disclosure of, or unauthorized access to, information relating to the representation of a client." Model Rule 1.1, which addresses competence, has been interpreted by at least 40 state bars to include technological competence.</p>
<p>This means that a failure to implement reasonable cybersecurity measures is not just a business risk, it is potentially a violation of your professional obligations, which can result in disciplinary action, malpractice claims, loss of your license, or all of the above.</p>
<p>Many state bars now issue ethics opinions specifically addressing cybersecurity. If your state bar has published cybersecurity guidance, you should be following it. If they have not, the ABA Formal Opinion 477R on securing client communications and Formal Opinion 483 on obligations after a data breach provide the baseline expectations.</p>
<p>37% of legal clients said they would pay a premium for law firms with stronger cybersecurity measures. That is an ethical argument and a business decision.</p>

<h2>Take the Next Step</h2>
<p>This page gives you the picture. Our free cybersecurity assessment tells you where your firm specifically stands against each of these threats and maps your results to what cyber insurance carriers will ask.</p>`,
  faqs: [
    {
      question: "Do small law firms really get targeted by hackers?",
      answer:
        "Yes. The ABA reports that 36% of all law firms experienced a security incident in the past year, and the rate is higher at mid-sized firms than at solo practices. Attackers target small firms specifically because they handle high-value data and large wire transfers with weaker security than large firms.",
    },
    {
      question: "What is the average cost of a data breach for a law firm?",
      answer:
        "The average cost of a law firm data breach in 2024 was $5.08 million, a 10% increase from the previous year. For smaller firms, the absolute cost may be lower, but the impact relative to revenue is often more severe, and the reputational damage in a local legal community can be career-ending.",
    },
    {
      question: "Does my law firm need cyber insurance?",
      answer:
        "If your firm handles client funds, processes wire transfers, or stores confidential client information electronically (which is every firm), yes. In 2023, 80% of firms had at least one technology insurance policy, but only 34% had an incident response plan. The insurance is only useful if you also have the procedures to respond effectively when something happens.",
    },
    {
      question: "What should I do first after reading this page?",
      answer:
        "Enable MFA on your firm's email accounts today. That single action blocks the most common entry point for BEC, phishing, and credential theft. Then implement a written wire transfer verification policy requiring verbal confirmation on a known number for every disbursement. Those two steps address the two most financially damaging threats to law firms.",
    },
    {
      question: "What are my ethical obligations for cybersecurity as an attorney?",
      answer:
        "ABA Model Rule 1.6(c) requires reasonable efforts to prevent unauthorized access to client information. Model Rule 1.1 has been interpreted to include technological competence. At least 40 state bars have adopted this interpretation. A failure to implement reasonable cybersecurity is potentially an ethics violation, not just a business risk.",
    },
    {
      question: "What is the Chatty Spider / Luna Moth threat?",
      answer:
        "Chatty Spider (also called Silent Ransomware or Luna Moth) is a threat group that specifically targeted law firms in 2025. Their method involved calling attorneys directly, posing as IT support, requesting remote access, and then exfiltrating client files before issuing ransom demands ranging from $500,000 to $21 million. The attack bypasses email filters and endpoint protection because it relies on social engineering over the phone rather than malware.",
    },
  ],
  sources: [
    "FBI Internet Crime Complaint Center 2024 Annual Report",
    "Verizon 2025 Data Breach Investigations Report",
    "ABA 2024 Cybersecurity Tech Report",
    "BakerHostetler 2026 Data Security Incident Response Report",
    "Clio 2024 Legal Trends Report",
    "Integris 2025 Law Firm Cybersecurity Report",
  ],
  ctaText: "Start Your Free Assessment",
  ctaLink: "/tools/cyber-audit",
};

const financial = {
  slug: "financial",
  title: "Cybersecurity Threats for Financial Services",
  metaTitle: "Cybersecurity Threats for Financial Services | Data Hygienics",
  metaDescription:
    "BEC, phishing, ransomware, and regulatory obligations explained for accountants, bookkeepers, tax preparers, and financial advisors.",
  lastReviewed: "2026-04",
  datePublished: "2026-04-08",
  industry: "Financial Services",
  industryDescription:
    "BEC, phishing, ransomware, and regulatory obligations explained for accountants, bookkeepers, tax preparers, and financial advisors.",
  tldr: "If your business prepares tax returns, manages client payroll, handles bookkeeping, advises on investments, or processes any kind of consumer financial data, you may be classified as a financial institution under federal law and subject to the FTC Safeguards Rule whether you know it or not. FTC Safeguards Rule citation: https://www.ftc.gov/business-guidance/privacy-security/safeguards-rule Cyberattacks on accounting firms have surged 300% since 2020. The average cost of a financial services data breach reached $6.08 million in 2024. This page covers the threats most likely to hit your firm and the regulatory obligations most small firms are not meeting.",
  content: `<h2>Why Financial Services Firms Are a Target</h2>
<p>When most people hear "financial services cybersecurity," they think of JPMorgan or Goldman Sachs. That is not who this page is for. This page is for the two-person bookkeeping firm that handles payroll for 30 small businesses. The solo tax preparer who files 400 returns every spring. The independent financial advisor with 150 clients and a home office. The regional CPA firm with four partners and a shared server in the back room.</p>
<p>You are holding the keys to enormous amounts of other people's money and personal information. Every client file in your system contains Social Security numbers, bank account numbers, income details, and tax identification numbers. A single client folder in your practice management software is more valuable to an attacker than a stolen credit card, because credit cards get canceled but tax identities can be exploited for years.</p>
<p>The financial services sector faced the highest average cost of data breaches among all industries in 2024, reaching $6.08 million, 22% above the global average. Cyberattacks on accounting firms have increased 300% since 2020. In 2024, 65% of financial services organizations fell victim to ransomware, with an average recovery cost of $2.73 million. And 23% of all global phishing attacks targeted financial institutions.</p>
<p>The regulatory landscape has caught up to this reality. FTC amended the Safeguards Rule in 2021. Portions became effective in January 2022, and the compliance deadline for certain updated requirements was extended to June 9, 2023. The Rule was expanded with breach notification requirements in 2024 and requires covered financial institutions to maintain a written information security program. FTC's maximum civil penalty amount for certain FTC Act violations is $53,088 per violation (2025 adjustment). <a href="https://www.ftc.gov/business-guidance/privacy-security/safeguards-rule">FTC Safeguards Rule citation</a>.</p>

<h2>Threat #1: Business Email Compromise (BEC)</h2>
<h3>What It Is</h3>
<p>BEC is a targeted email attack where an attacker impersonates a trusted party to redirect money or steal sensitive information. The FBI documented $2.77 billion in BEC losses in 2024. For financial services firms, BEC is the most financially devastating threat because your business literally revolves around moving money on behalf of clients.</p>
<h3>What It Looks Like at a Financial Services Firm</h3>
<p>For an accounting or bookkeeping firm, BEC typically targets the person who processes client payroll or handles accounts payable.</p>
<p>The most common scenario involves payroll redirection. An attacker compromises a client's email account (or spoofs it convincingly) and sends a message to your firm requesting a change to an employee's direct deposit information. The request seems routine. Your bookkeeper updates the direct deposit routing number. The next payroll cycle, that employee's pay goes to an account controlled by the attacker. The employee does not get paid, the client blames your firm, and recovering the funds is extremely difficult because the wire is typically moved within hours.</p>
<p>I have seen this play out at a bookkeeping firm that managed payroll for a dozen small businesses. The attacker sent payroll change requests for one employee at each of three different client companies over a two-week period. Each request came from what appeared to be the client's email address. Each was processed without a verification call because the bookkeeper handled a number of requests like this every month and the clients had never had a problem before. Total loss across the three companies: $25,000. The bookkeeper's firm was held responsible because they had no written verification procedure for payroll changes.</p>
<p>Another common scenario targets tax season. An attacker compromises a tax preparer's email and uses it to send phishing emails to the preparer's entire client list. The email asks clients to "verify their information" through a link that leads to a credential harvesting page. Because the email genuinely comes from the preparer's email address (not a spoofed version), email filters don't always catch it, and clients trust it completely. The attacker now has login credentials for dozens of people who trust their tax preparer with their most sensitive financial information.</p>
<h3>How It Gets In</h3>
<p>BEC in financial services almost always starts with credential theft. An attacker obtains your email password through phishing, credential stuffing (trying passwords leaked from other breaches), or purchasing stolen credentials on the dark web. With 2.8 billion passwords exposed and posted for sale in 2024 alone, the odds that one of your passwords has been compromised are not trivial.</p>
<p>Once inside your email, the attacker studies your communication patterns. They learn which clients send payroll changes, which vendors your firm pays, and when tax season deadlines create urgency. Then they act at the moment when a rushed, routine request is least likely to trigger suspicion.</p>
<h3>What Stops It</h3>
<p><strong>Verbal verification for every payroll change and every payment redirection.</strong> Call the client at a known phone number (not the one in the email) to confirm any request to change direct deposit information, payment routing, or vendor bank details. Write this into your firm's procedures and follow it every time. (See: Financial Controls in the Controls Library)</p>
<p><strong>MFA on every email account and every client-facing portal.</strong> This is the single most effective control. If an attacker cannot get into your email, they cannot monitor your client communications, impersonate you, or redirect payments. Every person at your firm needs MFA on their email, their accounting software, their tax preparation platform, and any portal where client data is accessible. (See: <a href="/controls/multi-factor-authentication">Multi-Factor Authentication</a> in the Controls Library)</p>
<p><strong>Email forwarding rule audits.</strong> Attackers who compromise your email set up forwarding rules that silently copy every incoming message to an external address. Check forwarding rules on all firm email accounts monthly. In Microsoft 365, go to Exchange Admin Center and review transport rules. In Google Workspace, check Routing settings in the admin console. (See: <a href="/controls/email-filtering">Email Security</a> in the Controls Library)</p>
<h3>What Your Insurance Carrier Will Ask</h3>
<p>Carriers will ask specifically about your payroll change verification procedures, MFA on email, and whether you have dual authorization for outgoing payments. If your firm processes payroll for clients and cannot demonstrate a documented verification process, underwriters will flag the application.</p>

<h2>Threat #2: Phishing and Credential Theft</h2>
<h3>What It Is</h3>
<p>Phishing is a fraudulent message designed to trick someone into entering credentials on a fake website, clicking a malicious link, or opening an infected attachment. For financial services firms, phishing is both a direct threat (attackers steal your credentials) and the precursor to almost every other attack on this page.</p>
<h3>What It Looks Like at a Financial Services Firm</h3>
<p>Tax season is prime hunting season for attackers targeting financial services firms. The IRS has repeatedly warned tax professionals about phishing campaigns that impersonate the IRS, e-filing platforms, and tax software vendors. These campaigns spike between January and April and target preparers specifically because a compromised preparer gives the attacker access to hundreds of client returns.</p>
<p>A phishing email arrives that appears to be from your e-filing software with a "mandatory security update." The link goes to a login page that looks identical to the real thing. You enter your credentials and the attacker now has access to your tax preparation software, your client list, and potentially the ability to file fraudulent returns using real client data.</p>
<p>Beyond tax season, financial services firms face year-round phishing through fake QuickBooks notifications, fake banking portal alerts, and fake document sharing requests from what appear to be clients. The IRS has documented cases where attackers used stolen preparer credentials to file fraudulent returns and redirect refunds, affecting hundreds of taxpayers from a single compromised firm.</p>
<p>I once consulted with a small CPA firm where a staff accountant clicked on a fake Intuit notification during tax season. The attacker used the stolen credentials to access the firm's QuickBooks Online account and exported three years of client financial data, including Social Security numbers, bank account numbers, and income figures for over 500 clients. The firm had to notify every affected client, file a report with the FTC because they exceeded the 500-consumer threshold under the Safeguards Rule, and spend the next year dealing with the fallout. <a href="https://www.ftc.gov/business-guidance/privacy-security/safeguards-rule">FTC Safeguards Rule citation</a>. Two of their largest clients left immediately. The firm's professional liability insurance covered some costs, but the reputational damage in a small market was lasting.</p>
<h3>How It Gets In</h3>
<p>Phishing in financial services exploits two things: the volume of legitimate platform notifications your firm receives daily, and the seasonal pressure of deadlines. During tax season, a preparer might receive genuine emails from the IRS, their e-filing platform, their tax software vendor, their document portal, and multiple clients, all in a single hour. Distinguishing a well-crafted fake from the real McCoy in that environment isn't always easy.</p>
<p>The 2025 Verizon DBIR found that 88% of attacks on web applications involved stolen or brute-forced credentials. Only 3% of leaked passwords met basic complexity standards. If your firm is not using unique, complex passwords for every service, backed by a password manager, the odds are stacked against you.</p>
<h3>What Stops It</h3>
<p><strong>A password manager for the entire firm.</strong> Every login should be a unique, randomly generated password stored in a password manager. No one at your firm should be able to recite any of their passwords from memory, because if they can, the password is not strong enough. (See: <a href="/controls/password-management">Password Management</a> in the Controls Library)</p>
<p><strong>Simulated phishing tests, especially during tax season.</strong> Run tests that mimic what your firm actually receives: fake IRS notices, fake Intuit login alerts, fake client document sharing requests. Debrief the results with staff. Do not shame people who click, but teach them what to look for. (See: <a href="/controls/security-training">Security Awareness Training</a> in the Controls Library)</p>
<p><strong>DMARC, SPF, and DKIM on your firm's email domain.</strong> These protocols prevent attackers from sending emails that appear to come from your domain. If an attacker can spoof your email address, they can phish your clients while appearing to be you. (See: <a href="/controls/email-authentication">Email Security</a> in the Controls Library)</p>

<h2>Threat #3: Ransomware</h2>
<h3>What It Is</h3>
<p>Ransomware encrypts your files and demands payment for the decryption key. For financial services firms, the timing is often deliberate: attackers know that a CPA firm hit with ransomware in March will pay almost anything to get access back before the April 15 filing deadline.</p>
<h3>What It Looks Like at a Financial Services Firm</h3>
<p>Tax season ransomware is a documented pattern. Attackers target accounting firms in February and March specifically because the deadline pressure maximizes the likelihood of payment. A Georgia CPA firm paid a $450,000 ransom to regain access to encrypted client files. Legacy Professionals LLP in Chicago had to notify 216,752 individuals after a 2024 hack and is facing at least five class-action lawsuits over the exposed data.</p>
<p>For smaller firms, the scenario is simpler and just as devastating. Your tax preparation software, your client files, your document storage, and your email are all encrypted on a Thursday afternoon in mid-March. The ransom demand is $75,000. You have three weeks until the filing deadline. Your clients are calling asking why they cannot access their portal. Your backups, if they exist, are on the same network and are also encrypted.</p>
<p>The double extortion angle is especially painful for financial services firms. The attacker does not just encrypt your files. They steal them first and threaten to publish your clients' tax returns, Social Security numbers, and financial statements on the dark web unless you pay. Even if you can restore from backups, the data is already out there.</p>
<h3>What Stops It</h3>
<p><strong>Offline, air-gapped backups tested quarterly.</strong> Your backup solution needs to be physically disconnected from your network. Cloud backups that sync continuously are not sufficient because ransomware can encrypt synced cloud storage. Test your restore process before you need it. (See: <a href="/controls/data-backup">Data Backup and Recovery</a> in the Controls Library)</p>
<p><strong>EDR on every workstation.</strong> Traditional antivirus is not sufficient. EDR monitors behavior patterns and can detect ransomware deployment in progress. (See: <a href="/controls/endpoint-protection">Endpoint Protection</a> in the Controls Library)</p>
<p><strong>Network segmentation.</strong> Separate your client data environment from your general office network. If ransomware gets onto the receptionist's machine, it should not be able to reach your tax preparation server. (See: <a href="/controls/network-segmentation">Network Segmentation</a> in the Controls Library)</p>
<p><strong>Patch management, especially for edge devices.</strong> VPN appliances and firewalls with unpatched vulnerabilities were a leading entry point for ransomware in 2024. If your firm uses any internet-facing device that has not been updated in the last 90 days, you have an open door. (See: <a href="/controls/patch-management">Patch Management</a> in the Controls Library)</p>

<h2>Threat #4: Insider Threat</h2>
<h3>What It Is</h3>
<p>An insider threat is a security risk from someone within your organization: a departing employee who takes client files, a staff member who accesses records they should not, or an accidental exposure that puts client data at risk.</p>
<h3>What It Looks Like at a Financial Services Firm</h3>
<p>The departing staff member scenario is especially common in accounting. A bookkeeper who has been managing payroll for your firm's clients for five years leaves to start their own practice. On their way out, they copy client contact information, payroll records, and financial statements to a personal drive. They now have everything they need to solicit your clients directly, using data they obtained while working for you.</p>
<p>The accidental exposure is more common and can be just as costly. A staff accountant emails a client's completed tax return to the wrong email address. A tax preparer shares a folder in Google Drive with a client but accidentally sets it to "anyone with the link" instead of restricting access. A bookkeeper uploads a payroll file to a shared Dropbox folder that a former contractor still has access to.</p>
<p>For firms that work with sensitive client data daily, the risk is compounded by the volume of data handled and the routine nature of the work. When you process hundreds of W-2s and 1099s every January, the risk of one going to the wrong place is no longer theoretical, but statistical.</p>
<h3>What Stops It</h3>
<p><strong>Role-based access controls.</strong> Not everyone at your firm needs access to every client's financial data. Configure your practice management software, your tax platform, and your file storage so that staff members can only access the clients they are actively working on. (See: <a href="/controls/access-control-policy">Access Control Management</a> in the Controls Library)</p>
<p><strong>Offboarding procedures with same-day access revocation.</strong> When a staff member leaves, their access to all systems should be terminated on their last day. This includes email, QuickBooks, tax preparation software, document storage, and any client portals. (See: <a href="/controls/employee-offboarding">Account Management</a> in the Controls Library)</p>
<p><strong>DLP policies on email.</strong> Configure your email system to flag or block outgoing messages that contain Social Security numbers, EINs, or bank account numbers. Both Microsoft 365 and Google Workspace offer DLP features on business-tier plans. (See: Data Loss Prevention in the Controls Library)</p>

<h2>Threat #5: Vendor and Third-Party Risk</h2>
<h3>What It Is</h3>
<p>Vendor risk is the exposure that comes from the software and service providers your firm depends on. Your tax preparation software, your cloud accounting platform, your IT provider, and your document sharing service all have their own security postures. If any of them are compromised, your client data may be exposed even though your own systems were never breached.</p>
<h3>What It Looks Like at a Financial Services Firm</h3>
<p>The tools your firm uses daily are themselves targets. QuickBooks has been subject to documented data theft attacks involving PowerShell-based malware that exfiltrates client data files (see our QuickBooks vendor scorecard for the full analysis). Tax preparation software has been targeted by attackers who compromise preparer accounts to file fraudulent returns. Cloud storage platforms have had breaches that exposed shared documents.</p>
<p>The MSP risk is equally significant. If your IT provider's remote management tool is compromised, the attacker has access to every client that provider serves. For a small accounting firm that relies on a local MSP for IT support, this is a single point of failure that could expose every client file in the practice.</p>
<h3>What Stops It</h3>
<p><strong>Maintain a vendor inventory and review it annually.</strong> List every vendor that has access to client data or your firm's systems. Include your tax software, accounting platform, cloud storage, IT provider, payroll processor, and document sharing tools. (See: <a href="/controls/vendor-risk-management">Vendor Risk Management</a> in the Controls Library)</p>
<p><strong>Evaluate your IT provider's security posture.</strong> Ask for their SOC 2 report. Ask what MFA they use on their remote access tools. Ask what their incident response plan looks like if they are breached and document the answers.</p>
<p><strong>Use the vendor scorecards on this site.</strong> We have reviewed the security posture of the most common tools used by small financial services firms, including QuickBooks, Google Workspace, Microsoft 365, Dropbox, and Stripe. Each scorecard gives you an independent assessment of the vendor's encryption, access controls, compliance certifications, and breach history.</p>

<h2>How Financial Services Is Different: The Regulatory Context</h2>
<p>Most small financial services firms do not realize they are subject to federal cybersecurity regulation, but they are.</p>
<p>The FTC Safeguards Rule applies to many tax preparers, bookkeepers, financial advisors, accountants, mortgage brokers, and credit counselors in the United States. It requires covered financial institutions to maintain a written information security program with specific elements, including a designated qualified individual responsible for the program, a documented risk assessment, access controls, encryption, MFA, staff training, an incident response plan, and regular testing. FTC's maximum civil penalty amount for certain FTC Act violations is $53,088 per violation (2025 adjustment). The breach notification requirement, effective May 2024, requires firms to report breaches affecting 500 or more consumers to the FTC within 30 days, and those reports will be made public. <a href="https://www.ftc.gov/business-guidance/privacy-security/safeguards-rule">FTC Safeguards Rule citation</a>.</p>
<p>IRS Publication 4557 provides additional guidance specific to tax preparers, including requirements for securing taxpayer data, monitoring for data theft, and reporting security incidents. Compliance with Pub 4557 has been required on PTIN applications since 2019.</p>
<p>The Gramm-Leach-Bliley Act (GLBA) is the statute underlying the Safeguards Rule and applies broadly to businesses engaged in financial activities. If you handle other people's financial data for a living, GLBA may apply to you. <a href="https://www.ftc.gov/business-guidance/privacy-security/safeguards-rule">FTC Safeguards Rule citation</a>.</p>
<p>The FTC's own plain-language guidance lists examples of covered businesses, including tax preparation firms, financial advisors, credit counselors, mortgage brokers, collection agencies, and investment advisors. If you are unsure whether your firm is covered, the safer assumption is that you need legal or compliance review. <a href="https://www.ftc.gov/business-guidance/privacy-security/safeguards-rule">FTC Safeguards Rule citation</a>.</p>
<p>For a plain-English walkthrough of what the FTC Safeguards Rule requires from your firm, see our compliance resources. <a href="https://www.ftc.gov/business-guidance/privacy-security/safeguards-rule">FTC Safeguards Rule citation</a>.</p>

<h2>Take the Next Step</h2>
<p>This page gives you the picture. Our free cybersecurity assessment tells you where your firm specifically stands against these threats and maps your results to FTC Safeguards Rule requirements. <a href="https://www.ftc.gov/business-guidance/privacy-security/safeguards-rule">FTC Safeguards Rule citation</a>.</p>`,
  faqs: [
    {
      question: "Does the FTC Safeguards Rule apply to my bookkeeping firm?",
      answer:
        "If your firm handles client financial data, prepares tax returns, processes payroll, or provides financial advisory services, the answer may be yes. The FTC Safeguards Rule defines \"financial institution\" broadly and FTC guidance lists examples including tax preparers, accountants, bookkeepers, credit counselors, mortgage brokers, and financial advisors. Firms with records for fewer than 5,000 consumers are exempt from some requirements but are still subject to the Rule's core obligations. FTC Safeguards Rule citation: https://www.ftc.gov/business-guidance/privacy-security/safeguards-rule",
    },
    {
      question: "What happens if I am not in compliance with the Safeguards Rule?",
      answer:
        "FTC's maximum civil penalty amount for certain FTC Act violations is $53,088 per violation (2025 adjustment). Beyond fines, a breach tied to a Safeguards Rule failure can trigger state attorney general investigations, class-action lawsuits, mandatory remediation, and public disclosure of the breach through the FTC's reporting database. The reputational damage of a public breach report for a firm whose business depends on client trust can be permanent. FTC Safeguards Rule citation: https://www.ftc.gov/business-guidance/privacy-security/safeguards-rule",
    },
    {
      question: "Do accounting firms actually get targeted by ransomware?",
      answer:
        "Yes. Cyberattacks on accounting firms have increased 300% since 2020. In 2024, 65% of financial services organizations experienced ransomware. A Georgia CPA firm paid a $450,000 ransom, and Legacy Professionals LLP in Chicago was forced to notify over 216,000 individuals after a breach. Tax season is the most common time for these attacks because deadline pressure maximizes the likelihood of payment.",
    },
    {
      question: "What is the most important thing I should do first?",
      answer:
        "Enable MFA on every account at your firm: email, accounting software, tax preparation platform, and any client-facing portal. Then determine whether you have a written information security plan as required by the FTC Safeguards Rule. If you do not, that is your compliance gap, and it needs to be addressed before the next breach notification cycle. FTC Safeguards Rule citation: https://www.ftc.gov/business-guidance/privacy-security/safeguards-rule",
    },
    {
      question: "Does my firm need cyber insurance?",
      answer:
        "If your firm handles client financial data, including Social Security numbers, bank account information, and tax records, yes. A single data breach at a small accounting firm can trigger notification obligations to hundreds or thousands of individuals, FTC reporting requirements, and potential class-action exposure. Cyber insurance covers breach notification costs, legal defense, regulatory response, and business interruption. Without it, the financial impact of an incident can close a small firm. FTC Safeguards Rule citation: https://www.ftc.gov/business-guidance/privacy-security/safeguards-rule",
    },
  ],
  sources: [
    "FBI Internet Crime Complaint Center 2024 Annual Report",
    "Verizon 2025 Data Breach Investigations Report",
    "IBM Cost of a Data Breach Report 2024",
    "FTC Safeguards Rule (16 CFR Part 314): https://www.ftc.gov/business-guidance/privacy-security/safeguards-rule",
    "IRS Publication 4557",
    "Sophos State of Ransomware in Financial Services 2024",
  ],
  ctaText: "Start Your Free Assessment",
  ctaLink: "/tools/cyber-audit",
};

export const threats = [healthcare, legal, financial];

export function getThreatBySlug(slug) {
  return threats.find((t) => t.slug === slug);
}
