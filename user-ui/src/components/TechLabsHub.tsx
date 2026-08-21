'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  Laptop,
  BookOpen,
  Code,
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  Award,
} from 'lucide-react';

export default function TechLabsHub({ student }: { student: any }) {
  // Fetch Tech Labs
  const { data: labs, isLoading } = useQuery({
    queryKey: ['techLabsList'],
    queryFn: async () => {
      const res = await api.get('/learning');
      return res.data.data;
    },
  });

  return (
    <div className="space-y-8">
      {/* Laptop Grant Allocation Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-rose-300 text-xs font-bold">
              <Laptop className="w-3.5 h-3.5" />
              <span>Katalyst Hardware Grant Initiative</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Free Brand-New Laptop Distribution
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
              Every eligible Katalyst scholar who lacks personal computing hardware receives a high-performance brand-new laptop (Intel Core i5 / 16GB RAM / 512GB SSD) pre-configured with Linux/Windows and coding toolchains.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 min-w-[240px]">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
              Laptop Grant Status
            </span>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-extrabold text-white">Eligible for Allocation</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-normal">
              Distributed upon completion of college outreach verification and orientation drive.
            </p>
          </div>
        </div>
      </div>

      {/* Live Tech Labs & Workshops Grid */}
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Katalyst Technical Labs & Bootcamps
          </h3>
          <p className="text-xs text-slate-500">
            Over 600 hours of live technical masterclasses designed to prepare you for Tier-1 corporate engineering interviews.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-52 bg-slate-200/60 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {labs?.map((lab: any) => (
              <div
                key={lab.id}
                className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                      {lab.category}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {lab.durationHrs} Hours &bull; {lab.totalModules} Modules
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mb-1 leading-snug">
                    {lab.title}
                  </h4>
                  <p className="text-xs text-indigo-600 font-semibold mb-2">
                    Instructor: {lab.instructor}
                  </p>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3">
                    {lab.description}
                  </p>

                  {lab.syllabus && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500">
                      <span className="font-bold text-slate-700">Syllabus Highlights: </span>
                      <span>{lab.syllabus}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Free for Scholars</span>
                  </span>
                  <button
                    onClick={() => alert(`Enrolled in "${lab.title}"! Course material and live session links sent to your student email.`)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <span>Start Learning</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
