export const VENDORS = [
  {
    slug: "quickbooks",
    lastReviewed: "2026-04",
    name: "QuickBooks",
    score: 70,
    tldr: "QuickBooks Online is one of the most popular accounting platforms for small businesses. Its securiy posture, however, has real gaps that decision makers ought to be aware of. MFA is available but cannot be enforced across its userbase by an administrator, there is no HIPAA BAA available, and QuickBooks Desktop files are a documented target for data theft malware. If your business handles sensitive financial data, consider pairing QuickBooks with deliberate access control policies and endpoint protection.",
    categories: {
      encryption: { score: 17, max: 20, detail: "AES-256 at rest, TLS in transit, key management not publicly documented" },
      accessControls: { score: 14, max: 20, detail: "MFA available but not enforced by default" },
      complianceCerts: { score: 15, max: 20, detail: "SOC 2 Type II (payroll only, NDA required), ISO 27001, PCI DSS" },
      transparency: { score: 7, max: 15, detail: "SOC report extremely difficult to obtain, no public subprocessor list" },
      breachHistory: { score: 11, max: 15, detail: "No core data breach; documented phishing campaigns targeting users" },
      smbFit: { score: 6, max: 10, detail: "MFA not on by default; compliance docs not accessible without enterprise relationship" },
    },
    hipaa_baa: false,
    trustUrl: "https://www.intuit.com/compliance/",
    securityUrl: "https://security.intuit.com/",
    keyFinding: "The single biggest security gap in QuickBooks Online is that it does not provide centralized, auditable enforcement of MFA across all users in the way enterprise systems do. Each user must enable MFA individually, and there is no way for an admin to verify whether they have done so or and no way to block login for users if they haven't. Intuit's community forums show this feature has been requested since 2020 with no resolution as of 2026. For any business trying to prove MFA compliance to a cyber insurer, this is a serious issue.",
    verdict: "QuickBooks is a popular and capable accounting tool with reasonable baseline security: 256-bit encryption in transit, automatic backups, and role-based user permissions. But the platform falls short on the controls that matter most for compliance and insurance readiness. No admin-enforced MFA, no HIPAA BAA, and a well-documented history of being targeted by data theft malware make it a tool you need to secure around rather than rely on. For most small businesses, QuickBooks is fine so long as you know its limits and compensate for them with solid endpoint protection, access control policies, and considerable permission management.",
    industryNotes: {
      "Law Firms": "QuickBooks is widely used in the legal industry, usually because the firm's bookkeeper or outside accountant is already familiar with it. It works well for core accounting tasks like bank syncing, general ledger management, and standard financial reporting. But law firms face a specific compliance challenge: QuickBooks lacks built-in safeguards to prevent trust account overdraws or perform the three-way reconciliation that many state bars require. Most firms that use QuickBooks successfully pair it with legal practice management software like Clio or CARET to handle trust accounting and matter-based billing before pushing data to QuickBooks for final accounting. The Plus or Advanced tiers are the right fit for firms. If your firm uses QuickBooks, make sure every user has MFA enabled individually, restrict user roles to the minimum necessary, and never store client-privileged information in invoice descriptions or notes fields.",
      "Medical Practices": "QuickBooks Online is not HIPAA compliant. Intuit states this explicitly: the platform meets industry standards for online security but does not comply with HIPAA privacy requirements. Intuit does not sign Business Associate Agreements. If your medical practice uses QuickBooks for billing, you cannot enter protected health information into the platform, including diagnostic codes, dates of service linked to patient names, or any data that could identify a patient's health condition. You can use QuickBooks for general accounting tasks like payroll, expense tracking, and vendor payments, but all PHI must stay in your EHR or a HIPAA-compliant billing system. Use tokenized patient IDs and generic service descriptions in QuickBooks invoices. If you need a HIPAA-compliant accounting platform, look at Sage Intacct or Cliniko, both of which sign BAAs.",
      "Government Contractors": "Government contractors face a unique problem with QuickBooks: the platform was not built to meet the data handling requirements that come with federal contract work. If your business handles Controlled Unclassified Information or falls under DFARS 252.204-7012, you are subject to NIST SP 800-171 controls and, increasingly, CMMC Level 2 certification. QuickBooks Online does not meet these requirements. There is no FedRAMP authorization, no CUI marking or handling capability, and no conceivable way to enforce the access controls that NIST 800-171 demands. The inability to mandate MFA across the userbase is especially problematic here, since NIST 800-171 control 3.5.3 explicitly requires multi-factor authentication for network access to privileged and non-privileged accounts. If your accounting data touches contract financials, cost proposals, or employee clearance information, you need to isolate QuickBooks from any system that processes CUI. Many smaller defense subcontractors use QuickBooks for general business accounting and keep all contract-specific financials in a separate, NIST SP 800-171-compliant environment. If you are pursuing CMMC certification, document this separation clearly, because an assessor will ask.",
    },
    whatToDo: [
      "Enable MFA on every user's Intuit account individually. Since QuickBooks cannot enforce this, you will need to walk each user through the setup at accounts.intuit.com under Sign-in & Security.",
      "Audit user roles quarterly. Remove access for any former employees, former bookkeepers, or outside accountants who no longer need it. Restrict each active user to the minimum permissions their role requires.",
      "If you use QuickBooks Desktop, check your file permissions after every database repair. File permission issues can occur during repair processes; administrators should verify access controls after maintenance.",
      "Do not store protected health information, client-privileged details, or Social Security numbers in QuickBooks fields. Use tokenized IDs and generic descriptions for sensitive records.",
      "Set up login alerts in your Intuit account to receive notifications for new device logins or changes to account settings. This gives you early warning if an unauthorized person gains access."
    ],
    faqs: [
      { question: "Does QuickBooks have a SOC 2 report?", answer: "Yes, but access is limited. The SOC 2 Type II report covers payroll services only, requires an active payroll subscription, and must be requested through support under NDA. Multiple users report the process taking weeks." },
      { question: "Is QuickBooks HIPAA compliant?", answer: "No. Intuit does not offer a HIPAA Business Associate Agreement for QuickBooks. Do not use it to store or process protected health information." },
      { question: "Does QuickBooks require MFA?", answer: "MFA is available but not enforced by default on most plan tiers. Admins should enable it manually for every account." },
    ],
    sources: [
      { label: "Intuit Trust Center — company compliance index", url: "https://www.intuit.com/compliance/", claim: "SOC 2, ISO 27001, PCI DSS posture" },
      { label: "Intuit Security — product security documentation", url: "https://security.intuit.com/", claim: "Encryption, account security, responsible disclosure" },
      { label: "QuickBooks Online account security help", url: "https://quickbooks.intuit.com/learn-support/", claim: "MFA availability and enrollment guidance" },
    ],
  },
  {
    slug: "dropbox",
    lastReviewed: "2026-04",
    name: "Dropbox",
    score: 75,
    tldr: "Dropbox offers solid encryption and a mature compliance program including SOC 2, ISO 27001, and HIPAA BAA availability on Business plans. However, the platform has a documented history of security incidents, including a 2012 breach that exposed 68 million user credentials and a 2024 breach of the Dropbox Sign service. The default product does not include end-to-end encryption, which means Dropbox holds the keys to your files. For businesses storing sensitive documents, the Business or Enterprise tier with thoughtfully configured admin controls is the minimum starting point.",
    categories: {
      encryption: { score: 18, max: 20, detail: "AES-256 at rest, TLS/SSL in transit; no default end-to-end encryption on standard plans" },
      accessControls: { score: 15, max: 20, detail: "Admin can enforce MFA via SSO on Business/Enterprise; granular permissions, remote wipe" },
      complianceCerts: { score: 17, max: 20, detail: "SOC 2 Type II, ISO 27001, ISO 27018, HIPAA (with BAA on paid plans), CSA STAR Level 2" },
      transparency: { score: 9, max: 15, detail: "Public Trust Center, SOC 3 available; subprocessor list published; security whitepaper accessible" },
      breachHistory: { score: 8, max: 15, detail: "2012 breach exposed 68 million credentials; 2022 phishing exposed GitHub repos; 2024 Dropbox Sign breach exposed user data for all Sign users" },
      smbFit: { score: 8, max: 10, detail: "Free plan lacks admin controls; Business plan required for meaningful security management" },
    },
    hipaa_baa: true,
    trustUrl: "https://www.dropbox.com/trust",
    securityUrl: "https://www.dropbox.com/features/security",
    keyFinding: "Dropbox manages its own encryption keys on standard accounts. Translation: the company technically has ability to access your stored files. After acquiring Boxcryptor in 2022, Dropbox has been developing end-to-end encryption for Business users, but the feature has not fully rolled out as a default as of 2026. For any business storing client-privileged documents, financial records, or sensitive HR files, this architecture means a compromise of Dropbox infrastructure could expose file contents, not just metadata. The 2024 Dropbox Sign breach demonstrated this risk in practice when a compromised service account gave attackers access to emails, usernames, hashed passwords, API keys, and MFA details for all Sign users.",
    verdict: "Dropbox is a capable collaboration tool with real compliance credentials, but its breach history is the longest of any vendor in this review. The 2012, 2022, and 2024 incidents represent three distinct attack vectors across more than a decade, which suggests a pattern rather than isolated events. If your business requires cloud storage, the Business plan with admin-enforced SSO, MFA, and configured sharing restrictions is workable. But if you handle highly sensitive client data, legal privilege, or PHI, you should evaluate whether Dropbox key management architecture meets your risk tolerance.",
    industryNotes: {
      "Law Firms": "Law firms frequently use Dropbox to share documents with clients and co-counsel, and the platforms ease of use makes it popular with attorneys who want to avoid more complex document management systems. However, the lack of default end-to-end encryption is a real concern for client-privileged material. If opposing counsel or a regulator asked whether your cloud provider could access privileged documents, the honest answer with standard Dropbox is yes. Firms that use Dropbox should at minimum be on a Business plan with SSO and MFA enforced, external sharing restricted to approved domains, and file recovery configured to prevent permanent deletion. Consider pairing Dropbox with a client-side encryption tool like Cryptomator for matter folders containing privileged communications.",
      "Medical Practices": "Dropbox Business and Enterprise plans can support HIPAA compliance. Dropbox will sign a BAA through the admin console, covers core file storage and sharing under that agreement, and publishes a SOC 2 report aligned to HIPAA/HITECH controls. However, HIPAA compliance is not configured by default. You must configure sharing permissions to prevent PHI from being accessible to unauthorized users, enforce MFA, disable permanent deletion so only admins can remove content (HIPAA has retention requirements), and ensure no third-party apps connected to your Dropbox account handle PHI without their own BAA. Free and personal Dropbox accounts cannot be used with PHI under any circumstance.",
      "Government Contractors": "Dropbox Business includes a NIST SP 800-171 mapping validated by Ernst and Young, integrated into its SOC 2 report. This positions it ahead of many SMB tools for government contractors who need to demonstrate compliance with CUI handling requirements. That said, Dropbox does not hold FedRAMP authorization, and its standard infrastructure stores data on US-based servers without the isolation guarantees a CMMC assessor might expect. If your business handles CUI, verify that the Dropbox environment you are using falls within the scope of the NIST 800-171 validated controls, restrict sharing to internal users, and document your configuration decisions for your System Security Plan.",
    },
    whatToDo: [
      "Upgrade to Dropbox Business or Enterprise. Free and Plus plans lack admin controls, MFA enforcement, and audit logging required for any regulated data.",
      "Enable SSO integration and enforce MFA for all users through your identity provider. Dropbox Business supports this through the admin console.",
      "Restrict external sharing to approved domains. By default, any user can share links publicly, which is a data leak waiting to happen.",
      "Disable permanent file deletion for non-admin users. This prevents accidental or malicious destruction of records you may be required to retain.",
      "Review connected third-party apps quarterly. Each app with access to your Dropbox has its own security posture, and a compromised integration can expose your files.",
    ],
    faqs: [
      { question: "Is Dropbox HIPAA compliant?", answer: "Dropbox Business and Enterprise plans support HIPAA compliance. Dropbox will sign a BAA through the admin console, and its SOC 2 report includes a HIPAA/HITECH controls evaluation. However, free and personal accounts are not eligible for a BAA and cannot be used with PHI. Compliance also depends on your configuration: you must restrict sharing, enforce MFA, and disable permanent deletion." },
      { question: "Has Dropbox been breached?", answer: "Yes, multiple times. In 2012, a breach exposed 68 million user email addresses and hashed passwords, though the full scope was not publicly disclosed until 2016. In 2022, attackers phished Dropbox employees to access 130 GitHub repositories containing internal code, API keys, and employee and customer data. In 2024, the Dropbox Sign service was breached through a compromised service account, exposing emails, usernames, phone numbers, hashed passwords, and authentication data for all Sign users." },
      { question: "Does Dropbox use end-to-end encryption?", answer: "Not by default. Standard Dropbox accounts use AES-256 encryption at rest and TLS in transit, but Dropbox manages the encryption keys, meaning the company can technically access your file contents. End-to-end encryption is being developed for Business users following Dropbox acquisition of Boxcryptor in 2022, but as of April 2026, it is not a default feature on most accounts." },
      { question: "Can Dropbox admins enforce MFA?", answer: "Yes, on Business and Enterprise plans. Admins can require MFA for all team members through the admin console or enforce it via SSO integration with an identity provider. This is a significant advantage over platforms like QuickBooks, where MFA cannot be enforced at the admin level." },
    ],
    sources: [
      { label: "Dropbox Trust Center — certifications and compliance", url: "https://www.dropbox.com/trust", claim: "SOC 2 Type II, ISO 27001/27018, HIPAA BAA availability, CSA STAR Level 2" },
      { label: "Dropbox Security — product security overview", url: "https://www.dropbox.com/features/security", claim: "Encryption at rest/in transit, admin controls, MFA/SSO" },
      { label: "Dropbox compliance portal — SOC 3 and audit reports", url: "https://www.dropbox.com/trust/compliance", claim: "Downloadable SOC 3 report and compliance documentation" },
      { label: "Dropbox Sign security update — April 2024 service account incident", url: "https://sign.dropbox.com/blog/a-recent-security-incident-involving-dropbox-sign", claim: "2024 Dropbox Sign breach disclosure" },
      { label: "Dropbox blog — 2022 GitHub repository phishing disclosure", url: "https://dropbox.tech/security/a-recent-phishing-campaign-targeting-dropbox", claim: "2022 phishing of Dropbox engineers, 130 GitHub repos accessed" },
    ],
  },
  {
    slug: "google-workspace",
    lastReviewed: "2026-04",
    name: "Google Workspace",
    score: 93,
    tldr: "Google Workspace is one of the most thoroughly certified platforms available to small businesses. It holds SOC 2, ISO 27001, FedRAMP High authorization, and offers a HIPAA BAA on Business and Enterprise plans. Administrators can enforce MFA across all users, restrict service access, and configure Data Loss Prevention rules. The platform's main risk for SMBs is complexity. Security features exist, but a non-technical admin may not configure them correctly without guidance.",
    categories: {
      encryption: { score: 19, max: 20, detail: "AES-256 at rest, TLS in transit; client-side encryption available on Enterprise plans" },
      accessControls: { score: 19, max: 20, detail: "Admin-enforced MFA, Conditional Access via Context-Aware Access, granular per-service controls" },
      complianceCerts: { score: 20, max: 20, detail: "SOC 2 Type II, ISO 27001/27017/27018/27701, HIPAA (with BAA), FedRAMP High, CSA STAR" },
      transparency: { score: 14, max: 15, detail: "Public transparency reports, detailed security whitepaper, published subprocessor list" },
      breachHistory: { score: 13, max: 15, detail: "No widely reported breach of core Workspace customer data; Google infrastructure incidents have occurred but are well-documented and rapidly addressed" },
      smbFit: { score: 8, max: 10, detail: "Feature depth can overwhelm small teams; security settings require deliberate admin configuration" },
    },
    hipaa_baa: true,
    trustUrl: "https://workspace.google.com/security",
    securityUrl: "https://workspace.google.com/intl/en/terms/trust/",
    keyFinding: "Google Workspace gives admins the ability to enforce MFA for every user in the organization, a control that several competing platforms still lack. Through the admin console, a super admin can require two-step verification, set enrollment deadlines, and block login for users who have not enrolled. Combined with Context-Aware Access policies (primarily limited to higher-tier subscriptions, such as Enterprise Standard/Plus, Education Standard/Plus, Frontline Standard/Plus, and Enterprise Essentials Plus), admins can restrict access based on device posture, location, and IP range. The gap is not in the tooling but in whether the small business admin knows these controls exist and has configured them. Out of the box, many of these settings are not active.",
    verdict: "Google Workspace is one of the strongest platforms for businesses that need both collaboration tools and compliance documentation. The certification stack is deep, the admin controls are granular, and the BAA covers the core services most businesses actually use: Gmail, Drive, Calendar, Meet, and Chat. The risk is not in what Google offers but in what the admin configures. A Google Workspace environment with Security Defaults turned off, MFA not enforced, and external sharing unrestricted is no safer than a free Gmail account. If you use Google Workspace, spend a few hours in the admin console with Google HIPAA Implementation Guide open so you can use the tools that are there.",
    industryNotes: {
      "Law Firms": "Google Workspace is increasingly common in small and mid-sized law firms, particularly for its real-time collaboration features in Docs and Drive. For client privilege concerns, admins can restrict external sharing by organizational unit, apply Information Rights Management policies to specific drives, and configure DLP rules that flag documents containing keywords like privileged or attorney-client. On Enterprise plans, client-side encryption allows firms to hold their own encryption keys, removing Google ability to access file contents. This is a meaningful advantage for firms handling litigation holds or regulatory investigations where key management matters.",
      "Medical Practices": "Google Workspace signs a BAA that covers Gmail, Drive, Docs, Sheets, Slides, Calendar, Chat, Meet, Keep, Sites, Tasks, Vault, and Cloud Identity. This is one of the broadest BAA scopes of any platform. However, not all Google services are covered. YouTube, third-party add-ons, and non-core APIs are excluded. Medical practices must disable or restrict non-covered services in the admin console before using Workspace with PHI. The HIPAA Implementation Guide published by Google walks through configuration step by step. As of 2026, Gemini for Workspace is covered under the BAA for Enterprise users, but only when used within the managed Workspace account.",
      "Government Contractors": "Google Workspace holds FedRAMP High authorization for its government cloud offering (Google Workspace for Government). The standard commercial Workspace product does not carry FedRAMP authorization, though it does hold SOC 2, ISO 27001, and the other certifications that support a NIST 800-171 compliance narrative. For contractors handling CUI, the government-specific offering is the appropriate choice. For contractors who do not handle CUI but want to demonstrate a mature security posture to a prime contractor or a CMMC assessor, the commercial Enterprise plan with properly configured admin controls is defensible.",
    },
    whatToDo: [
      "Enforce MFA for all users through the admin console. Set an enrollment deadline and block login for users who have not enrolled by that date.",
      "Disable Google services not covered by your compliance requirements. If you handle PHI, turn off YouTube and any non-core services in the admin console.",
      "Configure external sharing rules. Restrict Drive sharing to internal users by default, with exceptions only for approved external domains.",
      "Enable audit logging and set up email alerts for security events: failed login attempts, admin console changes, and external file sharing.",
      "Review the Google HIPAA Implementation Guide if your business handles PHI. It is the single most useful compliance configuration document any cloud vendor publishes.",
    ],
    faqs: [
      { question: "Is Google Workspace HIPAA compliant?", answer: "Yes, when properly configured. Google signs a BAA for Business, Enterprise, and Education plans. The BAA covers Gmail, Drive, Docs, Sheets, Slides, Calendar, Chat, Meet, Keep, Sites, Tasks, Vault, and Cloud Identity. However, signing the BAA alone does not make you compliant. You must configure sharing restrictions, enforce MFA, disable non-covered services, and follow the HIPAA Implementation Guide published by Google." },
      { question: "Can Google Workspace admins enforce MFA?", answer: "Yes. Super admins can require two-step verification for all users, set enrollment deadlines, and block login for non-enrolled users. This is configurable through the admin console under Security settings." },
      { question: "Is Google Workspace FedRAMP authorized?", answer: "Google Workspace for Government holds FedRAMP High authorization. The standard commercial Google Workspace product does not carry FedRAMP authorization, though it holds SOC 2, ISO 27001, and other certifications that support compliance narratives for NIST 800-171." },
      { question: "Does Google Workspace encrypt data at rest?", answer: "Yes. All data stored in Google Workspace is encrypted at rest using AES-256 and in transit using TLS. Enterprise plan customers can also enable client-side encryption, which allows the organization to hold its own encryption keys so that Google cannot access file contents." },
    ],
    sources: [
      { label: "Google Workspace security overview", url: "https://workspace.google.com/security/", claim: "Encryption, admin controls, Context-Aware Access" },
      { label: "Google Workspace Trust — compliance and certifications", url: "https://workspace.google.com/intl/en/terms/trust/", claim: "SOC 2 Type II, ISO 27001/27017/27018/27701, FedRAMP, HIPAA BAA coverage list" },
      { label: "Google Workspace HIPAA Implementation Guide", url: "https://support.google.com/a/answer/3407054", claim: "BAA-covered services and configuration requirements" },
      { label: "Google Workspace for Government — FedRAMP authorization", url: "https://workspace.google.com/industries/government/", claim: "FedRAMP High authorization for the government offering" },
      { label: "Google Transparency Report — service availability and incident history", url: "https://transparencyreport.google.com/", claim: "Public incident disclosure and government data request reporting" },
    ],
  },
  {
    slug: "microsoft-365",
    lastReviewed: "2026-04",
    name: "Microsoft 365",
    score: 86,
    tldr: "Microsoft 365 is one of the most feature-rich platforms available from a security standpoint. Conditional Access, Data Loss Prevention, sensitivity labels, and admin-enforced MFA provide granular control over who accesses what and under what conditions. The platform signs a HIPAA BAA, supports CMMC compliance, and holds FedRAMP authorization for its government cloud. The challenge for small businesses is that many of these features require Business Premium or higher licensing, and the admin experience is complex and can be a challenge for small teams to configure correctly.",
    categories: {
      encryption: { score: 18, max: 20, detail: "AES-256 at rest, TLS 1.2+ in transit; Customer Key available for customer-managed encryption on higher-tier plans" },
      accessControls: { score: 19, max: 20, detail: "Conditional Access policies, admin-enforced MFA (mandatory for admin roles as of Feb 2026), Privileged Identity Management" },
      complianceCerts: { score: 20, max: 20, detail: "SOC 2 Type II, ISO 27001, HIPAA, FedRAMP High (GCC High and government cloud environments), CMMC-supporting, NIST 800-171" },
      transparency: { score: 12, max: 15, detail: "Service Trust Portal with audit reports; transparency reports published; complexity of portal can be a barrier for SMBs" },
      breachHistory: { score: 9, max: 15, detail: "Midnight Blizzard (2024) breached Microsoft corporate email via a test account without MFA; multiple Exchange Online vulnerabilities in 2023-2024" },
      smbFit: { score: 8, max: 10, detail: "Extremely powerful but configuration complexity is high; Business Premium required for most security features" },
    },
    hipaa_baa: true,
    trustUrl: "https://www.microsoft.com/en-us/trust-center",
    securityUrl: "https://servicetrust.microsoft.com",
    keyFinding: "Microsoft began rolling out mandatory MFA for all user accounts accessing the Microsoft 365 admin center on February 3, 2025, in phases at the tenant level. This is a direct response to the Midnight Blizzard breach in early 2024, where state-backed attackers compromised a legacy test account that did not have MFA enabled and used it to access Microsoft leadership email. For small businesses, the takeaway is clear: if Microsoft's own internal security team failed to enforce MFA on a test account, the risk of leaving any account unprotected is quite real. Enable Security Defaults or configure Conditional Access policies that require MFA for all users, not just admins.",
    verdict: "Microsoft 365 has one of the deepest security feature sets of any productivity platform available to small businesses. But depth and usability aren't always synonymous. A law firm using Business Basic gets email and file storage with minimal security controls. The same firm on Business Premium gets Conditional Access, DLP, sensitivity labels, Defender for Office 365, and Intune device management. The gap between tiers is enormous, and the security features on the lower tiers may not be sufficient for businesses handling regulated data. If your business requires compliance documentation, invest in Business Premium and allocate time for admin configuration.",
    industryNotes: {
      "Law Firms": "Microsoft 365 is the default platform for most mid-sized law firms, and with Business Premium, it offers a strong security foundation. Sensitivity labels can classify and protect client-privileged documents. DLP policies can prevent accidental sharing of documents containing Social Security numbers or case file numbers. Conditional Access can require MFA and a managed device before granting access to SharePoint sites containing client matter files. For firms subject to state bar ethical opinions on cloud storage, Microsoft compliance documentation and BAA provide defensible answers to most questions a disciplinary board would ask.",
      "Medical Practices": "Microsoft 365 signs a HIPAA BAA through the Microsoft Data Protection Addendum, which is included automatically for qualifying license types. Covered services include Exchange Online, SharePoint, OneDrive, and Teams. To achieve HIPAA compliance, practices need to configure Conditional Access to require MFA and compliant devices, enable unified audit logging, implement DLP policies to detect PHI in email and files, and apply retention policies to meet HIPAA record-keeping requirements. Microsoft Purview provides the tools, though none are active by default.",
      "Government Contractors": "Microsoft offers GCC and GCC High environments specifically designed for CMMC and NIST 800-171 compliance. GCC High is Microsoft's recommended environment for organizations handling CUI and pursuing ITAR, DFARS, and CMMC alignment, though compliance still depends on proper customer configuration and controls. For small defense subcontractors, the standard commercial Microsoft 365 can still support a NIST 800-171 compliance narrative if properly configured, but CMMC Level 2 assessors increasingly expect GCC or GCC High for organizations handling CUI. The licensing cost for GCC High is considerably higher than commercial Microsoft 365, so contractors ought to determine early on whether their contract work involves CUI before committing to a tier.",
    },
    whatToDo: [
      "Enable Security Defaults or configure Conditional Access to require MFA for all users. As of February 2026, Microsoft mandates MFA for admin accounts, but all user accounts should be covered.",
      "Upgrade to Business Premium if you handle regulated data. Business Basic and Standard lack Conditional Access, DLP, and Defender for Office 365.",
      "Block legacy authentication protocols. Conditional Access can enforce this, and it closes one of the most common attack vectors for credential stuffing.",
      "Enable unified audit logging in Microsoft Purview. Without it, you have no trail of who accessed what, which is a requirement for HIPAA, CMMC, and most cyber insurance applications.",
      "If you are a government contractor handling CUI, evaluate GCC High licensing. Standard commercial Microsoft 365 may not satisfy a CMMC Level 2 assessor.",
    ],
    faqs: [
      { question: "Is Microsoft 365 HIPAA compliant?", answer: "Yes, with configuration. Microsoft signs a HIPAA BAA through the Data Protection Addendum included in qualifying licenses. Covered services include Exchange Online, SharePoint, OneDrive, and Teams. You must configure MFA, Conditional Access, DLP, audit logging, and retention policies to achieve compliance." },
      { question: "Does Microsoft enforce MFA?", answer: "As of February 2026, Microsoft mandates MFA for all admin accounts accessing the Microsoft 365 admin center. For non-admin users, MFA is not enforced by default but can be required through Security Defaults or Conditional Access policies." },
      { question: "What is the difference between Microsoft 365 Business Basic, Standard, and Premium?", answer: "For security purposes, the difference is substantial. Business Basic provides email and file storage with minimal security controls. Business Standard adds desktop Office apps. Business Premium adds Conditional Access, Intune device management, Defender for Business, and enhanced data protection capabilities including core DLP and sensitivity labeling features. If your business handles regulated data, Premium is the minimum viable tier." },
      { question: "Was Microsoft breached in 2024?", answer: "Yes. In early 2024, the Midnight Blizzard group compromised a legacy Microsoft test account that did not have MFA enabled. Using that initial access, they escalated privileges and accessed email accounts belonging to Microsoft senior leadership and cybersecurity staff. Microsoft has since mandated MFA for all admin access." },
    ],
    sources: [
      { label: "Microsoft Trust Center", url: "https://www.microsoft.com/en-us/trust-center", claim: "Compliance offerings, certifications index, BAA availability" },
      { label: "Microsoft Service Trust Portal — audit reports", url: "https://servicetrust.microsoft.com", claim: "Downloadable SOC 2, ISO 27001, FedRAMP, and HIPAA audit reports" },
      { label: "Microsoft Security Response Center — Midnight Blizzard disclosure", url: "https://msrc.microsoft.com/blog/2024/01/microsoft-actions-following-attack-by-nation-state-actor-midnight-blizzard/", claim: "January 2024 nation-state compromise of a legacy test account without MFA" },
      { label: "Microsoft Entra — mandatory MFA for admin center announcement", url: "https://techcommunity.microsoft.com/blog/microsoft-entra-blog/microsoft-will-require-mfa-for-all-azure-users/4140391", claim: "Phased mandatory MFA rollout for admin center access beginning Feb 2025" },
      { label: "Microsoft Compliance Offerings — HIPAA BAA coverage", url: "https://learn.microsoft.com/en-us/compliance/regulatory/offering-hipaa-hitech", claim: "HIPAA BAA scope and covered services" },
    ],
  },
  {
    slug: "zoom",
    lastReviewed: "2026-04",
    name: "Zoom",
    score: 73,
    tldr: "Zoom offers HIPAA BAA availability, end-to-end encryption as an option, and a solid set of compliance certifications. Its history includes the 2020 Zoombombing incidents that led to an $85 million settlement and a steady stream of vulnerability disclosures, including a critical Windows privilege escalation flaw (CVSS 9.6) patched in 2025. For telehealth and regulated meetings, Zoom works if you configure it deliberately. Out of the box, the default settings leave gaps that a determined attacker or an accidental participant can exploit.",
    categories: {
      encryption: { score: 16, max: 20, detail: "AES-256-GCM for meetings; E2EE available but disables some features; recordings not E2EE by default" },
      accessControls: { score: 14, max: 20, detail: "MFA available; waiting rooms and passcodes available but not always enforced by default" },
      complianceCerts: { score: 16, max: 20, detail: "SOC 2 Type II, ISO 27001, HIPAA (with BAA on Business+), HITRUST CSF, FedRAMP Moderate (Gov only)" },
      transparency: { score: 10, max: 15, detail: "Trust Center with security advisories; 30 CVEs published in 2025 alone" },
      breachHistory: { score: 9, max: 15, detail: "No major data breach of user data; 2020 Zoombombing incidents and $85M class action; critical CVE-2025-49457 (CVSS 9.6) patched in 2025" },
      smbFit: { score: 8, max: 10, detail: "Easy to deploy; default settings are not secure enough for regulated use without configuration" },
    },
    hipaa_baa: true,
    trustUrl: "https://explore.zoom.us/en/trust/",
    securityUrl: "https://explore.zoom.us/en/security/",
    keyFinding: "Zoom default meeting settings are not secure enough for regulated use. When you create a new meeting, waiting rooms and passcodes may or may not be enabled depending on your account configuration and plan tier. Cloud recording, if enabled, is not end-to-end encrypted by default. E2EE is available but disables breakout rooms, polling, and cloud recording when active. For medical practices conducting telehealth or law firms holding privileged discussions, every meeting involving sensitive information should have waiting rooms enabled, passcodes required, E2EE turned on where feasible, and cloud recording disabled unless storage is independently secured.",
    verdict: "Zoom has matured significantly since the 2020 incidents, and its current compliance posture with SOC 2, HITRUST, and HIPAA BAA availability is credible. But 30 CVEs in a single year (2025) means the platform requires active patch management. If your organization uses Zoom for sensitive meetings, keep the client updated, configure security settings proactively, and treat the default configuration as a starting point, not a finished product.",
    industryNotes: {
      "Law Firms": "Law firms use Zoom for client meetings, depositions, and internal discussions that may involve privileged information. The risk is not Zoom encryption (which is strong) but its meeting configuration. An improperly secured meeting can allow unauthorized participants to join, potentially waiving privilege. Enable waiting rooms, require passcodes, lock meetings after all expected participants have joined, and disable cloud recording unless you control where recordings are stored. For depositions, consider using Zoom for Government (FedRAMP Moderate) or enabling E2EE if breakout rooms are not needed.",
      "Medical Practices": "Zoom for Healthcare signs a BAA on Business tier and above. When the BAA is executed, Zoom automatically disables cloud recording, enables encrypted chat, and enforces encryption for third-party endpoints. However, the free and Pro tiers do not qualify for a BAA, and using them for telehealth sessions involving PHI creates HIPAA exposure. If your practice uses Zoom for patient consultations, confirm you are on a BAA-eligible plan and that the BAA has been signed. Disable any third-party Zoom Marketplace apps unless they carry their own BAA.",
      "Government Contractors": "Zoom for Government holds FedRAMP Moderate authorization and operates in a separate cloud environment from the commercial product. Standard commercial Zoom does not meet FedRAMP requirements and should not be used for meetings involving CUI. For contractors who need a video conferencing solution for non-CUI internal meetings, the commercial Business plan with configured security settings is adequate. For any meeting involving controlled information, use Zoom for Government or an alternative platform with FedRAMP authorization.",
    },
    whatToDo: [
      "Require meeting passcodes for all scheduled meetings. Configure this as an account-wide default in Settings > Security.",
      "Enable waiting rooms so the host controls who enters. This is the single most effective control against unauthorized meeting access.",
      "Keep the Zoom client updated on all devices. With 30 CVEs published in 2025, including a CVSS 9.6 Windows privilege escalation, patching is not optional.",
      "Disable cloud recording by default. If recordings are necessary, configure storage to a location you control with appropriate access restrictions.",
      "If your organization uses Zoom for telehealth, confirm that your BAA has been signed and that you are on a Business tier or above. Free and Pro plans are not BAA-eligible.",
    ],
    faqs: [
      { question: "Is Zoom HIPAA compliant?", answer: "Zoom can be HIPAA compliant on Business tier and above with a signed BAA. When the BAA is executed, Zoom automatically applies certain security settings including disabling cloud recording and enabling encrypted chat. Free and Pro plans do not qualify for a BAA." },
      { question: "Does Zoom have end-to-end encryption?", answer: "Yes, E2EE is available as an option for Zoom meetings. However, enabling E2EE disables certain features including cloud recording, breakout rooms, and polling. E2EE is not the default setting and must be enabled by the host for each meeting or configured as an account-wide default." },
      { question: "Has Zoom been breached?", answer: "Zoom has not experienced a large-scale data breach of user account information. The 2020 Zoombombing incidents involved unauthorized meeting access due to weak default settings, resulting in an $85 million class action settlement. Zoom regularly discloses and patches vulnerabilities, with 30 CVEs published in 2025 including one critical flaw rated CVSS 9.6." },
    ],
    sources: [
      { label: "Zoom Trust Center", url: "https://explore.zoom.us/en/trust/", claim: "Compliance programs, certifications, BAA process" },
      { label: "Zoom Security page", url: "https://explore.zoom.us/en/security/", claim: "E2EE architecture, encryption, meeting security controls" },
      { label: "Zoom for Healthcare — HIPAA overview", url: "https://explore.zoom.us/en/industry/healthcare/", claim: "HIPAA BAA availability on Business tier and above, default security configuration for BAA customers" },
      { label: "Zoom Trust Advisories — published CVEs", url: "https://www.zoom.com/en/trust/security-bulletin/", claim: "2025 CVE disclosures including CVE-2025-49457" },
      { label: "NVD — CVE-2025-49457", url: "https://nvd.nist.gov/vuln/detail/CVE-2025-49457", claim: "CVSS 9.6 Windows privilege escalation flaw referenced in the review" },
      { label: "Zoom Government — FedRAMP Moderate authorization", url: "https://www.zoomgov.com/", claim: "FedRAMP Moderate status for the government environment" },
    ],
  },
  {
    slug: "docusign",
    lastReviewed: "2026-04",
    name: "DocuSign",
    score: 85,
    tldr: "DocuSign is a secure eSignature platform with strong encryption, a court-admissible audit trail on every document, and HIPAA BAA availability on Enterprise plans. The platform has not experienced a major data breach of customer documents. The primary risk to small businesses is not DocuSign itself but the phishing campaigns that impersonate DocuSign notifications to trick recipients into clicking malicious links.",
    categories: {
      encryption: { score: 18, max: 20, detail: "AES-256 at rest, TLS 1.2+ in transit; documents encrypted and access-controlled per envelope" },
      accessControls: { score: 16, max: 20, detail: "MFA available; SSO integration; court-admissible audit trail on every envelope" },
      complianceCerts: { score: 18, max: 20, detail: "SOC 2 Type II, ISO 27001, HIPAA (with BAA on Enterprise), PCI DSS for payment features" },
      transparency: { score: 12, max: 15, detail: "Trust Center available; security whitepaper published; detailed audit trail per document" },
      breachHistory: { score: 13, max: 15, detail: "No major breach of customer document data; platform is a frequent target for phishing impersonation campaigns" },
      smbFit: { score: 8, max: 10, detail: "Core eSignature product is straightforward; HIPAA BAA requires Enterprise plan which may be cost-prohibitive for very small practices" },
    },
    hipaa_baa: true,
    trustUrl: "https://www.docusign.com/trust",
    securityUrl: "https://www.docusign.com/how-it-works/security",
    keyFinding: "DocuSign biggest security story is not about the platform but about how attackers use its brand. DocuSign impersonation phishing is one of the most common social engineering tactics targeting small businesses. Attackers send emails that closely mimic legitimate DocuSign envelope notifications, often including the correct branding, formatting, and even spoofed sender addresses. Because employees are trained to expect DocuSign emails as part of normal business operations, these phishing attempts have an unusually high success rate. Any business using DocuSign should train staff to verify DocuSign emails by logging into the DocuSign website directly rather than clicking links in email notifications.",
    verdict: "DocuSign does what it claims to do well: securely manage electronic signatures with encryption, access controls, and a tamper-evident audit trail. For most small businesses, the security posture of the core eSignature product is strong. The HIPAA BAA is limited to Enterprise plans, which may be a cost barrier for solo practitioners or very small practices. If you need a HIPAA-compliant eSignature solution on a tighter budget, evaluate alternatives. If cost is not a constraint, DocuSign Enterprise with SSO and MFA is a solid choice.",
    industryNotes: {
      "Law Firms": "DocuSign is widely used in legal practice for engagement letters, settlement agreements, closing documents, and client intake forms. The audit trail provides a court-admissible record of who signed what, when, and from which IP address, satisfying most evidentiary requirements. For firms handling sensitive transaction documents, configure DocuSign to require signer identity verification on high-value envelopes. Do not include privileged content in the body of DocuSign emails; use the envelope for the document itself and keep privileged communications in your secure email system.",
      "Medical Practices": "DocuSign signs a HIPAA BAA on Enterprise plans. When PHI is included in documents such as consent forms with diagnosis information or insurance authorization forms, the Enterprise plan with BAA is required. For practices that use DocuSign only for general intake paperwork that does not contain PHI, a lower tier may suffice, but you must be certain that no PHI appears in any document processed through the platform. DocuSign holds encrypted copies of signed documents on its servers.",
      "Government Contractors": "DocuSign is widely accepted for federal contracting document execution. The platform holds FedRAMP authorization for its government offering. For standard contract execution that does not involve CUI, the commercial Enterprise plan is appropriate. For document workflows involving CUI, use the DocuSign FedRAMP-authorized environment and ensure your SSP documents the boundary between DocuSign and your other systems.",
    },
    whatToDo: [
      "Train staff to recognize DocuSign impersonation phishing. Instruct employees to navigate to docusign.com directly rather than clicking links in emails that claim to be from DocuSign.",
      "Enable MFA for all DocuSign accounts, particularly for admin and sender roles.",
      "If your business handles PHI in signed documents, confirm you are on an Enterprise plan with a signed BAA.",
      "Use signer identity verification on envelopes involving high-value or legally sensitive documents.",
      "Review envelope retention settings. Understand how long DocuSign stores your signed documents and whether that aligns with your regulatory retention requirements.",
    ],
    faqs: [
      { question: "Is DocuSign HIPAA compliant?", answer: "Yes, on Enterprise plans with a signed BAA. DocuSign will sign a Business Associate Addendum with covered entities and business associates. The platform encrypts documents using AES-256 and maintains audit trails. Lower-tier plans do not include BAA availability." },
      { question: "Has DocuSign been breached?", answer: "DocuSign has not experienced a major breach of customer document data. However, the DocuSign brand is one of the most frequently impersonated in phishing campaigns. Attackers send emails that closely mimic legitimate DocuSign notifications to trick recipients into entering credentials on fake login pages." },
      { question: "Are DocuSign signatures legally binding?", answer: "Yes. Electronic signatures are legally enforceable in the United States under the ESIGN Act and the Uniform Electronic Transactions Act. DocuSign audit trail provides a court-admissible record of the signing event." },
    ],
    sources: [
      { label: "DocuSign Trust Center", url: "https://www.docusign.com/trust", claim: "Compliance certifications, BAA availability, subprocessor list" },
      { label: "DocuSign Security page", url: "https://www.docusign.com/how-it-works/security", claim: "Encryption, audit trail, platform security architecture" },
      { label: "DocuSign compliance and certifications", url: "https://www.docusign.com/trust/compliance", claim: "SOC 2 Type II, ISO 27001, HIPAA BAA, PCI DSS posture" },
      { label: "DocuSign Protect — impersonation and phishing guidance", url: "https://www.docusign.com/trust/security/protection-from-phishing", claim: "Guidance on recognizing DocuSign impersonation phishing" },
    ],
  },
  {
    slug: "stripe",
    lastReviewed: "2026-04",
    name: "Stripe",
    score: 98,
    tldr: "Stripe is the gold standard for payment processing security in the SMB space. It is PCI DSS Level 1 certified (the highest level), holds SOC 2 Type II and ISO 27001, publishes a public SOC 3 report, and has no publicly disclosed breach of its payment infrastructure. Stripe tokenization architecture means sensitive card data never touches your servers, which dramatically reduces your own PCI compliance burden.",
    categories: {
      encryption: { score: 20, max: 20, detail: "AES-256 at rest, TLS 1.2+ in transit; tokenization separates card data from merchant systems; decryption keys stored separately" },
      accessControls: { score: 19, max: 20, detail: "Dashboard 2FA, API key scoping, role-based access, webhook signing verification" },
      complianceCerts: { score: 20, max: 20, detail: "PCI DSS Level 1 (highest level), SOC 1 and SOC 2 Type II, ISO 27001, public SOC 3 report" },
      transparency: { score: 14, max: 15, detail: "Public SOC 3 report, detailed security documentation, integration security guide, transparent changelog" },
      breachHistory: { score: 15, max: 15, detail: "No publicly disclosed breach of Stripe payment infrastructure" },
      smbFit: { score: 10, max: 10, detail: "No configuration required for baseline security; tokenization reduces PCI scope for merchants automatically" },
    },
    hipaa_baa: false,
    trustUrl: "https://stripe.com/docs/security",
    securityUrl: "https://stripe.com/guides/pci-compliance",
    keyFinding: "Stripe architecture is designed to keep you out of scope. When you use Stripe Checkout, Elements, or mobile SDKs, card numbers are transmitted directly from the customer browser to Stripe servers without passing through yours. Stripe returns a token that your system stores instead of the actual card number. This means that for most small businesses, the PCI compliance questionnaire is significantly simplified because you never handle raw card data. This is a fundamentally different security model from processors that require you to collect and transmit card numbers through your own infrastructure.",
    verdict: "There is very little to criticize about Stripe security posture. The certifications are comprehensive, the architecture minimizes risk to the merchant, and the documentation is the most accessible of any vendor in the market today. The only area where Stripe could improve for SMBs is in making dashboard 2FA mandatory rather than optional, but this is a minor gap in an otherwise exemplary security profile.",
    industryNotes: {
      "Law Firms": "For law firms accepting client payments, Stripe tokenization means you do not handle raw credit card data, which simplifies your compliance obligations. Stripe also supports ACH payments and bank transfers, which are common in legal billing. Ensure that your Stripe dashboard has 2FA enabled for all users with access, and scope API keys to the minimum permissions necessary. If you use Stripe with a practice management platform like Clio, the integration typically handles tokenization automatically.",
      "Medical Practices": "Stripe processes payments but does not handle protected health information. If your billing workflow keeps PHI out of Stripe fields, no BAA is needed. Use generic descriptions in Stripe payment metadata (office visit, consultation) rather than clinical details. If your billing platform sends PHI to Stripe through custom metadata fields, you have a compliance problem that Stripe architecture was not designed to solve.",
      "Government Contractors": "Stripe is suitable for processing payments on government-adjacent work such as consulting invoices or service fees. It does not process classified or CUI data. For contractors whose payment workflows are straightforward, Stripe PCI Level 1 certification and SOC 2 report provide strong compliance documentation that a prime contractor or CMMC assessor would accept for the payment processing component of your environment.",
    },
    whatToDo: [
      "Enable 2FA on your Stripe dashboard for every user with access. This is not enforced by default.",
      "Use Stripe Checkout, Elements, or mobile SDKs so that raw card data never touches your servers. This keeps your PCI scope minimal.",
      "Scope API keys to the minimum permissions necessary. Use restricted keys for integrations that only need read access or payment creation.",
      "Do not store sensitive information in Stripe metadata fields. Payment descriptions should be generic, especially if your business handles healthcare or legal billing.",
      "Monitor your Stripe webhook endpoints. Verify webhook signatures to prevent attackers from sending forged events to your application.",
    ],
    faqs: [
      { question: "Is Stripe PCI compliant?", answer: "Yes. Stripe is certified as a PCI DSS Level 1 Service Provider, the highest level of certification in the payment card industry. When you use Stripe recommended integrations, card data goes directly to Stripe without touching your servers, which significantly reduces your own PCI compliance requirements." },
      { question: "Has Stripe been breached?", answer: "No. There is no publicly disclosed breach of Stripe payment processing infrastructure. Stripe undergoes annual SOC 1 and SOC 2 Type II audits, and publishes a public SOC 3 report." },
      { question: "Does Stripe sign a HIPAA BAA?", answer: "No, and it does not need to for most use cases. Stripe processes payment data, not health information. As long as you do not include PHI in Stripe metadata or description fields, no BAA is required. Keep clinical details out of payment descriptions." },
    ],
    sources: [
      { label: "Stripe Security — product security documentation", url: "https://stripe.com/docs/security", claim: "Encryption, tokenization architecture, key management" },
      { label: "Stripe PCI compliance guide", url: "https://stripe.com/guides/pci-compliance", claim: "PCI DSS Level 1 certification and merchant scope reduction" },
      { label: "Stripe Trust — public compliance index", url: "https://stripe.com/privacy-center/legal", claim: "SOC 1, SOC 2 Type II, ISO 27001 documentation and public SOC 3 report" },
      { label: "Stripe integration security best practices", url: "https://stripe.com/docs/security/guide", claim: "Webhook signature verification, API key scoping, 2FA guidance" },
    ],
  },
  {
    slug: "slack",
    lastReviewed: "2026-04",
    name: "Slack",
    score: 78,
    tldr: "Slack is a useful collaboration tool with solid compliance credentials on its Enterprise Grid tier: SOC 2, ISO 27001, and HIPAA BAA availability. But messages in Slack are not end-to-end encrypted, meaning Slack (and by extension Salesforce, its parent company) holds the encryption keys and can technically access message content. For most small businesses, the bigger risk is not encryption architecture but the tendency to share sensitive information in Slack channels without considering who has access or how long messages are retained.",
    categories: {
      encryption: { score: 16, max: 20, detail: "AES-256 at rest, TLS 1.2 in transit; no end-to-end encryption for messages; Slack holds encryption keys" },
      accessControls: { score: 16, max: 20, detail: "Admin-enforced MFA, SSO via SAML, channel-level permissions, guest access controls" },
      complianceCerts: { score: 16, max: 20, detail: "SOC 2 Type II, SOC 3, ISO 27001, HIPAA (Enterprise Grid only), FedRAMP Moderate (GovSlack)" },
      transparency: { score: 11, max: 15, detail: "Trust Center, security whitepaper, transparency reports; subprocessor list available" },
      breachHistory: { score: 11, max: 15, detail: "2022: Slack disclosed unauthorized access to its GitHub repositories via stolen employee tokens; no customer message data was exposed" },
      smbFit: { score: 8, max: 10, detail: "Widely adopted; HIPAA BAA limited to Enterprise Grid which is priced for larger organizations" },
    },
    hipaa_baa: true,
    trustUrl: "https://slack.com/trust",
    securityUrl: "https://slack.com/intl/en-us/security",
    keyFinding: "Slack HIPAA BAA is available only on Enterprise Grid, which is priced for organizations with hundreds or thousands of users. For a small medical practice or law firm with 5 to 20 employees, Enterprise Grid is likely cost-prohibitive. This means that most small businesses using Slack are on Pro or Business+ plans, where no BAA is available and where messages containing PHI or client-privileged information create compliance exposure. If your team discusses patients, clients, or sensitive business matters in Slack, understand that those messages are stored on Slack servers, encrypted with keys Slack controls, and retained according to your workspace retention policy.",
    verdict: "Slack is a strong communication tool with reasonable security for general business use. The admin controls on Business+ and Enterprise Grid are solid. The limitation for small businesses is that the HIPAA BAA and the most advanced security features are gated behind Enterprise Grid pricing. If your business handles regulated data, either budget for Enterprise Grid or establish clear policies about what can and cannot be discussed in Slack, and enforce those policies through training.",
    industryNotes: {
      "Law Firms": "Law firms should be cautious about discussing client matters in Slack. Messages are stored on Slack servers and are not end-to-end encrypted. If a discovery request or subpoena targets your Slack workspace, those messages are producible. Set clear firm policies about what can be discussed in Slack versus what must stay in secure email or your document management system. On Enterprise Grid, firms can configure retention policies and DLP rules to reduce risk.",
      "Medical Practices": "Do not discuss patient information in Slack unless you are on Enterprise Grid with a signed BAA. On Pro or Business+ plans, any message mentioning a patient by name alongside a health condition, diagnosis, or treatment constitutes PHI in an unsecured environment. If your practice uses Slack for team communication, restrict its use to scheduling, administrative logistics, and general announcements.",
      "Government Contractors": "GovSlack holds FedRAMP Moderate authorization and operates in a separate environment from commercial Slack. Standard commercial Slack should not be used for discussions involving CUI. For non-CUI internal communication, commercial Slack with SSO and enforced MFA is adequate, but establish channel naming conventions and access controls that prevent CUI from entering the workspace.",
    },
    whatToDo: [
      "Enforce MFA for all workspace members through the admin console. This is available on Pro plans and above.",
      "Configure message retention policies. By default, Slack retains all messages indefinitely. Set retention limits appropriate for your industry.",
      "Establish written policies about what can and cannot be discussed in Slack. Client names, patient information, and sensitive financial data should stay out of Slack unless you are on Enterprise Grid with a BAA.",
      "Review guest access quarterly. External collaborators with guest access to your channels may retain access long after the project that justified their invitation.",
      "If your business requires HIPAA compliance for messaging, evaluate whether Enterprise Grid pricing is feasible. If not, use a HIPAA-compliant messaging alternative for clinical or privileged discussions.",
    ],
    faqs: [
      { question: "Is Slack HIPAA compliant?", answer: "Only on Enterprise Grid. Slack will sign a BAA for Enterprise Grid customers. Pro and Business+ plans do not include BAA availability and should not be used to transmit PHI." },
      { question: "Are Slack messages encrypted?", answer: "Slack encrypts messages at rest using AES-256 and in transit using TLS. However, Slack does not offer end-to-end encryption. Slack holds the encryption keys, which means the company can technically access message content." },
      { question: "Has Slack been breached?", answer: "In 2022, Slack disclosed that an unauthorized party accessed its externally hosted GitHub repositories using stolen employee tokens. The company stated that no customer data, including messages and files, was affected." },
    ],
    sources: [
      { label: "Slack Trust Center", url: "https://slack.com/trust", claim: "Compliance certifications, subprocessor list, BAA availability" },
      { label: "Slack Security — architecture and controls", url: "https://slack.com/intl/en-us/security", claim: "Encryption, admin controls, SSO/MFA, HIPAA Enterprise Grid requirement" },
      { label: "Slack compliance certifications", url: "https://slack.com/trust/compliance", claim: "SOC 2 Type II, SOC 3, ISO 27001, FedRAMP Moderate (GovSlack)" },
      { label: "Slack Security Update — December 2022 GitHub incident disclosure", url: "https://slack.com/intl/en-gb/blog/news/slack-security-update", claim: "2022 stolen-token access to Slack's externally hosted GitHub repositories" },
      { label: "GovSlack — FedRAMP Moderate authorization", url: "https://slack.com/solutions/govslack", claim: "FedRAMP Moderate status for the government environment" },
    ],
  },
  {
    slug: "gusto",
    lastReviewed: "2026-04",
    name: "Gusto",
    score: 78,
    tldr: "Gusto is a payroll and HR platform built specifically for small businesses, and its user experience reflects that focus. The platform uses AES-256 encryption, holds SOC 2 Type II certification, and processes payroll and tax filings for over 300,000 businesses. Gusto does not sign a HIPAA BAA, which limits its use for healthcare organizations that tie benefits administration to health plan data. For businesses that need a simple, reliable payroll provider with reasonable security, Gusto delivers.",
    categories: {
      encryption: { score: 17, max: 20, detail: "AES-256 at rest, TLS in transit; bank-level encryption for payroll and tax data" },
      accessControls: { score: 15, max: 20, detail: "MFA available; role-based permissions for admins, managers, and employees" },
      complianceCerts: { score: 14, max: 20, detail: "SOC 2 Type II; no HIPAA BAA; no ISO 27001 published" },
      transparency: { score: 9, max: 15, detail: "Security page exists but limited public detail; no published subprocessor list; SOC 2 report available on request" },
      breachHistory: { score: 13, max: 15, detail: "No publicly disclosed breach of Gusto payroll infrastructure" },
      smbFit: { score: 10, max: 10, detail: "Purpose-built for small businesses; onboarding and UI are straightforward" },
    },
    hipaa_baa: false,
    trustUrl: "https://gusto.com/company/security",
    securityUrl: "https://gusto.com/trust",
    keyFinding: "Gusto handles some of the most sensitive data any small business generates: Social Security numbers, bank account information, salary details, and tax filings. Despite this sensitivity, Gusto public security documentation is thinner than what you would find from comparable platforms. The SOC 2 Type II report is available on request but not publicly summarized, there is no published ISO 27001 certification, and the company does not publish a subprocessor list. For a platform processing payroll for hundreds of thousands of businesses, more transparency would be appropriate.",
    verdict: "Gusto is well-designed for what it does, and its clean breach record is a positive signal. The security controls that exist (encryption, MFA, role-based access) are adequate for most small businesses. The transparency gap is the main concern: when your payroll provider holds every employee SSN and bank account number, you should be able to verify their security posture in more detail than Gusto currently provides.",
    industryNotes: {
      "Law Firms": "Gusto works well for small law firms that need straightforward payroll processing without the complexity of larger HR platforms. Employee Social Security numbers, compensation data, and bank accounts are all processed through Gusto, so ensure that admin access is restricted to the managing partner or office manager and that MFA is enabled on all admin accounts. Do not use shared login credentials for the firm Gusto account.",
      "Medical Practices": "Gusto does not sign a HIPAA BAA. If your practice administers employee health benefits through Gusto and the platform processes health plan enrollment data that includes PHI, you may have a compliance gap. For payroll processing alone, no BAA is needed because payroll data is not PHI. Evaluate whether your benefits administration workflow routes PHI through Gusto, and if so, consider a benefits platform that signs a BAA.",
      "Government Contractors": "Gusto is adequate for payroll processing in a small contracting business that does not handle CUI in its HR systems. Payroll data itself is not CUI, but employee clearance status and position descriptions could be. Keep any clearance-related information out of Gusto system. If your CMMC scope includes HR systems, you may need a payroll provider with stronger published compliance documentation.",
    },
    whatToDo: [
      "Enable MFA for all admin accounts. Gusto processes SSNs and bank account numbers for every employee, making the admin account a high-value target.",
      "Review user roles quarterly. Remove access for former accountants, bookkeepers, or HR contacts who no longer need it.",
      "Do not store employee clearance status, health conditions, or other regulated information in Gusto notes or custom fields.",
      "Request Gusto SOC 2 Type II report and review it. Understand the scope of what was audited and whether it covers the services you use.",
      "Use Gusto built-in document storage for tax forms rather than emailing these documents, which are often sent unencrypted.",
    ],
    faqs: [
      { question: "Is Gusto HIPAA compliant?", answer: "No. Gusto does not sign a HIPAA BAA. If your benefits administration workflow routes PHI through Gusto, you may have a compliance gap. For payroll-only use, no BAA is needed." },
      { question: "Has Gusto been breached?", answer: "No. There is no publicly disclosed breach of Gusto payroll infrastructure." },
      { question: "What certifications does Gusto hold?", answer: "Gusto holds SOC 2 Type II certification. The report is available on request. Gusto does not publish ISO 27001 certification or a HIPAA BAA." },
    ],
    sources: [
      { label: "Gusto Security page", url: "https://gusto.com/company/security", claim: "Encryption, MFA, role-based permissions" },
      { label: "Gusto Trust page", url: "https://gusto.com/trust", claim: "SOC 2 Type II posture, audit report availability" },
      { label: "Gusto privacy and data practices", url: "https://gusto.com/about/privacy", claim: "Data handling, retention, and vendor sharing practices" },
    ],
  },
  {
    slug: "clio",
    lastReviewed: "2026-04",
    name: "Clio",
    score: 90,
    tldr: "Clio is purpose-built for small and mid-sized law firms, and its security posture reflects the sensitivity of legal data. SOC 2 Type II, ISO 27001, AES-256 encryption, and matter-level access controls are all standard. Clio will sign a HIPAA BAA, which matters for firms that handle healthcare-related legal work. The platform has no publicly disclosed breach. For law firms evaluating practice management software, Clio security credentials are among the strongest in the legal technology market.",
    categories: {
      encryption: { score: 18, max: 20, detail: "AES-256 at rest, TLS 1.2+ in transit; per-matter access controls; document storage encrypted" },
      accessControls: { score: 18, max: 20, detail: "Role-based permissions, matter-level access restrictions, SSO available, MFA available" },
      complianceCerts: { score: 17, max: 20, detail: "SOC 2 Type II, ISO 27001; HIPAA BAA available; designed for legal industry compliance" },
      transparency: { score: 13, max: 15, detail: "Detailed Trust Center, published security whitepaper, annual SOC 2 audits, transparent data handling practices" },
      breachHistory: { score: 14, max: 15, detail: "No publicly disclosed breach of Clio customer data" },
      smbFit: { score: 10, max: 10, detail: "Purpose-built for small and mid-sized law firms. Clean UX, accessible pricing, strong integration ecosystem." },
    },
    hipaa_baa: true,
    trustUrl: "https://www.clio.com/trust/",
    securityUrl: "https://www.clio.com/security/",
    keyFinding: "Clio matter-level access controls allow firm administrators to restrict which attorneys and staff can view specific client matters. This is not just a convenience feature; it is an ethical obligation. ABA Model Rule 1.6 requires confidentiality protections, and in multi-practice firms, information barriers between matters are sometimes required. Clio permissions system supports this at the software level, which is more than many general-purpose tools can offer. For firms handling opposing parties, government investigations, or matters with potential conflicts, this granularity is critical.",
    verdict: "Clio is the benchmark for legal practice management security in the SMB market. The platform is designed from the ground up for law firms, which means the security features align with the ethical and regulatory obligations attorneys face. SOC 2, ISO 27001, no breach history, and HIPAA BAA availability put Clio ahead of most general-purpose tools. If your firm uses QuickBooks for accounting, Dropbox for file storage, and Zoom for client calls, Clio integration ecosystem connects to all of them while providing a security layer that those individual tools do not.",
    industryNotes: {
      "Law Firms": "This is Clio home field. The platform handles time tracking, billing, client intake, document management, trust accounting, and calendaring with security controls designed for legal ethics compliance. Matter-level permissions support information barriers. The trust accounting module integrates with QuickBooks to help firms maintain proper IOLTA separation. Audit trails track who accessed which matter and when. For solo practitioners and small firms, Clio Manage is the entry point. For firms that need client intake portals with conflict checking, Clio Grow adds a front-end layer. Both tiers include the core security controls.",
      "Medical Practices": "Clio is designed for law firms, not medical practices. However, healthcare attorneys and firms specializing in medical malpractice, health law, or healthcare regulatory work will handle documents containing PHI. Clio HIPAA BAA availability makes it a defensible choice for these practices. Configure matter-level access restrictions for cases involving PHI, and ensure that documents uploaded to Clio containing patient information are shared only with authorized team members.",
      "Government Contractors": "Clio is not designed for government contractor compliance. However, law firms representing defense contractors or handling ITAR/export control legal work may need to store sensitive documents within Clio. The platform SOC 2 and ISO 27001 certifications support a reasonable security narrative, but Clio does not hold FedRAMP authorization. For firms whose clients require CUI handling, consult with the client about whether Clio security posture meets their contractual requirements.",
    },
    whatToDo: [
      "Enable MFA for all firm members. Clio supports authenticator apps and SMS verification.",
      "Configure matter-level access permissions for cases involving conflicts, opposing parties, or sensitive client information. Do not rely on the honor system.",
      "If your firm handles healthcare legal work involving PHI, request Clio HIPAA BAA before uploading documents containing patient information.",
      "Review integration permissions quarterly. Each app connected to Clio (QuickBooks, Dropbox, Zoom, etc.) has its own security posture.",
      "Use Clio built-in document storage rather than linking to external file shares. Documents stored in Clio benefit from its encryption and access controls.",
    ],
    faqs: [
      { question: "Is Clio secure for client data?", answer: "Yes. Clio uses AES-256 encryption at rest and TLS in transit. The platform holds SOC 2 Type II and ISO 27001 certifications, has no publicly disclosed breach, and provides matter-level access controls that support ethical wall requirements." },
      { question: "Does Clio sign a HIPAA BAA?", answer: "Yes. Clio will sign a BAA on request, which is relevant for law firms handling healthcare-related legal work where documents may contain PHI." },
      { question: "Can Clio support trust accounting compliance?", answer: "Yes. Clio includes a trust accounting module that integrates with QuickBooks to help firms maintain proper separation between trust and operating accounts. This addresses one of the most common compliance requirements for law firms." },
      { question: "Does Clio integrate with other tools?", answer: "Yes. Clio integrates with QuickBooks for accounting, Dropbox and Google Drive for file storage, Zoom for video conferencing, DocuSign for eSignatures, and Stripe for payment processing. Each integration has its own security posture, so review connected apps quarterly." },
    ],
    sources: [
      { label: "Clio Trust Center", url: "https://www.clio.com/trust/", claim: "Compliance certifications, BAA availability, security commitments" },
      { label: "Clio Security page", url: "https://www.clio.com/security/", claim: "Encryption, matter-level access controls, SSO/MFA" },
      { label: "Clio compliance and certifications", url: "https://www.clio.com/trust/compliance/", claim: "SOC 2 Type II, ISO 27001, HIPAA BAA availability" },
      { label: "Clio data handling and privacy", url: "https://www.clio.com/privacy/", claim: "Data residency, retention, and ethics-wall enforcement" },
    ],
  },
]

/**
 * Single source of truth for vendor score banding. The `band` field on
 * individual vendor entries is derived from `score` via this function;
 * do NOT store a band string alongside the score or it will drift when a
 * score is updated without a matching band edit.
 *
 * Thresholds: Strong >= 85, Adequate >= 70, Marginal >= 60, Caution < 60.
 * These match the existing `bandColors` map used by the vendor index and
 * vendor detail pages.
 */
export function getScoreBand(score) {
  if (typeof score !== "number") return "Caution"
  if (score >= 85) return "Strong"
  if (score >= 70) return "Adequate"
  if (score >= 60) return "Marginal"
  return "Caution"
}

// ============================================================================
// Module-load integrity checks
// ============================================================================
//
// Run once on import. Surfaces three classes of problem at deploy time
// instead of at reader time:
//
//   1. Placeholder tokens (PLACEHOLDER / TBD / FIXME) left inside any
//      reviewable content field. These should never ship.
//   2. Missing or empty `sources` array on a vendor. A scorecard without
//      sources cannot be audited against primary references.
//   3. Stale `lastReviewed` dates more than 180 days old. A scorecard
//      that has not been touched in six months is a snapshot, not a
//      live assessment, and readers should know. Warn so the next
//      maintainer sees the gap in Vercel build logs.
//
// Non-fatal by design — a warn rather than a throw — because a single
// stale vendor should not nuke a deploy. Promote to throw if the editorial
// policy tightens.
// ----------------------------------------------------------------------------
;(function checkVendorContentIntegrity() {
  const PLACEHOLDER_PATTERN = /\b(PLACEHOLDER|FIXME|TBD)\b/i
  const STALE_DAYS = 180
  const now = Date.now()

  // Fields that contain prose a reader will see. `whatToDo` and `faqs` are
  // structured and handled separately because they are arrays of strings
  // and objects respectively.
  const STRING_FIELDS = ["tldr", "keyFinding", "verdict"]

  for (const v of VENDORS) {
    // 1. Placeholder tokens anywhere in the reviewable content
    const haystack = [
      ...STRING_FIELDS.map((k) => v[k] || ""),
      ...Object.values(v.industryNotes || {}),
      ...(v.whatToDo || []),
      ...(v.faqs || []).flatMap((f) => [f.question || "", f.answer || ""]),
      ...Object.values(v.categories || {}).map((c) => c.detail || ""),
    ].join("\n")
    if (PLACEHOLDER_PATTERN.test(haystack)) {
      console.warn(
        `[vendors.js] vendor "${v.slug}" contains a placeholder token (PLACEHOLDER / FIXME / TBD). Replace it with real content before shipping.`
      )
    }

    // 2. Sources array present and non-empty
    if (!Array.isArray(v.sources) || v.sources.length === 0) {
      console.warn(
        `[vendors.js] vendor "${v.slug}" has no sources[] array. Every scorecard needs primary references so readers can audit factual claims.`
      )
    }

    // 3. Stale review date
    if (typeof v.lastReviewed === "string" && v.lastReviewed.length > 0) {
      const reviewedMs = new Date(`${v.lastReviewed}-01T00:00:00.000Z`).getTime()
      if (Number.isFinite(reviewedMs)) {
        const ageDays = Math.floor((now - reviewedMs) / (1000 * 60 * 60 * 24))
        if (ageDays > STALE_DAYS) {
          console.warn(
            `[vendors.js] vendor "${v.slug}" was last reviewed ${ageDays} days ago (${v.lastReviewed}). Scorecards older than ${STALE_DAYS} days should be re-verified.`
          )
        }
      }
    } else {
      console.warn(
        `[vendors.js] vendor "${v.slug}" has no lastReviewed date. Add one in YYYY-MM format so the page displays an accurate review month.`
      )
    }
  }
})()
