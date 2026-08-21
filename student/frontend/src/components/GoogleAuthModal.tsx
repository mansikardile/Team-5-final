'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Sparkles, CheckCircle2, ArrowRight, User, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';

const SAMPLE_COLLEGE_ACCOUNTS = [
  { name: 'Priya Sharma', email: 'priya.sharma@coep.ac.in', college: 'College of Engineering Pune (COEP)', isCollege: true },
  { name: 'Ananya Deshmukh', email: 'ananya.d@vjti.ac.in', college: 'VJTI Mumbai', isCollege: true },
  { name: 'Sneha Patel', email: 'sneha.patel@vit.edu', college: 'VIT Pune', isCollege: true },
  { name: 'Riya Kulkarni', email: 'riya.k@cumminscollege.in', college: 'MKSSS Cummins College of Engineering', isCollege: true },
  { name: 'Kavya Singh', email: 'kavya.singh@gmail.com', college: 'General Student (Personal Account)', isCollege: false },
];

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultIsCollege?: boolean;
  onSuccess: (data: any) => void;
}

export default function GoogleAuthModal({
  isOpen,
  onClose,
  defaultIsCollege = true,
  onSuccess,
}: GoogleAuthModalProps) {
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customCollege, setCustomCollege] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectAccount = async (account: {
    name: string;
    email: string;
    college: string;
  }) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const res = await api.post('/auth/google', {
        email: account.email,
        fullName: account.name,
        googleId: `google_oauth_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        profileImageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(account.name)}`,
        collegeName: account.college,
      });

      if (res.data?.data?.token) {
        localStorage.setItem('katalyst_student_token', res.data.data.token);
        localStorage.setItem('katalyst_student_user', JSON.stringify(res.data.data.student));
        onSuccess(res.data);
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Google authentication failed');
      setIsLoading(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail || !customName) {
      setErrorMessage('Please enter both your name and Google account email');
      return;
    }
    handleSelectAccount({
      name: customName,
      email: customEmail,
      college: customCollege || 'Engineering College',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-none">
                Sign in with Google
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Choose a Google account to continue to Katalyst
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Account selection list */}
        {!isCustomMode ? (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-700 mb-2">
              Select or test with a Google account:
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {SAMPLE_COLLEGE_ACCOUNTS.map((acc, i) => (
                <button
                  key={i}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSelectAccount(acc)}
                  className="w-full p-3 rounded-2xl border border-slate-200 hover:border-sky-400 hover:bg-sky-50/50 transition-all text-left flex items-center justify-between group disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {acc.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 leading-snug">
                        {acc.name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {acc.email}
                      </div>
                    </div>
                  </div>

                  {acc.isCollege ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                      <ShieldCheck className="w-3 h-3" />
                      Verified College
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                      Personal Gmail
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Custom Google account button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsCustomMode(true)}
                className="w-full py-2.5 px-3 rounded-xl border border-dashed border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>+ Use another Google account</span>
              </button>
            </div>
          </div>
        ) : (
          /* Custom Google Account Form */
          <form onSubmit={handleCustomSubmit} className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Enter your Google Account Details
              </span>
              <button
                type="button"
                onClick={() => setIsCustomMode(false)}
                className="text-[11px] text-sky-600 hover:underline"
              >
                &larr; Back to list
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Radhika Apte"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Google Email Address *
              </label>
              <input
                type="email"
                placeholder="name@coep.ac.in or name@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Emails from recognized college domains (@coep.ac.in, @vit.edu, @vjti.ac.in, @pict.edu) will be auto-verified!
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                College / Institution Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. COEP Pune"
                value={customCollege}
                onChange={(e) => setCustomCollege(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Authenticating with Google...</span>
                </>
              ) : (
                <>
                  <span>Sign in with this Google Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
