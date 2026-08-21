'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  Star,
  CheckCircle2,
  AlertCircle,
  Building2,
  Globe,
  Mic,
  Lock,
  KeyRound,
  MessageSquare,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  LogOut,
  Calendar,
} from 'lucide-react';
import { api } from '@/lib/api';

interface VolunteerFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultActivityCode?: string;
}

const UI_TEXT = {
  en: {
    title: 'Volunteer Feedback',
    selectEvent: 'Select Volunteering Drive / Event *',
    ratingLabel: '1. Overall Rating Out of 5 *',
    expLabel: '2. Volunteering Experience (Key Highlights) *',
    expPlaceholder: 'Describe your volunteering experience (or tap 🎙️ to speak)...',
    suggLabel: '3. Suggestions for Future Drives (Optional)',
    suggPlaceholder: 'Ideas or suggestions for future drives (or tap 🎙️ to speak)...',
    sttButton: '🎙️ Tap to Speak (STT)',
    listening: 'Listening...',
    submitBtn: 'Submit Verified Feedback',
    submittingBtn: 'Submitting & Translating via Gemini...',
    switchAccount: 'Switch Account',
    accountLabel: 'Authenticated Volunteer:',
  },
  hi: {
    title: 'स्वयंसेवक अभिप्राय (Volunteer Feedback)',
    selectEvent: 'उपक्रम / ड्राईव्ह निवडा (Select Event) *',
    ratingLabel: '१. एकंदरीत रेटिंग (५ पैकी) *',
    expLabel: '२. स्वयंसेवा अनुभव (प्रमुख वैशिष्ट्ये) *',
    expPlaceholder: 'आपला स्वयंसेवा अनुभव लिहा किंवा 🎙️ दाबून बोला (बोलून टाईप करा)...',
    suggLabel: '३. भविष्यतील उपक्रमांसाठी सूचना (पर्यायी)',
    suggPlaceholder: 'भविष्यतील उपक्रमांसाठी आपल्या सूचना लिहा किंवा 🎙️ दाबून बोला...',
    sttButton: '🎙️ बोलून टाईप करा (STT)',
    listening: 'ऐकत आहे...',
    submitBtn: 'अभिप्राय सबमिट करा',
    submittingBtn: 'सबमिट होत आहे व भाषांतर चालू आहे...',
    switchAccount: 'खाते बदला',
    accountLabel: 'प्रमाणित स्वयंसेवक खाते:',
  },
  mr: {
    title: 'स्वयंसेवक अभिप्राय (Volunteer Feedback)',
    selectEvent: 'उपक्रम / ड्राईव्ह निवडा (Select Event) *',
    ratingLabel: '१. एकूण रेटिंग (५ पैकी) *',
    expLabel: '२. स्वयंसेवा अनुभव (प्रमुख वैशिष्ट्ये) *',
    expPlaceholder: 'तुमचा स्वयंसेवा अनुभव लिहा किंवा 🎙️ दाबून बोला (बोलून टाईप करा)...',
    suggLabel: '३. पुढील उपक्रमांसाठी सूचना (पर्यायी)',
    suggPlaceholder: 'पुढील उपक्रमांसाठी तुमच्या सूचना लिहा किंवा 🎙️ दाबून बोला...',
    sttButton: '🎙️ बोलून टाईप करा (STT)',
    listening: 'ऐकत आहे...',
    submitBtn: 'अभिप्राय सबमिट करा',
    submittingBtn: 'सबमिट होत आहे व जेमिनी भाषांतर चालू आहे...',
    switchAccount: 'खाते बदला',
    accountLabel: 'प्रमाणित स्वयंसेवक खाते:',
  },
};

export default function VolunteerFeedbackModal({
  isOpen,
  onClose,
  defaultActivityCode = 'SEVA-PUNE-KIT-01',
}: VolunteerFeedbackModalProps) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);

  const [language, setLanguage] = useState<'en' | 'hi' | 'mr'>('en');
  const [activityCode, setActivityCode] = useState(defaultActivityCode);
  const [eventsList, setEventsList] = useState<Array<{ code: string; title: string; partner: string }>>([
    { code: 'SEVA-PUNE-KIT-01', title: 'Samutkarsh: 500 School Kits Assembly & Distribution', partner: 'Mastercard India' },
    { code: 'SEVA-MUM-DIGI-02', title: 'Digital Literacy & Coding Lab for Municipal School', partner: 'Barclays Mumbai' },
    { code: 'SEVA-PUNE-TREE-03', title: 'Punarvas: Urban Micro-Forest Plantation & Seed Balls', partner: 'TCS Pune' },
    { code: 'SEVA-NSK-TRIBAL-04', title: 'Vanyashala: Solar Study Lamp Assembly for Tribal Hamlets', partner: 'Cummins India' },
  ]);

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [experience, setExperience] = useState('');
  const [suggestion, setSuggestion] = useState('');

  // Voice STT State
  const [isRecordingExp, setIsRecordingExp] = useState(false);
  const [isRecordingSugg, setIsRecordingSugg] = useState(false);
  const [sttSupported, setSttSupported] = useState(false);

  // OTP Login State
  const [isOtpStep, setIsOtpStep] = useState(true);
  const [emailOrPhone, setEmailOrPhone] = useState('aniket.d@mastercard.com');
  const [otpInput, setOtpInput] = useState('');
  const [otpSentNotice, setOtpSentNotice] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<any | null>(null);

  const t = UI_TEXT[language] || UI_TEXT.en;

  useEffect(() => {
    if (isOpen) {
      setSubmittedData(null);
      setErrorMessage(null);
      setExperience('');
      setSuggestion('');
      setRating(5);

      if (defaultActivityCode) {
        setActivityCode(defaultActivityCode);
      }

      const tok = localStorage.getItem('katalyst_student_token');
      const usr = localStorage.getItem('katalyst_student_user');
      if (tok && usr) {
        setToken(tok);
        try {
          setUser(JSON.parse(usr));
          setIsOtpStep(false);
        } catch (e) {
          setToken(null);
          setUser(null);
          setIsOtpStep(true);
        }
      } else {
        setToken(null);
        setUser(null);
        setIsOtpStep(true);
      }

      // Fetch live events list from backend
      api.get('/events').then((res) => {
        if (res.data?.data && res.data.data.length > 0) {
          setEventsList(
            res.data.data.map((e: any) => ({
              code: e.code,
              title: e.title,
              partner: e.partner || e.collegeName || 'SevaSahayog Drive',
            }))
          );
        }
      }).catch((e) => console.warn('Events fetch fallback active'));
    }

    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setSttSupported(true);
    }
  }, [defaultActivityCode, isOpen]);

  if (!isOpen) return null;

  const handleLogout = () => {
    localStorage.removeItem('katalyst_student_token');
    localStorage.removeItem('katalyst_student_user');
    setToken(null);
    setUser(null);
    setIsOtpStep(true);
    setSubmittedData(null);
    setOtpSentNotice(null);
    setOtpError(null);
  };

  const handleRequestOtp = async () => {
    setOtpError(null);
    try {
      const res = await api.post('/auth/request-otp', { emailOrPhone });
      if (res.data?.success) {
        setOtpSentNotice(res.data.message);
      }
    } catch (err: any) {
      setOtpError(err.response?.data?.message || 'Failed to request OTP');
    }
  };

  const handleVerifyOtp = async () => {
    setOtpError(null);
    try {
      const res = await api.post('/auth/verify-otp', { emailOrPhone, otp: otpInput });
      if (res.data?.success) {
        const { token, student } = res.data.data;
        localStorage.setItem('katalyst_student_token', token);
        localStorage.setItem('katalyst_student_user', JSON.stringify(student));
        setToken(token);
        setUser(student);
        setIsOtpStep(false);
      }
    } catch (err: any) {
      setOtpError(err.response?.data?.message || 'Invalid OTP code');
    }
  };

  // Speech-to-Text (STT) Handler
  const startSpeechRecognition = (targetField: 'experience' | 'suggestion') => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition (STT) is not supported in this browser. Please try Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    if (language === 'hi') recognition.lang = 'hi-IN';
    else if (language === 'mr') recognition.lang = 'mr-IN';
    else recognition.lang = 'en-IN';

    if (targetField === 'experience') setIsRecordingExp(true);
    if (targetField === 'suggestion') setIsRecordingSugg(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (targetField === 'experience') {
        setExperience((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecordingExp(false);
      } else if (targetField === 'suggestion') {
        setSuggestion((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecordingSugg(false);
      }
    };

    recognition.onerror = () => {
      setIsRecordingExp(false);
      setIsRecordingSugg(false);
    };

    recognition.onend = () => {
      setIsRecordingExp(false);
      setIsRecordingSugg(false);
    };

    recognition.start();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setIsOtpStep(true);
      return;
    }

    if (!experience.trim() || experience.trim().length < 5) {
      setErrorMessage('Please describe your volunteering experience in at least 5 characters.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await api.post(
        '/feedback',
        {
          activityCode: activityCode.trim().toUpperCase(),
          experience: experience.trim(),
          rating: Number(rating),
          suggestion: suggestion.trim() || undefined,
          language,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        setSubmittedData(response.data.data);
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        'Failed to submit feedback. Please ensure you are logged in as a verified volunteer.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header Ribbon */}
        <div className="p-6 bg-gradient-to-r from-[#0f2b5c] via-blue-900 to-[#091b3b] text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-sky-200 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-sky-300" />
            <span>Speech-to-Text &amp; Gemini AI Multilingual</span>
          </div>
          <h3 className="text-xl font-black text-white">{t.title}</h3>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
          {/* STRICT MANDATORY LOGIN STEP IF NO TOKEN OR OTP STEP ACTIVE */}
          {!token || isOtpStep ? (
            <div className="text-center py-4 space-y-4 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-blue-50 text-[#0f2b5c] flex items-center justify-center mx-auto border border-blue-100 shadow-inner">
                <Lock className="w-7 h-7 text-blue-700" />
              </div>

              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 text-[10px] font-bold border border-rose-200">
                  Authentication Required
                </span>
                <h4 className="text-lg font-black text-slate-900">
                  Login via OTP to Access Feedback Form
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Per SevaSahayog security policy, you must log in via OTP with your corporate email before submitting feedback.
                </p>
              </div>

              {otpError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-left">
                  {otpError}
                </div>
              )}

              {otpSentNotice && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-left">
                  {otpSentNotice}
                </div>
              )}

              <div className="space-y-3 text-left">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Corporate Email or Mobile *</label>
                  <input
                    type="text"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="aniket.d@mastercard.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-semibold"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleRequestOtp}
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer"
                >
                  Send 6-Digit Email OTP
                </button>

                <div className="space-y-1 pt-1">
                  <label className="font-bold text-slate-700">Enter 6-Digit OTP Code</label>
                  <input
                    type="text"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="Enter 6-digit code (e.g. 123456)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-mono font-bold text-center text-base tracking-widest text-slate-900"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="w-full py-3.5 rounded-2xl bg-[#0f2b5c] text-white text-xs font-bold shadow-md cursor-pointer hover:bg-[#091b3b]"
                >
                  Verify OTP &amp; Continue to Feedback
                </button>
              </div>
            </div>
          ) : !submittedData ? (
            /* AUTHENTICATED FEEDBACK FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* MULTILINGUAL LANGUAGE SELECTOR */}
              <div className="flex items-center justify-between bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                <span className="font-bold text-slate-600 px-2 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  <span>Select Language:</span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                      language === 'en' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('hi')}
                    className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                      language === 'hi' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    हिंदी
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('mr')}
                    className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                      language === 'mr' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    मराठी
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Logged in Volunteer Account & Switch Account Button */}
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">{t.accountLabel}</span>
                  <span className="font-bold text-blue-950">
                    {user?.fullName} ({user?.collegeName || 'Mastercard'})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                  title="Log out and switch account"
                >
                  <LogOut className="w-3 h-3" />
                  <span>{t.switchAccount}</span>
                </button>
              </div>

              {/* FEATURE 1: SELECT VOLUNTEERING DRIVE / EVENT DROPDOWN */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-700" />
                  <span>{t.selectEvent}</span>
                </label>
                <select
                  value={activityCode}
                  onChange={(e) => setActivityCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                >
                  {eventsList.map((evt) => (
                    <option key={evt.code} value={evt.code}>
                      [{evt.code}] {evt.title} ({evt.partner})
                    </option>
                  ))}
                </select>
              </div>

              {/* FEATURE 2: OVERALL RATING */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-center space-y-1.5">
                <label className="font-black text-amber-900 block uppercase tracking-wider">
                  {t.ratingLabel}
                </label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 text-xl transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          (hoverRating || rating) >= star
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* FEATURE 3: EXPERIENCE WITH STT VOICE */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">{t.expLabel}</label>
                  {sttSupported && (
                    <button
                      type="button"
                      onClick={() => startSpeechRecognition('experience')}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                        isRecordingExp ? 'bg-rose-500 text-white animate-pulse' : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}
                    >
                      <Mic className="w-3 h-3 text-blue-700" />
                      <span>{isRecordingExp ? t.listening : t.sttButton}</span>
                    </button>
                  )}
                </div>
                <textarea
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder={t.expPlaceholder}
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900"
                  required
                />
              </div>

              {/* FEATURE 4: SUGGESTIONS WITH STT VOICE */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">{t.suggLabel}</label>
                  {sttSupported && (
                    <button
                      type="button"
                      onClick={() => startSpeechRecognition('suggestion')}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                        isRecordingSugg ? 'bg-rose-500 text-white animate-pulse' : 'bg-amber-50 text-amber-900 border border-amber-200'
                      }`}
                    >
                      <Mic className="w-3 h-3 text-amber-600" />
                      <span>{isRecordingSugg ? t.listening : t.sttButton}</span>
                    </button>
                  )}
                </div>
                <textarea
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  placeholder={t.suggPlaceholder}
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-[#0f2b5c] text-white font-bold cursor-pointer hover:bg-[#091b3b]"
              >
                {isSubmitting ? t.submittingBtn : t.submitBtn}
              </button>
            </form>
          ) : (
            /* SUBMITTED SUCCESS */
            <div className="text-center py-6 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
              <h4 className="text-lg font-black text-slate-900">
                {language === 'hi' || language === 'mr' ? 'अभिप्राय यशस्वीरीत्या प्राप्त झाला!' : 'Feedback Submitted & Verified!'}
              </h4>
              <p className="text-xs text-slate-500">
                Your feedback for <strong className="text-blue-900">{activityCode}</strong> has been translated by Gemini AI and saved to PostgreSQL.
              </p>
              <button
                onClick={() => {
                  setSubmittedData(null);
                  onClose();
                }}
                className="px-6 py-2.5 rounded-2xl bg-[#0f2b5c] text-white font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
