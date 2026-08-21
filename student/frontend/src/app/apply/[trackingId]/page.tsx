'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import DigitalSignaturePad from '@/components/DigitalSignaturePad';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  CheckCircle2,
  Building2,
  HeartHandshake,
  User,
  Laptop,
  CheckCircle,
  Clock,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';

export default function PersonalizedApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const trackingId = params?.trackingId as string;

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('1st Year Engineering');
  const [branch, setBranch] = useState('');
  const [hscPercentage, setHscPercentage] = useState('88.5%');
  const [cetPercentile, setCetPercentile] = useState('94.2');
  const [annualFamilyIncome, setAnnualFamilyIncome] = useState('Below ₹2,50,000 / annum');
  const [primaryEarnerName, setPrimaryEarnerName] = useState('');
  const [primaryEarnerJob, setPrimaryEarnerJob] = useState('');
  const [hasSingleParent, setHasSingleParent] = useState(false);
  const [hasFirstGenLearner, setHasFirstGenLearner] = useState(true);
  const [whyStemEssay, setWhyStemEssay] = useState('');
  const [careerAspiration, setCareerAspiration] = useState('');
  const [needsLaptopGrant, setNeedsLaptopGrant] = useState(true);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);

  // Fetch lead data by trackingId
  const { data: leadData, isLoading } = useQuery({
    queryKey: ['leadByTracking', trackingId],
    queryFn: async () => {
      const res = await api.get(`/sessions/lead-by-tracking/${trackingId}`);
      return res.data.data;
    },
    enabled: !!trackingId,
  });

  useEffect(() => {
    if (leadData) {
      if (leadData.fullName) setFullName(leadData.fullName);
      if (leadData.email) setEmail(leadData.email);
      if (leadData.phone && leadData.phone !== 'N/A') setPhone(leadData.phone);
      if (leadData.college) setCollegeName(leadData.college);
      if (leadData.yearOfStudy) setYearOfStudy(leadData.yearOfStudy);
      if (leadData.fieldOfStudy) setBranch(leadData.fieldOfStudy);
      if (leadData.signatureDataUrl) setSignatureDataUrl(leadData.signatureDataUrl);
    }
  }, [leadData]);

  const submitApplicationMutation = useMutation({
    mutationFn: async () => {
      setSubmitError(null);
      const targetEmail = (email || leadData?.email || '').toLowerCase().trim();
      if (!targetEmail) {
        throw new Error('Please provide your email address in Step 1.');
      }

      // Create or update student scholarship application
      const res = await api.post('/scholarship/submit-offline', {
        trackingId,
        fullName: fullName || leadData?.fullName || 'Katalyst Scholar',
        email: targetEmail,
        phone: phone || leadData?.phone || 'N/A',
        collegeName: collegeName || leadData?.college || 'Engineering College',
        yearOfStudy: yearOfStudy || leadData?.yearOfStudy || '1st Year Engineering',
        branch: branch || leadData?.fieldOfStudy || 'Engineering',
        hscPercentage,
        cetPercentile,
        annualFamilyIncome,
        primaryEarnerName,
        primaryEarnerJob,
        hasSingleParent,
        hasFirstGenLearner,
        whyStemEssay: whyStemEssay || 'I am passionate about engineering and technology to solve real-world problems.',
        careerAspiration: careerAspiration || 'Software Engineer / Technologist',
        needsLaptopGrant,
        signatureDataUrl,
        digitalConsent: true,
      });
      return res.data;
    },
    onSuccess: () => {
      setIsSubmitted(true);
    },
    onError: (err: any) => {
      console.error('Submit error:', err);
      setSubmitError(err.response?.data?.message || err.message || 'Failed to submit application. Please check your details and try again.');
    },
  });

  const handleFinalSubmit = () => {
    const targetEmail = (email || leadData?.email || '').trim();
    if (!targetEmail) {
      setSubmitError('Please enter a valid email address in Step 1.');
      setCurrentStep(1);
      return;
    }
    submitApplicationMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-700">Loading personalized application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-rose-500 selection:text-white flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-600 to-indigo-600 flex items-center justify-center text-white font-black text-base shadow-md shadow-rose-500/20">
              K
            </div>
            <div>
              <div className="text-base font-black text-slate-900 tracking-tight leading-none">
                Katalyst India
              </div>
              <div className="text-[9px] text-rose-600 font-bold uppercase tracking-wider mt-0.5">
                Personalized Scholarship Enrollment
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200">
              ID: {trackingId}
            </span>
          </div>
        </div>
      </header>

      {/* Main Form Area */}
      <main className="max-w-4xl w-full mx-auto p-4 sm:p-8 flex-1">
        {isSubmitted ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-xl text-center space-y-5 max-w-xl mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900">Application Submitted! 🎉</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Thank you, <strong className="text-slate-900">{fullName}</strong>. Your 4-year Katalyst Fellowship application and digital signature have been recorded in Supabase with status <span className="font-bold text-emerald-600">COMPLETED</span>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5 font-medium text-slate-600">
              <p>&bull; <strong>Tracking ID:</strong> {trackingId}</p>
              <p>&bull; <strong>College:</strong> {collegeName}</p>
              <p>&bull; <strong>Laptop Grant:</strong> {needsLaptopGrant ? 'Requested (Eligible)' : 'Not needed'}</p>
              <p>&bull; <strong>Digital Signature:</strong> <span className="text-emerald-700 font-bold">✓ Legally Verified &amp; Attached</span></p>
              <p>&bull; <strong>Next Step:</strong> Admin committee review &amp; admission offer decision.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                <span>Access Student Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-slate-600 hover:text-slate-900 font-bold text-xs transition-all"
              >
                <span>Return Home</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-rose-950 text-white shadow-xl relative overflow-hidden">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>Personalized Enrollment Link Active</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Welcome, {fullName || 'Scholar'}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Your campus drive registration was verified. Complete your 4-step application below to unlock 4-year financial grants, 1:1 corporate mentorship, and laptop distribution.
              </p>
            </div>

            {/* Error Notification */}
            {submitError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Stepper Wizard */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              {/* Step indicator */}
              <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold text-slate-400 border-b border-slate-100 pb-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className={`transition-colors ${currentStep >= 1 ? 'text-rose-600 font-extrabold' : 'hover:text-slate-600'}`}
                >
                  1. Academic
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className={`transition-colors ${currentStep >= 2 ? 'text-rose-600 font-extrabold' : 'hover:text-slate-600'}`}
                >
                  2. Family
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className={`transition-colors ${currentStep >= 3 ? 'text-rose-600 font-extrabold' : 'hover:text-slate-600'}`}
                >
                  3. Hardware
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className={`transition-colors ${currentStep >= 4 ? 'text-rose-600 font-extrabold' : 'hover:text-slate-600'}`}
                >
                  4. Aspirations &amp; Signature
                </button>
              </div>

              {/* Step 1: Academic */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-slate-900">Step 1: Academic Background</h3>
                    <span className="text-[10px] font-bold text-slate-400">Step 1 of 4</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl input-field outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl input-field outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 text-xs rounded-xl input-field outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">College Name *</label>
                      <input
                        type="text"
                        value={collegeName}
                        onChange={(e) => setCollegeName(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl input-field outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Current Year *</label>
                      <select
                        value={yearOfStudy}
                        onChange={(e) => setYearOfStudy(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl input-field outline-none"
                      >
                        <option value="1st Year Engineering">1st Year Engineering (B.E / B.Tech)</option>
                        <option value="2nd Year Engineering">2nd Year Engineering (B.E / B.Tech)</option>
                        <option value="3rd Year Engineering">3rd Year Engineering</option>
                        <option value="4th Year Engineering">4th Year Engineering</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Engineering Branch *</label>
                      <input
                        type="text"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        placeholder="e.g. Computer Science / IT / AI / Mechanical"
                        className="w-full px-3 py-2 text-xs rounded-xl input-field outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md"
                    >
                      <span>Continue to Step 2</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Family */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-slate-900">Step 2: Socio-Economic Profile</h3>
                    <span className="text-[10px] font-bold text-slate-400">Step 2 of 4</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Annual Family Income *</label>
                      <select
                        value={annualFamilyIncome}
                        onChange={(e) => setAnnualFamilyIncome(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl input-field outline-none"
                      >
                        <option value="Below ₹1,50,000 / annum">Below ₹1,50,000 / annum (High Priority)</option>
                        <option value="Below ₹2,50,000 / annum">Below ₹2,50,000 / annum (Full Eligibility)</option>
                        <option value="Below ₹4,00,000 / annum">Below ₹4,00,000 / annum</option>
                        <option value="Above ₹4,00,000 / annum">Above ₹4,00,000 / annum</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Primary Earner Name *</label>
                      <input
                        type="text"
                        placeholder="Parent / Guardian Name"
                        value={primaryEarnerName}
                        onChange={(e) => setPrimaryEarnerName(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl input-field outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Primary Earner Occupation *</label>
                      <input
                        type="text"
                        placeholder="e.g. Daily Wage Worker, Farmer, Teacher, Clerk, Self-employed"
                        value={primaryEarnerJob}
                        onChange={(e) => setPrimaryEarnerJob(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl input-field outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasSingleParent}
                        onChange={(e) => setHasSingleParent(e.target.checked)}
                        className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                      />
                      <span>Single parent / Guardian household</span>
                    </label>

                    <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasFirstGenLearner}
                        onChange={(e) => setHasFirstGenLearner(e.target.checked)}
                        className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                      />
                      <span>First-generation college learner</span>
                    </label>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md"
                    >
                      <span>Continue to Step 3</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Hardware & Laptop */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-slate-900">Step 3: Hardware &amp; Laptop Grant</h3>
                    <span className="text-[10px] font-bold text-slate-400">Step 3 of 4</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-rose-50/80 border border-rose-200/80 space-y-3">
                    <div className="flex items-center gap-2">
                      <Laptop className="w-5 h-5 text-rose-600" />
                      <span className="text-xs font-bold text-slate-900">100% Laptop Grant Request</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Every enrolled girl scholar receives a brand-new high-speed laptop for programming, DSA practice, and engineering projects.
                    </p>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={needsLaptopGrant}
                        onChange={(e) => setNeedsLaptopGrant(e.target.checked)}
                        className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                      />
                      <span>Yes, I require a free coding laptop grant from Katalyst.</span>
                    </label>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md"
                    >
                      <span>Continue to Step 4</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Aspirations & Digital Signature */}
              {currentStep === 4 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-slate-900">Step 4: Career Aspirations &amp; Digital Signature</h3>
                    <span className="text-[10px] font-bold text-slate-400">Step 4 of 4</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Why are you passionate about Engineering &amp; STEM? *
                    </label>
                    <textarea
                      rows={3}
                      value={whyStemEssay}
                      onChange={(e) => setWhyStemEssay(e.target.value)}
                      placeholder="Share what inspires your passion for software engineering, tech innovation, or leadership..."
                      className="w-full px-3 py-2 text-xs rounded-xl input-field outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Career Goal / Target Role in 4 Years
                    </label>
                    <input
                      type="text"
                      value={careerAspiration}
                      onChange={(e) => setCareerAspiration(e.target.value)}
                      placeholder="e.g. Cloud Architect, AI Researcher, Fullstack Engineer, Tech Lead"
                      className="w-full px-3 py-2 text-xs rounded-xl input-field outline-none"
                    />
                  </div>

                  {/* Digital Signature Pad */}
                  <DigitalSignaturePad
                    signerName={fullName || 'Katalyst Scholar'}
                    onSignatureChange={(sig) => setSignatureDataUrl(sig)}
                    initialSignature={signatureDataUrl}
                  />

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Step 3</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleFinalSubmit}
                      disabled={submitApplicationMutation.isPending}
                      className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-rose-600/25 flex items-center justify-center gap-2 hover-lift transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{submitApplicationMutation.isPending ? 'Submitting to Supabase...' : 'Submit Application & Complete Funnel'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
