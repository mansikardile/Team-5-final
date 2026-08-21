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
  Briefcase,
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
        const parsed = JSON.parse(stored);
        setAdminUser(parsed);
        if (parsed?.role === 'SPOC') {
          setCurrentNav('spoc'); // Default SPOCs to their volunteer approval workflow
        }
      } catch (e) {
        // fallback
      }
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('seva_admin_token');
    localStorage.removeItem('seva_admin_profile');
    router.push('/admin/login');
  };

  const isSpoc = adminUser?.role === 'SPOC';

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
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                    isSpoc
                      ? 'bg-amber-50 text-amber-900 border-amber-200'
                      : 'bg-blue-50 text-blue-800 border-blue-200'
                  }`}
                >
                  {isSpoc ? `🏢 ${adminUser?.company || 'Mastercard'} SPOC Console` : '🛡️ Executive Admin Console'}
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
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
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
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
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
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
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
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
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

            {!isSpoc && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="hidden sm:flex px-4 py-2.5 rounded-full bg-[#0f2b5c] hover:bg-[#091b3b] text-white text-xs font-bold shadow-sm items-center gap-1.5 transition-all cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5 text-sky-300" />
                <span>New Drive</span>
              </button>
            )}

            <button
              onClick={handleSignOut}
              className="p-2.5 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. ROLE SCOPE EXPLANATION BANNER */}
      <div className={`border-b ${isSpoc ? 'bg-amber-500/10 border-amber-200 text-amber-950' : 'bg-blue-600/10 border-blue-200 text-blue-950'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2.5 flex items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-2">
            {isSpoc ? <Briefcase className="w-4 h-4 text-amber-700 shrink-0" /> : <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />}
            <span>
              {isSpoc ? (
                <>
                  <strong>Mastercard Corporate SPOC View:</strong> Scoped strictly to <strong>{adminUser?.company || 'Mastercard'}</strong> volunteer approval pipeline, company drives, and employee feedback.
                </>
              ) : (
                <>
                  <strong>Executive Admin View:</strong> Pan-NGO Super Access across all 35+ monthly drives, 12+ corporate partners, and 25,000+ volunteers.
                </>
              )}
            </span>
          </div>

          <span className="hidden md:inline font-mono font-bold text-[11px] opacity-80">
            User: {adminUser?.email || 'admin@sevasahayog.org'}
          </span>
        </div>
      </div>

      {/* 3. MAIN DASHBOARD CONTENT BODY */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
        {/* Navigation Tabs Rendering */}
        {currentNav === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            <SevaStatCards />
            <ThematicAnalyticsGrid />
            <VolunteerFeedbackTable />
          </div>
        )}

        {currentNav === 'spoc' && (
          <div className="space-y-8 animate-fade-in">
            <SpocVerificationTable />
            <VolunteerFeedbackTable />
          </div>
        )}

        {currentNav === 'feedback' && (
          <div className="space-y-8 animate-fade-in">
            <VolunteerFeedbackTable />
          </div>
        )}

        {currentNav === 'drives' && (
          <div className="space-y-8 animate-fade-in">
            <VolunteerActivitiesList onOpenCreateModal={() => setIsCreateModalOpen(true)} />
          </div>
        )}
      </main>

      {/* 4. MODALS */}
      <CreateActivityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

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
