export const POLICY_DATA = {
  slug: "information-security-policy",
  name: "Information Security Policy",
  sections: [
    {
      id: "purpose_scope",
      title: "Purpose & Scope",
      options: [
        {
          id: "a",
          label: "Simplified",
          text: "This Information Security Policy establishes the framework for protecting information assets owned, operated, or maintained by [COMPANY_NAME]. The policy applies to all employees, contractors, and third-party users who access [COMPANY_NAME] systems or data.\n\nThe goal of this policy is to ensure that sensitive information is protected from unauthorized access, disclosure, modification, or destruction. All personnel are expected to understand and comply with the requirements outlined in this document."
        },
        {
          id: "b",
          label: "Standard",
          default: true,
          text: "This Information Security Policy defines the requirements and expectations for safeguarding the confidentiality, integrity, and availability of all information assets owned, managed, or entrusted to [COMPANY_NAME]. It serves as the overarching governance document from which all subordinate security policies, standards, and procedures derive their authority.\n\nThis policy applies to all employees, temporary staff, contractors, consultants, vendors, and any other individuals or entities granted access to [COMPANY_NAME] information systems, networks, applications, or data, regardless of location or method of access.\n\nThe scope of this policy encompasses all forms of information, including electronic data, paper records, verbal communications, and information stored or processed by third-party service providers on behalf of [COMPANY_NAME]. All business units and operational functions are subject to the provisions of this policy."
        },
        {
          id: "c",
          label: "Comprehensive",
          text: "This Information Security Policy establishes the comprehensive governance framework for the protection of all information assets owned, operated, managed, or entrusted to [COMPANY_NAME]. It serves as the authoritative top-level directive from which all subordinate security policies, standards, guidelines, and operational procedures derive their mandate and enforcement authority.\n\nThis policy applies to all personnel associated with [COMPANY_NAME], including full-time and part-time employees, temporary workers, interns, contractors, subcontractors, consultants, vendors, business partners, and any other individuals or entities that access, process, store, transmit, or manage [COMPANY_NAME] information assets. It applies regardless of geographic location, employment status, or the method of access used, including remote access, cloud-based services, and mobile computing.\n\nThe scope encompasses all categories of information in any format, including electronic records, databases, source code, intellectual property, financial records, customer data, employee records, paper documents, verbal communications, and visual media. It further extends to all information systems, network infrastructure, endpoints, cloud environments, operational technology, and third-party hosted services that process or store [COMPANY_NAME] data.\n\nThis policy has been developed in alignment with industry frameworks including NIST Cybersecurity Framework 2.0, ISO/IEC 27001, and CIS Controls. It is designed to satisfy regulatory obligations, contractual requirements, and insurance policy conditions applicable to [COMPANY_NAME] operations."
        }
      ]
    },
    {
      id: "security_objectives",
      title: "Security Objectives",
      options: [
        {
          id: "a",
          label: "Simplified",
          text: "[COMPANY_NAME] is committed to protecting information through three core security objectives. Confidentiality ensures that information is accessible only to authorized individuals. Integrity ensures that information remains accurate, complete, and unaltered by unauthorized parties. Availability ensures that authorized users can access information and systems when needed.\n\nAll security controls, processes, and technologies deployed by [COMPANY_NAME] are designed to support one or more of these objectives."
        },
        {
          id: "b",
          label: "Standard",
          default: true,
          text: "[COMPANY_NAME] maintains its information security program around the three foundational principles of the CIA triad: Confidentiality, Integrity, and Availability. These objectives guide all security decisions, risk assessments, and control implementations across the organization.\n\nConfidentiality requires that access to information is restricted to authorized individuals based on the principle of least privilege. [COMPANY_NAME] implements access controls, encryption, data classification, and personnel screening to prevent unauthorized disclosure of sensitive information.\n\nIntegrity requires that information and systems are protected from unauthorized or accidental modification. [COMPANY_NAME] deploys change management controls, audit logging, data validation mechanisms, and backup procedures to ensure the accuracy and completeness of all information assets.\n\nAvailability requires that information systems and data are accessible to authorized users when needed to perform business functions. [COMPANY_NAME] maintains business continuity plans, disaster recovery capabilities, redundant infrastructure, and capacity management processes to ensure reliable access to critical resources."
        },
        {
          id: "c",
          label: "Comprehensive",
          text: "The information security program at [COMPANY_NAME] is structured around the three foundational principles of the CIA triad: Confidentiality, Integrity, and Availability. These principles serve as the basis for all risk assessment activities, security architecture decisions, control selection and implementation, and ongoing security monitoring.\n\nConfidentiality ensures that information is disclosed only to authorized individuals, processes, and systems with a legitimate business need. [COMPANY_NAME] enforces confidentiality through role-based access controls, multi-factor authentication, data classification and handling procedures, encryption of data at rest and in transit, network segmentation, personnel background checks, non-disclosure agreements, and security awareness training. Confidentiality requirements are determined by data classification level and applicable regulatory mandates.\n\nIntegrity ensures that information remains accurate, complete, and trustworthy throughout its lifecycle, and that systems operate as intended without unauthorized modification. [COMPANY_NAME] protects integrity through change management processes, version control systems, digital signatures, hash verification, input validation, audit logging with tamper detection, separation of duties, and regular data reconciliation procedures. Critical systems undergo integrity monitoring to detect unauthorized changes to configurations and files.\n\nAvailability ensures that information systems, applications, and data are accessible and operational when required by authorized users to perform business functions. [COMPANY_NAME] supports availability through redundant infrastructure, automated failover capabilities, documented business continuity and disaster recovery plans, regular backup and restoration testing, capacity planning, patch management schedules that minimize downtime, and service level agreements with critical vendors.\n\nIn addition to the CIA triad, [COMPANY_NAME] recognizes the supporting principles of accountability, non-repudiation, and authenticity. All security events are logged to maintain accountability. Transaction logging and digital signatures support non-repudiation. Identity verification mechanisms ensure the authenticity of users and systems."
        }
      ]
    },
    {
      id: "roles_responsibilities",
      title: "Roles & Responsibilities",
      options: [
        {
          id: "a",
          label: "Simplified",
          text: "Executive leadership is responsible for approving this policy, allocating adequate resources for information security, and fostering a culture of security awareness throughout [COMPANY_NAME].\n\nThe designated security lead (or IT administrator) is responsible for implementing and maintaining security controls, monitoring for security events, managing access to systems, and coordinating incident response activities.\n\nAll employees and contractors are responsible for complying with this policy and all related security procedures, reporting suspected security incidents promptly, protecting credentials and access tokens, and completing required security awareness training."
        },
        {
          id: "b",
          label: "Standard",
          default: true,
          text: "Executive Management bears ultimate accountability for the information security posture of [COMPANY_NAME]. Responsibilities include approving the information security policy and program charter, ensuring adequate budget and staffing for security initiatives, establishing risk tolerance thresholds, and championing security as a business priority.\n\nThe Information Security Officer (or designated equivalent) is responsible for developing, implementing, and maintaining the information security program. This includes conducting risk assessments, selecting and overseeing security controls, managing security incidents, ensuring regulatory compliance, reporting security metrics to leadership, and coordinating third-party security assessments and audits.\n\nDepartment Managers are responsible for ensuring that employees within their teams comply with security policies, that access rights are appropriate for job functions, that security requirements are incorporated into business processes, and that departing employees complete offboarding procedures including access revocation.\n\nAll Users, including employees, contractors, and third-party personnel, are responsible for complying with all information security policies and procedures, completing assigned security training, safeguarding credentials and access tokens, reporting suspected incidents or policy violations to the security team, and using [COMPANY_NAME] resources in accordance with the Acceptable Use Policy."
        },
        {
          id: "c",
          label: "Comprehensive",
          text: "The Board of Directors or Executive Leadership Team holds fiduciary responsibility for the governance of information security risk at [COMPANY_NAME]. This body is responsible for approving the information security policy, reviewing the organization's risk posture at least quarterly, ensuring that the security program is adequately funded and staffed, and establishing the organizational risk appetite and tolerance levels.\n\nThe Chief Information Security Officer (CISO) or designated Information Security Officer is accountable for the design, implementation, operation, and continuous improvement of the information security program. Specific responsibilities include developing and maintaining security policies, standards, and procedures; conducting enterprise risk assessments; overseeing vulnerability management and penetration testing programs; managing security incident response; producing executive-level security metrics and reporting; coordinating external audits, assessments, and regulatory examinations; evaluating and approving security architectures for new systems; and managing relationships with security vendors and managed service providers.\n\nDepartment and Business Unit Managers serve as data stewards for the information assets within their operational areas. They are responsible for classifying data according to the data classification policy, ensuring that access requests are reviewed and approved based on business need, incorporating security requirements into project planning and procurement, ensuring team members complete required security training, and initiating access revocation for departing or transferring personnel within 24 hours of the change.\n\nSystem Administrators and IT Operations personnel are responsible for implementing technical security controls as directed by the security program, maintaining system hardening baselines, applying patches within the timelines specified by the vulnerability management policy, monitoring system logs and alerts, maintaining backup and recovery systems, and documenting system configurations and changes.\n\nAll Users, regardless of role or employment status, bear individual responsibility for protecting the information assets they access. This includes completing all required security awareness training within prescribed timeframes, using strong and unique passwords or passphrases, reporting suspected security incidents within one hour of discovery, locking workstations when unattended, refraining from sharing credentials or access tokens, handling information according to its classification level, and cooperating with security investigations when requested."
        }
      ]
    },
    {
      id: "policy_hierarchy",
      title: "Policy Hierarchy",
      options: [
        {
          id: "a",
          label: "Simplified",
          text: "This Information Security Policy serves as the top-level security document for [COMPANY_NAME]. All other security-related policies, procedures, and guidelines operate under the authority of this document.\n\nSupporting policies address specific topics such as acceptable use, access control, incident response, and data protection. In the event of a conflict between this policy and a subordinate document, this policy takes precedence."
        },
        {
          id: "b",
          label: "Standard",
          default: true,
          text: "The [COMPANY_NAME] information security documentation framework follows a four-tier hierarchy. This Information Security Policy sits at the top as the governing directive, establishing the overall security posture and authority for the program.\n\nTier 2 consists of topic-specific policies that address particular security domains, including but not limited to Acceptable Use, Access Control, Data Classification and Handling, Incident Response, Business Continuity and Disaster Recovery, Vendor and Third-Party Risk Management, and Password and Authentication standards.\n\nTier 3 consists of standards and procedures that define the specific technical requirements and step-by-step instructions for implementing policy requirements. Tier 4 consists of guidelines and reference documents that provide recommended practices and supplementary information.\n\nIn the event of a conflict between documents at different tiers, the higher-tier document takes precedence. All subordinate policies and procedures must be reviewed for consistency with this policy whenever it is updated."
        },
        {
          id: "c",
          label: "Comprehensive",
          text: "The [COMPANY_NAME] information security governance framework is structured as a four-tier documentation hierarchy designed to provide clear authority, consistent interpretation, and practical implementation guidance across the organization.\n\nTier 1, Governing Policy: This Information Security Policy is the authoritative top-level document. It defines the strategic direction, scope, objectives, and accountability structure for the entire information security program. It is approved by executive leadership and reviewed annually.\n\nTier 2, Topic-Specific Policies: These policies address individual security domains and derive their authority from this governing policy. Required topic-specific policies include, at minimum: Acceptable Use Policy, Access Control and Identity Management Policy, Data Classification and Handling Policy, Incident Response Plan, Business Continuity and Disaster Recovery Plan, Vendor and Third-Party Risk Management Policy, Change Management Policy, Password and Authentication Policy, Encryption and Key Management Policy, Physical Security Policy, and Remote Access and Mobile Device Policy.\n\nTier 3, Standards and Procedures: Standards define mandatory technical requirements (such as minimum encryption algorithms, password complexity rules, or hardening baselines). Procedures provide step-by-step operational instructions for carrying out policy and standard requirements. Standards and procedures are maintained by the security team and relevant system owners.\n\nTier 4, Guidelines and Reference Materials: Guidelines provide recommended best practices that are advisory in nature. Reference materials include architecture diagrams, approved product lists, and supplementary training resources.\n\nIn the event of a conflict between documents at different tiers, the higher-tier document governs. Department-specific procedures may impose additional requirements beyond those established by the governing policy, but may not reduce or waive any requirement without formal exception approval. All subordinate documents must be reviewed for alignment whenever this governing policy is revised."
        }
      ]
    },
    {
      id: "compliance_enforcement",
      title: "Compliance & Enforcement",
      options: [
        {
          id: "a",
          label: "Simplified",
          text: "All personnel are expected to comply with this policy and all supporting security policies and procedures. Failure to comply may result in disciplinary action, up to and including termination of employment or contract.\n\n[COMPANY_NAME] reserves the right to monitor systems and network activity to verify compliance. Employees who become aware of policy violations should report them to their manager or the designated security contact."
        },
        {
          id: "b",
          label: "Standard",
          default: true,
          text: "Compliance with this policy and all subordinate security policies is mandatory for all personnel within scope. [COMPANY_NAME] will conduct periodic compliance assessments, including technical audits, access reviews, and policy acknowledgment verification, to ensure adherence.\n\nViolations of this policy may result in disciplinary action proportionate to the severity of the violation and any resulting harm. Disciplinary measures may include verbal or written warnings, mandatory retraining, suspension of system access, reassignment of duties, termination of employment or contract, and, where applicable, civil or criminal legal action.\n\nExceptions to this policy must be documented, risk-assessed, and approved by the Information Security Officer and the relevant business unit executive. All exceptions must specify an expiration date and compensating controls. The security team will maintain a register of all active exceptions.\n\nAll personnel are required to report known or suspected policy violations to the security team. Reports may be made directly or through established anonymous reporting channels. [COMPANY_NAME] prohibits retaliation against individuals who report violations in good faith."
        },
        {
          id: "c",
          label: "Comprehensive",
          text: "Compliance with this Information Security Policy and all subordinate policies, standards, and procedures is a mandatory condition of employment, contract engagement, or system access at [COMPANY_NAME]. All personnel must acknowledge this policy in writing upon onboarding and annually thereafter.\n\n[COMPANY_NAME] enforces compliance through multiple mechanisms, including automated technical controls, periodic internal audits, annual risk assessments, user access reviews conducted at least quarterly, continuous monitoring of system and network activity, third-party penetration testing, and regulatory examination responses. The security team will produce quarterly compliance reports for executive review.\n\nViolations of this policy will be addressed through a structured enforcement process. Upon identification of a violation, the security team will conduct a preliminary investigation to determine the nature, scope, and severity of the incident. Findings will be documented and referred to the appropriate authority. Disciplinary measures will be proportionate and may include formal written warnings entered into personnel records, mandatory completion of targeted security training, temporary or permanent revocation of system access privileges, reassignment of duties or removal from sensitive projects, termination of employment or contract, recovery of costs associated with remediation efforts, and referral to law enforcement authorities for violations involving criminal activity.\n\nExceptions to policy requirements must follow the formal exception management process. The requestor must submit a written exception request that identifies the specific policy requirement, the business justification for the exception, the duration of the exception, a risk assessment of the exception, and proposed compensating controls. Exceptions require approval from both the Information Security Officer and the applicable business unit executive. All approved exceptions are recorded in the exception register, reviewed quarterly, and must not exceed a 12-month duration without renewal.\n\nAll personnel have an obligation to report known or suspected policy violations, security weaknesses, or compliance gaps to the security team. [COMPANY_NAME] maintains anonymous reporting channels for this purpose and strictly prohibits retaliation against individuals who report concerns in good faith. Failure to report a known violation may itself constitute a policy violation."
        }
      ]
    },
    {
      id: "review_schedule",
      title: "Review Schedule",
      options: [
        {
          id: "a",
          label: "Simplified",
          text: "This policy will be reviewed and updated at least once per year by the designated security lead. Additional reviews may occur after significant security incidents, major organizational changes, or changes in applicable regulations.\n\nAll updates must be approved by executive leadership before taking effect."
        },
        {
          id: "b",
          label: "Standard",
          default: true,
          text: "This Information Security Policy will be reviewed at least annually by the Information Security Officer and approved by executive leadership. The review will assess the policy's continued adequacy, effectiveness, and alignment with business objectives, regulatory requirements, and the current threat landscape.\n\nIn addition to the scheduled annual review, this policy will undergo an interim review when triggered by any of the following events: a significant security incident or breach, material changes to the regulatory or legal environment, major organizational changes such as mergers, acquisitions, or restructuring, significant changes to the technology environment or business operations, or findings from internal or external audits that identify policy gaps.\n\nAll revisions will be documented with version numbers, revision dates, and a summary of changes. The current version will be communicated to all personnel within scope, and updated acknowledgments will be collected as needed."
        },
        {
          id: "c",
          label: "Comprehensive",
          text: "This Information Security Policy is subject to a formal review and maintenance cycle to ensure its continued relevance, effectiveness, and compliance with evolving requirements.\n\nThe scheduled annual review will be conducted by the Information Security Officer in coordination with department stakeholders and executive leadership. The review will evaluate the effectiveness of current policy provisions, alignment with the current threat landscape and industry best practices, changes in applicable laws, regulations, and contractual obligations, results of risk assessments, audits, and penetration tests conducted during the review period, feedback from personnel regarding policy clarity and operational feasibility, changes in organizational structure, business strategy, or technology environment, and the status of previously identified policy gaps or improvement initiatives.\n\nInterim reviews will be triggered by significant security incidents or near-miss events, material regulatory or legislative changes, major organizational changes including mergers, acquisitions, divestitures, or leadership transitions, deployment of new critical systems or migration to new platforms, findings from external audits, regulatory examinations, or insurance assessments, and changes to referenced frameworks such as NIST CSF 2.0 or ISO 27001.\n\nAll policy revisions will follow a formal change management process that includes draft preparation by the security team, stakeholder review and comment period of no less than 10 business days, executive approval and sign-off, communication of changes to all personnel within scope, collection of updated policy acknowledgments within 30 days of publication, and archival of the previous version with full revision history. The security team will maintain a policy revision log that records the version number, effective date, author, approver, and a summary of changes for each revision."
        }
      ]
    },
    {
      id: "contact_information",
      title: "Contact Information",
      options: [
        {
          id: "a",
          label: "Simplified",
          text: "Questions about this policy or information security matters should be directed to the designated security contact at [COMPANY_NAME]. Security incidents should be reported immediately to the same contact.\n\nContact details for the security team will be maintained on the company intranet and included in employee onboarding materials."
        },
        {
          id: "b",
          label: "Standard",
          default: true,
          text: "For questions, concerns, or clarifications regarding this policy or any aspect of the [COMPANY_NAME] information security program, personnel should contact the Information Security Officer or the IT department through the established communication channels.\n\nSecurity incidents, suspected breaches, and policy violations should be reported immediately using the designated incident reporting process. The primary reporting channels include the IT help desk, direct communication with the security team, and the anonymous reporting mechanism where available.\n\n[COMPANY_NAME] will maintain current contact information for all security-related functions on the company intranet, within the incident response plan, and in employee and contractor onboarding packages. Contact information will be reviewed and updated at least quarterly."
        },
        {
          id: "c",
          label: "Comprehensive",
          text: "For questions, concerns, clarifications, or feedback regarding this Information Security Policy or the broader security program, personnel should contact the appropriate function as outlined below.\n\nGeneral policy questions, security awareness training inquiries, and requests for policy exception guidance should be directed to the Information Security Officer through the IT service management system or the dedicated security mailbox.\n\nSecurity incident reporting, including suspected breaches, malware infections, phishing attempts, unauthorized access, lost or stolen devices, and any other events that may compromise information security, must be reported immediately through any of the following channels: the IT help desk (available during business hours), the security incident hotline (available 24/7 for critical incidents), direct communication with any member of the security or IT team, or the anonymous reporting mechanism.\n\nVendor and third-party security inquiries, including requests for security documentation, completion of customer security questionnaires, and coordination of third-party assessments, should be directed to the Information Security Officer.\n\n[COMPANY_NAME] will maintain accurate and current contact information for all security functions. Contact details will be published on the company intranet, included in the incident response plan, distributed during employee and contractor onboarding, and reviewed at least quarterly to ensure accuracy. The security team will ensure that after-hours contact procedures are documented and tested periodically to confirm their reliability."
        }
      ]
    }
  ]
};
