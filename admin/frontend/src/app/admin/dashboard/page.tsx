'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Building2,
  FileSpreadsheet,
  LogOut,
  PlusCircle,
  Search,
  Filter,
  Bell,
  Sparkles,
  Award,
  ChevronRight,
  ShieldCheck,
  Download,
  Heart,
  UserCheck,
  Bot,
} from 'lucide-react';

import SevaStatCards from '@/components/admin/SevaStatCards';
import ThematicAnalyticsGrid from '@/components/admin/ThematicAnalyticsGrid';
import VolunteerFeedbackTable from '@/components/admin/VolunteerFeedbackTable';
import VolunteerActivitiesList from '@/components/admin/VolunteerActivitiesList';
import CreateActivityModal from '@/components/admin/CreateActivityModal';
import SpocVerificationTable from '@/components/admin/SpocVerificationTable';
import GeminiEventSummaryModal from '@/components/admin/GeminiEventSummaryModal';

export default function SevaAdminDashboardPage() {
  const router = useRouter();
  const [currentNav, setCurrentNav] = useState<'overview' | 'feedback' | 'drives' | 'spoc'>('overview');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeGeminiModal, setActiveGeminiModal] = useState<{ code: string; title: string } | null>(null);

  const [adminUser, setAdminUser] = useState<{ name: string; email: string; role: string; company?: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('seva_admin_profile');
    if (stored) {
      try {
        setAdminUser(JSON.parse(stored));
      } catch (e) {
        // fallback
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 1. TOP ADMIN & SPOC BAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#0f2b5c] text-white flex items-center justify-center font-black text-lg shadow-md">
              <Heart className="w-6 h-6 text-sky-300 fill-sky-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-slate-900 tracking-tight leading-none">
                  SevaSahayog<span className="text-blue-600">.</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-extrabold border border-blue-200">
                  {adminUser?.role === 'SPOC' ? `${adminUser?.company || 'Corporate'} SPOC Console` : 'Operations Console'}
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
                Volunteer Feedback &amp; Experience Tracking System
              </span>
            </div>
          </div>

          {/* Navigation Pill Switcher */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/70">
            <button
              onClick={() => setCurrentNav('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentNav === 'overview'
                  ? 'bg-white text-blue-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Intelligence Grid</span>
            </button>
            <button
              onClick={() => setCurrentNav('spoc')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentNav === 'spoc'
                  ? 'bg-white text-blue-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>SPOC Volunteer Approval</span>
            </button>
            <button
              onClick={() => setCurrentNav('feedback')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentNav === 'feedback'
                  ? 'bg-white text-blue-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Feedback Ledger</span>
            </button>
            <button
              onClick={() => setCurrentNav('drives')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentNav === 'drives'
                  ? 'bg-white text-blue-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Monthly Drives</span>
            </button>
          </nav>

          {/* Quick Action & Sign Out */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveGeminiModal({ code: 'SEVA-PUNE-KIT-01', title: 'Samutkarsh: 500 School Kits Assembly' })}
              className="hidden lg:flex px-3.5 py-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold items-center gap-1.5 transition-all border border-blue-200 cursor-pointer"
            >
              <Bot className="w-4 h-4 text-blue-700" />
              <span>Gemini AI Summary</span>
            </button>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="hidden sm:flex px-4 py-2.5 rounded-full bg-[#0f2b5c] hover:bg-[#091b3b] text-white text-xs font-bold shadow-sm items-center gap-1.5 transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-sky-300" />
              <span>New Drive</span>
            </button>

            <button
              onClick={() => {
                localStorage.removeItem('seva_admin_token');
                localStorage.removeItem('seva_admin_profile');
                router.push('/admin/login');
              }}
              className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT VIEW */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full space-y-8 flex-1">
        {/* Metric Cards Banner */}
        <SevaStatCards />

        {/* Tab 1: Overview & AI Thematic Discovery */}
        {currentNav === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            <ThematicAnalyticsGrid />
            <VolunteerFeedbackTable />
          </div>
        )}

        {/* Tab 2: SPOC Volunteer Approval Pipeline */}
        {currentNav === 'spoc' && (
          <div className="animate-fade-in">
            <SpocVerificationTable />
          </div>
        )}

        {/* Tab 3: Feedback Ledger */}
        {currentNav === 'feedback' && (
          <div className="animate-fade-in">
            <VolunteerFeedbackTable />
          </div>
        )}

        {/* Tab 4: Monthly Volunteering Drives Registry */}
        {currentNav === 'drives' && (
          <div className="animate-fade-in">
            <VolunteerActivitiesList onOpenCreateModal={() => setIsCreateModalOpen(true)} />
          </div>
        )}
      </main>

      {/* 3. MODAL FOR CONFIGURING DRIVES */}
      <CreateActivityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* 4. MODAL FOR GEMINI EXECUTIVE AI SUMMARY */}
      {activeGeminiModal && (
        <GeminiEventSummaryModal
          isOpen={true}
          onClose={() => setActiveGeminiModal(null)}
          eventCode={activeGeminiModal.code}
          eventTitle={activeGeminiModal.title}
        />
      )}
    </div>
  );
}
