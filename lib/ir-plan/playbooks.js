export const INCIDENT_TYPES = [
  {
    key: "ransomware",
    title: "Ransomware Attack",
    icon: "Lock",
    description:
      "Files are encrypted, a ransom demand is displayed, or systems are locked and inaccessible.",
    severity: "critical",
    triggerExamples: [
      "Employees report they cannot open files",
      "A ransom message appears on screens",
      "Multiple systems are unresponsive simultaneously",
      "Your IT provider alerts you to encrypted servers",
    ],
  },
  {
    key: "bec",
    title: "Business Email Compromise",
    icon: "Mail",
    description:
      "A fraudulent email tricks someone into sending money, sharing credentials, or providing sensitive information.",
    severity: "high",
    triggerExamples: [
      "An employee wired money to a vendor but the bank details were fake",
      "A client reports receiving a suspicious invoice from your domain",
      "An executive's email account is sending messages they did not write",
      "Someone shared credentials after receiving an urgent email from 'the CEO'",
    ],
  },
  {
    key: "data_breach",
    title: "Data Breach or Unauthorized Access",
    icon: "ShieldAlert",
    description:
      "Someone accessed data they should not have, data was found exposed, or you received a notification that your data appeared in a breach.",
    severity: "high",
    triggerExamples: [
      "A former employee still had access and downloaded files",
      "Client data was found on a public website or dark web",
      "Unusual login activity detected from an unfamiliar location",
      "A vendor notified you that their systems were breached and your data was involved",
    ],
  },
  {
    key: "phishing",
    title: "Phishing Campaign",
    icon: "Fish",
    description:
      "Multiple employees received suspicious emails, or someone clicked a malicious link and entered their credentials.",
    severity: "medium",
    triggerExamples: [
      "Several employees received the same suspicious email",
      "Someone clicked a link and entered their password on a fake login page",
      "You notice email forwarding rules you did not create",
      "Your IT provider reports compromised credentials",
    ],
  },
  {
    key: "lost_device",
    title: "Lost or Stolen Device",
    icon: "Smartphone",
    description:
      "A laptop, phone, or tablet containing company data was lost, stolen, or left in a public place.",
    severity: "medium",
    triggerExamples: [
      "An employee reports their laptop was stolen from their car",
      "A company phone was left at a restaurant or airport",
      "A device was taken during a break-in at the office",
      "An employee left the company and did not return their equipment",
    ],
  },
]

export function getIncidentType(key) {
  return INCIDENT_TYPES.find((t) => t.key === key) || null
}

// Phase definitions for each incident type. Steps use placeholders like
// {incident_commander}, {it_contact}, {insurance_carrier} etc. that get
// replaced with actual values from the user's saved plan via interpolateStep.
export const PLAYBOOKS = {
  ransomware: {
    phases: [
      {
        title: "First 15 Minutes",
        subtitle: "Stop the spread. Do not panic.",
        urgency: "critical",
        steps: [
          {
            id: "r1",
            action:
              "DO NOT turn off computers. DO NOT try to open encrypted files. DO NOT contact the attackers or pay any ransom.",
            why: "Turning off computers can destroy forensic evidence needed for the investigation and insurance claim. Opening encrypted files cannot recover them and wastes critical time. Paying ransom does not guarantee recovery and may violate sanctions laws.",
            assignedTo: "everyone",
            critical: true,
          },
          {
            id: "r2",
            action:
              "Call {it_contact} immediately. If no answer within 10 minutes, call {it_contact_backup}.",
            why: "Your IT contact needs to begin isolating affected systems to prevent the ransomware from spreading to additional computers and servers.",
            assignedTo: "incident_commander",
            script:
              "Say: 'We have a ransomware incident. [Describe what you see.] We need you to begin isolating affected systems immediately. Do not wipe or rebuild anything yet. We need to preserve evidence for our insurance claim.'",
          },
          {
            id: "r3",
            action:
              "Disconnect affected computers from the network. Unplug the ethernet cable or turn off Wi-Fi. Do NOT turn the computer off.",
            why: "Disconnecting stops the ransomware from spreading to other devices while preserving the evidence on the affected machine.",
            assignedTo: "it_contact",
          },
          {
            id: "r4",
            action:
              "Take photos of any ransom messages on screens with your phone. Note the exact time each was discovered and which device it appeared on.",
            why: "This documentation becomes evidence for law enforcement and your insurance claim. Time-stamped photos establish the timeline.",
            assignedTo: "incident_commander",
          },
          {
            id: "r5",
            action:
              "Notify {incident_commander} if they are not already aware. The incident commander makes all decisions from this point forward.",
            why: "A single decision-maker prevents conflicting actions and ensures the response follows the plan.",
            assignedTo: "first_responder",
          },
        ],
      },
      {
        title: "First Hour",
        subtitle: "Assess the damage. Activate your resources.",
        urgency: "high",
        steps: [
          {
            id: "r6",
            action:
              "Call your cyber insurance carrier: {insurance_carrier} at {insurance_claims_phone}. Provide policy number {insurance_policy_number}.",
            why: "Your carrier will assign a breach coach (usually a lawyer) within hours. The breach coach coordinates forensics, legal obligations, and communications. Call them before hiring your own vendors, as the carrier may have pre-approved firms that are covered under your policy.",
            assignedTo: "incident_commander",
            script:
              "Say: 'I need to report a cyber incident. My policy number is {insurance_policy_number}. We discovered a ransomware attack at approximately [time]. We have [contained / not yet contained] the affected systems. We have not paid any ransom. We need a breach coach assigned.'",
            critical: true,
          },
          {
            id: "r7",
            action:
              "Have {it_contact} determine the scope: How many devices are affected? Are servers impacted? Are backups intact? Is the attacker still in the network?",
            why: "Understanding scope determines every subsequent decision, from whether to shut down operations to what you tell your clients.",
            assignedTo: "it_contact",
            checklist: [
              "How many workstations show ransom messages?",
              "Are any servers affected?",
              "Can you access your backup console? Are backups intact and not encrypted?",
              "When did the earliest encryption begin? (check file timestamps)",
              "Is the attacker still active in the network? (check for ongoing encryption activity)",
            ],
          },
          {
            id: "r8",
            action:
              "Begin a written incident log. Document every action, every phone call, every decision, and the time it occurred.",
            why: "This log becomes a legal document. Your insurance carrier, lawyer, and potentially regulators will review it. Start now because reconstructing events later is unreliable.",
            assignedTo: "incident_commander",
          },
          {
            id: "r9",
            action: "If you have legal counsel, notify {legal_counsel}: {legal_counsel_phone}.",
            why: "Legal counsel should be involved early to advise on breach notification requirements, which vary by state and industry. Communications made under attorney-client privilege may be protected from disclosure.",
            assignedTo: "incident_commander",
            conditional: "has_legal_counsel",
          },
          {
            id: "r10",
            action:
              "Instruct all employees: Do not discuss the incident on social media, with clients, or with anyone outside the response team until {communications_lead} provides approved messaging.",
            why: "Premature or inaccurate public statements can increase legal liability and cause unnecessary panic. All external communication should go through one person with approved language.",
            assignedTo: "incident_commander",
          },
        ],
      },
      {
        title: "First 24 Hours",
        subtitle: "Stabilize operations. Begin recovery planning.",
        urgency: "medium",
        steps: [
          {
            id: "r11",
            action:
              "Work with {it_contact} and the carrier's forensics team to determine the attack vector: How did the ransomware get in?",
            why: "You must close the entry point before beginning recovery, otherwise the attacker can re-enter and encrypt your systems again.",
            assignedTo: "it_contact",
          },
          {
            id: "r12",
            action: "Force password resets on ALL accounts. Start with admin accounts and work down.",
            why: "The attacker likely has credentials. Resetting all passwords before restoring systems prevents immediate re-compromise.",
            assignedTo: "it_contact",
          },
          {
            id: "r13",
            action:
              "Assess whether operations can continue. Can employees work on unaffected systems? Is there a manual workaround for critical business functions?",
            why: "Business continuity decisions affect revenue, client relationships, and insurance claims. Document the operational impact.",
            assignedTo: "incident_commander",
          },
          {
            id: "r14",
            action:
              "If client data may have been accessed or exfiltrated, begin preparing breach notification with guidance from your breach coach and legal counsel.",
            why: "Most states require breach notification within 30 to 60 days. Some industries (healthcare, financial) have shorter deadlines. Your breach coach will advise on specific requirements.",
            assignedTo: "communications_lead",
            conditional: "data_possibly_compromised",
          },
          {
            id: "r15",
            action:
              "Begin restoring from backups only after the entry point is closed and forensics has cleared the environment.",
            why: "Restoring before the environment is clean risks re-infection. Your forensics team or IT provider needs to confirm the environment is safe before restore begins.",
            assignedTo: "it_contact",
          },
        ],
      },
      {
        title: "First Week",
        subtitle: "Recover, communicate, and document.",
        urgency: "standard",
        steps: [
          {
            id: "r16",
            action: "Continue system restoration in priority order based on your critical systems list.",
            why: "Restore the systems that affect revenue and client service first. Use your recovery priorities from the plan.",
            assignedTo: "it_contact",
          },
          {
            id: "r17",
            action:
              "If required, send breach notification to affected individuals and regulators per your breach coach's guidance.",
            why: "Timely, accurate notification is both a legal requirement and a trust-building action. Your breach coach provides the template.",
            assignedTo: "communications_lead",
          },
          {
            id: "r18",
            action:
              "File an IC3 report at ic3.gov. This is the FBI's Internet Crime Complaint Center. Your carrier may also require a police report.",
            why: "Law enforcement reporting is often required by insurance policies and may be required by regulation. The IC3 report creates a federal record of the crime.",
            assignedTo: "incident_commander",
          },
          {
            id: "r19",
            action:
              "Document the full cost of the incident: IT remediation, lost revenue, overtime, replacement equipment, legal fees, notification costs.",
            why: "This documentation supports your insurance claim and may be needed for tax purposes. Start tracking costs from day one.",
            assignedTo: "incident_commander",
          },
          {
            id: "r20",
            action:
              "Schedule a post-incident review within 2 weeks. Include everyone involved in the response. Document what worked, what failed, and what needs to change in the plan.",
            why: "The post-incident review turns a crisis into an improvement. Update this plan based on what you learned.",
            assignedTo: "incident_commander",
          },
        ],
      },
    ],
  },

  bec: {
    phases: [
      {
        title: "First 15 Minutes",
        subtitle: "If money was sent, time is critical.",
        urgency: "critical",
        steps: [
          {
            id: "b1",
            action:
              "If a wire transfer was sent, call your bank's fraud department IMMEDIATELY. Request a wire recall. Every minute matters for recovery.",
            why: "Banks can sometimes freeze or recall wire transfers, but only within a very short window (often 24 to 72 hours). Calling within the first hour dramatically increases the chance of recovery.",
            assignedTo: "incident_commander",
            critical: true,
            script:
              "Say: 'I need to report a fraudulent wire transfer. The transfer was sent on [date] for [amount] to [bank/account if known]. We believe the payment instructions were altered by a cyber criminal. I need to initiate a wire recall immediately.'",
          },
          {
            id: "b2",
            action:
              "Call {it_contact}. Report the compromised email account. Request immediate password reset and session revocation for the affected account.",
            why: "If the attacker is in someone's mailbox, they can see your response and send additional fraudulent messages. Lock them out first.",
            assignedTo: "incident_commander",
          },
          {
            id: "b3",
            action:
              "Do NOT reply to the suspicious email or communicate with the attacker. Forward the original email as an attachment (not inline) to your IT contact for analysis.",
            why: "Replying alerts the attacker that you're aware. Forwarding as an attachment preserves the email headers which contain forensic evidence.",
            assignedTo: "everyone",
          },
          {
            id: "b4",
            action:
              "Check the affected email account for mail forwarding rules, delegated access, or inbox rules that redirect messages. These are how attackers maintain access.",
            why: "Attackers commonly set up forwarding rules to receive copies of all incoming email, even after the password is changed. This is the most commonly missed step in BEC response.",
            assignedTo: "it_contact",
            checklist: [
              "Check inbox rules for forwarding to external addresses",
              "Check delegated access for unknown accounts",
              "Check sent items for messages the user did not send",
              "Check deleted items for evidence of attacker activity",
              "Review sign-in logs for unfamiliar locations or IP addresses",
            ],
          },
        ],
      },
      {
        title: "First Hour",
        subtitle: "Contain the compromise and assess scope.",
        urgency: "high",
        steps: [
          {
            id: "b5",
            action:
              "Call your cyber insurance carrier: {insurance_carrier} at {insurance_claims_phone}. Report the business email compromise.",
            why: "BEC losses are covered under most cyber policies. Your carrier needs to know immediately, especially if funds were transferred.",
            assignedTo: "incident_commander",
            script:
              "Say: 'I need to report a business email compromise. My policy number is {insurance_policy_number}. An employee [authorized a fraudulent wire transfer of $X / received a phishing email that compromised their account / other]. We have [recalled the wire / locked the compromised account]. We need guidance on next steps.'",
          },
          {
            id: "b6",
            action:
              "Determine if this was an isolated incident or if multiple accounts are compromised. Have {it_contact} review recent sign-in activity for all users.",
            why: "BEC attackers often compromise multiple accounts. Checking only the reported account misses lateral movement.",
            assignedTo: "it_contact",
          },
          {
            id: "b7",
            action:
              "If vendor payment details were altered, contact the real vendor directly using a known phone number (not from the suspicious email) to verify their actual bank details.",
            why: "Vendor email compromise (where the attacker is in your vendor's email, not yours) is a common variant. Verify payment changes by phone, never by email.",
            assignedTo: "incident_commander",
          },
          {
            id: "b8",
            action:
              "File an IC3 complaint at ic3.gov and request the Financial Fraud Kill Chain (FFKC) if the transfer exceeded $50,000.",
            why: "The IC3's FFKC process works with international banks to freeze fraudulent transfers. It has recovered hundreds of millions of dollars, but only works if filed quickly.",
            assignedTo: "incident_commander",
          },
        ],
      },
      {
        title: "First 24 Hours",
        subtitle: "Secure the environment and communicate.",
        urgency: "medium",
        steps: [
          {
            id: "b9",
            action:
              "Force MFA enrollment on all accounts that do not already have it. This is the single most effective prevention for future BEC.",
            why: "BEC almost always begins with a compromised password. MFA blocks credential-based attacks even if the password is known.",
            assignedTo: "it_contact",
          },
          {
            id: "b10",
            action:
              "Notify affected clients or partners if the attacker sent messages from your email accounts. Use approved language from {communications_lead}.",
            why: "If fraudulent messages were sent from your domain, the recipients need to know. Proactive notification protects your relationships and limits liability.",
            assignedTo: "communications_lead",
          },
          {
            id: "b11",
            action:
              "Implement a verbal verification policy for all wire transfers and payment changes. Any change to payment instructions must be confirmed by phone using a known number.",
            why: "This is the single most effective control against BEC. It costs nothing and prevents the most common attack pattern.",
            assignedTo: "incident_commander",
          },
          {
            id: "b12",
            action:
              "Document the full incident: timeline, financial impact, actions taken, accounts affected. This supports your insurance claim and any law enforcement action.",
            why: "Thorough documentation is required for insurance claims and may be needed for regulatory notification if client data was exposed through the compromised account.",
            assignedTo: "incident_commander",
          },
        ],
      },
    ],
  },

  data_breach: {
    phases: [
      {
        title: "First 15 Minutes",
        subtitle: "Preserve evidence. Contain the exposure.",
        urgency: "critical",
        steps: [
          {
            id: "d1",
            action:
              "Do NOT delete, modify, or attempt to 'fix' anything. Preserving the current state of systems is critical for forensic investigation.",
            why: "Deleting files, clearing logs, or modifying systems destroys evidence needed for the investigation, insurance claim, and potential law enforcement action.",
            assignedTo: "everyone",
            critical: true,
          },
          {
            id: "d2",
            action:
              "Call {it_contact}. Describe what was discovered: what data, where it was found, who discovered it, and when.",
            why: "Your IT contact needs to assess how the data was accessed and whether the access is ongoing.",
            assignedTo: "incident_commander",
          },
          {
            id: "d3",
            action:
              "If the unauthorized access is ongoing (active session, open connection), have {it_contact} revoke the access immediately while preserving logs.",
            why: "Stopping ongoing access takes priority over evidence preservation. Save logs first, then revoke.",
            assignedTo: "it_contact",
          },
          {
            id: "d4",
            action:
              "Document exactly what you know: What data was accessed? How many records? What types of information (names, SSNs, health records, financial data)?",
            why: "The type and volume of data determines your legal notification obligations, which vary significantly by state and data type.",
            assignedTo: "incident_commander",
          },
        ],
      },
      {
        title: "First Hour",
        subtitle: "Activate your response team.",
        urgency: "high",
        steps: [
          {
            id: "d5",
            action: "Call your cyber insurance carrier: {insurance_carrier} at {insurance_claims_phone}.",
            why: "Your carrier will assign a breach coach who specializes in notification requirements for your state and industry. Do not attempt to determine notification requirements yourself.",
            assignedTo: "incident_commander",
            script:
              "Say: 'I need to report a data breach. My policy number is {insurance_policy_number}. We discovered unauthorized access to [type of data]. Approximately [number] records may be affected. The access has been [contained / is ongoing].'",
            critical: true,
          },
          {
            id: "d6",
            action: "Contact {legal_counsel}. Engage them before communicating externally about the breach.",
            why: "Communications about a breach have legal implications. Attorney-client privilege protects certain communications. Your lawyer should review any external statements.",
            assignedTo: "incident_commander",
            conditional: "has_legal_counsel",
          },
          {
            id: "d7",
            action:
              "Have {it_contact} determine: Was data exfiltrated (copied out), or only accessed (viewed)? Check firewall logs, data transfer logs, and cloud audit trails.",
            why: "The distinction between 'accessed' and 'exfiltrated' affects notification requirements and risk level. Exfiltration is more severe.",
            assignedTo: "it_contact",
          },
          {
            id: "d8",
            action:
              "Begin the notification timeline clock. Note today's date. Most states require notification within 30 to 60 days of discovery.",
            why: "The notification clock starts when you discover the breach, not when you finish investigating. Knowing your deadline prevents compliance violations.",
            assignedTo: "incident_commander",
          },
        ],
      },
      {
        title: "First 24 to 72 Hours",
        subtitle: "Investigate, contain, and prepare notifications.",
        urgency: "medium",
        steps: [
          {
            id: "d9",
            action:
              "Work with forensics (assigned by your carrier) to determine the full scope: all systems accessed, all data involved, the attacker's method of entry, and whether they still have access.",
            why: "A thorough investigation prevents a second breach and satisfies regulatory requirements for demonstrating reasonable response.",
            assignedTo: "it_contact",
          },
          {
            id: "d10",
            action:
              "Prepare a list of affected individuals based on the forensic findings. Categorize by data type exposed (PII, PHI, financial).",
            why: "Notification requirements differ based on what data was exposed. Health data triggers HIPAA. Financial data may trigger GLBA. SSNs trigger state notification laws.",
            assignedTo: "incident_commander",
          },
          {
            id: "d11",
            action:
              "Draft notification letters with your breach coach. Determine whether to offer credit monitoring or identity theft protection.",
            why: "Most breach notification laws specify what the notification must contain. Your breach coach provides compliant templates. Credit monitoring is standard for SSN or financial data exposure.",
            assignedTo: "communications_lead",
          },
          {
            id: "d12",
            action:
              "File law enforcement report (local police and IC3). Determine whether state attorney general notification is required.",
            why: "Many states require notification to the state attorney general when a breach exceeds a certain number of individuals (often 500 or 1,000).",
            assignedTo: "incident_commander",
          },
          {
            id: "d13",
            action:
              "Close the vulnerability that allowed the breach. Document what changed and when. Update this response plan with lessons learned.",
            why: "Demonstrating that you identified and remediated the root cause is important for regulatory compliance, insurance claims, and preventing recurrence.",
            assignedTo: "it_contact",
          },
        ],
      },
    ],
  },

  phishing: {
    phases: [
      {
        title: "First 15 Minutes",
        subtitle: "Contain the compromised account.",
        urgency: "high",
        steps: [
          {
            id: "p1",
            action:
              "If someone entered credentials on a fake page, immediately reset their password and revoke all active sessions.",
            why: "The attacker has the password. Every second the account remains accessible, the attacker can read email, set up forwarding rules, and access connected systems.",
            assignedTo: "it_contact",
            critical: true,
          },
          {
            id: "p2",
            action:
              "Check the compromised account for: inbox forwarding rules, delegated access, recently sent emails the user did not write, and connected apps or OAuth permissions.",
            why: "These are the four ways attackers maintain persistence after a credential compromise. All four must be checked and cleaned.",
            assignedTo: "it_contact",
            checklist: [
              "Inbox rules forwarding to external addresses",
              "Delegated access from unknown accounts",
              "Sent items containing messages the user did not write",
              "OAuth app permissions for unfamiliar applications",
              "Sign-in logs showing unfamiliar IP addresses or locations",
            ],
          },
          {
            id: "p3",
            action:
              "Determine if anyone else received the same phishing email. Search the organization's email for the sender address, subject line, or URL from the phishing message.",
            why: "Phishing campaigns rarely target one person. Finding and removing the email from other inboxes prevents additional compromises.",
            assignedTo: "it_contact",
          },
          {
            id: "p4",
            action:
              "Report the phishing email: forward it to reportphishing@apwg.org and report it to your email provider (Microsoft: use the Report Message button, Google: Report phishing).",
            why: "Reporting helps email providers block the phishing site for other potential victims.",
            assignedTo: "incident_commander",
          },
        ],
      },
      {
        title: "First Hour",
        subtitle: "Assess impact and notify the team.",
        urgency: "medium",
        steps: [
          {
            id: "p5",
            action:
              "Determine if the attacker accessed any sensitive data through the compromised account. Review recent email and file access activity.",
            why: "If the compromised account had access to client data, financial information, or health records, this may escalate to a reportable data breach.",
            assignedTo: "it_contact",
          },
          {
            id: "p6",
            action:
              "If data was likely accessed, follow the Data Breach playbook from step d5 onward (call insurance carrier).",
            why: "A phishing incident that results in data access triggers the same notification and investigation requirements as any other breach.",
            assignedTo: "incident_commander",
            conditional: "data_possibly_compromised",
          },
          {
            id: "p7",
            action:
              "Send an internal notification to all employees: 'We are aware of phishing emails targeting our organization. If you received a similar email, do not click any links. If you already clicked, contact {it_contact} immediately.'",
            why: "Prompt internal communication prevents additional compromises. Employees who clicked but have not yet reported will come forward.",
            assignedTo: "communications_lead",
          },
          {
            id: "p8",
            action:
              "If MFA is not already required on the compromised account type, enable it immediately for all users.",
            why: "MFA would have prevented this incident. Implementing it now prevents the same attack from succeeding again.",
            assignedTo: "it_contact",
          },
          {
            id: "p9",
            action:
              "Document the incident: the phishing email (save as attachment), who clicked, what was accessed, timeline, and actions taken. Update the response plan if needed.",
            why: "This documentation serves as your incident record and is useful for employee training, insurance records, and identifying patterns if future phishing attempts occur.",
            assignedTo: "incident_commander",
          },
        ],
      },
    ],
  },

  lost_device: {
    phases: [
      {
        title: "First 15 Minutes",
        subtitle: "Lock it down remotely.",
        urgency: "high",
        steps: [
          {
            id: "l1",
            action:
              "Call {it_contact}. Report the lost or stolen device. Provide: device type, the employee's name, and whether the device is company-owned or personal (BYOD).",
            why: "Your IT contact needs to initiate a remote wipe or lock before the device can be accessed by whoever has it.",
            assignedTo: "incident_commander",
          },
          {
            id: "l2",
            action:
              "If your organization uses MDM (mobile device management), initiate a remote wipe or remote lock immediately.",
            why: "Remote wipe erases all data on the device. Remote lock prevents access while you determine whether a wipe is necessary. If the device is simply misplaced, lock first. If confirmed stolen, wipe.",
            assignedTo: "it_contact",
            conditional: "has_mdm",
          },
          {
            id: "l3",
            action:
              "If NO MDM is available, immediately change the passwords for every account accessible from that device: email, cloud storage, VPN, financial systems, CRM, and any other business applications.",
            why: "Without MDM, you cannot remotely wipe the device. Changing passwords is your only way to prevent access to company data through the saved sessions and passwords on the device.",
            assignedTo: "it_contact",
            critical: true,
            conditional: "no_mdm",
          },
          {
            id: "l4",
            action:
              "Determine what data was on the device. Was it encrypted (BitLocker, FileVault)? Was there client data, health records, financial information, or other sensitive data?",
            why: "If the device was encrypted, the data is protected even though the device is gone. If it was NOT encrypted and contained sensitive data, this may become a reportable data breach.",
            assignedTo: "it_contact",
            checklist: [
              "Was full-disk encryption (BitLocker/FileVault) enabled?",
              "Was the device protected with a strong password or biometric?",
              "What email accounts were accessible?",
              "Were client files stored locally or only in the cloud?",
              "Were any passwords saved in the browser?",
              "Was the device enrolled in MDM with remote wipe capability?",
            ],
          },
        ],
      },
      {
        title: "First Hour",
        subtitle: "Assess data exposure risk.",
        urgency: "medium",
        steps: [
          {
            id: "l5",
            action:
              "If the device was NOT encrypted and contained sensitive data (PII, PHI, financial records), treat this as a potential data breach. Call your insurance carrier: {insurance_carrier} at {insurance_claims_phone}.",
            why: "An unencrypted device with sensitive data constitutes a presumed data breach under most state laws unless you can prove the data was not accessed.",
            assignedTo: "incident_commander",
            conditional: "unencrypted_sensitive_data",
          },
          {
            id: "l6",
            action:
              "If the device was stolen (not just lost), file a police report. Keep the report number for your insurance claim.",
            why: "A police report creates an official record and is typically required for insurance claims involving stolen property.",
            assignedTo: "incident_commander",
          },
          {
            id: "l7",
            action:
              "Review sign-in activity for the employee's accounts. Look for any access from unfamiliar devices or locations after the device was lost.",
            why: "Sign-in logs tell you whether someone used the lost device to access company data. This determines whether data was actually compromised or just at risk.",
            assignedTo: "it_contact",
          },
          {
            id: "l8",
            action:
              "Document the incident: device type, encryption status, data stored, actions taken, and timeline. If data breach is confirmed, follow the Data Breach playbook.",
            why: "Complete documentation supports insurance claims and regulatory compliance.",
            assignedTo: "incident_commander",
          },
        ],
      },
    ],
  },
}

/**
 * Replace {placeholder} tokens in a step's action/script/why fields with
 * values from the user's saved IR plan. Missing values fall back to a clear
 * placeholder so the user can see what they still need to fill in.
 */
const FALLBACK = {
  incident_commander:
    "[Incident Commander not on file - update your plan at datahygienics.com/tools/ir-plan/builder]",
  it_contact:
    "[IT contact not on file - update your plan at datahygienics.com/tools/ir-plan/builder]",
  it_contact_backup:
    "[no backup IT number on file - try the main IT line again]",
  communications_lead:
    "[Communications lead not on file - update your plan at datahygienics.com/tools/ir-plan/builder]",
  legal_counsel:
    "[Legal counsel not on file - your insurance carrier's breach coach can stand in until you have one]",
  legal_counsel_phone:
    "[legal counsel phone not on file - check your engagement letter or call the firm directly]",
  insurance_carrier:
    "[Insurance carrier not on file - check your policy declaration page]",
  insurance_claims_phone:
    "[claims phone not on file - check the first page of your policy document or call your insurance broker immediately]",
  insurance_policy_number:
    "[policy number not on file - check your policy declaration page]",
  generic_phone: "[no phone on file - check email or directory]",
}

export function buildPlanContext(plan) {
  if (!plan) return {}
  const ic = plan.incident_commander || {}
  const it = plan.it_contact || {}
  const cl = plan.communications_lead || {}
  const lc = plan.legal_counsel || {}
  const ins = plan.insurance_info || {}
  const phoneOf = (c) =>
    c.phone || c.after_hours_phone || c.backup_phone || FALLBACK.generic_phone

  return {
    incident_commander: ic.name || FALLBACK.incident_commander,
    incident_commander_phone: phoneOf(ic),
    it_contact: it.name || FALLBACK.it_contact,
    it_contact_phone: phoneOf(it),
    it_contact_backup:
      it.after_hours_phone || it.phone || FALLBACK.it_contact_backup,
    communications_lead: cl.name || FALLBACK.communications_lead,
    communications_lead_phone: phoneOf(cl),
    legal_counsel: lc.name || FALLBACK.legal_counsel,
    legal_counsel_phone: lc.phone || FALLBACK.legal_counsel_phone,
    insurance_carrier: ins.carrier || FALLBACK.insurance_carrier,
    insurance_claims_phone: ins.claims_phone || FALLBACK.insurance_claims_phone,
    insurance_policy_number:
      ins.policy_number || FALLBACK.insurance_policy_number,
  }
}

export function interpolate(text, ctx) {
  if (!text) return text
  return text.replace(/\{(\w+)\}/g, (m, key) => {
    if (ctx[key] !== undefined && ctx[key] !== null && ctx[key] !== "") return ctx[key]
    return m
  })
}

/**
 * Returns a list of critical contact gaps in the user's saved plan. Used as
 * a preflight check before activating Active Incident Mode so the user knows
 * which placeholders they will see during the response.
 */
export function getPlanReadinessWarnings(plan) {
  if (!plan) return []
  const warnings = []
  if (!plan.incident_commander?.phone) {
    warnings.push({ field: "Incident Commander phone" })
  }
  if (!plan.it_contact?.phone) {
    warnings.push({ field: "IT Contact phone" })
  }
  if (!plan.communications_lead?.phone) {
    warnings.push({ field: "Communications Lead phone" })
  }
  // Insurance: required if has_insurance was answered yes
  if (plan.insurance_info?.has_insurance === "yes") {
    if (!plan.insurance_info?.claims_phone) {
      warnings.push({ field: "Insurance claims phone" })
    }
    if (!plan.insurance_info?.carrier) {
      warnings.push({ field: "Insurance carrier name" })
    }
  }
  return warnings
}

export function interpolateStep(step, ctx) {
  return {
    ...step,
    action: interpolate(step.action, ctx),
    why: interpolate(step.why, ctx),
    script: step.script ? interpolate(step.script, ctx) : null,
  }
}
