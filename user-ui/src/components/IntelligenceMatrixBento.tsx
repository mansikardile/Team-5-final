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
  Laptop,
} from 'lucide-react';
import Interactive3DCard from '@/components/Interactive3DCard';

export default function IntelligenceMatrixBento() {
  const [activeDomain, setActiveDomain] = useState<'ai' | 'cloud' | 'security'>('ai');
  const [liveCounter, setLiveCounter] = useState(4520);

  // Subtle live ticker effect
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCounter((prev) => prev + Math.floor(Math.random() * 2));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const domainData = {
    ai: {
      title: 'AI & Data Engineering Pipeline',
      stat: '98.6%',
      label: 'Model Accuracy & ML Placement',
      partners: ['Google Cloud', 'Microsoft Research', 'Amazon AWS'],
      growth: '+42.8%',
      skills: ['PyTorch', 'LLM Fine-Tuning', 'MLOps', 'Distributed Compute'],
    },
    cloud: {
      title: 'Cloud Systems & Microservices',
      stat: '99.4%',
      label: 'High-Availability Infrastructure',
      partners: ['Mastercard', 'Cisco Systems', 'Oracle'],
      growth: '+58.2%',
      skills: ['Kubernetes', 'Docker', 'AWS Lambda', 'Terraform'],
    },
    security: {
      title: 'Cybersecurity & Cryptography',
      stat: '100%',
      label: 'Zero-Trust Protocol Readiness',
      partners: ['Mastercard Cyber', 'Palo Alto', 'IBM Security'],
      growth: '+64.1%',
      skills: ['Zero-Trust', 'SIEM', 'Threat Intel', 'Network Defenses'],
    },
  };

  const current = domainData[activeDomain];

  return (
    <section className="py-24 px-4 sm:px-8 max-w-7xl mx-auto w-full">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/90 shadow-sm">
          <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>Real-Time Intelligence &amp; Impact Grid</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Precision Mentorship. <br />
          <span className="text-[#ea580c] font-editorial italic font-normal">Measurable</span> Outcomes.
        </h2>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Powered by data-driven corporate matchmaking, 1:1 senior mentorship, and verified skill credentialing that propels young women into Tier-1 engineering careers.
        </p>
      </div>

      {/* Bento Grid Layout (LP Intelligence Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Card 1 (Large Feature): Interactive Domain Matching Matrix */}
        <div className="lg:col-span-8">
          <Interactive3DCard className="h-full rounded-3xl" maxTilt={6}>
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-950 text-white border border-slate-800/80 shadow-2xl relative overflow-hidden flex flex-col justify-between h-full group">
              {/* Radiant ambient glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#ea580c]/10 rounded-full blur-3xl pointer-events-none" />

              {/* Card Header & Controls */}
              <div className="relative z-10 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-white">
                        Corporate Matchmaking Telemetry
                      </h3>
                      <p className="text-xs text-slate-400">
                        Live scholar-to-mentor corporate linkage
                      </p>
                    </div>
                  </div>

                  {/* Filter Pill Selector */}
                  <div className="flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-xl">
                    <button
                      onClick={() => setActiveDomain('ai')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeDomain === 'ai'
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      AI &amp; ML
                    </button>
                    <button
                      onClick={() => setActiveDomain('cloud')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeDomain === 'cloud'
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Cloud
                    </button>
                    <button
                      onClick={() => setActiveDomain('security')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeDomain === 'security'
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Security
                    </button>
                  </div>
                </div>

                {/* Main Dynamic Highlight Area */}
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                  <div>
                    <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider block">
                      Domain Placement Rate
                    </span>
                    <div className="text-4xl sm:text-5xl font-black text-emerald-400 mt-1 tracking-tight">
                      {current.stat}
                    </div>
                    <span className="text-[11px] text-emerald-300/80 font-medium flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {current.growth} Year-over-Year
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
                      <span>Top Mentorship Partners:</span>
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
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>
                    Verified Mentorship Matches:{' '}
                    <strong className="text-white font-mono">{liveCounter.toLocaleString()}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1 text-emerald-400 font-bold hover:underline cursor-pointer">
                  <span>Explore Curriculum Topology</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Interactive3DCard>
        </div>

        {/* Card 2: 4.8x ROI & Income Velocity Multiplier */}
        <div className="lg:col-span-4">
          <Interactive3DCard className="h-full rounded-3xl" maxTilt={8}>
            <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white border border-emerald-800/40 shadow-xl relative overflow-hidden flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#ea580c]/20 border border-[#ea580c]/30 flex items-center justify-center text-[#ea580c]">
                  <TrendingUp className="w-5 h-5" />
                </div>

                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Socio-Economic Velocity
                  </span>
                  <h3 className="text-4xl font-black text-white mt-1">
                    4.8x Multiplier
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Average household income increase within 12 months of fellowship completion.
                  </p>
                </div>

                {/* Visual Progress Bar HUD */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-400">Pre-Fellowship Baseline</span>
                    <span className="text-slate-300">₹1.8 LPA</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="w-1/4 h-full bg-slate-500 rounded-full" />
                  </div>

                  <div className="flex justify-between text-[11px] font-bold pt-2">
                    <span className="text-emerald-400">Graduate Tech Placement</span>
                    <span className="text-emerald-400 font-mono">₹8.6 – ₹18.4 LPA</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-r from-emerald-500 to-[#ea580c] rounded-full animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span>100% Financial Grant</span>
                <span className="text-emerald-400 font-bold">Zero Debt</span>
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
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
                    Tamper-Proof Dossier
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Verified Scholar Ledger
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Digital consent signatures, college domain verifications, and academic Dossiers are cryptographically indexed for corporate auditability.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 font-mono text-[11px] text-slate-700 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Hash Protocol:</span>
                    <span className="text-indigo-600 font-bold">SHA-256 Consent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Verification Engine:</span>
                    <span className="text-emerald-600 font-bold">Institutional Domain</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Real-Time Sync:</span>
                    <span className="text-slate-900 font-bold">Supabase PostgreSQL</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Audited for Corporate CSR Compliance</span>
              </div>
            </div>
          </Interactive3DCard>
        </div>

        {/* Card 4: Free Laptop Hardware Grant & Coding Ecosystem */}
        <div className="lg:col-span-7">
          <Interactive3DCard className="h-full rounded-3xl" maxTilt={6}>
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#153e2e] via-emerald-900 to-[#0e2c20] text-white border border-emerald-700/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 h-full relative overflow-hidden">
              <div className="space-y-4 max-w-sm relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-bold border border-white/10">
                  <Laptop className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Hardware Equity Initiative</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  100% Free Laptops For Every Fellow.
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                  Brand-new engineering laptops provisioned with development tools, cloud sandboxes, and offline training modules delivered directly to scholars.
                </p>
              </div>

              <div className="relative z-10 shrink-0 text-center sm:text-right space-y-2">
                <div className="text-5xl font-black text-white font-mono tracking-tight">
                  4,500+
                </div>
                <p className="text-xs text-emerald-200 font-medium">
                  Devices Dispatched Pan-India
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ea580c] text-white text-xs font-bold shadow-md">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>100% Grant Funded</span>
                </div>
              </div>
            </div>
          </Interactive3DCard>
        </div>
      </div>
    </section>
  );
}
