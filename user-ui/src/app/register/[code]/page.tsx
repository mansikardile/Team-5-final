'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { QRCodeSVG } from 'qrcode.react';
import RealGoogleAuthButton from '@/components/RealGoogleAuthButton';
import {
  Sparkles,
  Building2,
  Calendar,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  User,
  Mail,
  Phone,
  BookOpen,
  ArrowRight,
  QrCode,
  Download,
} from 'lucide-react';

export default function DirectQRRegistrationPage() {
  const params = useParams();
  const eventCode = params?.code as string;
  const [token, setToken] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registrationData, setRegistrationData] = useState<any>(null);

  // Form states for frictionless registration
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('1st Year Engineering');
  const [branch, setBranch] = useState('Computer Engineering / IT');

  useEffect(() => {
    const storedToken = localStorage.getItem('katalyst_student_token');
    setToken(storedToken);
  }, []);

  // Fetch student profile if token exists
  const { data: student } = useQuery({
    queryKey: ['studentMe', token],
    queryFn: async () => {
      const res = await api.get('/auth/me');
      return res.data.data;
    },
    enabled: !!token,
  });

  // Pre-fill from student if logged in
  useEffect(() => {
    if (student) {
      if (student.fullName) setFullName(student.fullName);
      if (student.email) setEmail(student.email);
      if (student.phone) setPhone(student.phone);
      if (student.collegeName) setCollegeName(student.collegeName);
    }
  }, [student]);

  // Fetch event details by code
  const { data: event, isLoading: isEventLoading } = useQuery({
    queryKey: ['eventByCode', eventCode],
    queryFn: async () => {
      const res = await api.get('/sessions');
      const all = res.data.data;
      return all.find((e: any) => e.code === eventCode) || all[0];
    },
  });

  // Set default college name from event
  useEffect(() => {
    if (event?.collegeName && !collegeName) {
      setCollegeName(event.collegeName);
    }
  }, [event]);

  // Register mutation (supports both guests & logged in students)
  const registerMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/sessions/${event?.id}/register`, {
        fullName,
        email,
        phone,
        collegeName,
        yearOfStudy,
        branch,
      });
      return res.data;
    },
    onSuccess: (data) => {
      setIsSuccess(true);
      setRegistrationData(data.data);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Failed to register for this session.');
    },
  });

  if (isEventLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 py-8">
      <div className="max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl mx-auto mb-3 shadow-lg shadow-rose-500/20">
            K
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campus Outreach Drive Entry</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
            {event?.title || 'Campus Orientation Drive'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Session Code: <span className="font-mono font-bold text-slate-700">{eventCode}</span>
          </p>
        </div>

        {/* Event Details Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 mb-6 text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-500 shrink-0" />
            <span className="truncate">{event?.collegeName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-rose-500 shrink-0" />
            <span>
              {event?.eventDate
                ? new Date(event.eventDate).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Upcoming Session'}
            </span>
          </div>
          {event?.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{event?.location}</span>
            </div>
          )}
        </div>

        {/* SUCCESS STATE & DIGITAL PASS */}
        {isSuccess ? (
          <div className="text-center space-y-4 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Registration Confirmed! 🎉</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Attendee: <span className="font-bold text-slate-800">{fullName}</span> &bull; {email}
              </p>
            </div>

            {/* Render Entry QR */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block shadow-inner">
              <QRCodeSVG
                value={JSON.stringify({
                  trackingId: registrationData?.trackingId,
                  studentName: fullName,
                  email,
                  eventCode,
                })}
                size={180}
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p className="font-bold text-slate-800">Pass ID: {registrationData?.trackingId}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Show this QR pass at the entrance desk for instant check-in.</p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => window.print()}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save / Print Entry Pass</span>
              </button>

              <Link
                href="/signup"
                className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
                <span>Unlock 4-Year Scholarship & Mentorship Portal</span>
              </Link>
            </div>
          </div>
        ) : (
          /* INSTANT GUEST REGISTRATION FORM */
          <form
            onSubmit={(e) => {
              e.preventDefault();
              registerMutation.mutate();
            }}
            className="space-y-4"
          >
            <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Quick Registration (No signup required)</span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                Instant QR Pass
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Mansi Kardile"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl input-field outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl input-field outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl input-field outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  College Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cummins / COEP / VJTI / VIT"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl input-field outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Year of Study *
                </label>
                <select
                  value={yearOfStudy}
                  onChange={(e) => setYearOfStudy(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl input-field outline-none"
                >
                  <option value="1st Year Engineering">1st Year Engineering</option>
                  <option value="2nd Year Engineering">2nd Year Engineering</option>
                  <option value="3rd Year Engineering">3rd Year Engineering</option>
                  <option value="4th Year Engineering">4th Year Engineering</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Engineering Branch / Stream *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Computer Science, AI & DS, IT, Electronics"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded-xl input-field outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-rose-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              <QrCode className="w-4 h-4 text-rose-200" />
              <span>{registerMutation.isPending ? 'Registering...' : 'Register for Event & Get QR Pass'}</span>
            </button>

            {/* Optional 1-click Google auto-fill */}
            <div className="pt-3 border-t border-slate-100 text-center">
              <p className="text-[11px] text-slate-400 mb-2">Or autofill faster with your Google account:</p>
              <RealGoogleAuthButton
                buttonText="Auto-fill with Google"
                onSuccess={() => window.location.reload()}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
