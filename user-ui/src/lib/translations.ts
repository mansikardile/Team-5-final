export type Language = 'en' | 'hi' | 'mr';

export interface Translations {
  // Navigation
  navHome: string;
  navAbout: string;
  navIssues: string;
  navPrograms: string;
  navDrives: string;
  navMentors: string;
  navSignIn: string;
  navRegisterDrive: string;
  navWorkspace: string;
  navSignOut: string;

  // Hero Section
  heroPill: string;
  heroTitle1: string;
  heroTitle2: string;
  heroSubtitle: string;
  heroBtnRegister: string;
  heroBtnScholarship: string;
  heroTagFocus: string;
  heroTagFocusSub: string;
  heroTagLaptop: string;
  heroTagLaptopSub: string;

  // About Section (Home)
  aboutPill: string;
  aboutTitle: string;
  aboutDesc: string;
  aboutQuote: string;
  aboutReadStory: string;
  aboutTagOrg: string;
  aboutTagOrgSub: string;

  // Dedicated About Page
  aboutHeroTag: string;
  aboutHeroTitle1: string;
  aboutHeroTitle2: string;
  aboutHeroSub: string;
  aboutVisionTitle: string;
  aboutVisionDesc: string;
  aboutModelTitle: string;
  aboutModelDesc: string;
  aboutJourneyPill: string;
  aboutJourneyTitle: string;
  aboutM1Title: string;
  aboutM1Desc: string;
  aboutM2Title: string;
  aboutM2Desc: string;
  aboutM3Title: string;
  aboutM3Desc: string;
  aboutM4Title: string;
  aboutM4Desc: string;
  aboutGovTitle: string;
  aboutGovSub: string;
  aboutSec8Title: string;
  aboutSec8Desc: string;
  about80GTitle: string;
  about80GDesc: string;
  aboutFcraTitle: string;
  aboutFcraDesc: string;

  // Issues Section
  issuesPill: string;
  issuesTitle1: string;
  issuesTitle2: string;
  issuesFocusTag: string;

  // Programs Section
  programsPill: string;
  programsTitle: string;
  programsSubtitle: string;
  prog1Title: string;
  prog1Desc: string;
  prog1Tag: string;
  prog2Title: string;
  prog2Desc: string;
  prog2Tag: string;
  prog3Title: string;
  prog3Desc: string;
  prog3Tag: string;

  // Drives Section
  drivesPill: string;
  drivesTitle: string;
  drivesSubtitle: string;
  drivesScanQR: string;
  drivesRegisterBtn: string;
  drivesRegisteredBadge: string;
  drivesPassBtn: string;
  drivesAttendees: string;

  // Mentors Section
  mentorsPill: string;
  mentorsTitle: string;
  mentorsSubtitle: string;

  // CTA Banner
  ctaTitle: string;
  ctaSubtitle: string;
  ctaRegisterBtn: string;
  ctaLearnBtn: string;

  // Registration Modal
  modalTag: string;
  modalFullName: string;
  modalEmail: string;
  modalPhone: string;
  modalCollege: string;
  modalYear: string;
  modalBranch: string;
  modalSubmitBtn: string;
  modalSuccessTitle: string;
  modalSuccessSub: string;
  modalPrintBtn: string;
  modalDoneBtn: string;

  // Footer
  footerAbout: string;
  footerRegOffice: string;
  footerRegOfficeAddr: string;
  footerCenters: string;
  footerQuickLinks: string;
  footerRights: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    navHome: 'Home',
    navAbout: 'About Us',
    navIssues: 'The Issues',
    navPrograms: 'Programs',
    navDrives: 'Campus Drives',
    navMentors: 'Corporate Mentors',
    navSignIn: 'Sign In',
    navRegisterDrive: 'Register for Drive',
    navWorkspace: 'Scholar Workspace',
    navSignOut: 'Sign Out',

    heroPill: 'Katalyst Women in STEM Fellowship 2025–2026',
    heroTitle1: 'Empowering Young Women',
    heroTitle2: "to Lead India's Tech Future.",
    heroSubtitle:
      'We work exclusively with female engineering students from low-income communities, providing 1:1 corporate mentorship with senior women executives, free laptops, and 4-year transformative scholarships.',
    heroBtnRegister: 'Register for Campus Drive',
    heroBtnScholarship: 'Apply for Full Scholarship',
    heroTagFocus: '100% Female STEM Focus',
    heroTagFocusSub: 'Dedicated solely to girl scholars',
    heroTagLaptop: '100% Free Laptop Grants',
    heroTagLaptopSub: 'For every enrolled girl scholar',

    aboutPill: 'About Katalyst India',
    aboutTitle: "Bridging the Gender Divide in India's Technology Ecosystem",
    aboutDesc:
      "India has one of the world's highest proportions of female STEM graduates, yet young women from economically challenged families face immense hurdles accessing hardware, industry networks, and corporate placement opportunities. Katalyst provides a complete 4-year bridge.",
    aboutQuote: '"We Transform Potential into High-Impact Corporate Leadership for Girls."',
    aboutReadStory: 'Read Our 18-Year Impact Story & Milestones',
    aboutTagOrg: 'Registered NGO',
    aboutTagOrgSub: 'Founded in 2007 by Third Sector Partners to bridge the gender gap.',

    // Dedicated About Us Page
    aboutHeroTag: 'Registered Section 8 Non-Profit Organization • Founded 2007',
    aboutHeroTitle1: 'Empowering Young Women from the Classroom to',
    aboutHeroTitle2: 'Corporate Leadership',
    aboutHeroSub:
      'Katalyst is an initiative of Third Sector Partners, created to empower bright, capable young women from low-income communities to pursue professional engineering careers and assume senior leadership roles in STEM.',
    aboutVisionTitle: 'Our Vision',
    aboutVisionDesc:
      "To build a gender-balanced workforce where talented young women from economically disadvantaged backgrounds possess equal opportunity, technical excellence, and corporate mentorship to lead India's innovation economy.",
    aboutModelTitle: 'Our 4-Year Holistic Model',
    aboutModelDesc:
      'Unlike traditional one-time grants, Katalyst provides a continuous 4-year developmental ecosystem comprising 600+ hours of technical training, 1:1 corporate mentorship with senior women executives, brand-new laptops, financial grants, and placement assistance.',
    aboutJourneyPill: 'Our Journey',
    aboutJourneyTitle: '18+ Years of Impact for Girls in STEM',
    aboutM1Title: 'Founded by Third Sector Partners',
    aboutM1Desc:
      'Started with 10 female engineering students in Mumbai to bridge the deep gender imbalance in corporate tech leadership.',
    aboutM2Title: 'Expansion to Pune & Bengaluru',
    aboutM2Desc:
      'Partnered with top tier-1 engineering institutions (COEP, VJTI, Cummins, RVCE).',
    aboutM3Title: '100% Laptop Grant Initiative',
    aboutM3Desc:
      'Ensured every enrolled girl scholar receives a brand-new high-spec laptop for coding.',
    aboutM4Title: 'National Scale & 1:1 Corporate Mentorship',
    aboutM4Desc:
      'Over 4,500+ female alumnae leading engineering teams across global MNCs including Mastercard and Google.',
    aboutGovTitle: 'Legal Disclosures & Certifications',
    aboutGovSub: 'Full statutory compliance as a registered Indian non-profit organization.',
    aboutSec8Title: 'Section 8 Registration',
    aboutSec8Desc:
      'Registered under the Indian Companies Act, 2013 (CIN: U85300MH2007NPL175968)',
    about80GTitle: '80G & 12A Certified',
    about80GDesc:
      'Donations are eligible for tax deduction under Section 80G of the Income Tax Act.',
    aboutFcraTitle: 'FCRA Registered',
    aboutFcraDesc:
      'Authorized by the Ministry of Home Affairs to receive institutional foreign contributions.',

    issuesPill: 'The Problem We Solve',
    issuesTitle1: 'Understanding the',
    issuesTitle2: 'Gender Realities in Engineering',
    issuesFocusTag: 'Focus Area',

    programsPill: '4-Year Intervention for Girls',
    programsTitle: 'Our Programs for a Better Future',
    programsSubtitle:
      'A comprehensive support ecosystem tailored specifically for female engineering students.',
    prog1Title: 'Hardware Grants & Laptops',
    prog1Desc:
      'Every enrolled female scholar who lacks personal computing hardware receives a brand-new high-performance laptop, plus annual financial grants for tuition.',
    prog1Tag: '100% Free Hardware Grant',
    prog2Title: '1:1 Corporate Mentorship',
    prog2Desc:
      'Scholars are paired with senior women engineering leaders from Google, Mastercard, Microsoft, and IBM for continuous career roadmapping and mock interviews.',
    prog2Tag: '1:1 Executive Matching',
    prog3Title: 'Technical Labs & Placements',
    prog3Desc:
      'Over 600 hours of DSA coding bootcamps, AI labs, and exclusive corporate internship pathways with Tier-1 technology companies.',
    prog3Tag: '600+ Hours Training',

    drivesPill: 'Upcoming Drives',
    drivesTitle: 'Katalyst Campus Drives & Orientation Sessions',
    drivesSubtitle:
      'Scan the QR code or click register to get your digital pass (no signup required).',
    drivesScanQR: 'QR',
    drivesRegisterBtn: 'Register',
    drivesRegisteredBadge: 'Registered',
    drivesPassBtn: 'Pass',
    drivesAttendees: 'attendees',

    mentorsPill: 'Senior Women Leaders',
    mentorsTitle: 'Learn from Senior Women Tech Leaders',
    mentorsSubtitle:
      'Executive mentors from leading global technology companies dedicate 1:1 time for our female scholars.',

    ctaTitle: 'Every Young Woman Deserves the Opportunity to Lead in STEM.',
    ctaSubtitle:
      'Join the Katalyst female scholar community today or partner with us as a corporate mentor.',
    ctaRegisterBtn: 'Register for Campus Drive',
    ctaLearnBtn: 'Learn More About Us',

    modalTag: 'Instant Campus Registration (No Account Required)',
    modalFullName: 'Full Name *',
    modalEmail: 'Email Address *',
    modalPhone: 'Phone Number *',
    modalCollege: 'College Name *',
    modalYear: 'Year of Study *',
    modalBranch: 'Branch / Major *',
    modalSubmitBtn: 'Register for Session & Get QR Pass',
    modalSuccessTitle: 'Registration Confirmed! 🎉',
    modalSuccessSub: 'Show this QR pass at the venue entrance desk.',
    modalPrintBtn: 'Save / Print Pass',
    modalDoneBtn: 'Done',

    footerAbout:
      'An initiative of Third Sector Partners. Registered Section 8 Non-Profit Organization empowering female engineers to become tech leaders.',
    footerRegOffice: 'Registered Office',
    footerRegOfficeAddr:
      'Unit 402, 4th Floor, C-Wing, Fortune 2000, Bandra Kurla Complex (BKC), Mumbai, Maharashtra 400051',
    footerCenters: 'Regional Centers',
    footerQuickLinks: 'Quick Navigation',
    footerRights: 'Katalyst India Foundation. All rights reserved. 80G Tax Exemption Certified.',
  },

  hi: {
    navHome: 'होम',
    navAbout: 'हमारे बारे में',
    navIssues: 'चुनौतियाँ',
    navPrograms: 'कार्यक्रम',
    navDrives: 'कैंपस ड्राइव',
    navMentors: 'कॉर्पोरेट मेंटर्स',
    navSignIn: 'साइन इन',
    navRegisterDrive: 'ड्राइव के लिए रजिस्टर करें',
    navWorkspace: 'स्कॉलर डैशबोर्ड',
    navSignOut: 'साइन आउट',

    heroPill: 'कैटालिस्ट विमेन इन स्टेम (STEM) फेलोशिप 2025–2026',
    heroTitle1: 'युवा छात्राओं का सशक्तिकरण,',
    heroTitle2: 'भारत के तकनीकी भविष्य का नेतृत्व।',
    heroSubtitle:
      'हम कम आय वाले परिवारों की इंजीनियरिंग छात्राओं के साथ काम करते हैं, उन्हें 1:1 कॉर्पोरेट मेंटरशिप, मुफ्त लैपटॉप और 4 साल की पूर्ण छात्रवृत्ति प्रदान करते हैं।',
    heroBtnRegister: 'कैंपस ड्राइव के लिए रजिस्टर करें',
    heroBtnScholarship: 'पूरी छात्रवृत्ति के लिए आवेदन करें',
    heroTagFocus: '100% महिला STEM फोकस',
    heroTagFocusSub: 'केवल छात्राओं के लिए समर्पित',
    heroTagLaptop: '100% मुफ्त लैपटॉप अनुदान',
    heroTagLaptopSub: 'प्रत्येक नामांकित छात्रा के लिए',

    aboutPill: 'कैटालिस्ट इंडिया के बारे में',
    aboutTitle: 'भारत के तकनीकी क्षेत्र में लैंगिक अंतर को समाप्त करना',
    aboutDesc:
      'भारत में महिला STEM स्नातकों का अनुपात दुनिया में सबसे अधिक है, फिर भी आर्थिक रूप से कमजोर छात्राओं को हार्डवेयर, नेटवर्क और प्लेसमेंट के अवसरों में बाधाओं का सामना करना पड़ता है। कैटालिस्ट इसे 4 वर्षों में पूरा करता है।',
    aboutQuote: '"हम छात्राओं की प्रतिभा को उच्च प्रभाव वाले कॉर्पोरेट नेतृत्व में बदलते हैं।"',
    aboutReadStory: 'हमारी 18 वर्षों की यात्रा और मील के पत्थर पढ़ें',
    aboutTagOrg: 'पंजीकृत एनजीओ',
    aboutTagOrgSub: '2007 में थर्ड सेक्टर पार्टनर्स द्वारा स्थापित।',

    // Dedicated About Us Page (Hindi)
    aboutHeroTag: 'पंजीकृत धारा 8 गैर-लाभकारी संगठन • स्थापना 2007',
    aboutHeroTitle1: 'कक्षा से लेकर कॉर्पोरेट नेतृत्व तक',
    aboutHeroTitle2: 'युवा छात्राओं का सशक्तिकरण',
    aboutHeroSub:
      'कैटालिस्ट थर्ड सेक्टर पार्टनर्स की एक पहल है, जो कम आय वाले परिवारों की मेधावी छात्राओं को पेशेवर इंजीनियरिंग करियर और STEM में वरिष्ठ नेतृत्व संभालने के लिए सशक्त बनाती है।',
    aboutVisionTitle: 'हमारा दृष्टिकोण (Vision)',
    aboutVisionDesc:
      'एक लैंगिक-संतुलित कार्यबल का निर्माण करना जहाँ आर्थिक रूप से कमजोर छात्राओं को समान अवसर, तकनीकी उत्कृष्टता और मेंटरशिप प्राप्त हो ताकि वे भारत के नवाचार का नेतृत्व कर सकें।',
    aboutModelTitle: 'हमारा 4-वर्षीय समग्र मॉडल',
    aboutModelDesc:
      'एकमुश्त अनुदानों के विपरीत, कैटालिस्ट 600+ घंटों का तकनीकी प्रशिक्षण, वरिष्ठ महिला अधिकारियों के साथ 1:1 मेंटरशिप, नए लैपटॉप, वित्तीय अनुदान और प्लेसमेंट सहायता प्रदान करता है।',
    aboutJourneyPill: 'हमारी यात्रा',
    aboutJourneyTitle: 'STEM में छात्राओं के लिए 18+ वर्षों का प्रभाव',
    aboutM1Title: 'थर्ड सेक्टर पार्टनर्स द्वारा स्थापना',
    aboutM1Desc:
      'कॉर्पोरेट तकनीकी नेतृत्व में लैंगिक असंतुलन को दूर करने के लिए मुंबई में 10 इंजीनियरिंग छात्राओं के साथ शुरुआत की।',
    aboutM2Title: 'पुणे और बेंगलुरु में विस्तार',
    aboutM2Desc:
      'शीर्ष इंजीनियरिंग संस्थानों (COEP, VJTI, कमिंस, RVCE) के साथ साझेदारी की।',
    aboutM3Title: '100% लैपटॉप अनुदान पहल',
    aboutM3Desc:
      'प्रत्येक छात्रा को कोडिंग और प्रोजेक्ट्स के लिए एक नया हाई-परफॉर्मेंस लैपटॉप सुनिश्चित किया गया।',
    aboutM4Title: 'राष्ट्रीय स्तर पर विस्तार और 1:1 मेंटरशिप',
    aboutM4Desc:
      '4,500+ से अधिक पूर्व छात्राएं अब Mastercard और Google जैसी वैश्विक MNCs में इंजीनियरिंग टीमों का नेतृत्व कर रही हैं।',
    aboutGovTitle: 'कानूनी खुलासे और प्रमाणपत्र',
    aboutGovSub: 'पंजीकृत भारतीय गैर-लाभकारी संगठन के रूप में पूर्ण वैधानिक अनुपालन।',
    aboutSec8Title: 'धारा 8 पंजीकरण',
    aboutSec8Desc:
      'भारतीय कंपनी अधिनियम, 2013 के तहत पंजीकृत (CIN: U85300MH2007NPL175968)',
    about80GTitle: '80G और 12A प्रमाणित',
    about80GDesc:
      'आयकर अधिनियम की धारा 80G के तहत दान कर कटौती के लिए पात्र हैं।',
    aboutFcraTitle: 'FCRA पंजीकृत',
    aboutFcraDesc:
      'विदेशी संस्थागत योगदान प्राप्त करने के लिए गृह मंत्रालय द्वारा अधिकृत।',

    issuesPill: 'समस्या जिसका हम समाधान करते हैं',
    issuesTitle1: 'इंजीनियरिंग में',
    issuesTitle2: 'लैंगिक वास्तविकताओं को समझना',
    issuesFocusTag: 'फोकस क्षेत्र',

    programsPill: 'छात्राओं के लिए 4-वर्षीय पहल',
    programsTitle: 'एक बेहतर भविष्य के लिए हमारे कार्यक्रम',
    programsSubtitle: 'विशेष रूप से महिला इंजीनियरिंग छात्राओं के लिए तैयार की गई सहायता प्रणाली।',
    prog1Title: 'हार्डवेयर अनुदान और लैपटॉप',
    prog1Desc:
      'प्रत्येक छात्रा को कोडिंग और प्रोजेक्ट्स के लिए एक नया हाई-परफॉर्मेंस लैपटॉप और वार्षिक ट्यूशन सहायता दी जाती है।',
    prog1Tag: '100% मुफ्त हार्डवेयर अनुदान',
    prog2Title: '1:1 कॉर्पोरेट मेंटरशिप',
    prog2Desc:
      'छात्राओं को Google, Mastercard, Microsoft और IBM की वरिष्ठ महिला तकनीकी अधिकारियों के साथ मेंटरशिप दी जाती है।',
    prog2Tag: '1:1 मेंटर मैचिंग',
    prog3Title: 'टेक्निकल लैब्स और प्लेसमेंट',
    prog3Desc:
      '600 से अधिक घंटों की DSA कोडिंग, AI वर्कशॉप्स और शीर्ष MNCs के साथ विशेष इंटर्नशिप मार्ग।',
    prog3Tag: '600+ घंटे प्रशिक्षण',

    drivesPill: 'आगामी ड्राइव्स',
    drivesTitle: 'कैटालिस्ट कैंपस ड्राइव्स और ओरिएंटेशन सत्र',
    drivesSubtitle:
      'QR कोड स्कैन करें या डिजिटल पास प्राप्त करने के लिए रजिस्टर करें (साइन अप की आवश्यकता नहीं)।',
    drivesScanQR: 'QR कोड',
    drivesRegisterBtn: 'रजिस्टर करें',
    drivesRegisteredBadge: 'रजिस्टर्ड',
    drivesPassBtn: 'पास देखें',
    drivesAttendees: 'प्रतिभागी',

    mentorsPill: 'वरिष्ठ महिला अधिकारी',
    mentorsTitle: 'शीर्ष महिला तकनीकी लीडर्स से सीखें',
    mentorsSubtitle:
      'प्रमुख वैश्विक तकनीकी कंपनियों की कार्यकारी मेंटर्स हमारी छात्राओं को 1:1 मार्गदर्शन देती हैं।',

    ctaTitle: 'हर युवा छात्रा को STEM में नेतृत्व करने का अवसर मिलना चाहिए।',
    ctaSubtitle:
      'आज ही कैटालिस्ट समुदाय में शामिल हों या मेंटर के रूप में हमसे जुड़ें।',
    ctaRegisterBtn: 'कैंपस ड्राइव के लिए रजिस्टर करें',
    ctaLearnBtn: 'हमारे बारे में और जानें',

    modalTag: 'तुरंत कैंपस पंजीकरण (खाता बनाने की आवश्यकता नहीं)',
    modalFullName: 'पूरा नाम *',
    modalEmail: 'ईमेल आईडी *',
    modalPhone: 'फ़ोन नंबर *',
    modalCollege: 'कॉलेज का नाम *',
    modalYear: 'अध्ययन वर्ष *',
    modalBranch: 'ब्रांच / मेजर *',
    modalSubmitBtn: 'सत्र के लिए रजिस्टर करें और QR पास प्राप्त करें',
    modalSuccessTitle: 'पंजीकरण की पुष्टि हो गई! 🎉',
    modalSuccessSub: 'कार्यक्रम स्थल के प्रवेश द्वार पर यह QR पास दिखाएं।',
    modalPrintBtn: 'पास सेव / प्रिंट करें',
    modalDoneBtn: 'पूर्ण',

    footerAbout:
      'थर्ड सेक्टर पार्टनर्स की एक पहल। पंजीकृत धारा 8 गैर-लाभकारी संगठन जो महिला इंजीनियरों को सशक्त बनाता है।',
    footerRegOffice: 'पंजीकृत कार्यालय',
    footerRegOfficeAddr:
      'यूनिट 402, चौथी मंजिल, सी-विंग, फॉर्च्यून 2000, बांद्रा कुर्ला कॉम्प्लेक्स (BKC), मुंबई, महाराष्ट्र 400051',
    footerCenters: 'क्षेत्रीय केंद्र',
    footerQuickLinks: 'त्वरित नेविगेशन',
    footerRights: 'कैटालिस्ट इंडिया फाउंडेशन। सर्वाधिकार सुरक्षित। 80G कर छूट प्रमाणित।',
  },

  mr: {
    navHome: 'मुख्यपृष्ठ',
    navAbout: 'आमच्याबद्दल',
    navIssues: 'समस्या',
    navPrograms: 'कार्यक्रम',
    navDrives: 'कॅम्पस ड्राइव्ह्स',
    navMentors: 'कॉर्पोरेट मेंटॉर्स',
    navSignIn: 'साइन इन',
    navRegisterDrive: 'ड्राइव्हसाठी नोंदणी करा',
    navWorkspace: 'स्कॉलर डॅशबोर्ड',
    navSignOut: 'साइन आउट',

    heroPill: 'कॅटालिस्ट विमेन इन स्टेम (STEM) फेलोशिप २०२५–२०२६',
    heroTitle1: 'युवतींचे सक्षमीकरण,',
    heroTitle2: 'भारताच्या तंत्रज्ञान भविष्याचे नेतृत्व.',
    heroSubtitle:
      'आम्ही आर्थिकदृष्ट्या दुर्बल कुटुंबातील अभियांत्रिकी विद्यार्थिनींना १:१ कॉर्पोरेट मार्गदर्शन, मोफत लॅपटॉप आणि ४ वर्षांची संपूर्ण शिष्यवृत्ती देतो.',
    heroBtnRegister: 'कॅम्पस ड्राइव्हसाठी नोंदणी करा',
    heroBtnScholarship: 'पूर्ण शिष्यवृत्तीसाठी अर्ज करा',
    heroTagFocus: '१००% विद्यार्थिनी STEM फोकस',
    heroTagFocusSub: 'केवळ विद्यार्थिनींसाठी समर्पित',
    heroTagLaptop: '१००% मोफत लॅपटॉप अनुदान',
    heroTagLaptopSub: 'प्रत्येक नोंदणीकृत विद्यार्थिनीसाठी',

    aboutPill: 'कॅटालिस्ट इंडियाबद्दल',
    aboutTitle: 'भारताच्या तंत्रज्ञान क्षेत्रातील लिंगभेद कमी करणे',
    aboutDesc:
      'भारतात महिला STEM पदवीधरांचे प्रमाण सर्वाधिक आहे, तरीही आर्थिक अडचणींमुळे विद्यार्थिनींना लॅपटॉप, मार्गदर्शन आणि रोजगाराच्या संधी मिळण्यात अडचणी येतात. कॅटालिस्ट हा ४ वर्षांचा सेतू निर्माण करतो.',
    aboutQuote: '"आम्ही विद्यार्थिनींच्या कौशल्यांचे रूपांतर प्रभावी कॉर्पोरेट नेतृत्वात करतो."',
    aboutReadStory: 'आमचा १८ वर्षांचा प्रवास आणि टप्पे वाचा',
    aboutTagOrg: 'नोंदणीकृत स्वयंसेवी संस्था (NGO)',
    aboutTagOrgSub: '२००७ मध्ये थर्ड सेक्टर पार्टनर्सने सुरू केले.',

    // Dedicated About Us Page (Marathi)
    aboutHeroTag: 'नोंदणीकृत कलम ८ धर्मादाय संस्था • स्थापना २००७',
    aboutHeroTitle1: 'वर्गापासून कॉर्पोरेट नेतृत्वापर्यंत',
    aboutHeroTitle2: 'युवतींचे सक्षमीकरण',
    aboutHeroSub:
      'कॅटालिस्ट हा थर्ड सेक्टर पार्टनर्सचा उपक्रम आहे, जो होतकरू विद्यार्थिनींना अभियांत्रिकी क्षेत्रात व्यावसायिक करिअर घडवण्यासाठी आणि STEM मध्ये वरिष्ठ नेतृत्व सांभाळण्यासाठी सक्षम करतो.',
    aboutVisionTitle: 'आमचा दृष्टीकोन (Vision)',
    aboutVisionDesc:
      'अशी कार्यसंस्कृती निर्माण करणे जिथे गरजू विद्यार्थिनींना समान संधी, तांत्रिक कौशल्ये आणि कॉर्पोरेट मार्गदर्शन मिळून त्या भारताच्या तंत्रज्ञान क्षेत्राचे नेतृत्व करू शकतील.',
    aboutModelTitle: 'आमचे ४-वर्षीय सर्वसमावेशक मॉडेल',
    aboutModelDesc:
      'केवळ एका वेळेचे अनुदान देण्याऐवजी, कॅटालिस्ट ६००+ तासांचे तांत्रिक प्रशिक्षण, वरिष्ठ महिला तंत्रज्ञान अधिकाऱ्यांकडून १:१ मार्गदर्शन, नवीन लॅपटॉप, आर्थिक मदत आणि थेट नोकरी सहाय्य पुरवतो.',
    aboutJourneyPill: 'आमचा प्रवास',
    aboutJourneyTitle: 'STEM मधील विद्यार्थिनींसाठी १८+ वर्षांचे योगदान',
    aboutM1Title: 'थर्ड सेक्टर पार्टनर्सद्वारे स्थापना',
    aboutM1Desc:
      'कॉर्पोरेट तंत्रज्ञान क्षेत्रातील लिंगभेद दूर करण्यासाठी मुंबईतील १० अभियांत्रिकी विद्यार्थिनींसोबत सुरुवात केली.',
    aboutM2Title: 'पुणे आणि बंगळुरू येथे विस्तार',
    aboutM2Desc:
      'अव्वल अभियांत्रिकी महाविद्यालयांशी (COEP, VJTI, कमिन्स, RVCE) भागीदारी केली.',
    aboutM3Title: '१००% लॅपटॉप अनुदान उपक्रम',
    aboutM3Desc:
      'प्रत्येक विद्यार्थिनीला कोडिंगसाठी नवीन हाय-स्पीड लॅपटॉप दिला गेला.',
    aboutM4Title: 'राष्ट्रीय पातळीवर विस्तार आणि १:१ मार्गदर्शन',
    aboutM4Desc:
      '४,५०० हून अधिक माजी विद्यार्थिनी आता Mastercard आणि Google सारख्या आघाडीच्या MNCs मध्ये तंत्रज्ञान पथकांचे नेतृत्व करत आहेत.',
    aboutGovTitle: 'कायदेशीर बाबी आणि प्रमाणपत्रे',
    aboutGovSub: 'नोंदणीकृत भारतीय धर्मादाय संस्था म्हणून पूर्ण वैधानिक पूर्तता.',
    aboutSec8Title: 'कलम ८ नोंदणी',
    aboutSec8Desc:
      'भारतीय कंपनी कायदा, २०१३ अंतर्गत नोंदणीकृत (CIN: U85300MH2007NPL175968)',
    about80GTitle: '८०G आणि १२A प्रमाणित',
    about80GDesc:
      'आयकर कायद्याच्या कलम ८०G अंतर्गत देणग्या कर सवलतीसाठी पात्र आहेत.',
    aboutFcraTitle: 'FCRA नोंदणीकृत',
    aboutFcraDesc:
      'गृह मंत्रालयाकडून परदेशी संस्थात्मक योगदान स्वीकारण्यास अधिकृत.',

    issuesPill: 'आम्ही सोडवत असलेली समस्या',
    issuesTitle1: 'अभियांत्रिकीतील',
    issuesTitle2: 'वास्तविक लिंगभेद समजून घेणे',
    issuesFocusTag: 'लक्ष्य क्षेत्र',

    programsPill: 'विद्यार्थिनींसाठी ४-वर्षीय उपक्रम',
    programsTitle: 'उज्ज्वल भविष्यासाठी आमचे कार्यक्रम',
    programsSubtitle: 'अभियांत्रिकी विद्यार्थिनींसाठी खास तयार केलेली सर्वसमावेशक सहाय्य प्रणाली.',
    prog1Title: 'हार्डवेअर अनुदान आणि लॅपटॉप',
    prog1Desc:
      'प्रत्येक विद्यार्थिनीला कोडिंग आणि प्रकल्पांसाठी ब्रँड-न्यू हाय-स्पीड लॅपटॉप आणि वार्षिक शैक्षणिक शुल्क अनुदान दिले जाते.',
    prog1Tag: '१००% मोफत हार्डवेअर अनुदान',
    prog2Title: '१:१ कॉर्पोरेट मार्गदर्शन',
    prog2Desc:
      'विद्यार्थिनींना Google, Mastercard, Microsoft आणि IBM मधील वरिष्ठ महिला तंत्रज्ञान अधिकाऱ्यांकडून करिअर मार्गदर्शन दिले जाते.',
    prog2Tag: '१:१ मार्गदर्शक जोडणी',
    prog3Title: 'तांत्रिक लॅब्स आणि नोकरी मार्गदर्शन',
    prog3Desc:
      '६०० हून अधिक तासांचे DSA कोडिंग बूटकॅम्प, AI लॅब्स आणि नामांकित MNCs मध्ये थेट इंटर्नशिपच्या संधी.',
    prog3Tag: '६००+ तास प्रशिक्षण',

    drivesPill: 'आगामी ड्राइव्ह्स',
    drivesTitle: 'कॅटालिस्ट कॅम्पस ड्राइव्ह्स आणि ओरिएंटेशन सत्रे',
    drivesSubtitle:
      'QR कोड स्कॅन करा किंवा डिजिटल पास मिळवण्यासाठी नोंदणी करा (साइन अपची गरज नाही).',
    drivesScanQR: 'QR कोड',
    drivesRegisterBtn: 'नोंदणी करा',
    drivesRegisteredBadge: 'नोंदणीकृत',
    drivesPassBtn: 'पास पहा',
    drivesAttendees: 'उपस्थिती',

    mentorsPill: 'वरिष्ठ महिला तंत्रज्ञान अधिकारी',
    mentorsTitle: 'ज्येष्ठ महिला तंत्रज्ञान लीडर्सकडून शिका',
    mentorsSubtitle:
      'जागतिक तंत्रज्ञान कंपन्यांमधील वरिष्ठ मार्गदर्शक आमच्या विद्यार्थिनींना १:१ मार्गदर्शन देतात.',

    ctaTitle: 'प्रत्येक युवतीला STEM मध्ये नेतृत्व करण्याची समान संधी मिळायला हवी.',
    ctaSubtitle:
      'आजच कॅटालिस्ट विद्यार्थिनी समुदायात सामील व्हा किंवा मार्गदर्शक म्हणून आमच्याशी जोडा.',
    ctaRegisterBtn: 'कॅम्पस ड्राइव्हसाठी नोंदणी करा',
    ctaLearnBtn: 'आमच्याबद्दल अधिक जाणून घ्या',

    modalTag: 'त्वरित कॅम्पस नोंदणी (खात्याची आवश्यकता नाही)',
    modalFullName: 'पूर्ण नाव *',
    modalEmail: 'ईमेल पत्ता *',
    modalPhone: 'फोन नंबर *',
    modalCollege: 'कॉलेजचे नाव *',
    modalYear: 'शिक्षणाचे वर्ष *',
    modalBranch: 'शाखा / विभाग *',
    modalSubmitBtn: 'सत्रासाठी नोंदणी करा आणि QR पास मिळवा',
    modalSuccessTitle: 'नोंदणी यशस्वी झाली! 🎉',
    modalSuccessSub: 'कार्यक्रमाच्या प्रवेशद्वारावर हा QR पास दाखवा.',
    modalPrintBtn: 'पास सेव्ह / प्रिंट करा',
    modalDoneBtn: 'पूर्ण',

    footerAbout:
      'थर्ड सेक्टर पार्टनर्सचा उपक्रम. महिला अभियंत्यांना सक्षम करणारी नोंदणीकृत कलम ८ धर्मादाय संस्था.',
    footerRegOffice: 'नोंदणीकृत कार्यालय',
    footerRegOfficeAddr:
      'युनिट ४०२, ४था मजला, सी-विंग, फॉर्च्यून २०००, वांद्रे कुर्ला संकुल (BKC), मुंबई, महाराष्ट्र ४०००५१',
    footerCenters: 'प्रादेशिक केंद्रे',
    footerQuickLinks: 'द्रुत दुवे',
    footerRights: 'कॅटालिस्ट इंडिया फाउंडेशन. सर्व हक्क राखीव. ८०G कर सवलत प्रमाणित.',
  },
};
