'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import StudentNavbar from '@/components/StudentNavbar';
import ScholarshipJourneyWizard from '@/components/ScholarshipJourneyWizard';
import MentorshipHub from '@/components/MentorshipHub';
import TechLabsHub from '@/components/TechLabsHub';
import MySessionsManager from '@/components/MySessionsManager';
import {
  Award,
  QrCode,
  HeartHandshake,
  Laptop,
  CheckCircle2,
  Calendar,
  Sparkles,
  ShieldCheck,
  Building2,
  User,
  ArrowRight,
  BookOpen,
  Phone,
  Mail,
  ChevronRight,
  Clock,
} from 'lucide-react';

export default function StudentDashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch student profile
  const { data: student, isLoading } = useQuery({
    queryKey: ['studentMe'],
    queryFn: async () => {
      const res = await api.get('/auth/me');
      return res.data.data;
    },
  });

  // Profile update form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [branch, setBranch] = useState('');
  const [collegeEmail, setCollegeEmail] = useState('');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (student) {
      if (student.fullName) setFullName(student.fullName);
      if (student.phone) setPhone(student.phone);
      if (student.collegeName) setCollegeName(student.collegeName);
      if (student.yearOfStudy) setYearOfStudy(student.yearOfStudy);
      if (student.branch) setBranch(student.branch);
    }
  }, [student]);

  const updateProfileMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.patch('/auth/profile', payload);
      return res.data;
    },
    onSuccess: (data) => {
      setProfileSuccessMsg('Academic profile updated successfully! 🎉');
      queryClient.invalidateQueries({ queryKey: ['studentMe'] });
      setTimeout(() => setProfileSuccessMsg(null), 4000);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Failed to update profile');
    },
  });

  const handleLogout = () => {
    localStorage.removeItem('katalyst_student_token');
    localStorage.removeItem('katalyst_student_user');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-600">Loading your Scholar Hub...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full p-8 bg-white rounded-3xl shadow-xl text-center space-y-4 border border-slate-200">
          <h3 className="text-base font-bold text-slate-900">Session Expired</h3>
          <p className="text-xs text-slate-500">Please sign in to access your student dashboard.</p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Student Navigation Bar */}
      <StudentNavbar
        student={student}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex-1">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-rose-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-rose-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Katalyst Scholar Workspace</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  Welcome,{' '}
                  <span className="bg-gradient-to-r from-rose-400 to-pink-300 bg-clip-text text-transparent">
                    {student.fullName}
                  </span>{' '}
                  🎓
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 font-normal">
                  {student.collegeName || 'Engineering College'} &bull; {student.yearOfStudy || 'Undergraduate STEM'} &bull; {student.email}
                </p>
              </div>

              {/* Status Badge */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 min-w-[220px]">
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Institutional Status
                </span>
                <div className="flex items-center gap-2">
                  <ShieldCheck className={`w-4 h-4 ${(student as any).leadStatus === 'REJECTED' ? 'text-rose-400' : 'text-emerald-400'}`} />
                  <span className="text-xs font-extrabold text-white uppercase">
                    {(student as any).leadStatus === 'REJECTED'
                      ? 'REVIEW COMPLETED • NOT SELECTED'
                      : student.verificationStatus.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 mt-1">
                  {(student as any).leadStatus === 'ACCEPTED' || (student as any).applicationStatus === 'ACCEPTED'
                    ? '🎉 Accepted Katalyst Fellow with Full 4-Year Grant.'
                    : (student as any).leadStatus === 'REJECTED'
                    ? 'Application review concluded. You can update your details & re-apply.'
                    : 'Standard account. Complete application for fellowship review.'}
                </p>
              </div>
            </div>

            {/* Accepted Fellow Special Banner */}
            {(student as any).leadStatus === 'ACCEPTED' || (student as any).applicationStatus === 'ACCEPTED' ? (
              <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-purple-500/30">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/40 text-purple-300 flex items-center justify-center font-black shrink-0">
                    <Sparkles className="w-6 h-6 text-purple-300" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-200 text-[10px] font-bold mb-1">
                      <span>Admission Decision: ACCEPTED</span>
                    </div>
                    <h3 className="text-base font-extrabold text-white">
                      Congratulations, {student.fullName}! You are an Accepted Katalyst Fellow 🎉
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Your admission for the 4-Year Women in STEM Fellowship has been approved. Free laptop grant &amp; 1:1 mentorship are active.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('application')}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all shrink-0 flex items-center gap-1.5"
                >
                  <span>View Fellowship Offer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (student as any).leadStatus === 'REJECTED' || (student as any).applicationStatus === 'REJECTED' ? (
              <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-rose-500/30">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/40 text-rose-300 flex items-center justify-center font-black shrink-0">
                    <Clock className="w-6 h-6 text-rose-400" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold mb-1">
                      <span>Admission Decision: NOT SELECTED</span>
                    </div>
                    <h3 className="text-base font-extrabold text-white">
                      Fellowship Application Review Outcome
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Thank you for applying to the Katalyst Fellowship. You can review, update your academic/family details, and re-submit for committee reconsideration.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('application')}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Update Details &amp; Re-apply &rarr;</span>
                </button>
              </div>
            ) : null}

            {/* KPI Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => setActiveTab('sessions')}
                className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <QrCode className="w-5 h-5" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900">
                  {student.sessionRegistrations?.length || 0} Active
                </div>
                <div className="text-xs font-bold text-slate-700 mt-0.5">
                  Campus Sessions & QR Pass
                </div>
                <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                  <span>View entry passes</span>
                  <ChevronRight className="w-3 h-3 text-rose-500" />
                </p>
              </div>

              <div
                onClick={() => setActiveTab('application')}
                className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <div className="text-2xl font-extrabold text-purple-900">
                  {(student as any).leadStatus === 'ACCEPTED' || (student as any).applicationStatus === 'ACCEPTED'
                    ? 'Accepted'
                    : (student as any).leadStatus === 'REJECTED'
                    ? 'Not Selected'
                    : '4 Steps'}
                </div>
                <div className="text-xs font-bold text-slate-700 mt-0.5">
                  Scholarship Status
                </div>
                <p className="text-[11px] font-semibold mt-1 flex items-center gap-1 text-purple-600">
                  <span>
                    {(student as any).leadStatus === 'ACCEPTED' || (student as any).applicationStatus === 'ACCEPTED'
                      ? '✓ Fellowship Awarded'
                      : (student as any).leadStatus === 'REJECTED'
                      ? 'Outcome: Not Selected'
                      : 'Continue application'}
                  </span>
                  <ChevronRight className="w-3 h-3 text-purple-500" />
                </p>
              </div>

              <div
                onClick={() => setActiveTab('mentorship')}
                className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900">1:1 Corporate</div>
                <div className="text-xs font-bold text-slate-700 mt-0.5">
                  Mentorship Program
                </div>
                <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                  <span>Meet tech mentors</span>
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                </p>
              </div>

              <div
                onClick={() => setActiveTab('labs')}
                className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Laptop className="w-5 h-5" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900">Eligible</div>
                <div className="text-xs font-bold text-slate-700 mt-0.5">
                  Free Laptop Grant
                </div>
                <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                  <span>Hardware & labs</span>
                  <ChevronRight className="w-3 h-3 text-purple-500" />
                </p>
              </div>
            </div>

            {/* Quick Embedded Sessions preview */}
            <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Upcoming Campus Sessions</h3>
                  <p className="text-xs text-slate-500">Register with 1 click to get your QR pass.</p>
                </div>
                <button
                  onClick={() => setActiveTab('sessions')}
                  className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
                >
                  <span>View All Sessions</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <MySessionsManager student={student} />
            </div>
          </div>
        )}

        {/* TAB 2: SESSIONS & QR PASS */}
        {activeTab === 'sessions' && <MySessionsManager student={student} />}

        {/* TAB 3: 4-STEP SCHOLARSHIP JOURNEY */}
        {activeTab === 'application' && <ScholarshipJourneyWizard student={student} />}

        {/* TAB 4: 1:1 MENTORSHIP HUB */}
        {activeTab === 'mentorship' && <MentorshipHub student={student} />}

        {/* TAB 5: TECH LABS & LAPTOP GRANTS */}
        {activeTab === 'labs' && <TechLabsHub student={student} />}

        {/* TAB 6: ACADEMIC PROFILE & SETTINGS */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {profileSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{profileSuccessMsg}</span>
              </div>
            )}

            <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="pb-4 border-b border-slate-100 mb-6">
                <h3 className="text-lg font-bold text-slate-900">Scholar Academic Profile</h3>
                <p className="text-xs text-slate-500">
                  Update your contact details, engineering institute, and link your college email.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateProfileMutation.mutate({
                    fullName,
                    phone,
                    collegeName,
                    yearOfStudy,
                    branch,
                    collegeEmail,
                  });
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl input-field outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl input-field outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      College / Engineering Institute Name *
                    </label>
                    <input
                      type="text"
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      required
                      placeholder="e.g. COEP Pune / VJTI / VIT / Cummins"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl input-field outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Current Year of Study *
                    </label>
                    <select
                      value={yearOfStudy}
                      onChange={(e) => setYearOfStudy(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl input-field outline-none"
                    >
                      <option value="1st Year Engineering (B.E / B.Tech)">1st Year Engineering (B.E / B.Tech)</option>
                      <option value="2nd Year Engineering (B.E / B.Tech)">2nd Year Engineering (B.E / B.Tech)</option>
                      <option value="3rd Year Engineering">3rd Year Engineering</option>
                      <option value="4th Year Engineering">4th Year Engineering</option>
                      <option value="Other STEM Degree">Other STEM Degree</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Engineering Branch / Stream *
                    </label>
                    <input
                      type="text"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      required
                      placeholder="e.g. Computer Science & Engineering"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl input-field outline-none"
                    />
                  </div>
                </div>

                {!student.isCollegeVerified && (
                  <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 mt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-sky-600" />
                      <span className="text-xs font-bold text-sky-900">
                        Link College Email for Instant Verification
                      </span>
                    </div>
                    <p className="text-[11px] text-sky-700 leading-relaxed">
                      Enter your official university email (e.g. @coep.ac.in, @vjti.ac.in, @vit.edu, @cumminscollege.in) to unlock Verified Scholar status.
                    </p>
                    <input
                      type="email"
                      placeholder="yourname@college.edu"
                      value={collegeEmail}
                      onChange={(e) => setCollegeEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-sky-200 outline-none"
                    />
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <span>{updateProfileMutation.isPending ? 'Saving Profile...' : 'Save Profile Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
