'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Language, translations } from '@/lib/translations';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  HeartHandshake,
  Briefcase,
  Users,
  Target,
  CheckCircle2,
  Building2,
  Calendar,
  Laptop,
  GraduationCap,
  Globe,
  Mail,
  Phone,
  MapPin,
  FileText,
  Heart,
  Star,
} from 'lucide-react';

export default function AboutUsPage() {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    const savedLang = (localStorage.getItem('katalyst_lang') as Language) || 'en';
    setLang(savedLang);
  }, []);

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('katalyst_lang', newLang);
  };

  const t = translations[lang] || translations.en;

  const milestones = [
    {
      year: '2007',
      title: t.aboutM1Title,
      desc: t.aboutM1Desc,
    },
    {
      year: '2014',
      title: t.aboutM2Title,
      desc: t.aboutM2Desc,
    },
    {
      year: '2020',
      title: t.aboutM3Title,
      desc: t.aboutM3Desc,
    },
    {
      year: '2025',
      title: t.aboutM4Title,
      desc: t.aboutM4Desc,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
              K
            </div>
            <div>
              <div className="text-lg font-black text-slate-900 tracking-tight leading-none">
                Katalyst India
              </div>
              <div className="text-[10px] text-rose-600 font-bold uppercase tracking-wider mt-0.5">
                Empowering Girls in STEM &bull; Section 8 NGO
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600">
            <Link href="/" className="hover:text-rose-600 transition-colors">
              {t.navHome}
            </Link>
            <Link href="/about" className="text-rose-600 font-extrabold border-b-2 border-rose-600 pb-0.5">
              {t.navAbout}
            </Link>
            <Link href="/#programs" className="hover:text-rose-600 transition-colors">
              {t.navPrograms}
            </Link>
            <Link href="/#sessions" className="hover:text-rose-600 transition-colors">
              {t.navDrives}
            </Link>
            <Link href="/#mentors" className="hover:text-rose-600 transition-colors">
              {t.navMentors}
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher currentLang={lang} onLanguageChange={handleLanguageChange} />
            <Link
              href="/login"
              className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors hidden sm:inline-block"
            >
              {t.navSignIn}
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 hover-lift"
            >
              <span>{t.navWorkspace}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-slate-950 via-indigo-950 to-rose-950 text-white py-24 px-4 sm:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

        <ScrollReveal direction="up" distance={30} duration={1000} className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <span>{t.aboutHeroTag}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            {t.aboutHeroTitle1}{' '}
            <span className="text-rose-400">{t.aboutHeroTitle2}</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            {t.aboutHeroSub}
          </p>
        </ScrollReveal>
      </section>

      {/* Core Mission & Vision */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ScrollReveal direction="right" distance={35} duration={1000}>
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3 h-full hover-lift">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xl mb-4">
                🎯
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">{t.aboutVisionTitle}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.aboutVisionDesc}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" distance={35} delay={150} duration={1000}>
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3 h-full hover-lift">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl mb-4">
                🤝
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">{t.aboutModelTitle}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.aboutModelDesc}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Key Milestones Timeline */}
      <section className="bg-slate-100/70 border-y border-slate-200/80 py-20 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="up" distance={25} duration={800} className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>{t.aboutJourneyPill}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.aboutJourneyTitle}
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((m, idx) => (
              <ScrollReveal key={idx} direction="up" distance={35} delay={idx * 100} duration={1000}>
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between h-full hover-lift">
                  <div>
                    <span className="text-2xl font-black text-rose-600 block mb-2">{m.year}</span>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">{m.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Governance & Legal Disclosure */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-20 w-full">
        <ScrollReveal direction="up" distance={30} duration={1000}>
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-base">
                📜
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{t.aboutGovTitle}</h3>
                <p className="text-xs text-slate-500">{t.aboutGovSub}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">{t.aboutSec8Title}</span>
                <p className="text-slate-500">{t.aboutSec8Desc}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">{t.about80GTitle}</span>
                <p className="text-slate-500">{t.about80GDesc}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">{t.aboutFcraTitle}</span>
                <p className="text-slate-500">{t.aboutFcraDesc}</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Official Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-12 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-100">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center">
                K
              </div>
              <span className="text-sm font-extrabold text-slate-900">Katalyst India</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {t.footerAbout}
            </p>
            <span className="text-[10px] text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-full block w-fit border border-rose-200">
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
              <li><Link href="/#sessions" className="hover:text-rose-600">{t.navDrives}</Link></li>
              <li><Link href="/#mentors" className="hover:text-rose-600">{t.navMentors}</Link></li>
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
    </div>
  );
}
