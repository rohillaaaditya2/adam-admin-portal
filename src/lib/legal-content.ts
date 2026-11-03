export interface LegalDoc {
  title: string;
  badge: string;
  summary: string;
  sections: Array<{ heading: string; content: string[] }>;
}

export const LEGAL_DOCS: Record<string, LegalDoc> = {
  'privacy-policy': {
    title: 'Privacy Policy & Data Protection Charter',
    badge: 'Digital Personal Data Protection Act, 2023 (DPDP) Compliant',
    summary:
      'This Privacy Policy governs the collection, processing, storage, and protection of personal data by Adam N Eve Matrimony in strict compliance with the Digital Personal Data Protection Act, 2023 (DPDP Act, India), the Information Technology Act, 2000, and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.',
    sections: [
      {
        heading: '1. Identity of the Data Fiduciary',
        content: [
          'Adam N Eve Matrimony ("Platform", "We", "Our", "Us") operates as a specialized, trust-first Christian matrimonial platform. We act as the Data Fiduciary under the Digital Personal Data Protection Act, 2023 for all personal data provided by members and prospective candidates.',
          'Registered Office: Adam N Eve Matrimony, Indore, Madhya Pradesh, India - 452001.',
          'Grievance Redressal Officer Contact: grievance@adamneve.in | Helpline: +91 90000 00001.'
        ]
      },
      {
        heading: '2. Purpose Limitation & Data Minimization (Only Necessary Data Collected)',
        content: [
          'In alignment with the principle of Data Minimization under the DPDP Act, we only collect personal data strictly necessary to facilitate matrimonial alliances among Christian communities:',
          '• Personal Identification: Full name, date of birth, gender, and phone number for OTP authentication.',
          '• Religious & Community Details: Christian denomination (Catholic, Syro-Malabar, Orthodox, Mar Thoma, CSI, Pentecostal, Baptist, etc.), home parish/church, and priest reference where applicable.',
          '• Educational & Professional Background: Highest qualification, occupation, and general city/state of residence.',
          '• Family Details: Parent contact details, family values, and marriage expectations.',
          '• Candidate Verification Photos: Up to six genuine candidate photographs, subject to strict manual staff moderation before becoming visible.',
          'We DO NOT collect unnecessary tracking telemetry, credit card PINs, passwords in plaintext, or biometric data.'
        ]
      },
      {
        heading: '3. Explicit Consent & Candidate Verification (Section 6 DPDP Act)',
        content: [
          'Personal data is processed exclusively on the basis of free, specific, informed, unconditional, and unambiguous consent given by the adult candidate or registered account creator.',
          '• Candidate Phone Consent: Where an account is initiated by a parent, sibling, or guardian, the adult candidate must independently verify their own phone number via SMS OTP before the profile is approved or published.',
          '• Withdrawal of Consent: Members retain the statutory right to withdraw consent at any time through their Account Settings or by raising a ticket at the Support Desk. Upon withdrawal, processing stops and the profile is taken offline.'
        ]
      },
      {
        heading: '4. Privacy Controls & Photo Protection',
        content: [
          '• Contact Privacy: Full mobile numbers and parent contacts are never displayed publicly. They are accessible exclusively to verified, paid members who have been accepted through mutual interest.',
          '• Photo Visibility: Members may set photographs to "Public Preview", "Members Only", or "Private on Request", where photos are revealed only after explicit member permission.',
          '• No Crawlers / No Third-Party Reselling: Member profiles are protected from automated search engine scraping. We strictly do not sell, rent, trade, or monetize personal data to advertisers or third-party brokers.'
        ]
      },
      {
        heading: '5. Data Security, Encryption & Storage Standards',
        content: [
          'We implement industry-grade technical and organizational security safeguards:',
          '• Encryption in Transit: All website, API, and mobile communications are encrypted using Transport Layer Security (TLS 1.2/1.3).',
          '• Encryption at Rest: Database snapshots and private media tokens utilize authenticated AES-256-GCM encryption.',
          '• Password Security: Credentials are encrypted using salted bcrypt cryptographic hashes with zero plaintext persistence.',
          '• Session Versioning: Active JWT sessions include cryptographic version counters that instantly revoke tokens on password change or logout.'
        ]
      },
      {
        heading: '6. Rights of the Data Principal (Your Statutory Rights)',
        content: [
          'Under the Digital Personal Data Protection Act, 2023, you enjoy full statutory control over your personal data:',
          '• Right to Access: View an itemized summary of your personal data and processing history.',
          '• Right to Correction & Updating: Edit, update, or correct incomplete biodata fields at any time via the profile editor.',
          '• Right to Erasure / Account Deletion: Request permanent deletion of your profile, photos, and messages via Support Desk or Settings.',
          '• Right to Grievance Redressal: Redressal within statutory timelines by contacting our Grievance Officer.'
        ]
      },
      {
        heading: '7. Grievance Redressal Mechanism (IT Rules 2021 & DPDP Act 2023)',
        content: [
          'In accordance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, the designated Grievance Officer details are:',
          '• Officer: Grievance & Compliance Desk, Adam N Eve Matrimony',
          '• Email: grievance@adamneve.in (Direct escalation: adamnevematrimony@gmail.com)',
          '• Address: Indore, Madhya Pradesh, India - 452001',
          '• Response Time: Acknowledgment within 24 hours; resolution within 15 days of receipt of grievance.'
        ]
      }
    ]
  },
  'terms-of-service': {
    title: 'Terms of Service & Community Agreement',
    badge: 'Legal Agreement for Matrimonial Alliances',
    summary:
      'These Terms of Service govern your access to and use of Adam N Eve Matrimony (website, mobile applications, and backoffice services). By creating an account or browsing the platform, you agree to be legally bound by these terms.',
    sections: [
      {
        heading: '1. Eligibility & Age Verification',
        content: [
          'Adam N Eve Matrimony is strictly reserved for Christian individuals seeking holy matrimonial alliances in good faith.',
          '• Minimum Marriageable Age: In compliance with the Prohibition of Child Marriage Act, 2006, male candidates must be at least 21 years of age, and female candidates must be at least 18 years of age at the time of registration.',
          '• Marital Status: Registrations are accepted solely for single, widowed, or legally divorced individuals (with finalized court decree). Married individuals are prohibited from creating profiles.',
          '• Legal Capacity: By registering, you warrant that you are legally competent under the Indian Contract Act, 1872.'
        ]
      },
      {
        heading: '2. Sole Purpose: Matrimony Only (Dating & Casual Hookups Prohibited)',
        content: [
          'This platform is created with Christian ethical dignity to unite prospective brides, grooms, and their families.',
          '• The service may not be used for casual dating, romantic flings, commercial solicitation, escort services, or non-marital relationships.',
          '• Misrepresentation of identity, fake marital claims, or submitting altered photographs constitutes a material breach and results in immediate account termination without refund.'
        ]
      },
      {
        heading: '3. Prohibition of Dowry (Dowry Prohibition Act, 1961)',
        content: [
          'Adam N Eve Matrimony unconditionally condemns the practice of dowry in all forms.',
          '• Users are strictly prohibited from demanding, giving, taking, or abetting the payment of dowry directly or indirectly.',
          '• Any user demanding dowry, cash, luxury gifts, or financial compensation in connection with marriage will be banned and reported to law enforcement authorities under the Dowry Prohibition Act, 1961.'
        ]
      },
      {
        heading: '4. Intermediary Status & Independent Family Due Diligence',
        content: [
          '• Adam N Eve Matrimony acts as an intermediary under Section 79 of the Information Technology Act, 2000.',
          '• While our moderators conduct manual checks on photos, phone OTPs, and church denominations, the platform does not guarantee the truthfulness, character, financial standing, or criminal background of any candidate.',
          '• Families, parents, and candidates are strictly advised to conduct their own independent church, parish, matrimonial, and community inquiries before fixing alliances or exchanging sensitive financial details.'
        ]
      },
      {
        heading: '5. Paid Memberships & Subscription Entitlements',
        content: [
          '• Free accounts allow biodata creation, photo upload, and receiving incoming expressions of interest.',
          '• Premium plans (Quarterly, Semi-Annual, Annual, and Spotlight Boosts) enable viewing verified family contact numbers, sending direct interest requests, and secure in-app messaging.',
          '• Subscriptions are non-transferable and strictly personal to the registered member.'
        ]
      },
      {
        heading: '6. Intellectual Property & User Content License',
        content: [
          '• Members retain ownership of photos and biodata uploaded. By submitting, members grant Adam N Eve Matrimony a non-exclusive license to display the content to eligible platform members solely for matchmaking purposes.',
          '• All platform branding, software, designs, layouts, and trade dress are the exclusive intellectual property of Adam N Eve Matrimony.'
        ]
      },
      {
        heading: '7. Governing Law & Jurisdiction',
        content: [
          'These terms and any disputes arising out of or related to your use of the platform shall be governed by and construed in accordance with the laws of the Republic of India.',
          'The courts situated in Indore, Madhya Pradesh, India shall have exclusive territorial and subject-matter jurisdiction.'
        ]
      }
    ]
  },
  'cookie-policy': {
    title: 'Cookie Policy & Local Storage Standards',
    badge: 'Transparent Session & Privacy Management',
    summary:
      'This Cookie Policy explains how Adam N Eve Matrimony utilizes cookies, session identifiers, and browser local storage to deliver secure, responsive matchmaking services while safeguarding your digital privacy.',
    sections: [
      {
        heading: '1. What Are Cookies and Local Storage?',
        content: [
          'Cookies are small text files stored on your computer or mobile device when you access websites. Local storage allows web applications to store lightweight preferences locally in your browser to maintain responsiveness and remember user choices across visits.'
        ]
      },
      {
        heading: '2. Our Commitment: Zero Third-Party Advertising Trackers',
        content: [
          'Unlike commercial portals that monetize user activity, Adam N Eve Matrimony operates with strict privacy standards:',
          '• We DO NOT use third-party behavioral advertising cookies (no cross-site tracking, no Facebook Pixel, no retargeting ad networks).',
          '• We DO NOT sell, trade, or share your browsing patterns with data aggregators.'
        ]
      },
      {
        heading: '3. Categories of Cookies We Use',
        content: [
          'We use exclusively two necessary categories of storage:',
          '1. Strictly Necessary & Security Cookies / Tokens: Used to authenticate your login session (ane_token, ane_admin_token), enforce CSRF defenses, and verify active session versions. These cannot be disabled as the platform cannot function securely without them.',
          '2. Functional & Preference Storage: Remembers your selected regional language (ane_lang) and records whether you have reviewed the cookie banner (ane_cookie_consent).'
        ]
      },
      {
        heading: '4. How to Manage or Disable Cookies in Your Browser',
        content: [
          'You can manage or disable cookies directly through your browser settings:',
          '• Google Chrome: Settings > Privacy and Security > Cookies and other site data.',
          '• Apple Safari: Preferences > Privacy > Block all cookies.',
          '• Mozilla Firefox: Settings > Privacy & Security > Cookies and Site Data.',
          'Please note: Disabling strictly necessary cookies will prevent you from signing in to your matrimonial account or accessing protected candidate features.'
        ]
      }
    ]
  },
  'refund-policy': {
    title: 'Refund & Cancellation Policy',
    badge: 'Consumer Protection (E-Commerce) Rules, 2020 Compliant',
    summary:
      'Adam N Eve Matrimony is committed to fair, transparent consumer practices. This policy outlines conditions under which membership plan subscriptions and boost add-ons are eligible for refunds or cancellations.',
    sections: [
      {
        heading: '1. Transparent Digital Membership Services',
        content: [
          'Adam N Eve Matrimony provides paid subscription plans that immediately grant access to premium matchmaking benefits, including verified family phone numbers, direct contact access, chat entitlements, and candidate spotlight placement.'
        ]
      },
      {
        heading: '2. 7-Day Cooling-Off Period (Zero Usage Guarantee)',
        content: [
          'We offer a 7-day cooling-off guarantee on all newly purchased membership plans:',
          '• If within 7 calendar days from the date of purchase you decide not to use the service, you are entitled to a 100% full refund, PROVIDED you have NOT used any contact credits, viewed verified family phone numbers, or initiated direct chats.',
          '• Once contact numbers have been unlocked or mutual chats conducted, the service is deemed consumed and becomes non-refundable.'
        ]
      },
      {
        heading: '3. Technical Billing Errors & Duplicate Transactions',
        content: [
          '• If an online transaction is debited multiple times due to a gateway error, bank glitch, or network timeout, all excess debited amounts will be refunded in full automatically or upon notification.',
          '• If money is debited from your bank or card but the membership fails to activate, the gateway will either automatically reconcile the transaction or issue an automated refund within 5 to 7 working days.'
        ]
      },
      {
        heading: '4. Profile Ineligibility & Moderation Rejection',
        content: [
          '• If a paid member submits profile details or photos that violate community guidelines (e.g., underage candidate, duplicate account, fraudulent misrepresentation) and the account cannot be approved, the subscription fee will be refunded after deducting gateway processing charges (not exceeding 3%).'
        ]
      },
      {
        heading: '5. Non-Refundable Scenarios',
        content: [
          'Refunds cannot be claimed in the following cases:',
          '• Member changes their mind after consuming contact credits or actively messaging prospective matches.',
          '• Member finds an alliance through other means or gets engaged while their active subscription period is running.',
          '• Account is suspended or terminated due to substantiated harassment, dowry demands, or abusive conduct reported by other members.'
        ]
      },
      {
        heading: '6. How to Request a Refund',
        content: [
          'To request a refund, submit a request via:',
          '• Support Ticket: Open a ticket at /support under the "Payment & Plan Activation" category.',
          '• Email: Send your Razorpay Payment ID and registered phone number to billing@adamneve.in.',
          '• Timeline: Eligible refunds are initiated through the original payment gateway (Razorpay) within 48 hours of review, and reflect in the source account within 5–7 bank working days.'
        ]
      }
    ]
  },
  'safety-centre': {
    title: 'Christian Community Safety Centre',
    badge: 'Safe & Dignified Family Matrimony',
    summary:
      'Your family’s safety, spiritual dignity, and personal privacy are our sacred responsibility. Review these essential guidelines to protect yourself and your loved ones while searching for marital alliances.',
    sections: [
      {
        heading: '1. Golden Rules for Safe Matrimonial Alliances',
        content: [
          '• Never Transfer Money or Gold: Under no circumstances should you ever send money, wire transfers, crypto, or loan amounts to any prospective match or family, regardless of the emergency claimed.',
          '• Parish & Church Verification: Always ask prospective alliances for their home parish, baptism certificate, or parish priest reference. Genuine families will happily share their church community roots.',
          '• Involve Family & Elders Early: Never keep matchmaking conversations secret. Involve parents, guardians, and trusted elders from the first stage of discussion.',
          '• Meet in Public / Parish Settings: When arranging in-person meetings, choose broad daylight in respected public spaces or church parlours with family members present.'
        ]
      },
      {
        heading: '2. Spotting Red Flags & Fraudulent Profiles',
        content: [
          'Be alert to potential warning signs:',
          '• Urgent requests for financial assistance, medical emergencies, or customs fees for gifts from abroad.',
          '• Refusal to have a phone call or video call with family members present.',
          '• Pressure to marry quickly without family involvement.',
          '• Inconsistencies between church denomination, baptism claims, and personal stories.'
        ]
      },
      {
        heading: '3. Immediate Reporting & Account Blocking',
        content: [
          'If you encounter suspicious behavior, report the profile immediately using the "Report Profile" button or by contacting safety@adamneve.in. Our moderation team reviews reported accounts within 4 hours.'
        ]
      }
    ]
  },
  'help-faq': {
    title: 'Frequently Asked Questions & Helpdesk',
    badge: 'Christian Matrimony User Guidance',
    summary:
      'Find answers to common questions regarding registration, 44-field biodata completion, photo moderation, church parish verification, and membership plans.',
    sections: [
      {
        heading: '1. Registration & Profile Moderation',
        content: [
          '• How long does profile review take? Every profile is manually reviewed by our pastoral moderation desk to maintain Christian dignity. Approval typically takes 2 to 4 hours.',
          '• Why are four photographs mandatory? To prevent fake profiles and build genuine trust among Christian families, all profiles must have at least 4 clear, genuine photographs before approval.',
          '• Is phone OTP verification required? Yes, both the account creator and the candidate must verify their respective mobile numbers via SMS OTP.'
        ]
      },
      {
        heading: '2. Church Denominations & Parish Details',
        content: [
          '• Which denominations are supported? We support all recognized Christian communities across India, including Catholic (Syro-Malabar, Latin, Syro-Malankara), Orthodox, Mar Thoma, CSI, CNI, Pentecostal, Baptist, Evangelical, and Protestant parishes.',
          '• Can I update church details later? Yes, church and priest details can be updated at any time in the "Church Details" section of your biodata editor.'
        ]
      },
      {
        heading: '3. Payments & Offline Verification',
        content: [
          '• What payment methods are supported? We accept secure online payments via Razorpay (UPI, Credit/Debit cards, Netbanking) and manual bank transfers with staff approval.',
          '• Are prices inclusive of GST? Yes, all listed membership fees include applicable statutory taxes.'
        ]
      }
    ]
  },
  'community': {
    title: 'Christian Heritage & Denominational Communities',
    badge: 'Unity in Faith & Culture',
    summary:
      'Adam N Eve Matrimony celebrates the rich traditions, apostolic heritage, and spiritual values of Christian families across Kerala, Tamil Nadu, Andhra Pradesh, Telangana, Goa, Karnataka, Maharashtra, and Pan-India.',
    sections: [
      {
        heading: '1. Apostolic Traditions & Church Roots',
        content: [
          'From the ancient St. Thomas Christian communities of the Malabar coast to the historic Catholic churches of Goa and the vibrant Protestant and Evangelical assemblies across India, our platform respects the unique customs, liturgical rites, and family values of every tradition.'
        ]
      },
      {
        heading: '2. Preserving Sacred Marriage Values',
        content: [
          'We recognize Holy Matrimony as a sacred sacrament and lifelong covenant established before God. Our service is intentionally built to honour pastoral guidance, church community ties, and prayerful discernment.'
        ]
      }
    ]
  },
  'about-us': {
    title: 'About Adam N Eve Matrimony',
    badge: 'A Dedicated Christian Matrimony Platform',
    summary:
      'Adam N Eve Matrimony is a dedicated, values-first matrimonial matchmaking platform founded to connect Christian brides, grooms, and their families across India and the global diaspora.',
    sections: [
      {
        heading: '1. Our Mission',
        content: [
          'To provide Christian families with a secure, private, and dignified digital platform where faith-centered alliances can be forged without commercial exploitation, fake profiles, or privacy violations.'
        ]
      },
      {
        heading: '2. Core Platform Pillars',
        content: [
          '• Uncompromising Privacy: Personal contact details are protected behind mutual consent and member verification.',
          '• Sacred Moderation: Every candidate profile and photograph is personally vetted by staff.',
          '• Community Respect: Dedicated filters and search capabilities for specific denominations, dioceses, and church traditions.'
        ]
      },
      {
        heading: '3. Legal & Business Information',
        content: [
          '• Platform Name: Adam N Eve Matrimony',
          '• Entity Type: Registered Christian Matrimonial Service Provider',
          '• Principal Place of Business: Indore, Madhya Pradesh, India - 452001',
          '• Official Website: https://adamneve.in',
          '• Support Contact: support@adamneve.in | Helpline: +91 90000 00001'
        ]
      },
      {
        heading: '4. Technology & Engineering Partner (Decodeax)',
        content: [
          '• Architecture & Software Development: Adam N Eve Matrimony is engineered, developed, and maintained by Decodeax Company (https://decodeax.com).',
          '• Modern Cloud & Data Security: Powered by enterprise-grade Next.js, real-time WebSockets, AES-256-GCM encryption, and full DPDP Act 2023 compliance engineered exclusively by Decodeax.',
          '• Official Partner Website: https://decodeax.com'
        ]
      }
    ]
  }
};
