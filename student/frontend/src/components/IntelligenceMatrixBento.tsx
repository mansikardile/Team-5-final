'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Zap,
  Cpu,
  Building2,
  Users,
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Layers,
  HeartHandshake,
} from 'lucide-react';
import Interactive3DCard from '@/components/Interactive3DCard';

export default function IntelligenceMatrixBento() {
  const [activeDomain, setActiveDomain] = useState<'education' | 'tribal' | 'environment'>('education');
  const [liveCounter, setLiveCounter] = useState(1280);

  // Subtle live ticker effect
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCounter((prev) => prev + Math.floor(Math.random() * 2));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const domainData = {
    education: {
      title: 'Samutkarsh Education & School Kits',
      stat: '98.8%',
      label: 'Volunteer Satisfaction & Kit Readiness',
      partners: ['Mastercard', 'Barclays', 'TCS'],
      growth: '+44.2%',
      skills: ['Kit Assembly', 'Digital Literacy', 'Science Labs', 'Mentoring'],
    },
    tribal: {
      title: 'Vanyashala Tribal Development',
      stat: '99.4%',
      label: 'Solar Lamps & Rural Skilling',
      partners: ['Cummins', 'Infosys', 'Wipro'],
      growth: '+62.1%',
      skills: ['Solar Assembly', 'Clean Water', 'Livelihood Workshops', 'Health Camps'],
    },
    environment: {
      title: 'Punarvas Urban Micro-Forests',
      stat: '100%',
      label: 'Native Sapling Survival Rate',
      partners: ['Mastercard Cyber', 'Cognizant', 'Bajaj Auto'],
      growth: '+71.5%',
      skills: ['Miyawaki Plantation', 'Seed-Ball Making', 'Lake Cleanups', 'Water Bunds'],
    },
  };

  const current = domainData[activeDomain];

  return (
    <section className="py-24 px-4 sm:px-8 max-w-7xl mx-auto w-full">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200/90 shadow-sm">
          <Activity className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span>Real-Time Intelligence &amp; Experience Grid</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Evidence-Backed Decisions. <br />
          <span className="text-blue-600 font-editorial italic font-normal">Measurable</span> Outcomes.
        </h2>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Converting unstructured volunteer feedback into real-time thematic insights, corporate CSR reports, and evidence-based improvements across 30+ monthly drives.
        </p>
      </div>

      {/* Bento Grid Layout (LP Intelligence Style in Royal Blue) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Card 1 (Large Feature): Interactive Domain Matching Matrix */}
        <div className="lg:col-span-8">
          <Interactive3DCard className="h-full rounded-3xl" maxTilt={6}>
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-950 text-white border border-slate-800/80 shadow-2xl relative overflow-hidden flex flex-col justify-between h-full group">
              {/* Radiant ambient glow in Blue / Cyan */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

              {/* Card Header & Controls */}
              <div className="relative z-10 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-sky-400">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-white">
                        NLP Thematic Classification Telemetry
                      </h3>
                      <p className="text-xs text-slate-400">
                        Live corporate volunteering theme breakdown
                      </p>
                    </div>
                  </div>

                  {/* Filter Pill Selector */}
                  <div className="flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-xl">
                    <button
                      onClick={() => setActiveDomain('education')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeDomain === 'education'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Education
                    </button>
                    <button
                      onClick={() => setActiveDomain('tribal')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeDomain === 'tribal'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Tribal
                    </button>
                    <button
                      onClick={() => setActiveDomain('environment')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeDomain === 'environment'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Environment
                    </button>
                  </div>
                </div>

                {/* Main Dynamic Highlight Area */}
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                  <div>
                    <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider block">
                      Volunteer CSAT Rating
                    </span>
                    <div className="text-4xl sm:text-5xl font-black text-sky-400 mt-1 tracking-tight">
                      {current.stat}
                    </div>
                    <span className="text-[11px] text-sky-300/80 font-medium flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {current.growth} Positive Sentiment
                    </span>
                  </div>

                  <div className="sm:col-span-2 space-y-3">
                    <span className="text-xs text-slate-300 font-bold block">
                      {current.title}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {current.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-lg bg-white/10 text-[11px] font-semibold text-slate-200 border border-white/5"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
                      <span>Top Corporate Partners:</span>
                      <strong className="text-white">
                        {current.partners.join(' • ')}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Ticker */}
              <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                  <span>
                    Verified Corporate Feedbacks Logged:{' '}
                    <strong className="text-white font-mono">{liveCounter.toLocaleString()}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sky-400 font-bold hover:underline cursor-pointer">
                  <span>Explore Feedback Themes</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Interactive3DCard>
        </div>

        {/* Card 2: 1-Minute Fast Track Experience */}
        <div className="lg:col-span-4">
          <Interactive3DCard className="h-full rounded-3xl" maxTilt={8}>
            <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 text-white border border-blue-800/40 shadow-xl relative overflow-hidden flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-sky-400">
                  <Zap className="w-5 h-5" />
                </div>

                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Zero Friction Velocity
                  </span>
                  <h3 className="text-4xl font-black text-white mt-1">
                    &lt; 60 Seconds
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Average time required for corporate volunteers to submit guided, structured activity feedback.
                  </p>
                </div>

                {/* Visual Progress Bar HUD */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-400">Traditional Forms</span>
                    <span className="text-slate-300">8–12 mins</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="w-4/5 h-full bg-slate-500 rounded-full" />
                  </div>

                  <div className="flex justify-between text-[11px] font-bold pt-2">
                    <span className="text-sky-400">SevaSahayog Guided Flow</span>
                    <span className="text-sky-400 font-mono">45 Seconds</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-r from-blue-500 to-sky-400 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span>Duplicate Prevention Engine</span>
                <span className="text-sky-400 font-bold">100% Active</span>
              </div>
            </div>
          </Interactive3DCard>
        </div>

        {/* Card 3: Cryptographic Zero-Tamper Verified Ledger */}
        <div className="lg:col-span-5">
          <Interactive3DCard className="h-full rounded-3xl" maxTilt={8}>
            <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-md flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-extrabold border border-blue-200">
                    Verified Experience Record
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Centralized Experience Ledger
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Feedback mapped directly to activity codes and corporate partners for audit-ready CSR reporting.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 font-mono text-[11px] text-slate-700 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Validation Protocol:</span>
                    <span className="text-blue-600 font-bold">Activity Code Match</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Export Capabilities:</span>
                    <span className="text-sky-600 font-bold">Excel &amp; PDF Dossier</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Multi-Language NLP:</span>
                    <span className="text-slate-900 font-bold">English • Hindi • Marathi</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Standardized for Corporate CSR Audit Compliance</span>
              </div>
            </div>
          </Interactive3DCard>
        </div>

        {/* Card 4: 35+ Monthly Corporate Drives */}
        <div className="lg:col-span-7">
          <Interactive3DCard className="h-full rounded-3xl" maxTilt={6}>
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#0f2b5c] via-blue-950 to-[#091b3b] text-white border border-blue-700/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 h-full relative overflow-hidden">
              <div className="space-y-4 max-w-sm relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-bold border border-white/10">
                  <HeartHandshake className="w-3.5 h-3.5 text-sky-300" />
                  <span>Corporate Volunteer Scale</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  30–35 Monthly Corporate Drives.
                </h3>
                <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed">
                  Seamlessly organizing large-scale corporate volunteering with Mastercard, Barclays, TCS, Cummins, and Infosys across Maharashtra.
                </p>
              </div>

              <div className="relative z-10 shrink-0 text-center sm:text-right space-y-2">
                <div className="text-5xl font-black text-white font-mono tracking-tight text-sky-400">
                  25,000+
                </div>
                <p className="text-xs text-sky-200 font-medium">
                  Corporate Volunteers Mobilized
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold shadow-md">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>100% NGO Verified</span>
                </div>
              </div>
            </div>
          </Interactive3DCard>
        </div>
      </div>
    </section>
  );
}
