// Tabletop exercise scenarios. Each scenario walks the user through 5 to 7
// realistic decision points. Each option is scored: best (10), acceptable
// (3 to 5), problematic (0 to 1). Feedback explains why.

export const SCENARIOS = {
  ransomware: {
    type: "ransomware",
    title: "Monday Morning Lockout",
    estimatedMinutes: "15-20",
    narrative_intro:
      "It is Monday at 8:15 AM. Your office manager, Sarah, calls you. 'None of us can open any files on the shared drive. There is a message on every computer that says our files are encrypted and we need to pay $75,000 in Bitcoin to get them back. What do I tell everyone?'",
    stages: [
      {
        id: "s1",
        narrative:
          "Sarah is on the phone. Employees are arriving and asking what is happening. Your phone is ringing from a client who says they received a strange email from your company overnight.",
        question: "What is your first action?",
        options: [
          {
            text: "Tell Sarah to have everyone step away from their computers and not touch anything. Then call your IT contact.",
            score: 10,
            best: true,
            feedback:
              "Excellent. This preserves evidence and prevents the ransomware from spreading further through user interaction. Calling IT first is the right priority.",
          },
          {
            text: "Tell Sarah to shut down all the computers immediately to stop the ransomware.",
            score: 3,
            feedback:
              "Understandable instinct, but shutting down computers can destroy forensic evidence stored in memory (RAM) that investigators need. The better approach is to disconnect from the network but leave machines powered on.",
          },
          {
            text: "Go online and research the ransom message to see if there is a known decryption tool.",
            score: 1,
            feedback:
              "While free decryption tools do exist for some ransomware variants, spending time researching delays critical response steps. Your IT contact and your insurance carrier's forensics team are better equipped to determine if a decryptor exists.",
          },
          {
            text: "Call the number in the ransom message to negotiate.",
            score: 0,
            feedback:
              "Never contact the attackers directly. This confirms your organization is a responsive target, can increase the demand, and may create legal issues. Your insurance carrier's negotiation specialists are trained for this if negotiation becomes necessary.",
          },
        ],
      },
      {
        id: "s2",
        narrative:
          "It is now 8:45 AM. Your IT contact is on the way. Sarah mentions that one of the employees just clicked the ransom message to 'see what it says' and is asking if she should let the attackers know they have insurance.",
        question: "How do you respond?",
        options: [
          {
            text: "Tell everyone: do not click anything, do not communicate with the attackers, and do not discuss insurance status with anyone outside the response team.",
            score: 10,
            best: true,
            feedback:
              "Correct. Discussing insurance with attackers gives them leverage to set the ransom at exactly your coverage limit. Restricting communication to a single channel prevents conflicting messages.",
          },
          {
            text: "Have the employee write down what the ransom message said before they close it.",
            score: 5,
            feedback:
              "Documentation is important, but a phone photo of the screen is faster and preserves more evidence than transcribing. Make sure they leave the message on the screen for now.",
          },
          {
            text: "Let employees discuss what they're seeing so you can build a complete picture.",
            score: 1,
            feedback:
              "Unstructured discussion creates rumors and conflicting accounts. Your incident commander should be the only person collecting and consolidating information.",
          },
        ],
      },
      {
        id: "s3",
        narrative:
          "It is 9:30 AM. Your IT provider has confirmed that ransomware spread from a compromised user account to your file server overnight. Backups exist and appear unaffected. Approximately 40 workstations are encrypted. The attacker may still be in the network.",
        question: "What is your next priority?",
        options: [
          {
            text: "Call your cyber insurance carrier before doing anything else, including starting recovery.",
            score: 10,
            best: true,
            feedback:
              "Correct. Calling the carrier triggers breach coach assignment and forensic engagement. Many policies require notification before vendors are hired. Starting recovery before the carrier is involved can void coverage.",
          },
          {
            text: "Have IT begin restoring from backups immediately so you can resume operations by lunchtime.",
            score: 1,
            feedback:
              "Restoring before forensics has identified the attack vector means the attacker can re-encrypt the restored systems. This is one of the most common and expensive mistakes in ransomware response.",
          },
          {
            text: "Notify law enforcement (local police) before contacting insurance.",
            score: 4,
            feedback:
              "Law enforcement notification is important and often required, but it should follow insurance notification. Your breach coach will guide you on which agency to contact and when.",
          },
          {
            text: "Email all clients to warn them that their data may be at risk.",
            score: 0,
            feedback:
              "Premature client notification, before you know what was actually accessed, creates panic, potentially incorrect statements, and unnecessary liability. Your breach coach drafts approved language for client communications.",
          },
        ],
      },
      {
        id: "s4",
        narrative:
          "It is 11:00 AM. Your insurance carrier has assigned a breach coach (a lawyer) and a forensics firm. The breach coach is asking for your written incident log: who discovered it, when, what actions you have taken, and who has been involved.",
        question: "What do you provide?",
        options: [
          {
            text: "A timestamped log written from the moment Sarah called you, including every phone call and decision since.",
            score: 10,
            best: true,
            feedback:
              "This is exactly what the breach coach needs. A contemporaneous timeline is invaluable for the legal investigation, the insurance claim, and any required regulatory notifications.",
          },
          {
            text: "A general summary of what happened, written from memory.",
            score: 3,
            feedback:
              "Better than nothing, but reconstructed timelines are unreliable and may be questioned later. Going forward, document everything in real time.",
          },
          {
            text: "Tell the breach coach you'll prepare it later, after you've handled the immediate crisis.",
            score: 0,
            feedback:
              "Documentation IS the immediate work. By the time the crisis is over, key details will be lost. Assign someone to maintain the log starting right now if you have not already.",
          },
        ],
      },
      {
        id: "s5",
        narrative:
          "It is now 4:00 PM. Forensics has identified the entry point: a user clicked a phishing email two days ago and entered their credentials on a fake Microsoft login page. The attacker used those credentials to access email, then escalated to the file server. Forensics has cleared the environment. You are ready to plan recovery.",
        question: "Before you begin restoring from backups, what must happen?",
        options: [
          {
            text: "Force a password reset on every account, starting with admins, and confirm MFA is enforced everywhere.",
            score: 10,
            best: true,
            feedback:
              "Critical step. The attacker likely has multiple credentials. Restoring without resetting passwords means the attacker can immediately re-enter the restored environment.",
          },
          {
            text: "Begin restoring the file server first since that is where the most data lives.",
            score: 4,
            feedback:
              "Starting with the highest-impact system has merit, but only after credentials are rotated. Otherwise you are just rebuilding for the same attacker to encrypt again.",
          },
          {
            text: "Reimage every workstation from scratch, including the ones not encrypted.",
            score: 5,
            feedback:
              "Comprehensive but expensive. Forensics should determine which devices were touched. Reimaging clean devices wastes time during a recovery.",
          },
          {
            text: "Skip the backup restore entirely. Start everyone fresh from a new file structure.",
            score: 1,
            feedback:
              "You would lose all your client work, financial records, and history. The whole reason backups exist is to avoid this outcome.",
          },
        ],
      },
      {
        id: "s6",
        narrative:
          "Three days later, recovery is mostly complete. The breach coach informs you that based on what forensics found, approximately 200 client records were potentially accessed, including names, email addresses, and project files. Your state requires breach notification within 60 days for incidents affecting more than 250 individuals; below that, notification is optional but recommended.",
        question: "What do you do?",
        options: [
          {
            text: "Notify the affected clients proactively with breach coach approved language, even though the incident is below the legal threshold.",
            score: 10,
            best: true,
            feedback:
              "Proactive notification preserves trust and demonstrates good faith. Clients hearing about the incident from you, on your terms, is far better than learning about it later from another source.",
          },
          {
            text: "Stay silent since you are below the legal notification threshold.",
            score: 2,
            feedback:
              "Legally permissible, but a serious miscalculation. If clients learn later (and they often do), the betrayal of trust costs more than the disclosure would have. Your reputation is the asset you should protect.",
          },
          {
            text: "Notify clients but downplay the severity to minimize concern.",
            score: 1,
            feedback:
              "Inaccurate communication creates legal risk and breaks trust if the truth surfaces. Always use language reviewed by your breach coach.",
          },
        ],
      },
      {
        id: "s7",
        narrative:
          "Two weeks later, operations are back to normal. You are completing the post-incident review.",
        question: "Which of these is the most valuable outcome of the review?",
        options: [
          {
            text: "Update the incident response plan with what worked, what failed, and what should change next time.",
            score: 10,
            best: true,
            feedback:
              "The whole point of an incident response plan is that it gets better after each test or real event. Capture lessons while they are fresh.",
          },
          {
            text: "Identify which employee clicked the phishing email and require them to take training.",
            score: 3,
            feedback:
              "Training has value, but blaming individuals creates a culture where people hide mistakes. The phishing email was sophisticated. The systemic fix (MFA, conditional access) matters more than punishment.",
          },
          {
            text: "Calculate the total cost of the incident for budget reporting.",
            score: 5,
            feedback:
              "Cost tracking is necessary for the insurance claim and tax reporting, but it is not the most important outcome. Improving the plan is.",
          },
        ],
      },
    ],
  },

  bec: {
    type: "bec",
    title: "The Wire That Was Not Yours",
    estimatedMinutes: "15-20",
    narrative_intro:
      "Your bookkeeper, Marcus, walks into your office looking pale. 'I just got off the phone with our biggest vendor. They say they never received the $87,000 payment we wired last week. But I have the email confirmation right here. They specifically asked me to update their bank info before sending it.'",
    stages: [
      {
        id: "s1",
        narrative: "Marcus is showing you the email. The sender's name looks correct, but the email address has an extra letter you did not notice before.",
        question: "What is your first call?",
        options: [
          {
            text: "Call your bank's fraud department and request an immediate wire recall.",
            score: 10,
            best: true,
            feedback:
              "Time is everything with BEC. Banks can sometimes recall fraudulent wires within the first 72 hours, but only if you call immediately. Every minute reduces the chance of recovery.",
          },
          {
            text: "Reply to the suspicious email and demand an explanation.",
            score: 0,
            feedback:
              "This alerts the attacker that you are aware and gives them time to move the funds. Never communicate with the attacker.",
          },
          {
            text: "Call the real vendor (using a known number, not the email) and apologize.",
            score: 3,
            feedback:
              "Eventually yes, but this comes after the bank call. The bank recall window is the smallest, so it gets the highest priority.",
          },
          {
            text: "Email your insurance broker for guidance.",
            score: 2,
            feedback:
              "Your insurance carrier needs to know, but a phone call to the bank is the time-sensitive action. Contact insurance after the wire recall is initiated.",
          },
        ],
      },
      {
        id: "s2",
        narrative:
          "The bank has filed a recall request, but says recovery is uncertain. You ask Marcus how the email arrived. He explains it came from what looked like the vendor's normal contact, with a real-looking PDF invoice attached and 'updated bank details for our new accounting system.'",
        question: "What is your next priority?",
        options: [
          {
            text: "Have IT immediately check whether the bookkeeper's email account has been compromised, including looking for forwarding rules.",
            score: 10,
            best: true,
            feedback:
              "Excellent. BEC often involves a compromise on either side of the transaction. Even if the attacker was in the vendor's email, you need to verify nothing similar happened in yours.",
          },
          {
            text: "Tell Marcus this was his fault for not catching the wrong email address.",
            score: 0,
            feedback:
              "Blaming the employee is counterproductive and inaccurate. These attacks are designed to slip past careful people. Focus on systemic prevention, not blame.",
          },
          {
            text: "Search for the attacker on social media to see who they are.",
            score: 1,
            feedback:
              "Wasted effort. BEC attackers operate from compromised infrastructure and stolen identities. Investigation is the FBI's job, not yours.",
          },
        ],
      },
      {
        id: "s3",
        narrative:
          "IT discovers that yes, Marcus's email account had a forwarding rule set up six weeks ago that quietly copied every message containing 'invoice' or 'payment' to an external Gmail address. The attacker had been watching for the right moment.",
        question: "What do you do next?",
        options: [
          {
            text: "Call your cyber insurance carrier and report the BEC incident with the full timeline.",
            score: 10,
            best: true,
            feedback:
              "BEC losses are typically covered under cyber policies. Your carrier needs to know quickly so they can guide the response and help maximize recovery.",
          },
          {
            text: "File a complaint at ic3.gov immediately and request the Financial Fraud Kill Chain.",
            score: 8,
            feedback:
              "Excellent action and absolutely should be done. The FFKC has recovered millions of dollars in BEC fraud, but only when filed quickly. Insurance call should still go first to coordinate the response.",
          },
          {
            text: "Reset Marcus's password and consider the matter handled.",
            score: 2,
            feedback:
              "A password reset alone misses the forwarding rule, the OAuth permissions the attacker may have granted, and the broader investigation needed.",
          },
        ],
      },
      {
        id: "s4",
        narrative:
          "Your insurance carrier has engaged. The breach coach asks: 'Which other accounts in your organization should we be checking? BEC attackers often compromise multiple mailboxes before they strike.'",
        question: "What do you tell them?",
        options: [
          {
            text: "All of them. Have IT pull sign-in logs and inbox rules for every user account.",
            score: 10,
            best: true,
            feedback:
              "Correct. Lateral movement is common. Checking only the obviously compromised account misses the larger compromise.",
          },
          {
            text: "Just the ones with access to financial systems, since those are the BEC targets.",
            score: 5,
            feedback:
              "A reasonable starting point, but BEC attackers also use any compromised account to move laterally. Comprehensive review is safer.",
          },
          {
            text: "None. The vendor was the one who got compromised, not us.",
            score: 1,
            feedback:
              "But you just discovered a forwarding rule on your bookkeeper's account. The attacker was inside your environment. This needs full investigation.",
          },
        ],
      },
      {
        id: "s5",
        narrative:
          "Investigation finds two more accounts with suspicious activity, both cleaned up. The wire recall partially succeeded; you recovered about $52,000 of the $87,000. Your insurance is processing the claim for the rest.",
        question: "What is the single most important control to implement now to prevent recurrence?",
        options: [
          {
            text: "Implement a mandatory verbal verification policy for all wire transfers and payment changes, using a known phone number.",
            score: 10,
            best: true,
            feedback:
              "This is the single most effective control against BEC. It costs nothing and would have prevented this entire incident.",
          },
          {
            text: "Train every employee to spot phishing emails better.",
            score: 5,
            feedback:
              "Training helps but does not eliminate the risk. Sophisticated phishing slips past trained users. A control that does not depend on user vigilance is more reliable.",
          },
          {
            text: "Switch banks to one with better fraud detection.",
            score: 2,
            feedback:
              "Bank fraud detection is helpful but does not replace your own controls. Every bank can be defrauded.",
          },
          {
            text: "Set up complex email filtering rules to block lookalike domains.",
            score: 6,
            feedback:
              "Good defense in depth, but harder to maintain than a verbal verification policy and easier for attackers to bypass.",
          },
        ],
      },
      {
        id: "s6",
        narrative:
          "Three weeks later, you are debriefing the team. The vendor whose identity was used has asked what they should be doing on their end.",
        question: "What advice do you give them?",
        options: [
          {
            text: "Review their own email security, enable MFA on all accounts, and ask their IT to look for inbox rules on their accounts too.",
            score: 10,
            best: true,
            feedback:
              "Helpful and protective of the relationship. The vendor was likely the actual point of compromise. Helping them fix it benefits everyone.",
          },
          {
            text: "Tell them they need to switch email providers.",
            score: 3,
            feedback:
              "Switching providers does not solve the underlying issue. The compromise pattern works against any email provider that does not have MFA enforced.",
          },
          {
            text: "Decline to give advice since it is not your responsibility.",
            score: 2,
            feedback:
              "Technically true, but your relationships with vendors depend on partnership. Helping them prevents a recurrence and preserves trust.",
          },
        ],
      },
    ],
  },

  data_breach: {
    type: "data_breach",
    title: "The Folder That Should Not Be Public",
    estimatedMinutes: "15-20",
    narrative_intro:
      "An employee from your healthcare partner organization calls. 'Hey, I was searching for one of your reports on Google and the results showed a folder full of your client records. I think it might be public by accident.' She sends you a link. You click it and see hundreds of patient files, indexed by Google.",
    stages: [
      {
        id: "s1",
        narrative:
          "The link works from your phone, no login required. There are at least 400 files visible.",
        question: "What is your first action?",
        options: [
          {
            text: "Take a screenshot of what is visible (without downloading), then call IT immediately to get the folder secured.",
            score: 10,
            best: true,
            feedback:
              "Document the exposure for the investigation, then close the hole. Both matter, in this order.",
          },
          {
            text: "Delete the folder immediately so the data is no longer exposed.",
            score: 2,
            feedback:
              "Deleting destroys evidence needed for the investigation, the insurance claim, and any potential regulatory action. Securing access (changing permissions) is different from deleting.",
          },
          {
            text: "Change the folder permissions yourself if you have access, before notifying anyone.",
            score: 4,
            feedback:
              "Securing the folder is important but if you make permission changes without IT involvement, you may inadvertently destroy logs. IT should make the change while preserving the audit trail.",
          },
          {
            text: "Call the partner who notified you and thank them, then think about what to do next.",
            score: 1,
            feedback:
              "Politeness is fine, but every minute the data sits exposed is more risk. Call IT first, thank the partner second.",
          },
        ],
      },
      {
        id: "s2",
        narrative:
          "IT confirms the folder permissions were changed three months ago to 'Anyone with the link.' Logs show approximately 60 unique IP addresses accessed files in that folder over the three months. The data includes patient names, dates of birth, and treatment notes.",
        question: "What is your next call?",
        options: [
          {
            text: "Call your cyber insurance carrier and report a HIPAA-affecting data breach.",
            score: 10,
            best: true,
            feedback:
              "Healthcare data triggers HIPAA, which has strict notification requirements. Your carrier and breach coach will guide the HIPAA-specific obligations.",
          },
          {
            text: "Call your local police department to report the breach.",
            score: 3,
            feedback:
              "Important eventually, but police are not equipped for data breach response. Your insurance carrier and breach coach are. Call them first.",
          },
          {
            text: "Email all your patients to let them know.",
            score: 1,
            feedback:
              "Premature. HIPAA notification has specific content requirements and timing rules. Your breach coach drafts the notification to ensure compliance.",
          },
          {
            text: "Hire a forensics firm yourself to investigate.",
            score: 4,
            feedback:
              "You may need forensics, but your insurance carrier likely has pre-approved firms covered under your policy. Hiring your own first may mean paying out of pocket.",
          },
        ],
      },
      {
        id: "s3",
        narrative:
          "The breach coach is on the line. She asks: 'Do you have legal counsel of your own, or should we proceed with our breach coach as your sole attorney?'",
        question: "What do you say?",
        options: [
          {
            text: "Use both. Your existing lawyer for general business matters, the breach coach for breach-specific work, and have them coordinate.",
            score: 10,
            best: true,
            feedback:
              "Excellent. Breach coaches are specialists in this exact situation. Your regular lawyer may not have the same depth in breach notification law. Both serve different roles.",
          },
          {
            text: "Use only your existing lawyer since you trust them.",
            score: 3,
            feedback:
              "Your regular lawyer is unlikely to have the breach notification expertise needed. Insist on at least consulting with a specialist.",
          },
          {
            text: "Use only the breach coach since they're the experts.",
            score: 6,
            feedback:
              "Reasonable, but your existing counsel has institutional knowledge of your business that the breach coach does not. Coordination between both is ideal.",
          },
        ],
      },
      {
        id: "s4",
        narrative:
          "Forensics determines that data was likely accessed by 60 different IP addresses, including some in foreign countries. Your state requires breach notification within 60 days for any incident affecting more than 500 individuals. The folder contained records on 412 patients.",
        question: "What is your notification obligation?",
        options: [
          {
            text: "Trigger HIPAA notification regardless of state law thresholds, since healthcare data is involved.",
            score: 10,
            best: true,
            feedback:
              "HIPAA applies regardless of state numerical thresholds. The 60-individual access pattern almost certainly triggers HIPAA notification requirements. Your breach coach will guide the specifics.",
          },
          {
            text: "Wait, since you are below the state's 500-person threshold.",
            score: 1,
            feedback:
              "Federal HIPAA requirements override state thresholds for healthcare data. Waiting could create both regulatory penalties and reputational harm.",
          },
          {
            text: "Notify the state attorney general but not the patients.",
            score: 2,
            feedback:
              "Patient notification is the legal requirement under HIPAA. Notifying only the AG misses the most important step.",
          },
        ],
      },
      {
        id: "s5",
        narrative:
          "Your breach coach drafts the notification letters. She asks whether you want to offer credit monitoring or identity theft protection for the affected patients.",
        question: "What is your decision?",
        options: [
          {
            text: "Yes. Offering credit monitoring is standard practice for breaches involving health data and demonstrates good faith.",
            score: 10,
            best: true,
            feedback:
              "Even though the technical risk from medical-only data is lower than financial data, the gesture matters for trust and is often expected.",
          },
          {
            text: "No, since the data did not include Social Security numbers.",
            score: 4,
            feedback:
              "Defensible position but a missed opportunity to maintain patient trust. The cost is small and the goodwill is significant.",
          },
          {
            text: "Yes, but only if your insurance covers the cost.",
            score: 6,
            feedback:
              "Practical, but the better question is what is right for your patients. Most cyber policies cover credit monitoring as part of breach response.",
          },
        ],
      },
      {
        id: "s6",
        narrative:
          "Six weeks after the discovery, notifications have been sent. Three patients have responded with concerns. One has hired a lawyer. The state department of health has opened an inquiry.",
        question: "How do you respond to the regulator inquiry?",
        options: [
          {
            text: "Cooperate fully through your breach coach, providing the timeline, the technical details, and the corrective actions you have taken.",
            score: 10,
            best: true,
            feedback:
              "Regulators are far more lenient with organizations that cooperate transparently and demonstrate good-faith remediation than with those that stonewall.",
          },
          {
            text: "Decline to respond until they issue a formal subpoena.",
            score: 1,
            feedback:
              "Adversarial posture invites adversarial outcomes. Cooperation is almost always the right path with healthcare regulators.",
          },
          {
            text: "Respond directly without involving the breach coach to keep things simple.",
            score: 2,
            feedback:
              "Communications with regulators have legal implications. Your breach coach should review or send everything.",
          },
        ],
      },
    ],
  },

  phishing: {
    type: "phishing",
    title: "The Login That Was Not Real",
    estimatedMinutes: "15-20",
    narrative_intro:
      "It is 3:00 PM on a Wednesday. One of your senior staff, Priya, walks into your office. 'I think I just messed up. I got an email that said my Microsoft 365 password was expiring, I clicked the link, and I entered my password. Then it said the system was down and to try again later. I just realized the URL did not look right.'",
    stages: [
      {
        id: "s1",
        narrative:
          "Priya is your senior project manager. She has access to email, the shared drive, financial reports, and client files.",
        question: "What is your first action?",
        options: [
          {
            text: "Immediately reset Priya's password and have IT revoke all active sessions on her account.",
            score: 10,
            best: true,
            feedback:
              "Speed matters. Every minute the attacker has those credentials, they can read email, set forwarding rules, and access connected systems. Revoke first, investigate second.",
          },
          {
            text: "Have Priya try logging in to confirm the attacker has access.",
            score: 1,
            feedback:
              "Pointless and risky. Assume the credentials are compromised. Verifying does not change the response, it just delays it.",
          },
          {
            text: "Send Priya home for the day so she does not cause further problems.",
            score: 0,
            feedback:
              "Counterproductive. Priya is your most important witness for what happened. Sending her home reinforces shame, which discourages future reporting.",
          },
          {
            text: "Tell Priya she should have known better.",
            score: 0,
            feedback:
              "Blaming the user is exactly the wrong response. Phishing succeeds because attacks are sophisticated. Punishing reporting trains people to hide mistakes.",
          },
        ],
      },
      {
        id: "s2",
        narrative:
          "IT has reset Priya's password and revoked sessions. They now ask: 'What else should I check?'",
        question: "What four things must IT check on Priya's account?",
        options: [
          {
            text: "Inbox forwarding rules, delegated access, sent items the user did not write, and OAuth app permissions.",
            score: 10,
            best: true,
            feedback:
              "These are the four primary persistence mechanisms after a credential compromise. Missing any one of them lets the attacker maintain access even after a password reset.",
          },
          {
            text: "Just the inbox rules. That is the most common one.",
            score: 4,
            feedback:
              "Inbox rules are the most common, but checking only those misses the other three. Persistent attackers use multiple mechanisms.",
          },
          {
            text: "Just check sign-in history to see where the attacker logged in from.",
            score: 3,
            feedback:
              "Useful for understanding scope, but does not address persistence. The sign-in history tells you what happened, not what is still active.",
          },
        ],
      },
      {
        id: "s3",
        narrative:
          "IT finds an inbox rule that was created 12 minutes after Priya entered her password. The rule forwards any email containing the words 'wire,' 'invoice,' 'password,' or 'login' to an external address. They remove the rule. They also see 6 sign-ins from a foreign country in the past hour.",
        question: "What is your next step?",
        options: [
          {
            text: "Have IT search the entire organization's email for the same phishing message and remove it from any inboxes that received it.",
            score: 10,
            best: true,
            feedback:
              "Phishing campaigns rarely target one person. Finding and removing the email from other inboxes prevents additional compromises before they happen.",
          },
          {
            text: "Send an all-staff email warning about the phishing attempt.",
            score: 7,
            feedback:
              "Important and you should do this. But do the technical removal first; you do not want curious employees clicking the email after the warning.",
          },
          {
            text: "Wait to see if anyone else reports being phished.",
            score: 1,
            feedback:
              "Reactive when you can be proactive. Hunt for the email actively rather than waiting.",
          },
        ],
      },
      {
        id: "s4",
        narrative:
          "Three other employees received the same phishing email. None of them clicked. The email is now removed from all inboxes. IT asks: 'Should we treat this as a data breach?'",
        question: "How do you decide?",
        options: [
          {
            text: "Determine whether the attacker had time to access sensitive data through Priya's account before her credentials were revoked, then consult your breach coach.",
            score: 10,
            best: true,
            feedback:
              "The right question is: what could the attacker have accessed in those 12+ minutes? If the answer includes regulated or sensitive data, it may be a notifiable breach. Your breach coach makes the call.",
          },
          {
            text: "Yes, automatically. Any successful phishing is a breach.",
            score: 5,
            feedback:
              "Conservative and defensible. Some breach notification laws define 'breach' as unauthorized access to data, which could apply here. Your breach coach provides the legal interpretation.",
          },
          {
            text: "No. The credentials were reset quickly, so it is not a breach.",
            score: 2,
            feedback:
              "Speed of response matters but does not automatically determine whether it is a notifiable breach. The legal question is whether unauthorized access occurred, not how long it lasted.",
          },
        ],
      },
      {
        id: "s5",
        narrative:
          "Forensics confirms the attacker accessed approximately 30 emails in the financial reporting folder during the 14 minutes they had access. None of the emails contained client SSNs or health data, but they did contain unredacted internal financial figures.",
        question: "Is this a reportable breach?",
        options: [
          {
            text: "Probably not legally reportable, but consider notifying the board and any contractually obligated parties.",
            score: 10,
            best: true,
            feedback:
              "Internal financial data without personal information typically does not trigger state breach notification laws, but contracts with investors, partners, or auditors may require disclosure. Talk to your breach coach to be sure.",
          },
          {
            text: "Yes, send notification to all employees and clients.",
            score: 4,
            feedback:
              "Over-notification creates unnecessary alarm. Notification should be targeted and based on legal/contractual requirements.",
          },
          {
            text: "No, and there is no need to mention it to anyone.",
            score: 3,
            feedback:
              "Quiet on the legal front, but board and stakeholders typically expect to be informed of security incidents. Document and report internally.",
          },
        ],
      },
      {
        id: "s6",
        narrative:
          "Two days later, Priya is still apologizing. She is worried she will be blamed for the incident going forward.",
        question: "How do you handle the conversation with her?",
        options: [
          {
            text: "Thank her sincerely for reporting it quickly. Tell her the speed of her report is the only reason this didn't become much worse.",
            score: 10,
            best: true,
            feedback:
              "This is the response that builds a reporting culture. Future incidents will be reported faster because employees know they will be supported, not punished.",
          },
          {
            text: "Tell her it's okay but quietly note it for her performance review.",
            score: 1,
            feedback:
              "If she finds out (and these things often surface), trust is destroyed. Worse, other employees will hear that reporting incidents is risky.",
          },
          {
            text: "Send her to mandatory phishing training as a corrective action.",
            score: 5,
            feedback:
              "Training has value, but framing it as 'corrective action' implies fault. Better: send everyone to a refresh, including Priya, framed as continuous improvement.",
          },
        ],
      },
    ],
  },

  lost_device: {
    type: "lost_device",
    title: "The Laptop in the Backseat",
    estimatedMinutes: "15-20",
    narrative_intro:
      "Your sales lead, Jordan, calls you on a Saturday morning. 'I'm so sorry. I went to the gym this morning and someone broke my car window. They took my work laptop. It had everything on it: my email, all my client files, the proposal I was working on for the big healthcare account. I don't know what to do.'",
    stages: [
      {
        id: "s1",
        narrative:
          "Jordan is shaken. He is at the gym parking lot, just got off the phone with the police, who are filing a report.",
        question: "What is your first action?",
        options: [
          {
            text: "Call IT immediately and find out whether you can remote wipe or remote lock the laptop, and reset the passwords on every account Jordan accessed from it.",
            score: 10,
            best: true,
            feedback:
              "Speed matters. Even encrypted laptops should have credentials rotated since saved passwords and active sessions could be exploited.",
          },
          {
            text: "Wait until Monday when the office is open and IT is available.",
            score: 0,
            feedback:
              "Waiting two days gives whoever has the laptop ample time to access company data, especially if it was not encrypted or if active sessions are saved.",
          },
          {
            text: "Tell Jordan it's not his fault and hope it gets recovered.",
            score: 1,
            feedback:
              "Compassion is fine, but action is required. The laptop is an active security incident, not just a property loss.",
          },
          {
            text: "Drive to the gym and look for the laptop yourself.",
            score: 0,
            feedback:
              "Ineffective and dangerous. The laptop is gone. Focus on what you can control: the data and accounts on it.",
          },
        ],
      },
      {
        id: "s2",
        narrative:
          "You reach IT. They confirm the laptop is enrolled in MDM. They can issue a remote wipe, which will erase the laptop the next time it connects to the internet. They can also issue a remote lock immediately, which will prevent login but not erase data.",
        question: "Wipe or lock?",
        options: [
          {
            text: "Lock first, then wipe within the hour after confirming with Jordan that the laptop will not be recovered.",
            score: 10,
            best: true,
            feedback:
              "Lock prevents immediate access. Wipe is irreversible. Locking first preserves the option of recovery if the laptop is found, then wiping if not.",
          },
          {
            text: "Wipe immediately. Better safe than sorry.",
            score: 7,
            feedback:
              "Aggressive but defensible. The downside is that if the laptop is recovered, you lose anything not synced to the cloud. Lock first is usually the better balance.",
          },
          {
            text: "Lock only. Hope to recover the laptop.",
            score: 4,
            feedback:
              "Lock is a starting point, but if recovery does not happen quickly, wipe is needed. Do not leave data on a device that you have lost custody of.",
          },
          {
            text: "Neither. The laptop has full disk encryption so the data is safe.",
            score: 2,
            feedback:
              "Encryption is good, but encryption does not protect saved passwords, browser sessions, or unencrypted external drives that may have been attached. Wipe still applies.",
          },
        ],
      },
      {
        id: "s3",
        narrative:
          "IT confirms the laptop had FileVault encryption enabled and a strong password. They have issued a remote lock and have queued the wipe to fire on next internet connection. They ask: 'What about Jordan's accounts?'",
        question: "What do you tell IT to do?",
        options: [
          {
            text: "Reset all of Jordan's account passwords (email, cloud storage, CRM, etc.) and revoke all active sessions. Force MFA re-enrollment on the new device.",
            score: 10,
            best: true,
            feedback:
              "Even with encryption, browser sessions and saved passwords could be exploited. Resetting credentials and revoking sessions closes those gaps.",
          },
          {
            text: "Reset only the email password, since that is the most sensitive.",
            score: 4,
            feedback:
              "Email is critical, but the other accounts are also at risk. Be comprehensive.",
          },
          {
            text: "Skip the resets since the laptop is encrypted.",
            score: 1,
            feedback:
              "Encryption protects data at rest, not active sessions or saved credentials in the browser. Resets are still required.",
          },
        ],
      },
      {
        id: "s4",
        narrative:
          "Jordan's laptop contained: his email, the company CRM, several active proposals, and copies of client agreements that he downloaded for offline editing. The healthcare proposal he was working on contained Protected Health Information (PHI) from the prospect's sample dataset.",
        question: "How do you classify this incident?",
        options: [
          {
            text: "Treat it as a potential data breach. Call your insurance carrier and engage your breach coach.",
            score: 10,
            best: true,
            feedback:
              "Even with encryption, the presence of PHI makes this a notifiable event under HIPAA Breach Notification Rule unless you can prove the PHI was secured. Better to engage the breach coach early.",
          },
          {
            text: "Treat it as just a stolen device since the laptop was encrypted.",
            score: 4,
            feedback:
              "Encryption may provide a 'safe harbor' under HIPAA, but only if the encryption meets specific standards and is documented. Your breach coach makes that determination, not you.",
          },
          {
            text: "Wait to see if any data shows up online before treating it as a breach.",
            score: 1,
            feedback:
              "Waiting is the wrong approach. Notification clocks start when you discover the incident, not when harm is confirmed.",
          },
        ],
      },
      {
        id: "s5",
        narrative:
          "Your breach coach reviews the situation and confirms: because the laptop was encrypted with FileVault, password protected, and you can document the encryption in writing, you likely qualify for the HIPAA encryption safe harbor. No notification required to patients, but the prospective client should still be informed.",
        question: "What do you do?",
        options: [
          {
            text: "Notify the prospective client transparently, explain the safe harbor, and provide a written account of the actions you took.",
            score: 10,
            best: true,
            feedback:
              "Transparency preserves trust with a high-value prospect. Hiding the incident risks much greater fallout if it surfaces later.",
          },
          {
            text: "Stay silent. The safe harbor means no obligation to notify.",
            score: 2,
            feedback:
              "Legally permissible, but you are about to do business with this client. Discovering the incident later from another source will end the relationship.",
          },
          {
            text: "Tell them only if they ask.",
            score: 3,
            feedback:
              "Passive transparency. If you would tell them when asked, why not just tell them now?",
          },
        ],
      },
      {
        id: "s6",
        narrative:
          "The prospective client appreciates the transparency. They sign with you anyway. A week later, you are reviewing the incident with the team.",
        question: "Which preventive change has the most impact?",
        options: [
          {
            text: "Require all sensitive client data to live only in cloud systems, never downloaded for offline use without explicit approval.",
            score: 10,
            best: true,
            feedback:
              "If the data had not been on the laptop, the laptop loss would have been a property issue, not a data issue. Cloud-only policies eliminate the local data risk.",
          },
          {
            text: "Buy a more secure laptop case for everyone.",
            score: 1,
            feedback:
              "Misses the point. The laptop will still be lost or stolen sometimes. The data on it is what matters.",
          },
          {
            text: "Tell employees to never leave laptops in cars.",
            score: 4,
            feedback:
              "A reasonable policy, but human behavior will fail eventually. Technical controls (cloud-only data) are more reliable than behavioral ones.",
          },
        ],
      },
    ],
  },
}

export function getScenario(key) {
  return SCENARIOS[key] || null
}
