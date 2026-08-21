'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Heart,
  Building2,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Award,
  BookOpen,
  TreePine,
  Sun,
  Activity,
  MessageSquare,
  ChevronRight,
  Search,
} from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import IndiaMapHeroVisual from '@/components/IndiaMapHeroVisual';
import Interactive3DCard from '@/components/Interactive3DCard';
import IntelligenceMatrixBento from '@/components/IntelligenceMatrixBento';
import VolunteerFeedbackModal from '@/components/VolunteerFeedbackModal';
import { Language, translations } from '@/lib/translations';

export default function SevaSahayogLandingPage() {
  const [lang, setLang] = useState<Language>('en');
  const t = translations[lang] || translations.en;

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [quickActivityCode, setQuickActivityCode] = useState('');
  const [selectedActivityCode, setSelectedActivityCode] = useState('');

  // Active volunteering activities calendar
  const [activities] = useState([
    {
      id: 'SEVA-PUNE-KIT-01',
      title: 'Samutkarsh: 500 School Kits Assembly & Distribution',
      vertical: 'Education & Literacy',
      partner: 'Mastercard India',
      location: 'Kothrud, Pune',
      date: 'Today • 2:00 PM – 5:00 PM',
      volunteersCount: 45,
      status: 'COMPLETED • FEEDBACK OPEN',
      icon: BookOpen,
      color: 'bg-emerald-600',
    },
    {
      id: 'SEVA-MUM-DIGI-02',
      title: 'Digital Literacy & Coding Lab for Municipal School',
      vertical: 'Digital Skilling',
      partner: 'Barclays Mumbai',
      location: 'Goregaon West, Mumbai',
      date: 'Yesterday • 10:00 AM – 1:00 PM',
      volunteersCount: 30,
      status: 'FEEDBACK CLOSING SOON',
      icon: Sparkles,
      color: 'bg-indigo-600',
    },
    {
      id: 'SEVA-PUNE-TREE-03',
      title: 'Punarvas: Urban Micro-Forest Plantation & Seed Balls',
      vertical: 'Environment & Ecology',
      partner: 'TCS Pune',
      location: 'Baner Hills, Pune',
      date: 'Tomorrow • 8:00 AM – 11:30 AM',
      volunteersCount: 60,
      status: 'UPCOMING DRIVE',
      icon: TreePine,
      color: 'bg-emerald-700',
    },
    {
      id: 'SEVA-NSK-TRIBAL-04',
      title: 'Vanyashala: Solar Study Lamp Assembly for Tribal Hamlets',
      vertical: 'Tribal Welfare',
      partner: 'Cummins India',
      location: 'Trimbakeshwar, Nashik',
      date: 'Aug 24, 2026 • 9:00 AM',
      volunteersCount: 35,
      status: 'UPCOMING DRIVE',
      icon: Sun,
      color: 'bg-[#ea580c]',
    },
  ]);

  const handleOpenFeedbackWithCode = (code: string) => {
    setSelectedActivityCode(code);
    setIsFeedbackModalOpen(true);
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickActivityCode.trim()) {
      handleOpenFeedbackWithCode(quickActivityCode.trim());
    } else {
      handleOpenFeedbackWithCode('SEVA-PUNE-KIT-01');
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 font-sans">
      {/* 1. TOP HEADER & NAVIGATION */}
      <header className="sticky top-0 z-40 bg-[#fdfbf7]/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-[#0f2b5c] text-white flex items-center justify-center font-black text-lg shadow-md group-hover:scale-105 transition-transform">
              <Heart className="w-6 h-6 text-sky-300 fill-sky-300" />
            </div>
            <div>
              <span className="text-xl font-black text-slate-900 tracking-tight leading-none block">
                SevaSahayog<span className="text-blue-600">.</span>
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mt-0.5">
                Volunteer Experience Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-slate-700">
            <Link href="#initiatives" className="hover:text-blue-700 transition-colors">
              {t.verticalsPill}
            </Link>
            <Link href="#calendar" className="hover:text-blue-700 transition-colors">
              {t.navActivities}
            </Link>
            <Link href="#insights" className="hover:text-blue-700 transition-colors">
              {t.navThemes}
            </Link>
            <Link
              href="/login"
              className="hover:text-blue-700 transition-colors flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>{t.navCorporate}</span>
            </Link>
            <a
              href="http://localhost:3000/admin/login"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-900 transition-colors"
            >
              {t.navAdmin}
            </a>
          </nav>

          {/* Actions & Language Switcher */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher currentLanguage={lang} onLanguageChange={setLang} />

            <button
              onClick={() => handleOpenFeedbackWithCode('SEVA-PUNE-KIT-01')}
              className="px-4 sm:px-6 py-2.5 rounded-full bg-[#0f2b5c] hover:bg-[#091b3b] active:bg-[#061226] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer hover-lift"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-300" />
              <span className="hidden sm:inline">{t.heroBtnFeedback}</span>
              <span className="sm:hidden">Feedback</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION (HopeBridge Inspired with India Map Silhouette & Campus Backdrop) */}
      <section className="relative overflow-hidden bg-[#fdfbf7] border-b border-slate-200/60 pt-14 sm:pt-20 pb-20 sm:pb-28 px-4 sm:px-8 w-full">
        {/* Ambient Indian Heritage University Campus Background */}
        <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
          <img
            src="/images/indian_heritage_campus_bg.jpg"
            alt="Indian Heritage Campus Background"
            className="w-full h-full object-cover object-center opacity-[0.45] filter contrast-125 brightness-95 saturate-110"
          />
          {/* Directional gradient mask to maintain razor-sharp text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#fdfbf7] via-[#fdfbf7]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fdfbf7] via-transparent to-[#fdfbf7]/50" />
        </div>

        {/* Subtle Ambient Radial Glows */}
        <div className="absolute top-12 left-1/3 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
          {/* Left Column: Editorial Headline, Subtitle, CTA Pills & Social Proof */}
          <ScrollReveal direction="up" distance={30} duration={1000} className="lg:col-span-7 space-y-7 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/80 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin duration-3000" />
              <span>{t.heroPill}</span>
            </div>

            {/* Editorial Heading Matching HopeBridge Typography */}
            <h1 className="text-4xl sm:text-6xl xl:text-[68px] font-black text-slate-900 tracking-tight leading-[1.08]">
              {t.heroTitle1}<br />
              Empowering <span className="text-[#ea580c] font-editorial italic font-normal tracking-normal">Volunteers.</span><br />
              Measuring Real Impact.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-normal">
              {t.heroSubtitle}
            </p>

            {/* HopeBridge Style Action Pills */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
              <button
                onClick={() => handleOpenFeedbackWithCode('SEVA-PUNE-KIT-01')}
                className="px-8 py-4 bg-[#0f2b5c] hover:bg-[#091b3b] active:bg-[#061226] text-white font-bold text-sm rounded-full shadow-xl shadow-blue-950/20 hover:shadow-2xl transition-all flex items-center justify-center gap-2.5 hover-lift cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-sky-300" />
                <span>{t.heroBtnFeedback}</span>
              </button>

              <Link
                href="/login"
                className="px-8 py-4 bg-white hover:bg-slate-50 border border-slate-300/90 text-slate-800 font-bold text-sm rounded-full shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2.5 hover-lift cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>{t.heroBtnSpoc}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>

            {/* Social Proof Avatar Cluster */}
            <div className="flex items-center gap-3.5 pt-2">
              <div className="flex -space-x-2.5 overflow-hidden">
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Corporate Volunteer 1"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Corporate Volunteer 2"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                  alt="Corporate Volunteer 3"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                  alt="Corporate Volunteer 4"
                />
              </div>
              <div className="text-xs">
                <div className="flex items-center text-amber-500 text-xs">
                  {'★'.repeat(5)}
                  <span className="ml-1 text-slate-700 font-bold">4.9 / 5.0</span>
                </div>
                <p className="text-slate-500 font-medium">
                  25,000+ corporate volunteers mobilized across Maharashtra
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column: 3D India Map Visual with Interactive Spatial Tilt */}
          <ScrollReveal direction="left" distance={30} duration={1000} className="lg:col-span-5 flex items-center justify-center">
            <IndiaMapHeroVisual />
          </ScrollReveal>
        </div>
      </section>

      {/* 3. QUICK 1-MINUTE FEEDBACK LAUNCHER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 -mt-8 relative z-20">
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-[11px] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Fast Track Volunteer Voice</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
              {t.quickFeedbackTitle}
            </h3>
            <p className="text-xs text-slate-500">
              {t.quickFeedbackSub}
            </p>
          </div>

          <form onSubmit={handleQuickSubmit} className="flex w-full md:w-auto items-center gap-2">
            <div className="relative flex-1 md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={quickActivityCode}
                onChange={(e) => setQuickActivityCode(e.target.value)}
                placeholder={t.quickActivityCodePlaceholder}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-[#0f2b5c] hover:bg-[#091b3b] text-white text-xs font-bold shadow-md transition-colors shrink-0 cursor-pointer"
            >
              {t.quickBtnStart}
            </button>
          </form>
        </div>
      </section>

      {/* 4. VOLUNTEERING VERTICALS (Interactive 3D Cards) */}
      <section id="initiatives" className="max-w-7xl mx-auto px-4 sm:px-8 py-24 w-full">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold">
            <Award className="w-3.5 h-3.5 text-blue-600" />
            <span>{t.verticalsPill}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.verticalsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {t.verticalsSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Vertical 1: Samutkarsh */}
          <Interactive3DCard className="h-full rounded-3xl" maxTilt={10}>
            <div className="rounded-3xl bg-white border border-slate-200/80 shadow-md hover:shadow-xl overflow-hidden flex flex-col justify-between h-full transition-shadow duration-300">
              <div className="h-48 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80"
                  alt="School Kit and Education Drive"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div
                  style={{ transform: 'translateZ(30px)' }}
                  className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-blue-600 text-white text-[10px] font-extrabold shadow-lg [transform-style:preserve-3d]"
                >
                  {t.v1Tag}
                </div>
              </div>
              <div className="p-6 space-y-2">
                <h3 className="text-base font-extrabold text-slate-900">
                  {t.v1Title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t.v1Desc}
                </p>
              </div>
            </div>
          </Interactive3DCard>

          {/* Vertical 2: Vanyashala */}
          <Interactive3DCard className="h-full rounded-3xl" maxTilt={10}>
            <div className="rounded-3xl bg-white border border-slate-200/80 shadow-md hover:shadow-xl overflow-hidden flex flex-col justify-between h-full transition-shadow duration-300">
              <div className="h-48 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&auto=format&fit=crop&q=80"
                  alt="Tribal Village and Solar Study Lamp Assembly"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div
                  style={{ transform: 'translateZ(30px)' }}
                  className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold shadow-lg [transform-style:preserve-3d]"
                >
                  {t.v2Tag}
                </div>
              </div>
              <div className="p-6 space-y-2">
                <h3 className="text-base font-extrabold text-slate-900">
                  {t.v2Title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t.v2Desc}
                </p>
              </div>
            </div>
          </Interactive3DCard>

          {/* Vertical 3: Punarvas */}
          <Interactive3DCard className="h-full rounded-3xl" maxTilt={10}>
            <div className="rounded-3xl bg-white border border-slate-200/80 shadow-md hover:shadow-xl overflow-hidden flex flex-col justify-between h-full transition-shadow duration-300">
              <div className="h-48 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80"
                  alt="Urban Plantation and Environment Drive"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div
                  style={{ transform: 'translateZ(30px)' }}
                  className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-sky-600 text-white text-[10px] font-extrabold shadow-lg [transform-style:preserve-3d]"
                >
                  {t.v3Tag}
                </div>
              </div>
              <div className="p-6 space-y-2">
                <h3 className="text-base font-extrabold text-slate-900">
                  {t.v3Title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t.v3Desc}
                </p>
              </div>
            </div>
          </Interactive3DCard>
        </div>
      </section>

      {/* 5. AI THEMATIC INTELLIGENCE & IMPACT BENTO GRID */}
      <div id="insights">
        <IntelligenceMatrixBento />
      </div>

      {/* 6. LIVE VOLUNTEERING CALENDAR & FEEDBACK TRACKER */}
      <section id="calendar" className="bg-slate-100/70 border-y border-slate-200/80 py-24 px-4 sm:px-8 w-full">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2">
                <Calendar className="w-3.5 h-3.5 text-blue-700" />
                <span>{t.activitiesPill}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {t.activitiesTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {t.activitiesSubtitle}
              </p>
            </div>

            <Link
              href="/login"
              className="px-5 py-2.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm flex items-center gap-2"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>SPOC Activity Portal</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activities.map((act) => {
              const IconComp = act.icon;
              return (
                <div
                  key={act.id}
                  className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono text-[11px] font-bold border border-slate-200">
                        {act.id}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-extrabold border border-blue-200">
                        {act.status}
                      </span>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className={`w-10 h-10 rounded-2xl ${act.color} text-white flex items-center justify-center shrink-0 shadow-md`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                          {act.title}
                        </h3>
                        <p className="text-xs font-semibold text-blue-600 mt-0.5">
                          {act.partner}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-600 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{act.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{act.volunteersCount} Volunteers</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => handleOpenFeedbackWithCode(act.id)}
                      className="w-full py-3 rounded-2xl bg-[#0f2b5c] hover:bg-[#091b3b] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-sky-300" />
                      <span>{t.actSubmitFeedback}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. CORPORATE PARTNERSHIP CSR OUTCOMES */}
      <section className="py-24 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="p-8 sm:p-12 rounded-[36px] bg-gradient-to-r from-[#0f2b5c] via-blue-950 to-[#091b3b] text-white border border-blue-800/40 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-bold border border-white/10">
              <Building2 className="w-3.5 h-3.5 text-sky-300" />
              <span>For Corporate CSR &amp; HR Leaders</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              Ready to Accelerate Corporate Volunteering with Evidence-Backed Insights?
            </h2>
            <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed">
              Access real-time activity dashboards, sentiment telemetry, and ready-to-share CSR impact reports for your leadership.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 relative z-10 shrink-0 w-full md:w-auto">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-[#0f2b5c] font-black text-xs hover:bg-slate-100 shadow-xl transition-all text-center"
            >
              Access Corporate SPOC Portal
            </Link>
            <a
              href="mailto:contact@sevasahayog.org"
              className="w-full sm:w-auto px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-colors text-center"
            >
              Contact SevaSahayog Team
            </a>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 pt-16 pb-12 px-4 sm:px-8 w-full">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-800">
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-lg">
                <Heart className="w-5 h-5 text-sky-300 fill-sky-300" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                SevaSahayog Foundation
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              {t.footerAbout}
            </p>
          </div>

          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              {t.footerPuneOffice}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.footerPuneAddr}
            </p>
          </div>

          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              {t.footerMumbaiOffice}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.footerMumbaiAddr}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>{t.footerRights}</p>
          <div className="flex items-center gap-6">
            <Link href="#initiatives" className="hover:text-slate-300">
              Initiatives
            </Link>
            <Link href="#calendar" className="hover:text-slate-300">
              Activity Calendar
            </Link>
            <Link href="/login" className="hover:text-slate-300">
              Corporate SPOC
            </Link>
          </div>
        </div>
      </footer>

      {/* 1-MINUTE GUIDED FEEDBACK MODAL */}
      <VolunteerFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        defaultActivityCode={selectedActivityCode}
        lang={lang}
      />
    </div>
  );
}
