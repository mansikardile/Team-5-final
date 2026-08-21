'use client';

import React from 'react';
import Link from 'next/link';
import { LogOut, ShieldCheck, User } from 'lucide-react';

interface StudentNavbarProps {
  student: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export default function StudentNavbar({
  student,
  activeTab,
  setActiveTab,
  onLogout,
}: StudentNavbarProps) {
  const navTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'sessions', label: 'Campus Drives & QR Pass' },
    { id: 'application', label: 'Scholarship Journey (4 Steps)' },
    { id: 'mentorship', label: '1:1 Mentorship Hub' },
    { id: 'labs', label: 'Tech Labs & Laptop Grants' },
    { id: 'profile', label: 'Academic Profile' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Scholar Pill */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-base shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
              K
            </div>
            <div>
              <div className="text-base font-black text-slate-900 tracking-tight leading-none">
                Katalyst
              </div>
              <div className="text-[9px] text-rose-600 font-bold uppercase tracking-wider mt-0.5">
                Scholar Portal
              </div>
            </div>
          </Link>

          {/* Mobile Profile pill */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onLogout}
              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* User Badge & Sign Out */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
            {student?.profileImageUrl ? (
              <img
                src={student.profileImageUrl}
                alt={student.fullName}
                className="w-6 h-6 rounded-full object-cover border border-slate-300"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center">
                {student?.fullName?.charAt(0) || 'S'}
              </div>
            )}
            <div className="text-left">
              <p className="text-xs font-bold text-slate-800 leading-none truncate max-w-[120px]">
                {student?.fullName}
              </p>
              <span className="text-[9px] font-semibold text-emerald-600 uppercase tracking-tight flex items-center gap-0.5">
                <ShieldCheck className="w-2.5 h-2.5" />
                {student?.isCollegeVerified ? 'Verified' : 'Scholar'}
              </span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
