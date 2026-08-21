export type Language = 'en' | 'hi' | 'mr';

export interface Translations {
  // Navigation
  navHome: string;
  navFeedback: string;
  navActivities: string;
  navCorporate: string;
  navAdmin: string;
  navThemes: string;
  navSignIn: string;
  navSignOut: string;

  // Hero Section
  heroPill: string;
  heroTitle1: string;
  heroTitle2: string;
  heroSubtitle: string;
  heroBtnFeedback: string;
  heroBtnSpoc: string;
  heroTagDrives: string;
  heroTagDrivesSub: string;
  heroTagQuick: string;
  heroTagQuickSub: string;

  // Quick 1-Min Feedback Launcher
  quickFeedbackTitle: string;
  quickFeedbackSub: string;
  quickActivityCodePlaceholder: string;
  quickBtnStart: string;

  // Verticals / Programs
  verticalsPill: string;
  verticalsTitle: string;
  verticalsSubtitle: string;
  v1Title: string;
  v1Desc: string;
  v1Tag: string;
  v2Title: string;
  v2Desc: string;
  v2Tag: string;
  v3Title: string;
  v3Desc: string;
  v3Tag: string;

  // Activities Section
  activitiesPill: string;
  activitiesTitle: string;
  activitiesSubtitle: string;
  actSubmitFeedback: string;
  actVolunteersNeeded: string;
  actLocation: string;
  actCorporatePartner: string;

  // AI Themes Section
  themesPill: string;
  themesTitle: string;
  themesSubtitle: string;

  // 1-Min Guided Feedback Modal
  modalTitle: string;
  modalSub: string;
  modalActivityCode: string;
  modalName: string;
  modalEmail: string;
  modalCompany: string;
  modalRating: string;
  modalTheme: string;
  modalComments: string;
  modalSuggestions: string;
  modalSubmitBtn: string;
  modalSuccessTitle: string;
  modalSuccessSub: string;
  modalCloseBtn: string;

  // Footer
  footerAbout: string;
  footerPuneOffice: string;
  footerPuneAddr: string;
  footerMumbaiOffice: string;
  footerMumbaiAddr: string;
  footerRights: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    navHome: 'Home',
    navFeedback: 'Submit Feedback',
    navActivities: 'Volunteering Drives',
    navCorporate: 'Corporate SPOC',
    navAdmin: 'Admin Portal',
    navThemes: 'Impact Insights',
    navSignIn: 'SPOC Sign In',
    navSignOut: 'Sign Out',

    heroPill: 'SevaSahayog Foundation • Corporate Volunteering Experience Platform',
    heroTitle1: 'Building Hope.',
    heroTitle2: 'Transforming Corporate Volunteering into Real Impact.',
    heroSubtitle:
      'Empowering 30-35 monthly corporate volunteering activities across Pune and Mumbai. Capture 1-minute structured volunteer feedback, discover actionable improvement themes, and extract evidence-backed stakeholder reports effortlessly.',
    heroBtnFeedback: '⚡ Submit 1-Min Feedback',
    heroBtnSpoc: '🏢 Corporate SPOC Portal',
    heroTagDrives: '35+ Monthly Corporate Drives',
    heroTagDrivesSub: 'Education, Environment & Skilling',
    heroTagQuick: '1-Minute Guided Feedback',
    heroTagQuickSub: 'Instant AI theme classification',

    quickFeedbackTitle: 'Were you part of a SevaSahayog volunteering event today?',
    quickFeedbackSub: 'Share your 1-minute structured feedback to help us refine volunteer experiences and community outcomes.',
    quickActivityCodePlaceholder: 'Enter 6-digit Activity Code (e.g. SEVA-PUNE-01)',
    quickBtnStart: 'Start 1-Min Feedback',

    verticalsPill: 'Volunteering Verticals',
    verticalsTitle: 'Our Core Community Initiatives',
    verticalsSubtitle: 'High-engagement volunteering drives designed for corporate partner teams.',
    v1Title: 'Samutkarsh (School Kit & Education)',
    v1Desc: 'Volunteers assemble school kits, conduct digital literacy labs, and build mini-science centers for underprivileged schools.',
    v1Tag: 'Education & Literacy',
    v2Title: 'Vanyashala (Tribal & Rural Development)',
    v2Desc: 'Empowering tribal hamlets across Maharashtra with clean water stations, solar study lamps, and livelihood skill workshops.',
    v2Tag: 'Tribal Welfare',
    v3Title: 'Punarvas (Environment & Sustainability)',
    v3Desc: 'Urban micro-forest plantation, seed-ball making, watershed management, and lake cleanup drives in Pune and Mumbai.',
    v3Tag: 'Ecology & Environment',

    activitiesPill: 'Live & Upcoming Activities',
    activitiesTitle: 'Corporate Volunteering Calendar',
    activitiesSubtitle: 'Explore active volunteering sessions across Pune and Mumbai corporate parks.',
    actSubmitFeedback: 'Submit Quick Feedback',
    actVolunteersNeeded: 'Volunteers Participated',
    actLocation: 'Location',
    actCorporatePartner: 'Corporate Partner',

    themesPill: 'AI Thematic Intelligence',
    themesTitle: 'Converting Feedback into Evidence-Backed Action',
    themesSubtitle: 'Automated natural language classification of volunteer sentiment, logistics, and beneficiary engagement.',

    modalTitle: '1-Minute Volunteer Feedback',
    modalSub: 'Your insights help SevaSahayog and your corporate leadership create meaningful social impact.',
    modalActivityCode: 'Activity Code *',
    modalName: 'Your Full Name *',
    modalEmail: 'Corporate Email Address *',
    modalCompany: 'Company / Corporate Partner *',
    modalRating: 'Overall Volunteering Experience Rating *',
    modalTheme: 'Primary Feedback Area *',
    modalComments: 'What went well? (Key Highlights) *',
    modalSuggestions: 'Any suggestions for future activities?',
    modalSubmitBtn: 'Submit Feedback & Get Thank You Pass',
    modalSuccessTitle: 'Thank You for Creating Change! 🎉',
    modalSuccessSub: 'Your feedback has been verified and indexed in the SevaSahayog Experience Ledger.',
    modalCloseBtn: 'Close',

    footerAbout:
      'SevaSahayog Foundation is a registered non-profit organization mobilizing corporate employees to empower schools, youth, and tribal communities across Maharashtra.',
    footerPuneOffice: 'Pune Head Office',
    footerPuneAddr: '18, Navketan Society, Kothrud, Pune, Maharashtra 411038',
    footerMumbaiOffice: 'Mumbai Center',
    footerMumbaiAddr: 'G-1, Ground Floor, Shreepal Complex, S.V. Road, Goregaon (W), Mumbai 400062',
    footerRights: 'SevaSahayog Foundation. All rights reserved. 80G & FCRA Certified.',
  },

  hi: {
    navHome: 'होम',
    navFeedback: 'प्रतिक्रिया दें',
    navActivities: 'सेवा गतिविधियाँ',
    navCorporate: 'कॉर्पोरेट SPOC',
    navAdmin: 'एडमिन पोर्टल',
    navThemes: 'प्रभाव विश्लेषण',
    navSignIn: 'SPOC साइन इन',
    navSignOut: 'साइन आउट',

    heroPill: 'सेवा सहयोग फाउंडेशन • कॉर्पोरेट स्वयंसेवक अनुभव मंच',
    heroTitle1: 'आशा का निर्माण,',
    heroTitle2: 'कॉर्पोरेट स्वयंसेवा को वास्तविक प्रभाव में बदलना।',
    heroSubtitle:
      'पुणे और मुंबई में प्रति माह 30-35 कॉर्पोरेट स्वयंसेवा गतिविधियों का संचालन। 1 मिनट में संरचित प्रतिक्रिया दर्ज करें, सुधार के मुख्य क्षेत्रों को समझें और प्रामाणिक रिपोर्ट तैयार करें।',
    heroBtnFeedback: '⚡ 1-मिनट में प्रतिक्रिया दें',
    heroBtnSpoc: '🏢 कॉर्पोरेट SPOC पोर्टल',
    heroTagDrives: '35+ मासिक कॉर्पोरेट गतिविधियाँ',
    heroTagDrivesSub: 'शिक्षा, पर्यावरण और कौशल विकास',
    heroTagQuick: '1-मिनट त्वरित प्रतिक्रिया',
    heroTagQuickSub: 'स्वचालित AI विषय वर्गीकरण',

    quickFeedbackTitle: 'क्या आपने आज सेवा सहयोग गतिविधि में भाग लिया?',
    quickFeedbackSub: 'स्वयंसेवक अनुभव और सामुदायिक परिणामों को बेहतर बनाने के लिए अपनी 1-मिनट की प्रतिक्रिया साझा करें।',
    quickActivityCodePlaceholder: '6-अंकीय गतिविधि कोड दर्ज करें (उदा. SEVA-PUNE-01)',
    quickBtnStart: 'प्रतिक्रिया शुरू करें',

    verticalsPill: 'सेवा क्षेत्र',
    verticalsTitle: 'हमारी मुख्य सामुदायिक पहल',
    verticalsSubtitle: 'कॉर्पोरेट साझेदार टीमों के लिए डिज़ाइन की गई प्रभावशाली स्वयंसेवा गतिविधियाँ।',
    v1Title: 'समुत्कर्ष (स्कूल किट और शिक्षा)',
    v1Desc: 'स्वयंसेवक स्कूल किट तैयार करते हैं, डिजिटल साक्षरता कार्यशालाएं लेते हैं और विज्ञान केंद्र स्थापित करते हैं।',
    v1Tag: 'शिक्षा और साक्षरता',
    v2Title: 'वन्यशाला (जनजातीय और ग्रामीण विकास)',
    v2Desc: 'महाराष्ट्र के आदिवासी गांवों में सौर अध्ययन लैंप, शुद्ध पेयजल और आजीविका कौशल कार्यशालाएं।',
    v2Tag: 'जनजातीय कल्याण',
    v3Title: 'पुनर्वास (पर्यावरण और स्थिरता)',
    v3Desc: 'शहरी वृक्षारोपण, सीड-बॉल निर्माण, जल संरक्षण और पुणे-मुंबई में स्वच्छता अभियान।',
    v3Tag: 'पर्यावरण संरक्षण',

    activitiesPill: 'सक्रिय और आगामी गतिविधियाँ',
    activitiesTitle: 'कॉर्पोरेट स्वयंसेवा कैलेंडर',
    activitiesSubtitle: 'पुणे और मुंबई के प्रमुख कॉर्पोरेट पार्कों में सक्रिय स्वयंसेवा सत्र।',
    actSubmitFeedback: 'त्वरित प्रतिक्रिया दें',
    actVolunteersNeeded: 'प्रतिभागी स्वयंसेवक',
    actLocation: 'स्थान',
    actCorporatePartner: 'कॉर्पोरेट साझेदार',

    themesPill: 'AI विषय विश्लेषण',
    themesTitle: 'प्रतिक्रिया को साक्ष्य-आधारित निर्णयों में बदलना',
    themesSubtitle: 'स्वयंसेवक संतुष्टि, लॉजिस्टिक्स और प्रभाव का स्वचालित प्राकृतिक भाषा वर्गीकरण।',

    modalTitle: '1-मिनट स्वयंसेवक प्रतिक्रिया',
    modalSub: 'आपकी राय सेवा सहयोग और आपके कॉर्पोरेट नेतृत्व को सार्थक सामाजिक प्रभाव पैदा करने में मदद करती है।',
    modalActivityCode: 'गतिविधि कोड *',
    modalName: 'आपका पूरा नाम *',
    modalEmail: 'कॉर्पोरेट ईमेल आईडी *',
    modalCompany: 'कंपनी / कॉर्पोरेट साझेदार *',
    modalRating: 'समग्र स्वयंसेवा अनुभव रेटिंग *',
    modalTheme: 'मुख्य प्रतिक्रिया क्षेत्र *',
    modalComments: 'क्या सबसे अच्छा रहा? *',
    modalSuggestions: 'भविष्य के लिए कोई सुझाव?',
    modalSubmitBtn: 'प्रतिक्रिया सबमिट करें और धन्यवाद पास प्राप्त करें',
    modalSuccessTitle: 'बदलाव लाने के लिए धन्यवाद! 🎉',
    modalSuccessSub: 'आपकी प्रतिक्रिया सत्यापित कर सेवा सहयोग अनुभव बहीखाते में दर्ज कर ली गई है।',
    modalCloseBtn: 'बंद करें',

    footerAbout:
      'सेवा सहयोग फाउंडेशन एक पंजीकृत गैर-लाभकारी संगठन है जो महाराष्ट्र में कॉर्पोरेट स्वयंसेवकों को स्कूलों, युवाओं और ग्रामीण समुदायों के विकास हेतु जोड़ता है।',
    footerPuneOffice: 'पुणे मुख्य कार्यालय',
    footerPuneAddr: '१८, नवकेतन सोसायटी, कोथरूड, पुणे, महाराष्ट्र ४११०३८',
    footerMumbaiOffice: 'मुंबई केंद्र',
    footerMumbaiAddr: 'जी-१, श्रीपाल कॉम्प्लेक्स, एस.वी. रोड, गोरेगांव (प), मुंबई ४०००६२',
    footerRights: 'सेवा सहयोग फाउंडेशन। सर्वाधिकार सुरक्षित। 80G और FCRA प्रमाणित।',
  },

  mr: {
    navHome: 'मुख्यपृष्ठ',
    navFeedback: 'अभिप्राय नोंदवा',
    navActivities: 'सेवा उपक्रम',
    navCorporate: 'कॉर्पोरेट SPOC',
    navAdmin: 'अ‍ॅडमिन पोर्टल',
    navThemes: 'प्रभाव विश्लेषण',
    navSignIn: 'SPOC साइन इन',
    navSignOut: 'साइन आउट',

    heroPill: 'सेवा सहयोग फाउंडेशन • कॉर्पोरेट स्वयंसेवक अनुभव व्यासपीठ',
    heroTitle1: 'आशेची निर्मिती,',
    heroTitle2: 'कॉर्पोरेट स्वयंसेवेचे मोजता येण्याजोग्या सामाजिक प्रभावात रूपांतर.',
    heroSubtitle:
      'पुणे आणि मुंबईत दरमहा ३०-३५ कॉर्पोरेट स्वयंसेवा उपक्रमांचे आयोजन. १ मिनिटात स्वयंसेवकांचा रचनात्मक अभिप्राय नोंदवा, सुधारणेचे मुख्य मुद्दे शोधा आणि पुराव्यांवर आधारित अहवाल मिळवा.',
    heroBtnFeedback: '⚡ १-मिनिटात अभिप्राय नोंदवा',
    heroBtnSpoc: '🏢 कॉर्पोरेट SPOC पोर्टल',
    heroTagDrives: '३५+ मासिक कॉर्पोरेट उपक्रम',
    heroTagDrivesSub: 'शिक्षण, पर्यावरण आणि कौशल्य विकास',
    heroTagQuick: '१-मिनिट सुलभ अभिप्राय',
    heroTagQuickSub: 'स्वयंचलित AI विषय वर्गीकरण',

    quickFeedbackTitle: 'तुम्ही आज सेवा सहयोगच्या स्वयंसेवा उपक्रमात सहभागी झालात का?',
    quickFeedbackSub: 'स्वयंसेवेचा अनुभव आणि सामाजिक परिणाम अधिक प्रभावी करण्यासाठी तुमचा १ मिनिटांचा अभिप्राय द्या.',
    quickActivityCodePlaceholder: '६-अंकी अ‍ॅक्टिव्हिटी कोड टाका (उदा. SEVA-PUNE-01)',
    quickBtnStart: 'अभिप्राय सुरू करा',

    verticalsPill: 'कार्यक्षेत्रे',
    verticalsTitle: 'आमचे मुख्य सामाजिक उपक्रम',
    verticalsSubtitle: 'कॉर्पोरेट भागीदार कंपन्यांच्या कर्मचाऱ्यांसाठी तयार केलेले प्रभावी स्वयंसेवा उपक्रम.',
    v1Title: 'समुत्कर्ष (शालेय साहित्य व शिक्षण)',
    v1Desc: 'स्वयंसेवक गरजू विद्यार्थ्यांसाठी स्कूल किट तयार करतात, संगणक साक्षरता वर्ग घेतात आणि मिनी-सायन्स लॅब उभारतात.',
    v1Tag: 'शिक्षण व साक्षरता',
    v2Title: 'वन्यशाळा (आदिवासी व ग्रामीण विकास)',
    v2Desc: 'महाराष्ट्रातील आदिवासी पाड्यांवर सौर अभ्यास दिवे, शुद्ध पिण्याचे पाणी आणि उपजीविका कौशल्य प्रशिक्षण कार्यशाळा.',
    v2Tag: 'आदिवासी कल्याण',
    v3Title: 'पुनर्वास (पर्यावरण व शाश्वतता)',
    v3Desc: 'शहरी वृक्षारोपण, सीड-बॉल निर्मिती, जलसंधारण आणि पुणे-मुंबईत स्वच्छता मोहिमा.',
    v3Tag: 'पर्यावरण संवर्धन',

    activitiesPill: 'सक्रिय आणि आगामी उपक्रम',
    activitiesTitle: 'कॉर्पोरेट स्वयंसेवा दिनदर्शिका',
    activitiesSubtitle: 'पुणे आणि मुंबईतील आघाडीच्या कॉर्पोरेट कंपन्यांसोबत सुरू असलेले स्वयंसेवा उपक्रम.',
    actSubmitFeedback: 'त्वरित अभिप्राय नोंदवा',
    actVolunteersNeeded: 'सहभागी स्वयंसेवक',
    actLocation: 'स्थान',
    actCorporatePartner: 'कॉर्पोरेट भागीदार',

    themesPill: 'AI विषय विश्लेषण',
    themesTitle: 'अभिप्रायाचे पुराव्यांवर आधारित निर्णयात रूपांतर',
    themesSubtitle: 'स्वयंसेवक समाधान, नियोजन व सामाजिक प्रभावाचे स्वयंचलित भाषा वर्गीकरण.',

    modalTitle: '१-मिनिट स्वयंसेवक अभिप्राय',
    modalSub: 'तुमचा अभिप्राय सेवा सहयोग आणि तुमच्या कॉर्पोरेट नेतृत्वाला सामाजिक प्रभाव वाढवण्यास मदत करतो.',
    modalActivityCode: 'अ‍ॅक्टिव्हिटी कोड *',
    modalName: 'तुमचे पूर्ण नाव *',
    modalEmail: 'कंपनीचा ईमेल पत्ता *',
    modalCompany: 'कंपनी / कॉर्पोरेट भागीदार *',
    modalRating: 'एकूण स्वयंसेवा अनुभव रेटिंग *',
    modalTheme: 'मुख्य अभिप्राय क्षेत्र *',
    modalComments: 'काय सर्वात चांगले वाटले? *',
    modalSuggestions: 'पुढील उपक्रमांसाठी काही सूचना?',
    modalSubmitBtn: 'अभिप्राय नोंदवा आणि धन्यवाद पास मिळवा',
    modalSuccessTitle: 'बदल घडवल्याबद्दल धन्यवाद! 🎉',
    modalSuccessSub: 'तुमचा अभिप्राय पडताळून सेवा सहयोग अनुभव नोंदवहीत नोंदवला गेला आहे.',
    modalCloseBtn: 'बंद करा',

    footerAbout:
      'सेवा सहयोग फाउंडेशन ही महाराष्ट्रातील शाळा, तरुण आणि वंचित घटकांच्या सक्षमीकरणासाठी कॉर्पोरेट स्वयंसेवकांना जोडणारी नोंदणीकृत स्वयंसेवी संस्था आहे.',
    footerPuneOffice: 'पुणे मुख्य कार्यालय',
    footerPuneAddr: '१८, नवकेतन सोसायटी, कोथरूड, पुणे, महाराष्ट्र ४११०३८',
    footerMumbaiOffice: 'मुंबई केंद्र',
    footerMumbaiAddr: 'जी-१, श्रीपाल कॉम्प्लेक्स, एस.व्ही. रोड, गोरेगाव (प), मुंबई ४०००६२',
    footerRights: 'सेवा सहयोग फाउंडेशन. सर्व हक्क राखीव. ८०G आणि FCRA प्रमाणित.',
  },
};
