'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Heart,
  Building2,
  UserCheck,
} from 'lucide-react';
import { api } from '@/lib/api';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid official email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function SevaAdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const res = await api.post('/auth/login', data);
      if (res.data?.success) {
        setIsSuccess(true);
        const { token, admin } = res.data.data;

        localStorage.setItem('seva_admin_token', token);
        localStorage.setItem('seva_admin_profile', JSON.stringify(admin));

        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 500);
      }
    } catch (err: any) {
      setAuthError(
        err.response?.data?.message ||
          'Authentication failed. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const setAdminDemo = () => {
    setValue('email', 'admin@sevasahayog.org');
    setValue('password', 'SevaAdmin2026!');
  };

  const setSpocDemo = () => {
    setValue('email', 'spoc@mastercard.com');
    setValue('password', 'MastercardSpoc2026!');
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-[#fdfbf7] overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-sky-100/40 rounded-full blur-3xl" />
      </div>

      {/* Top Header / Branding */}
      <header className="absolute top-6 left-6 sm:top-8 sm:left-10 z-10 flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-2xl bg-[#0f2b5c] flex items-center justify-center shadow-md text-white font-bold text-base">
          <Heart className="w-5 h-5 text-sky-300 fill-sky-300" />
        </div>
        <div className="flex flex-col">
          <span className="font-black text-slate-900 tracking-tight text-lg leading-tight">
            SevaSahayog<span className="text-blue-600">.</span>
          </span>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            Unified Admin &amp; SPOC Portal
          </span>
        </div>
      </header>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-[32px] shadow-2xl border border-slate-200/90 p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Admin &amp; Corporate SPOC Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Sign In to Console
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Manage 35+ monthly corporate drives, verify volunteer signups, and access Gemini AI executive summaries.
          </p>
        </div>


        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">Official Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                {...register('email')}
                placeholder="admin@sevasahayog.org or spoc@mastercard.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-rose-600 font-bold">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] text-rose-600 font-bold">{errors.password.message}</p>
            )}
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{authError}</span>
            </div>
          )}

          {isSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Authentication Verified. Opening Console...</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || isSuccess}
            className="w-full py-3.5 rounded-2xl bg-[#0f2b5c] hover:bg-[#091b3b] active:bg-[#061226] text-white font-black text-xs shadow-xl shadow-blue-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4 text-sky-300" />
                <span>Sign In to Console</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center">
          <a
            href="http://localhost:3001"
            className="text-xs text-blue-700 font-bold hover:underline"
          >
            ← Return to Public Volunteer Portal
          </a>
        </div>
      </div>
    </main>
  );
}
