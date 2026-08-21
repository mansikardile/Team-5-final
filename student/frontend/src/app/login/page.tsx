'use client';

import React, { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Lock,
  Mail,
  AlertCircle,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';
import { api } from '@/lib/api';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid corporate email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/feedback';

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // OTP Login Mode
  const [useOtpLogin, setUseOtpLogin] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSentNotice, setOtpSentNotice] = useState<string | null>(null);

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

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const res = await api.post('/auth/login', data);
      return res.data;
    },
    onSuccess: (res) => {
      setServerError(null);
      setSuccessMessage(res.message);
      if (res.data?.token) {
        localStorage.setItem('katalyst_student_token', res.data.token);
        localStorage.setItem('katalyst_student_user', JSON.stringify(res.data.student));
      }
      setTimeout(() => {
        router.push(returnUrl);
      }, 600);
    },
    onError: (err: any) => {
      setServerError(err.response?.data?.message || 'Login failed. Please verify your credentials.');
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setServerError(null);
    setSuccessMessage(null);
    loginMutation.mutate(data);
  };

  const handleRequestOtp = async () => {
    setServerError(null);
    try {
      const res = await api.post('/auth/request-otp', { emailOrPhone: otpEmail });
      if (res.data?.success) {
        setOtpSentNotice(res.data.message);
      }
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Failed to send OTP code');
    }
  };

  const handleVerifyOtp = async () => {
    setServerError(null);
    try {
      const res = await api.post('/auth/verify-otp', { emailOrPhone: otpEmail, otp: otpCode });
      if (res.data?.success) {
        const { token, student } = res.data.data;
        localStorage.setItem('katalyst_student_token', token);
        localStorage.setItem('katalyst_student_user', JSON.stringify(student));
        setSuccessMessage('OTP Verified successfully!');
        setTimeout(() => router.push(returnUrl), 600);
      }
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Invalid OTP code');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 bg-[#fdfbf7] relative overflow-hidden font-sans">
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-2xl border border-slate-200/90 overflow-hidden p-8 space-y-6 animate-fade-in relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#0f2b5c] text-white flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-7 h-7 text-sky-300" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Volunteer Login
          </h1>
          <p className="text-xs text-slate-500">
            Sign in to submit verified volunteering feedback and download CSR passes.
          </p>
        </div>

        {serverError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Mode Switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setUseOtpLogin(false)}
            className={`py-2 rounded-xl transition-all ${
              !useOtpLogin ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Password Login
          </button>
          <button
            type="button"
            onClick={() => setUseOtpLogin(true)}
            className={`py-2 rounded-xl transition-all ${
              useOtpLogin ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Email OTP Login
          </button>
        </div>

        {!useOtpLogin ? (
          /* Password Form */
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Corporate Email</label>
              <input
                type="email"
                {...register('email')}
                placeholder="aniket.d@mastercard.com"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-blue-600/30"
              />
              {errors.email && <p className="text-rose-600 text-[11px] font-bold">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Password</label>
              <input
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-blue-600/30"
              />
              {errors.password && <p className="text-rose-600 text-[11px] font-bold">{errors.password.message}</p>}
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-[11px] text-slate-500 block">Quick Auto-Fill Test Account:</span>
              <button
                type="button"
                onClick={() => {
                  setValue('email', 'aniket.d@mastercard.com');
                  setValue('password', 'Volunteer@123');
                }}
                className="w-full py-2 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 font-bold text-[11px] hover:bg-blue-100 cursor-pointer"
              >
                Auto-Fill: Aniket Deshmukh (Mastercard)
              </button>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-4 rounded-2xl bg-[#0f2b5c] hover:bg-[#091b3b] text-white font-black text-xs shadow-lg transition-colors cursor-pointer"
            >
              {loginMutation.isPending ? 'Authenticating...' : 'Sign In to Volunteer Portal'}
            </button>
          </form>
        ) : (
          /* OTP Form */
          <div className="space-y-4 text-xs">
            {otpSentNotice && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                {otpSentNotice}
              </div>
            )}

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Corporate Email</label>
              <input
                type="email"
                value={otpEmail}
                onChange={(e) => setOtpEmail(e.target.value)}
                placeholder="aniket.d@mastercard.com"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-semibold"
              />
            </div>

            <button
              type="button"
              onClick={handleRequestOtp}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer"
            >
              Send 6-Digit OTP Code
            </button>

            <div className="space-y-1 pt-1">
              <label className="font-bold text-slate-700">Enter 6-Digit OTP Code</label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="Enter 6-digit code (e.g. 123456)"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-center font-mono font-bold text-base tracking-widest text-slate-900"
              />
            </div>

            <button
              type="button"
              onClick={handleVerifyOtp}
              className="w-full py-4 rounded-2xl bg-[#0f2b5c] hover:bg-[#091b3b] text-white font-black text-xs shadow-lg transition-colors cursor-pointer"
            >
              Verify OTP &amp; Sign In
            </button>
          </div>
        )}

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Don't have a volunteer account yet? </span>
          <Link href="/signup" className="font-bold text-blue-700 hover:underline">
            Register Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-bold text-slate-400">Loading Login...</div>}>
      <LoginContent />
    </Suspense>
  );
}
