'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { QRCodeSVG } from 'qrcode.react';
import EventRegistrationQRModal from '@/components/EventRegistrationQRModal';
import ScrollReveal from '@/components/ScrollReveal';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import DigitalSignaturePad from '@/components/DigitalSignaturePad';
import IndiaMapHeroVisual from '@/components/IndiaMapHeroVisual';
import Interactive3DCard from '@/components/Interactive3DCard';
import IntelligenceMatrixBento from '@/components/IntelligenceMatrixBento';
import { Language, translations } from '@/lib/translations';
import {
  getOfflineQueue,
  saveOfflineRegistration,
  syncOfflineQueue,
} from '@/lib/offlineSync';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Calendar,
  MapPin,
  CheckCircle2,
  Building2,
  HeartHandshake,
  Briefcase,
  LogOut,
  Play,
  User,
  Clock,
  ExternalLink,
  ChevronRight,
  Laptop,
  Phone,
  BookOpen,
  CheckCircle,
  QrCode,
  Copy,
  Download,
  Users,
  Target,
  Globe,
  Mail,
  FileText,
  HelpCircle,
  ArrowUpRight,
  Zap,
  TrendingUp,
  Cpu,
  Heart,
  Star,
  Settings,
} from 'lucide-react';

interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  collegeName?: string | null;
  collegeDomain?: string | null;
  yearOfStudy?: string | null;
  branch?: string | null;
  isProfileComplete?: boolean;
  isCollegeVerified: boolean;
  verificationStatus: string;
  profileImageUrl?: string | null;
  sessionRegistrations?: any[];
}

interface EventSession {
  id: string;
  code: string;
  title: string;
  collegeName: string;
  location?: string | null;
  eventDate: string;
  description?: string | null;
  totalAttendees: number;
  isRegisteredByMe: boolean;
}

export default function StudentLandingPage() {
  const queryClient = useQueryClient();
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Multilingual State (English, Hindi, Marathi)
  const [lang, setLang] = useState<Language>('en');

  // Issues tab state (Nirmala design)
  const [activeIssueTab, setActiveIssueTab] = useState<number>(0);

  // Quick guest registration state (No signup required)
  const [quickRegisterEvent, setQuickRegisterEvent] = useState<EventSession | null>(null);
  const [scanQREvent, setScanQREvent] = useState<EventSession | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestCollege, setGuestCollege] = useState('');
  const [guestYear, setGuestYear] = useState('1st Year Engineering');
  const [guestBranch, setGuestBranch] = useState('Computer Engineering / IT');
  const [guestSuccessPass, setGuestSuccessPass] = useState<any>(null);
  const [guestSignature, setGuestSignature] = useState<string>('');
  const [guestConsent, setGuestConsent] = useState<boolean>(true);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [offlinePendingCount, setOfflinePendingCount] = useState<number>(0);
  const [isSyncingOffline, setIsSyncingOffline] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
    const storedToken = localStorage.getItem('katalyst_student_token');
    setToken(storedToken);
    const savedLang = (localStorage.getItem('katalyst_lang') as Language) || 'en';
    setLang(savedLang);

    // Check offline status & queue
    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);
      setOfflinePendingCount(getOfflineQueue().length);

      const handleOnline = async () => {
        setIsOffline(false);
        const { syncedCount } = await syncOfflineQueue();
        if (syncedCount > 0) {
          setSuccessToast(`Synced ${syncedCount} offline registrations to database!`);
          queryClient.invalidateQueries({ queryKey: ['availableSessions'] });
        }
        setOfflinePendingCount(getOfflineQueue().length);
      };

      const handleOffline = () => {
        setIsOffline(true);
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, [queryClient]);

  const handleManualOfflineSync = async () => {
    setIsSyncingOffline(true);
    const { syncedCount } = await syncOfflineQueue();
    setIsSyncingOffline(false);
    setOfflinePendingCount(getOfflineQueue().length);
    if (syncedCount > 0) {
      setSuccessToast(`Successfully synced ${syncedCount} offline registrations!`);
      queryClient.invalidateQueries({ queryKey: ['availableSessions'] });
    }
  };

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('katalyst_lang', newLang);
  };

  const t = translations[lang] || translations.en;

  // Fetch logged in student profile
  const { data: student } = useQuery<StudentProfile>({
    queryKey: ['studentMe', token],
    queryFn: async () => {
      const res = await api.get('/auth/me');
      return res.data.data;
    },
    enabled: !!token,
  });

  // Fetch live available outreach sessions
  const {
    data: sessions,
    isLoading: isSessionsLoading,
  } = useQuery<EventSession[]>({
    queryKey: ['availableSessions', token],
    queryFn: async () => {
      const res = await api.get('/sessions');
      return res.data.data;
    },
    refetchOnWindowFocus: true,
    staleTime: 5000,
    retry: 2,
  });

  // Fetch corporate mentors list
  const { data: mentors } = useQuery({
    queryKey: ['mentorsListLanding'],
    queryFn: async () => {
      const res = await api.get('/mentorship/mentors');
      return res.data.data;
    },
  });

  // Session registration mutation for logged in students
  const registerMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const res = await api.post(`/sessions/${eventId}/register`);
      return res.data;
    },
    onSuccess: (data) => {
      setSuccessToast(data.message || 'Successfully registered for this session!');
      queryClient.invalidateQueries({ queryKey: ['availableSessions'] });
      queryClient.invalidateQueries({ queryKey: ['studentMe'] });
      setTimeout(() => setSuccessToast(null), 4000);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Failed to register for session.');
    },
  });

  const handleLogout = () => {
    localStorage.removeItem('katalyst_student_token');
    localStorage.removeItem('katalyst_student_user');
    setToken(null);
    window.location.reload();
  };

  const isLoggedIn = isClient && !!token && !!student;

  const issues = [
    {
      title: lang === 'hi' ? 'तकनीकी नेतृत्व में लैंगिक असमानता' : lang === 'mr' ? 'तांत्रिक नेतृत्वातील लिंगभेद' : 'Gender Inequality in Tech Leadership',
      stat: lang === 'hi' ? 'भारत में केवल 14% वरिष्ठ तकनीकी नेतृत्व महिलाएं हैं।' : lang === 'mr' ? 'भारतात केवळ १४% वरिष्ठ तंत्रज्ञान नेतृत्व महिला आहेत.' : 'Only 14% of senior corporate tech leadership in India are women.',
      detail: lang === 'hi' ? 'महिला स्नातक 42% होने के बावजूद, कम आय वाली छात्राओं को प्लेसमेंट और कॉर्पोरेट नेटवर्किंग में भारी चुनौतियों का सामना करना पड़ता है।' : lang === 'mr' ? 'महिला पदवीधर ४२% असूनही, आर्थिक अडचणींमुळे विद्यार्थिनींना कॉर्पोरेट प्लेसमेंटमध्ये अडचणी येतात.' : 'While young women comprise over 42% of undergraduate engineering enrollments in India, socio-economic barriers cause severe attrition at placement and middle leadership levels.',
      tag: t.issuesFocusTag,
      icon: TrendingUp,
    },
    {
      title: lang === 'hi' ? 'छात्राओं के लिए हार्डवेयर और लैपटॉप की कमी' : lang === 'mr' ? 'विद्यार्थिनींसाठी लॅपटॉपची कमतरता' : 'Hardware & Computing Inequality for Girls',
      stat: lang === 'hi' ? '72% जरूरतमंद महिला इंजीनियरिंग छात्राओं के पास लैपटॉप नहीं है।' : lang === 'mr' ? '७२% गरजवंत अभियांत्रिकी विद्यार्थिनींकडे लॅपटॉप नाही.' : '72% of low-income female engineering students lack personal laptops.',
      detail: lang === 'hi' ? 'व्यक्तिगत कंप्यूटर के बिना छात्राएं कोडिंग, गिटहब प्रोजेक्ट्स और 24-घंटे के हैकाथॉन में भाग नहीं ले पाती हैं।' : lang === 'mr' ? 'स्वतःच्या संगणकाशिवाय विद्यार्थिनी कोडिंग, गिटहब प्रकल्प आणि हॅकाथॉनमध्ये मागे पडतात.' : 'Without dedicated computers at home or hostels, young women struggle to practice coding algorithms, build technical GitHub portfolios, or participate in 24-hour hackathons.',
      tag: t.issuesFocusTag,
      icon: Cpu,
    },
    {
      title: lang === 'hi' ? 'वरिष्ठ महिला कॉर्पोरेट रोल मॉडल की कमी' : lang === 'mr' ? 'वरिष्ठ महिला मार्गदर्शकांचा अभाव' : 'Lack of Senior Women Corporate Role Models',
      stat: lang === 'hi' ? '90% प्रथम-पीढ़ी की छात्राओं के पास पेशेवर मेंटर नहीं हैं।' : lang === 'mr' ? '९०% प्रथम-पिढीच्या विद्यार्थिनींकडे मार्गदर्शक नाहीत.' : '90% of first-generation female scholars lack professional mentors.',
      detail: lang === 'hi' ? 'छात्राओं को शीर्ष MNCs में तकनीकी मॉक इंटरव्यू और करियर मार्गदर्शन के लिए 1:1 मेंटरशिप की आवश्यकता होती है।' : lang === 'mr' ? 'विद्यार्थिनींना नामांकित MNCs मधील मॉक इंटरव्यू आणि करिअर मार्गदर्शनासाठी १:१ मेंटरशिपची गरज असते.' : 'Young women from non-elite backgrounds need 1:1 guidance from senior women directors in global MNCs for technical mock interviews, salary negotiation, and executive presence.',
      tag: t.issuesFocusTag,
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-rose-500 selection:text-white">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-bottom-3 duration-300">
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold">{successToast}</p>
            <p className="text-[10px] text-slate-400">Database synchronized in real-time</p>
          </div>
        </div>
      )}

      {/* Top Navbar with Language Switcher */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
              K
            </div>
            <div>
              <div className="text-lg font-black text-slate-900 tracking-tight leading-none">
                Katalyst
              </div>
              <div className="text-[9px] text-rose-600 font-bold uppercase tracking-wider mt-0.5">
                Women in STEM &bull; Section 8 NGO
              </div>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-600">
            <Link href="/" className="text-rose-600 hover:text-rose-700 transition-colors">
              {t.navHome}
            </Link>
            <Link href="/about" className="hover:text-rose-600 transition-colors">
              {t.navAbout}
            </Link>
            <a href="#issues" className="hover:text-rose-600 transition-colors">
              {t.navIssues}
            </a>
            <a href="#programs" className="hover:text-rose-600 transition-colors">
              {t.navPrograms}
            </a>
            <a href="#sessions" className="hover:text-rose-600 transition-colors">
              {t.navDrives}
            </a>
            <a href="#mentors" className="hover:text-rose-600 transition-colors">
              {t.navMentors}
            </a>
          </nav>

          {/* Language Switcher & Auth Actions */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher currentLang={lang} onLanguageChange={handleLanguageChange} />

            {isLoggedIn ? (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/dashboard"
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 hover-lift"
                >
                  <Sparkles className="w-3.5 h-3.5 text-rose-200" />
                  <span>{t.navWorkspace}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-600 text-xs font-semibold flex items-center justify-center transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors hidden sm:inline-block"
                >
                  {t.navSignIn}
                </Link>
                <a
                  href="#sessions"
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-extrabold rounded-xl shadow-md shadow-rose-600/20 transition-all flex items-center gap-1 hover-lift"
                >
                  <span>{t.navRegisterDrive}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Remote / Offline Mode Notification Banner */}
      {(isOffline || offlinePendingCount > 0) && (
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 sm:px-8 py-2.5 shadow-md">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
              <span>
                <strong>Remote / Offline Mode:</strong> {isOffline ? 'No internet connection detected.' : 'Internet active.'} ({offlinePendingCount} records queued locally in browser)
              </span>
            </div>
            {offlinePendingCount > 0 && (
              <button
                onClick={handleManualOfflineSync}
                disabled={isSyncingOffline}
                className="px-3 py-1 bg-white text-amber-900 font-bold text-xs rounded-lg shadow-sm hover:bg-amber-50 disabled:opacity-50"
              >
                {isSyncingOffline ? 'Syncing...' : `Sync ${offlinePendingCount} Pending Records Now`}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Logged-In Scholar Welcome Banner (If Authenticated) */}
      {isLoggedIn && (
        <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-700 text-white px-4 sm:px-8 py-3 shadow-inner">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold">
                {student.fullName.charAt(0)}
              </div>
              <span>
                Welcome back, <strong>{student.fullName}</strong>! You are logged in as a Katalyst Scholar.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="px-3 py-1 bg-white text-rose-700 font-extrabold text-xs rounded-lg shadow-sm hover:bg-rose-50 flex items-center gap-1"
              >
                <span>Open Scholar Dashboard & Edit Profile</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 1. HERO SECTION (HopeBridge Inspired with India Map Silhouette) */}
      <section className="relative overflow-hidden bg-[#fdfbf7] border-b border-slate-200/60 pt-16 sm:pt-20 pb-20 sm:pb-28 px-4 sm:px-8 w-full">
        {/* Ambient Indian Heritage University Campus Background (Richer & More Prominent) */}
        <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
          <img
            src="/images/indian_heritage_campus_bg.jpg"
            alt="Indian University Campus Background"
            className="w-full h-full object-cover object-center opacity-[0.45] filter contrast-125 brightness-95 saturate-110"
          />
          {/* Soft directional gradient mask to keep text ultra readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#fdfbf7] via-[#fdfbf7]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fdfbf7] via-transparent to-[#fdfbf7]/50" />
        </div>

        {/* Subtle Ambient Radial Glows */}
        <div className="absolute top-12 left-1/3 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
          {/* Left Column: Editorial Headline, Subtitle, CTA Pills & Social Proof */}
          <ScrollReveal direction="up" distance={30} duration={1000} className="lg:col-span-7 space-y-7 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/80 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Katalyst Women in STEM • India Fellowship 2025–2026</span>
            </div>

            {/* Editorial Heading Matching HopeBridge Typography */}
            <h1 className="text-4xl sm:text-6xl xl:text-[68px] font-black text-slate-900 tracking-tight leading-[1.08]">
              Building Hope.<br />
              Creating <span className="text-[#ea580c] font-editorial italic font-normal tracking-normal">Change.</span><br />
              Transforming Lives.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-normal">
              Together, we empower ambitious young women from low-income communities to live, learn, lead, and break barriers in Engineering &amp; Technology across India.
            </p>

            {/* HopeBridge Style Pill Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
              <Link
                href="/signup"
                className="px-8 py-4 bg-[#153e2e] hover:bg-[#0e2c20] active:bg-[#081a13] text-white font-bold text-sm rounded-full shadow-lg shadow-emerald-950/20 hover:shadow-xl transition-all flex items-center justify-center gap-2.5 hover-lift cursor-pointer"
              >
                <Heart className="w-4 h-4 text-rose-300 fill-rose-300" />
                <span>Apply for Fellowship</span>
              </Link>

              <a
                href="#sessions"
                className="px-7 py-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-full border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-2 hover-lift cursor-pointer"
              >
                <span>Explore Campus Drives</span>
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center ml-0.5">
                  <Play className="w-3 h-3 fill-emerald-800 translate-x-0.5" />
                </div>
              </a>
            </div>

            {/* Social Proof Scholar Avatars Stack */}
            <div className="flex items-center gap-3.5 pt-2">
              <div className="flex -space-x-2.5 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Katalyst Scholar"
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-sm"
                />
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
                  alt="Katalyst Scholar"
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-sm"
                />
                <img
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80"
                  alt="Katalyst Scholar"
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-sm"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Katalyst Scholar"
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-sm"
                />
              </div>

              <div className="text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-1 text-amber-500 mb-0.5">
                  {'★★★★★'.split('').map((s, idx) => (
                    <span key={idx} className="text-xs">★</span>
                  ))}
                </div>
                <span>Join <strong className="text-slate-900 font-bold">25,000+</strong> supporters &amp; scholars across India</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column: India Map Photo Mask Silhouette */}
          <ScrollReveal direction="left" distance={35} delay={150} duration={1000} className="lg:col-span-5 relative flex items-center justify-center">
            <IndiaMapHeroVisual />
          </ScrollReveal>
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-8 py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <ScrollReveal direction="right" distance={40} duration={1100} className="lg:col-span-5 relative">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200 group">
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80"
                alt="Young female student engineer in modern tech robotics laboratory"
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xl max-w-[210px] animate-float">
              <div className="flex items-center gap-1.5 mb-0.5">
                <ShieldCheck className="w-4 h-4 text-rose-600" />
                <span className="text-xs font-bold text-slate-900">{t.aboutTagOrg}</span>
              </div>
              <p className="text-[10px] text-slate-500">{t.aboutTagOrgSub}</p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" distance={40} delay={100} duration={1100} className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>{t.aboutPill}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {t.aboutTitle}
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              {t.aboutDesc}
            </p>

            <div className="p-4 rounded-2xl bg-rose-50/80 border-l-4 border-rose-600 text-rose-950 text-xs sm:text-sm font-bold italic shadow-sm">
              {t.aboutQuote}
            </div>

            <div>
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline"
              >
                <span>{t.aboutReadStory}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. THE ISSUES */}
      <section id="issues" className="bg-slate-100/70 border-y border-slate-200/80 py-24 px-4 sm:px-8 w-full">
        <div className="max-w-7xl mx-auto space-y-12">
          <ScrollReveal direction="up" distance={30} duration={1000}>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold mb-2">
              <Target className="w-3.5 h-3.5" />
              <span>{t.issuesPill}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t.issuesTitle1} <span className="text-rose-600">{t.issuesTitle2}</span>
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <ScrollReveal direction="right" distance={35} delay={100} duration={1000} className="lg:col-span-5 space-y-3">
              {issues.map((iss, idx) => {
                const IconComponent = iss.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveIssueTab(idx)}
                    className={`w-full p-4 rounded-2xl text-left transition-all border flex items-center justify-between ${
                      activeIssueTab === idx
                        ? 'bg-white border-rose-500 shadow-md ring-2 ring-rose-500/20 translate-x-1.5'
                        : 'bg-white/70 border-slate-200/80 hover:bg-white text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeIssueTab === idx ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-extrabold text-slate-900 block">{iss.title}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{iss.tag}</span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${activeIssueTab === idx ? 'text-rose-600 rotate-90' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </ScrollReveal>

            <ScrollReveal direction="left" distance={35} delay={150} duration={1000} className="lg:col-span-7 p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block">
                {issues[activeIssueTab].tag} Focus
              </span>
              <h3 className="text-2xl font-black text-slate-900 leading-snug">
                {issues[activeIssueTab].stat}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {issues[activeIssueTab].detail}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 4. OUR PROGRAMS */}
      <section id="programs" className="max-w-7xl mx-auto px-4 sm:px-8 py-24 w-full">
        <ScrollReveal direction="up" distance={30} duration={1000} className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>{t.programsPill}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.programsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            {t.programsSubtitle}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <ScrollReveal direction="up" distance={40} delay={100} duration={1100}>
            <Interactive3DCard className="h-full rounded-3xl" maxTilt={10}>
              <div className="rounded-3xl bg-white border border-slate-200/80 shadow-md hover:shadow-xl overflow-hidden flex flex-col justify-between h-full transition-shadow duration-300">
                <div className="h-48 overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80"
                    alt="Young female student coding with laptop"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div
                    style={{ transform: 'translateZ(30px)' }}
                    className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold shadow-lg [transform-style:preserve-3d]"
                  >
                    {t.prog1Tag}
                  </div>
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="text-base font-extrabold text-slate-900">
                    {t.prog1Title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {t.prog1Desc}
                  </p>
                </div>
              </div>
            </Interactive3DCard>
          </ScrollReveal>

          {/* Card 2 */}
          <ScrollReveal direction="up" distance={40} delay={200} duration={1100}>
            <Interactive3DCard className="h-full rounded-3xl" maxTilt={10}>
              <div className="rounded-3xl bg-white border border-slate-200/80 shadow-md hover:shadow-xl overflow-hidden flex flex-col justify-between h-full transition-shadow duration-300">
                <div className="h-48 overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=80"
                    alt="Senior woman technology director mentoring young female engineer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div
                    style={{ transform: 'translateZ(30px)' }}
                    className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold shadow-lg [transform-style:preserve-3d]"
                  >
                    {t.prog2Tag}
                  </div>
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="text-base font-extrabold text-slate-900">
                    {t.prog2Title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {t.prog2Desc}
                  </p>
                </div>
              </div>
            </Interactive3DCard>
          </ScrollReveal>

          {/* Card 3 */}
          <ScrollReveal direction="up" distance={40} delay={300} duration={1100}>
            <Interactive3DCard className="h-full rounded-3xl" maxTilt={10}>
              <div className="rounded-3xl bg-white border border-slate-200/80 shadow-md hover:shadow-xl overflow-hidden flex flex-col justify-between h-full transition-shadow duration-300">
                <div className="h-48 overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80"
                    alt="Group of young female engineering scholars learning in tech lab"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div
                    style={{ transform: 'translateZ(30px)' }}
                    className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-pink-600 text-white text-[10px] font-extrabold shadow-lg [transform-style:preserve-3d]"
                  >
                    {t.prog3Tag}
                  </div>
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="text-base font-extrabold text-slate-900">
                    {t.prog3Title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {t.prog3Desc}
                  </p>
                </div>
              </div>
            </Interactive3DCard>
          </ScrollReveal>
        </div>
      </section>

      {/* 4.5. REAL-TIME INTELLIGENCE & IMPACT GRID (LP Intelligence Bento Style) */}
      <IntelligenceMatrixBento />

      {/* 5. CAMPUS DRIVES */}
      <section id="sessions" className="bg-slate-100/70 border-y border-slate-200/80 py-24 px-4 sm:px-8 w-full">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" distance={30} duration={1000} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.drivesPill}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {t.drivesTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {t.drivesSubtitle}
              </p>
            </div>
          </ScrollReveal>

          {isSessionsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-60 bg-white rounded-3xl border border-slate-200 animate-pulse" />
              ))}
            </div>
          ) : sessions && sessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((ev, idx) => {
                const isRegistered = ev.isRegisteredByMe || student?.sessionRegistrations?.some((r: any) => r.eventId === ev.id);
                return (
                  <ScrollReveal key={ev.id} direction="up" distance={35} delay={idx * 120} duration={1100}>
                    <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover-lift flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 uppercase border border-rose-200/60">
                            {ev.code}
                          </span>
                          <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(ev.eventDate).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>

                        <h3 className="text-base font-extrabold text-slate-900 mb-1 leading-snug">
                          {ev.title}
                        </h3>

                        <div className="space-y-1.5 my-3 text-xs text-slate-500 font-medium">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{ev.collegeName}</span>
                          </div>
                          {ev.location && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{ev.location}</span>
                            </div>
                          )}
                        </div>

                        {ev.description && (
                          <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                            {ev.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                        <span className="text-[11px] font-medium text-slate-400">
                          {ev.totalAttendees} {t.drivesAttendees}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setScanQREvent(ev)}
                            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-bold flex items-center gap-1 transition-colors"
                            title="Scan QR to Register on Mobile"
                          >
                            <QrCode className="w-3.5 h-3.5 text-rose-600" />
                            <span className="hidden sm:inline">{t.drivesScanQR}</span>
                          </button>

                          {isRegistered ? (
                            <div className="flex items-center gap-1.5">
                              <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl flex items-center gap-1 border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{t.drivesRegisteredBadge}</span>
                              </span>
                              <Link
                                href="/dashboard"
                                className="px-2.5 py-1.5 bg-slate-900 text-white text-[11px] font-bold rounded-xl hover:bg-slate-800"
                              >
                                {t.drivesPassBtn}
                              </Link>
                            </div>
                          ) : isLoggedIn ? (
                            <button
                              onClick={() => registerMutation.mutate(ev.id)}
                              disabled={registerMutation.isPending}
                              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1 disabled:opacity-50"
                            >
                              <span>{t.drivesRegisterBtn}</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => setQuickRegisterEvent(ev)}
                              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1"
                            >
                              <span>{t.drivesRegisterBtn}</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <p className="text-sm font-bold text-slate-700">No scheduled sessions at the moment.</p>
              <p className="text-xs text-slate-400 mt-1">Check back soon for upcoming campus drives.</p>
            </div>
          )}
        </div>
      </section>

      {/* 6. CORPORATE MENTORS */}
      <section id="mentors" className="max-w-7xl mx-auto px-4 sm:px-8 py-24 w-full">
        <ScrollReveal direction="up" distance={30} duration={1000} className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold mb-2">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>{t.mentorsPill}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.mentorsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            {t.mentorsSubtitle}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mentors?.map((m: any, idx: number) => (
            <ScrollReveal key={m.id} direction="up" distance={35} delay={idx * 100} duration={1100}>
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover-lift flex flex-col justify-between h-full">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 font-extrabold text-lg flex items-center justify-center mb-4 border border-rose-100 shadow-sm">
                    {m.name.charAt(0)}
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{m.name}</h4>
                  <p className="text-xs font-bold text-rose-600">{m.company}</p>
                  <p className="text-[11px] text-slate-500 mt-1 leading-tight">{m.roleTitle}</p>
                  <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">{m.bio}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {m.expertise}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 7. CALL TO ACTION BANNER */}
      <ScrollReveal direction="none" distance={0} duration={1000} className="max-w-7xl mx-auto px-4 sm:px-8 py-10 w-full relative">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-rose-950 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

          <div className="space-y-2 text-center md:text-left max-w-xl relative z-10">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              {t.ctaTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-normal">
              {t.ctaSubtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 relative z-10">
            <a
              href="#sessions"
              className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-extrabold rounded-xl shadow-lg transition-all hover-lift"
            >
              {t.ctaRegisterBtn}
            </a>
            <Link
              href="/about"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-all hover-lift"
            >
              {t.ctaLearnBtn}
            </Link>
          </div>
        </div>
      </ScrollReveal>

      {/* 8. OFFICIAL DETAILED NGO FOOTER */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-12 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-100">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
                K
              </div>
              <span className="text-sm font-extrabold text-slate-900">Katalyst India</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {t.footerAbout}
            </p>
            <span className="text-[10px] text-rose-700 font-bold bg-rose-50 px-2.5 py-1 rounded-full block w-fit border border-rose-200">
              CIN: U85300MH2007NPL175968
            </span>
          </div>

          <div>
            <h4 className="font-extrabold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">{t.footerRegOffice}</h4>
            <div className="space-y-2 text-[11px] text-slate-500 leading-relaxed">
              <p className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                <span>{t.footerRegOfficeAddr}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>+91 22 2652 0909 / +91 22 2652 0910</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>contact@katalystindia.org</span>
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-extrabold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">{t.footerCenters}</h4>
            <ul className="space-y-1.5 text-[11px] text-slate-500">
              <li>&bull; <strong className="text-slate-700">Pune:</strong> Unit 105, Mayfair Tower, Shivajinagar</li>
              <li>&bull; <strong className="text-slate-700">Bengaluru:</strong> 3rd Floor, Brigade Towers, Residency Road</li>
              <li>&bull; <strong className="text-slate-700">Delhi-NCR:</strong> Connaught Place, New Delhi</li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">{t.footerQuickLinks}</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link href="/" className="hover:text-rose-600">{t.navHome}</Link></li>
              <li><Link href="/about" className="hover:text-rose-600 font-bold text-rose-600">{t.navAbout}</Link></li>
              <li><a href="#sessions" className="hover:text-rose-600">{t.navDrives}</a></li>
              <li><a href="#mentors" className="hover:text-rose-600">{t.navMentors}</a></li>
              <li><Link href="/login" className="hover:text-rose-600">{t.navSignIn}</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} {t.footerRights}
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-800 cursor-pointer">Privacy Policy</span>
            <span>&bull;</span>
            <span className="hover:text-slate-800 cursor-pointer">Terms of Service</span>
            <span>&bull;</span>
            <span className="hover:text-slate-800 cursor-pointer">80G & 12A Certifications</span>
          </div>
        </div>
      </footer>

      {/* QUICK GUEST REGISTRATION MODAL */}
      {quickRegisterEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => {
                setQuickRegisterEvent(null);
                setGuestSuccessPass(null);
              }}
              className="absolute right-4 top-4 w-7 h-7 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-xs font-bold"
            >
              ✕
            </button>

            {guestSuccessPass ? (
              <div className="text-center space-y-4 pt-2">
                <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {t.modalSuccessTitle}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Attendee: <span className="font-bold text-slate-800">{guestName}</span> &bull; {guestEmail}
                  </p>
                </div>

                {/* Digital QR Code Pass */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 inline-block shadow-inner">
                  <QRCodeSVG
                    value={JSON.stringify({
                      trackingId: guestSuccessPass.trackingId,
                      name: guestName,
                      event: quickRegisterEvent.code,
                    })}
                    size={170}
                    level="H"
                    includeMargin={true}
                  />
                </div>

                <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <p className="font-bold text-slate-800 font-mono">Pass ID: {guestSuccessPass.trackingId}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{t.modalSuccessSub}</p>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    href={`/apply/${guestSuccessPass.trackingId}`}
                    className="w-full py-2.5 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 hover-lift"
                  >
                    <span>🚀 Apply for 4-Year Full Scholarship</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => window.print()}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>{t.modalPrintBtn}</span>
                  </button>
                  <button
                    onClick={() => {
                      setQuickRegisterEvent(null);
                      setGuestSuccessPass(null);
                    }}
                    className="w-full py-1.5 text-xs font-bold text-slate-500 hover:text-slate-900"
                  >
                    {t.modalDoneBtn}
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const payload = {
                    fullName: guestName,
                    email: guestEmail,
                    phone: guestPhone,
                    collegeName: guestCollege || quickRegisterEvent.collegeName,
                    yearOfStudy: guestYear,
                    branch: guestBranch,
                    digitalConsent: guestConsent,
                    signatureDataUrl: guestSignature || undefined,
                  };

                  if (isOffline || !navigator.onLine) {
                    // Save offline locally
                    const offlinePass = saveOfflineRegistration({
                      ...payload,
                      eventId: quickRegisterEvent.id,
                      digitalConsent: guestConsent,
                      phone: guestPhone,
                      collegeName: guestCollege || quickRegisterEvent.collegeName,
                      yearOfStudy: guestYear,
                      branch: guestBranch,
                    });
                    setGuestSuccessPass({
                      ...offlinePass,
                      isOffline: true,
                      personalizedUrl: `http://localhost:3001/apply/${offlinePass.trackingId}`,
                    });
                    setOfflinePendingCount(getOfflineQueue().length);
                    setSuccessToast('Registration saved offline! Pass generated.');
                    return;
                  }

                  try {
                    const res = await api.post(`/sessions/${quickRegisterEvent.id}/register`, payload);
                    setGuestSuccessPass(res.data.data);
                    queryClient.invalidateQueries({ queryKey: ['availableSessions'] });
                  } catch (err: any) {
                    // Fallback to offline queue if server fails or network drop
                    const offlinePass = saveOfflineRegistration({
                      ...payload,
                      eventId: quickRegisterEvent.id,
                      digitalConsent: guestConsent,
                      phone: guestPhone,
                      collegeName: guestCollege || quickRegisterEvent.collegeName,
                      yearOfStudy: guestYear,
                      branch: guestBranch,
                    });
                    setGuestSuccessPass({
                      ...offlinePass,
                      isOffline: true,
                      personalizedUrl: `http://localhost:3001/apply/${offlinePass.trackingId}`,
                    });
                    setOfflinePendingCount(getOfflineQueue().length);
                    setSuccessToast('Network unavailable: Saved offline & generated pass!');
                  }
                }}
                className="space-y-3.5"
              >
                <div className="text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold mb-1.5">
                    <Sparkles className="w-3 h-3" />
                    <span>{t.modalTag}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {quickRegisterEvent.title}
                  </h3>
                  <p className="text-xs text-slate-500">{quickRegisterEvent.collegeName}</p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">{t.modalFullName}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mansi Kardile"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl input-field outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">{t.modalEmail}</label>
                    <input
                      type="email"
                      required
                      placeholder="name@gmail.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl input-field outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">{t.modalPhone}</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl input-field outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">{t.modalCollege}</label>
                    <input
                      type="text"
                      required
                      placeholder="College Name"
                      value={guestCollege || quickRegisterEvent.collegeName}
                      onChange={(e) => setGuestCollege(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl input-field outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">{t.modalYear}</label>
                    <select
                      value={guestYear}
                      onChange={(e) => setGuestYear(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl input-field outline-none"
                    >
                      <option value="1st Year Engineering">1st Year Engineering</option>
                      <option value="2nd Year Engineering">2nd Year Engineering</option>
                      <option value="3rd Year Engineering">3rd Year Engineering</option>
                      <option value="4th Year Engineering">4th Year Engineering</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">{t.modalBranch}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Computer Engineering"
                    value={guestBranch}
                    onChange={(e) => setGuestBranch(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl input-field outline-none"
                  />
                </div>

                {/* Digital Signature Pad */}
                <DigitalSignaturePad
                  onSave={(sigUrl) => setGuestSignature(sigUrl)}
                  onClear={() => setGuestSignature('')}
                />

                {/* Digital Consent Checkbox */}
                <label className="flex items-start gap-2 text-[11px] text-slate-600 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={guestConsent}
                    onChange={(e) => setGuestConsent(e.target.checked)}
                    className="mt-0.5 rounded text-rose-600 focus:ring-rose-500 w-4 h-4 shrink-0"
                  />
                  <span>
                    I consent to receive personalized WhatsApp/SMS/Email notifications from Katalyst India for future STEM opportunities, hackathons, and placement drives.
                  </span>
                </label>

                <button
                  type="submit"
                  className="w-full py-3 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-rose-600/25 transition-all flex items-center justify-center gap-2 mt-2 hover-lift"
                >
                  <CheckCircle2 className="w-4 h-4 text-rose-200" />
                  <span>{t.modalSubmitBtn}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* EVENT SCAN-TO-REGISTER QR MODAL */}
      <EventRegistrationQRModal
        isOpen={!!scanQREvent}
        onClose={() => setScanQREvent(null)}
        event={scanQREvent}
      />
    </div>
  );
}
