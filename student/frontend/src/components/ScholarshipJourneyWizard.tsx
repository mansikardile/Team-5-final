'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import DigitalSignaturePad from '@/components/DigitalSignaturePad';
import {
  Award,
  CheckCircle2,
  Clock,
  FileText,
  Building2,
  UserCheck,
  Laptop,
  ArrowRight,
  ArrowLeft,
  Save,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Mail,
  Phone,
  BookOpen,
  User,
} from 'lucide-react';

export default function ScholarshipJourneyWizard({ student }: { student: any }) {
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [attemptedNext, setAttemptedNext] = useState(false);

  // Form states matching EXACT candidate dossier structure
  // Step 1: Academic & Contact Info
  const [fullName, setFullName] = useState(student?.fullName || '');
  const [email, setEmail] = useState(student?.email || '');
  const [phone, setPhone] = useState(student?.phone || '');
  const [collegeName, setCollegeName] = useState(student?.collegeName || '');
  const [yearOfStudy, setYearOfStudy] = useState('1st Year Engineering (STEM)');
  const [branch, setBranch] = useState('Computer Engineering / IT');

  // Step 2: Socio-Economic & Family Profile
  const [familyIncome, setFamilyIncome] = useState('Below ₹2,50,000 / annum');
  const [earnerName, setEarnerName] = useState('');
  const [earnerJob, setEarnerJob] = useState('');
  const [singleParent, setSingleParent] = useState(false);
  const [firstGen, setFirstGen] = useState(true);
  const [needsLaptop, setNeedsLaptop] = useState(true);

  // Step 3: Statement of Purpose & Career Goals
  const [whyStem, setWhyStem] = useState('');
  const [careerGoals, setCareerGoals] = useState('');

  // Step 4: Digital Signature & Legal Sign-off
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [legalConsent, setLegalConsent] = useState(true);

  // Fetch existing application or lead info
  const { data: application } = useQuery({
    queryKey: ['scholarshipApp'],
    queryFn: async () => {
      const res = await api.get('/application');
      return res.data.data;
    },
  });

  useEffect(() => {
    if (student) {
      if (student.fullName && !fullName) setFullName(student.fullName);
      if (student.email && !email) setEmail(student.email);
      if (student.phone && !phone && student.phone !== 'N/A') setPhone(student.phone);
      if (student.collegeName && !collegeName) setCollegeName(student.collegeName);
    }
    if (application) {
      if (application.annualFamilyIncome) setFamilyIncome(application.annualFamilyIncome);
      if (application.primaryEarnerName) setEarnerName(application.primaryEarnerName);
      if (application.primaryEarnerJob) setEarnerJob(application.primaryEarnerJob);
      if (application.hasSingleParent !== undefined) setSingleParent(application.hasSingleParent);
      if (application.hasFirstGenLearner !== undefined) setFirstGen(application.hasFirstGenLearner);
      if (application.needsLaptopGrant !== undefined) setNeedsLaptop(application.needsLaptopGrant);
      if (application.whyStemEssay) setWhyStem(application.whyStemEssay);
      if (application.careerAspiration) setCareerGoals(application.careerAspiration);
      if (application.signatureDataUrl) {
        setSignatureDataUrl(application.signatureDataUrl);
      }
    }
  }, [application, student]);

  const saveMutation = useMutation({
    mutationFn: async ({ isSubmit }: { isSubmit: boolean }) => {
      const targetEmail = (email || student?.email || '').toLowerCase().trim();
      const res = await api.post('/scholarship/submit-offline', {
        trackingId: student?.leadTrackingId || `kat_${Date.now()}`,
        fullName: fullName || student?.fullName || 'Katalyst Scholar',
        email: targetEmail,
        phone: phone || student?.phone || 'N/A',
        collegeName: collegeName || student?.collegeName || 'Engineering College',
        yearOfStudy,
        branch,
        annualFamilyIncome: familyIncome,
        primaryEarnerName: earnerName,
        primaryEarnerJob: earnerJob,
        hasSingleParent: singleParent,
        hasFirstGenLearner: firstGen,
        needsLaptopGrant: needsLaptop,
        whyStemEssay: whyStem,
        careerAspiration: careerGoals,
        signatureDataUrl,
        digitalConsent: Boolean(legalConsent),
      });

      return res.data;
    },
    onSuccess: (data) => {
      setSaveSuccessMsg(data.message || 'Application submitted successfully to the Katalyst Committee!');
      setAttemptedNext(false);
      setValidationError(null);
      queryClient.invalidateQueries({ queryKey: ['scholarshipApp'] });
      queryClient.invalidateQueries({ queryKey: ['studentProfile'] });
      queryClient.invalidateQueries({ queryKey: ['studentMe'] });
      setTimeout(() => setSaveSuccessMsg(null), 5000);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Error saving application');
    },
  });

  const isReadOnly = application?.status === 'ACCEPTED' || student?.leadStatus === 'ACCEPTED';

  // Step Validation Helpers
  const isStep1Complete = Boolean(fullName?.trim() && email?.trim() && collegeName?.trim());
  const isStep2Complete = Boolean(familyIncome?.trim() && earnerName?.trim() && earnerJob?.trim());
  const isStep3Complete = Boolean(whyStem?.trim() && careerGoals?.trim());
  const isStep4Complete = Boolean(signatureDataUrl && legalConsent);

  const isStepComplete = (stepNum: number) => {
    switch (stepNum) {
      case 1:
        return isStep1Complete;
      case 2:
        return isStep2Complete;
      case 3:
        return isStep3Complete;
      case 4:
        return isStep4Complete;
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    setAttemptedNext(true);
    setValidationError(null);

    if (currentStep === 1) {
      if (!isStep1Complete) {
        setValidationError('⚠️ Please fill in all mandatory academic & contact fields (Full Name, Email, College Name).');
        return;
      }
    } else if (currentStep === 2) {
      if (!isStep2Complete) {
        setValidationError('⚠️ Please fill in all mandatory socio-economic fields (Family Income, Primary Earner Name, and Job).');
        return;
      }
    } else if (currentStep === 3) {
      if (!isStep3Complete) {
        setValidationError('⚠️ Please complete your Statement of Purpose (Why STEM) and 4-Year Target Career Role.');
        return;
      }
    }

    setAttemptedNext(false);
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handleStepClick = (targetStep: number) => {
    setValidationError(null);
    if (targetStep <= currentStep) {
      setCurrentStep(targetStep);
      return;
    }

    for (let i = 1; i < targetStep; i++) {
      if (!isStepComplete(i)) {
        setValidationError(`⚠️ Please complete all required fields in Step ${i} before jumping to Step ${targetStep}.`);
        return;
      }
    }
    setCurrentStep(targetStep);
  };

  const steps = [
    { num: 1, title: '1. Academic & Contact', desc: 'College, stream & contact' },
    { num: 2, title: '2. Socio-Economic Profile', desc: 'Family income & earner' },
    { num: 3, title: '3. Statement of Purpose', desc: 'Why STEM & career goals' },
    { num: 4, title: '4. Digital Signature', desc: 'Legal sign-off & consent' },
  ];

  return (
    <div className="space-y-6">
      {/* Application Status Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-rose-950 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-rose-300 text-xs font-bold mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Katalyst Women in STEM 4-Year Fellowship Dossier</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Personalized Scholarship Application
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl font-normal">
              Includes 100% Free Coding Laptop Grant, 4-Year Educational Grant, and 1:1 Executive Corporate Mentorship.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 min-w-[220px]">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
              Dossier Status
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  application?.status === 'ACCEPTED' || student?.leadStatus === 'ACCEPTED'
                    ? 'bg-emerald-400 animate-pulse'
                    : application?.status === 'REJECTED' || student?.leadStatus === 'REJECTED'
                    ? 'bg-rose-400'
                    : 'bg-amber-400 animate-ping'
                }`}
              />
              <span className="text-sm font-extrabold text-white">
                {application?.status === 'ACCEPTED' || student?.leadStatus === 'ACCEPTED'
                  ? 'ACCEPTED'
                  : application?.status === 'REJECTED' || student?.leadStatus === 'REJECTED'
                  ? 'NOT SELECTED'
                  : 'IN PROGRESS / SUBMITTED'}
              </span>
            </div>
            <p className="text-[10px] text-slate-300 mt-1">
              {application?.status === 'ACCEPTED' || student?.leadStatus === 'ACCEPTED'
                ? '🎉 Accepted! Full 4-year fellowship benefits awarded.'
                : application?.status === 'REJECTED' || student?.leadStatus === 'REJECTED'
                ? 'Review concluded. You can update details & re-submit below.'
                : 'Fill all 4 steps including your digital signature to submit.'}
            </p>
          </div>
        </div>

        {/* Celebratory Accepted Fellow Banner */}
        {(application?.status === 'ACCEPTED' || student?.leadStatus === 'ACCEPTED') && (
          <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/40 text-white space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-extrabold text-white">
                Official Fellowship Award Confirmation
              </h3>
            </div>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Congratulations, {fullName || student?.fullName}! You have been accepted into the Katalyst Women in STEM 4-Year Full Fellowship.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11px]">
              <div className="p-2.5 rounded-xl bg-black/30 border border-emerald-400/20">
                <span className="text-emerald-300 font-bold block">💻 Free Coding Laptop</span>
                <span className="text-slate-300">Grant Approved • Scheduled</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/30 border border-emerald-400/20">
                <span className="text-emerald-300 font-bold block">🤝 1:1 Corporate Mentor</span>
                <span className="text-slate-300">Executive Matching Open</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/30 border border-emerald-400/20">
                <span className="text-emerald-300 font-bold block">🎓 Tuition Grant</span>
                <span className="text-slate-300">Disbursement Processed</span>
              </div>
            </div>
          </div>
        )}

        {/* Rejection notice if not selected */}
        {(application?.status === 'REJECTED' || student?.leadStatus === 'REJECTED') && (
          <div className="mt-6 p-5 rounded-2xl bg-rose-500/20 border border-rose-400/40 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <h3 className="text-sm font-extrabold text-white">
                  Application Review Outcome: Not Selected
                </h3>
              </div>
              <p className="text-xs text-rose-100 leading-relaxed">
                You can review, update your academic &amp; family details, re-sign, and re-submit for committee evaluation below.
              </p>
            </div>
            <span className="text-[11px] font-bold text-rose-200 px-3 py-1.5 rounded-xl bg-rose-500/30 border border-rose-400/40 shrink-0">
              Editable Application Active
            </span>
          </div>
        )}

        {/* Step Progress Pills - Checkmark ONLY when step is actually complete */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          {steps.map((s) => {
            const isDone = isStepComplete(s.num);
            const isCurrent = currentStep === s.num;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => handleStepClick(s.num)}
                className={`p-3 rounded-2xl text-left transition-all ${
                  isCurrent
                    ? 'bg-white/20 border border-rose-400/50 shadow-md ring-1 ring-rose-400/40'
                    : isDone
                    ? 'bg-white/10 border border-emerald-400/30'
                    : 'bg-white/5 border border-white/5 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isDone
                        ? 'bg-emerald-400 text-slate-900'
                        : isCurrent
                        ? 'bg-rose-400 text-slate-900 font-extrabold'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    {isDone ? '✓' : s.num}
                  </span>
                  <span className="text-xs font-bold text-white truncate">{s.title}</span>
                </div>
                <p className="text-[10px] text-slate-300 truncate">
                  {isDone ? 'Completed' : s.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {saveSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Wizard Step Content */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl shadow-sm border border-slate-200/80">
        {/* STEP 1: Academic & Contact Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                1. Academic &amp; Contact Information
              </h3>
              <p className="text-xs text-slate-500">
                Verify your official registration details and engineering college affiliation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mansi Kardile"
                  value={fullName}
                  disabled={isReadOnly}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  className={`w-full px-3.5 py-2.5 text-xs rounded-xl input-field outline-none transition-all ${
                    attemptedNext && !fullName.trim()
                      ? 'border-rose-400 bg-rose-50/40 ring-2 ring-rose-300'
                      : ''
                  }`}
                />
                {attemptedNext && !fullName.trim() && (
                  <p className="text-[10px] text-rose-600 font-bold mt-1">This field is mandatory *</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Official Email Address *
                </label>
                <input
                  type="email"
                  placeholder="e.g. mansi.kardile@gmail.com"
                  value={email}
                  disabled={isReadOnly}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  className={`w-full px-3.5 py-2.5 text-xs rounded-xl input-field outline-none transition-all ${
                    attemptedNext && !email.trim()
                      ? 'border-rose-400 bg-rose-50/40 ring-2 ring-rose-300'
                      : ''
                  }`}
                />
                {attemptedNext && !email.trim() && (
                  <p className="text-[10px] text-rose-600 font-bold mt-1">This field is mandatory *</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Phone / WhatsApp Number
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +91 9876543210"
                  value={phone}
                  disabled={isReadOnly}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl input-field outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Engineering College / Institution *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vishwakarma Institute of Technology"
                  value={collegeName}
                  disabled={isReadOnly}
                  onChange={(e) => {
                    setCollegeName(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  className={`w-full px-3.5 py-2.5 text-xs rounded-xl input-field outline-none transition-all ${
                    attemptedNext && !collegeName.trim()
                      ? 'border-rose-400 bg-rose-50/40 ring-2 ring-rose-300'
                      : ''
                  }`}
                />
                {attemptedNext && !collegeName.trim() && (
                  <p className="text-[10px] text-rose-600 font-bold mt-1">This field is mandatory *</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Year of Study
                </label>
                <select
                  value={yearOfStudy}
                  disabled={isReadOnly}
                  onChange={(e) => setYearOfStudy(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl input-field outline-none"
                >
                  <option value="1st Year Engineering (STEM)">1st Year Engineering (STEM)</option>
                  <option value="2nd Year Engineering (STEM)">2nd Year Engineering (STEM)</option>
                  <option value="3rd Year Engineering (STEM)">3rd Year Engineering (STEM)</option>
                  <option value="4th Year Engineering (STEM)">4th Year Engineering (STEM)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Stream / Branch
                </label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science / AI / IT / E&TC"
                  value={branch}
                  disabled={isReadOnly}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl input-field outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Socio-Economic & Family Profile */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                2. Socio-Economic &amp; Family Profile
              </h3>
              <p className="text-xs text-slate-500">
                Katalyst scholarships prioritize women from low-income communities pursuing STEM degrees.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Annual Family Household Income *
                </label>
                <select
                  value={familyIncome}
                  disabled={isReadOnly}
                  onChange={(e) => setFamilyIncome(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl input-field outline-none"
                >
                  <option value="Below ₹1,50,000 / annum">Below ₹1,50,000 / annum</option>
                  <option value="Below ₹2,50,000 / annum">Below ₹2,50,000 / annum</option>
                  <option value="₹2,50,000 – ₹4,00,000 / annum">₹2,50,000 – ₹4,00,000 / annum</option>
                  <option value="₹4,00,000 – ₹6,00,000 / annum">₹4,00,000 – ₹6,00,000 / annum</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Primary Earner Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Father / Mother Name (e.g. Neelam)"
                  value={earnerName}
                  disabled={isReadOnly}
                  onChange={(e) => {
                    setEarnerName(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  className={`w-full px-3.5 py-2.5 text-xs rounded-xl input-field outline-none transition-all ${
                    attemptedNext && !earnerName.trim()
                      ? 'border-rose-400 bg-rose-50/40 ring-2 ring-rose-300'
                      : ''
                  }`}
                />
                {attemptedNext && !earnerName.trim() && (
                  <p className="text-[10px] text-rose-600 font-bold mt-1">This field is mandatory *</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Primary Earner Occupation / Job *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Law / Daily Wage / Small Business / Farming / Service"
                  value={earnerJob}
                  disabled={isReadOnly}
                  onChange={(e) => {
                    setEarnerJob(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  className={`w-full px-3.5 py-2.5 text-xs rounded-xl input-field outline-none transition-all ${
                    attemptedNext && !earnerJob.trim()
                      ? 'border-rose-400 bg-rose-50/40 ring-2 ring-rose-300'
                      : ''
                  }`}
                />
                {attemptedNext && !earnerJob.trim() && (
                  <p className="text-[10px] text-rose-600 font-bold mt-1">This field is mandatory *</p>
                )}
              </div>
            </div>

            <div className="pt-3 space-y-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={singleParent}
                  disabled={isReadOnly}
                  onChange={(e) => setSingleParent(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                />
                <span className="text-slate-700 font-medium">Single parent household / Raised by single mother</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={firstGen}
                  disabled={isReadOnly}
                  onChange={(e) => setFirstGen(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                />
                <span className="text-slate-700 font-medium">First-generation college learner in family</span>
              </label>

              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needsLaptop}
                    disabled={isReadOnly}
                    onChange={(e) => setNeedsLaptop(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900">Apply for Free Brand-New Coding Laptop Distribution (100% Grant)</span>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Katalyst provides high-performance laptops for scholars who do not own personal computing devices.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Statement of Purpose & Career Goals */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                3. Statement of Purpose &amp; Career Goals
              </h3>
              <p className="text-xs text-slate-500">
                Tell the selection committee about your passion for technology and engineering.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Why are you passionate about building a career in STEM / Engineering? *
              </label>
              <textarea
                rows={4}
                placeholder="Share your story, technical interests, and what motivated you to pursue engineering..."
                value={whyStem}
                disabled={isReadOnly}
                onChange={(e) => {
                  setWhyStem(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                className={`w-full px-3.5 py-2.5 text-xs rounded-xl input-field outline-none transition-all ${
                  attemptedNext && !whyStem.trim()
                    ? 'border-rose-400 bg-rose-50/40 ring-2 ring-rose-300'
                    : ''
                }`}
              />
              {attemptedNext && !whyStem.trim() && (
                <p className="text-[10px] text-rose-600 font-bold mt-1">This statement is mandatory *</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Where do you envision yourself in 5 years after graduating? (Target 4-Year Role) *
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Working as a Software Architect, leading tech initiatives at a top firm..."
                value={careerGoals}
                disabled={isReadOnly}
                onChange={(e) => {
                  setCareerGoals(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                className={`w-full px-3.5 py-2.5 text-xs rounded-xl input-field outline-none transition-all ${
                  attemptedNext && !careerGoals.trim()
                    ? 'border-rose-400 bg-rose-50/40 ring-2 ring-rose-300'
                    : ''
                }`}
              />
              {attemptedNext && !careerGoals.trim() && (
                <p className="text-[10px] text-rose-600 font-bold mt-1">This field is mandatory *</p>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: Digital Signature & Legal Sign-off */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                4. Digital Signature &amp; Legal Sign-off
              </h3>
              <p className="text-xs text-slate-500">
                Please draw or type your verified handwritten digital signature to certify your fellowship enrollment application.
              </p>
            </div>

            <DigitalSignaturePad
              signerName={fullName || student?.fullName || 'Mansi Kardile'}
              initialSignature={signatureDataUrl}
              initialConsent={legalConsent}
              onSignatureChange={(sig, consent) => {
                setSignatureDataUrl(sig);
                setLegalConsent(consent);
                if (validationError) setValidationError(null);
                setAttemptedNext(false);
              }}
            />

            {attemptedNext && (!signatureDataUrl || !legalConsent) && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Please draw or generate your signature and check the legal verification checkbox above.</span>
              </div>
            )}
          </div>
        )}

        {/* Wizard Controls */}
        <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => {
                  setValidationError(null);
                  setCurrentStep(currentStep - 1);
                }}
                className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Step</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : !isReadOnly ? (
              <button
                type="button"
                onClick={() => {
                  if (!signatureDataUrl || !legalConsent) {
                    setAttemptedNext(true);
                    setValidationError('⚠️ Please draw your signature and ensure the consent checkbox is checked before submitting.');
                    return;
                  }
                  saveMutation.mutate({ isSubmit: true });
                }}
                disabled={saveMutation.isPending}
                className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 active:bg-rose-800 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-rose-500/25 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-rose-200" />
                <span>
                  {saveMutation.isPending
                    ? 'Submitting...'
                    : application?.status === 'REJECTED' || student?.leadStatus === 'REJECTED'
                    ? 'Re-Submit Application for Review'
                    : 'Submit Official Application to Committee'}
                </span>
              </button>
            ) : (
              <div className="px-4 py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" />
                <span>Application Accepted • Dossier Locked</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
