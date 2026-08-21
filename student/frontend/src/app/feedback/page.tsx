'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  Star,
  CheckCircle2,
  AlertCircle,
  Building2,
  Lock,
  LogIn,
  Heart,
  Award,
  ArrowRight,
  MessageSquare,
  Lightbulb,
  ShieldCheck,
  Globe,
  Mic,
  MicOff,
  Volume2,
  KeyRound,
} from 'lucide-react';
import { api } from '@/lib/api';

function FeedbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activityCodeParam = searchParams.get('activityCode') || searchParams.get('activity') || '';

  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<{ id: string; fullName: string; email: string; collegeName?: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Multilingual Selector: English, Hindi, Marathi
  const [language, setLanguage] = useState<'en' | 'hi' | 'mr'>('en');

  // 3 Exact Feedback Features
  const [activityCode, setActivityCode] = useState(activityCodeParam || 'SEVA-PUNE-KIT-01');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [experience, setExperience] = useState('');
  const [suggestion, setSuggestion] = useState('');

  // Speech-to-Text (STT) Voice Input State
  const [isRecordingExp, setIsRecordingExp] = useState(false);
  const [isRecordingSugg, setIsRecordingSugg] = useState(false);
  const [sttSupported, setSttSupported] = useState(false);

  // OTP Modal State
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('aniket.d@mastercard.com');
  const [otpSentNotice, setOtpSentNotice] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<any | null>(null);

  useEffect(() => {
    setIsClient(true);
    const storedToken = localStorage.getItem('katalyst_student_token');
    const storedUser = localStorage.getItem('katalyst_student_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    }

    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setSttSupported(true);
    }
  }, []);

  // Web Speech API STT Handler
  const startSpeechRecognition = (targetField: 'experience' | 'suggestion') => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition (STT) is not supported in this browser. Please try Chrome, Edge, or Safari.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    // Set speech language code based on selected language
    if (language === 'hi') {
      recognition.lang = 'hi-IN';
    } else if (language === 'mr') {
      recognition.lang = 'mr-IN';
    } else {
      recognition.lang = 'en-IN';
    }

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

    recognition.onerror = (err: any) => {
      console.warn('Speech recognition error:', err);
      setIsRecordingExp(false);
      setIsRecordingSugg(false);
    };

    recognition.onend = () => {
      setIsRecordingExp(false);
      setIsRecordingSugg(false);
    };

    recognition.start();
  };

  const handleLogout = () => {
    localStorage.removeItem('katalyst_student_token');
    localStorage.removeItem('katalyst_student_user');
    setToken(null);
    setUser(null);
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
        setIsOtpModalOpen(false);
      }
    } catch (err: any) {
      setOtpError(err.response?.data?.message || 'Invalid OTP code');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setIsOtpModalOpen(true);
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
        'Failed to submit feedback. Please check activity code or SPOC verification status.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#0f2b5c] text-white flex items-center justify-center font-black shadow-md">
              <Heart className="w-5 h-5 text-sky-300 fill-sky-300" />
            </div>
            <div>
              <span className="font-black text-slate-900 tracking-tight text-base leading-none block">
                SevaSahayog<span className="text-blue-600">.</span>
              </span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                Volunteer Experience Platform
              </span>
            </div>
          </Link>

          {/* Multilingual Selector & Auth Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                  language === 'en' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                  language === 'hi' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setLanguage('mr')}
                className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                  language === 'mr' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                मराठी
              </button>
            </div>

            {user ? (
              <div className="flex items-center gap-2 text-xs">
                <span className="hidden sm:inline font-bold text-slate-700">{user.fullName}</span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Log Out of Volunteer Account"
                >
                  <LogIn className="w-3.5 h-3.5 rotate-180" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsOtpModalOpen(true)}
                className="px-3.5 py-1.5 rounded-full bg-[#0f2b5c] text-white text-xs font-bold shadow-sm hover:bg-[#091b3b] transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <LogIn className="w-3.5 h-3.5 text-sky-300" />
                <span>OTP Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-8 sm:py-12">
        {!token ? (
          /* QR / Direct Link Mobile OTP Login Barrier */
          <div className="bg-white rounded-[32px] p-8 sm:p-10 shadow-2xl border border-slate-200/90 text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-[#0f2b5c] flex items-center justify-center mx-auto border border-blue-100 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-[11px] font-bold border border-blue-200">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>QR Scan Authentication</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Quick OTP Authentication
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                Scan detected for activity <strong className="text-blue-700">{activityCode}</strong>. Enter your corporate email/phone to receive a 6-digit OTP code.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left text-xs font-mono space-y-1 text-slate-700">
              <span className="text-slate-400 text-[10px] block font-sans">Preloaded Activity Code:</span>
              <strong className="text-blue-700 font-bold text-sm">{activityCode}</strong>
            </div>

            <button
              onClick={() => setIsOtpModalOpen(true)}
              className="w-full py-4 rounded-2xl bg-[#0f2b5c] hover:bg-[#091b3b] text-white font-black text-sm shadow-xl shadow-blue-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover-lift"
            >
              <KeyRound className="w-4 h-4 text-sky-300" />
              <span>Login via Mobile / Email OTP</span>
              <ArrowRight className="w-4 h-4 text-sky-300" />
            </button>
          </div>
        ) : !submittedData ? (
          /* 3-Feature Multilingual Feedback Form with Voice STT */
          <div className="bg-white rounded-[32px] shadow-2xl border border-slate-200/90 overflow-hidden animate-fade-in">
            {/* Ribbon */}
            <div className="p-6 sm:p-8 bg-gradient-to-r from-[#0f2b5c] via-blue-900 to-[#091b3b] text-white">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-sky-200 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-sky-300" />
                <span>
                  {language === 'hi'
                    ? '१-मिनट स्वयंसेवक अभिप्राय (Speech-to-Text Voice Enabled)'
                    : language === 'mr'
                    ? '१-मिनिट स्वयंसेवक अभिप्राय (Speech-to-Text Voice Enabled)'
                    : '1-Minute Volunteer Feedback (Speech-to-Text Voice Enabled)'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {language === 'hi'
                  ? 'आपला अनुभव शेअर करा'
                  : language === 'mr'
                  ? 'तुमचा अनुभव सामायिक करा'
                  : 'Share Your Experience'}
              </h1>
              <p className="text-xs sm:text-sm text-sky-100/90 mt-1">
                {language === 'hi' || language === 'mr'
                  ? 'आपल्या आवाजात बोला (🎙️ Voice Input) किंवा लिहा. Google Gemini AI इंग्रजी भाषांतर CSR अहवालासाठी करेल.'
                  : 'Type or speak into your microphone (🎙️ Voice STT). Gemini AI will auto-translate Hindi & Marathi to English.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 text-xs">
              {errorMessage && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Verified Volunteer Bar */}
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Logged In Volunteer:</span>
                  <strong className="text-blue-950 font-bold">{user?.fullName} ({user?.email})</strong>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  ✓ SPOC Verified
                </span>
              </div>

              {/* Activity Code Input */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  Activity Code *
                </label>
                <input
                  type="text"
                  value={activityCode}
                  onChange={(e) => setActivityCode(e.target.value)}
                  placeholder="e.g. SEVA-PUNE-KIT-01"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 font-mono font-bold text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                  required
                />
              </div>

              {/* FEATURE 1: OVERALL RATING OUT OF 5 */}
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2 text-center">
                <label className="text-xs font-black text-amber-900 block uppercase tracking-wider">
                  1. Overall Rating Out of 5 *
                </label>
                <div className="flex items-center justify-center gap-2 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          (hoverRating || rating) >= star
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-xs font-bold text-amber-800">
                  {rating === 5 && '🌟 5/5 — Transformative & Highly Engaging!'}
                  {rating === 4 && '👍 4/5 — Very Good Experience!'}
                  {rating === 3 && '🙂 3/5 — Satisfactory Event'}
                  {rating <= 2 && '⚠️ Needs Improvements'}
                </p>
              </div>

              {/* FEATURE 2: EXPERIENCE WITH SPEECH-TO-TEXT (STT) VOICE BUTTON */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-700" />
                    <span>
                      2. Volunteering Experience (
                      {language === 'hi'
                        ? 'अनुभव / मुख्य ठळक मुद्दे'
                        : language === 'mr'
                        ? 'अनुभव / प्रमुख वैशिष्ट्ये'
                        : 'What went well / Key Highlights'}
                      ) *
                    </span>
                  </label>

                  {sttSupported && (
                    <button
                      type="button"
                      onClick={() => startSpeechRecognition('experience')}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isRecordingExp
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
                      }`}
                      title="Click and speak into your microphone"
                    >
                      {isRecordingExp ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-blue-700" />}
                      <span>{isRecordingExp ? 'Listening...' : '🎙️ Tap to Speak (STT)'}</span>
                    </button>
                  )}
                </div>

                <textarea
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder={
                    language === 'hi'
                      ? 'उदा. सायन्स किट तयार करणे खूप छान अनुभव होता. (आपण 🎙️ बटन दाबून बोलू शकता...)'
                      : language === 'mr'
                      ? 'उदा. मनपा शाळेतील विद्यार्थ्यांसाठी सायन्स किट पॅकेजिंग करणे अतिशय समाधानकारक अनुभव होता...'
                      : 'e.g. Assembling science kits directly for municipal school students was deeply rewarding... (or tap 🎙️ to speak)'
                  }
                  rows={4}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                  required
                />
              </div>

              {/* FEATURE 3: SUGGESTIONS WITH SPEECH-TO-TEXT (STT) VOICE BUTTON */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                    <span>
                      3. Suggestions (
                      {language === 'hi'
                        ? 'भविष्यतील उपक्रमांसाठी सूचना'
                        : language === 'mr'
                        ? 'पुढील उपक्रमांसाठी सूचना'
                        : 'Ideas for future volunteering drives'}
                      )
                    </span>
                  </label>

                  {sttSupported && (
                    <button
                      type="button"
                      onClick={() => startSpeechRecognition('suggestion')}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isRecordingSugg
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                      }`}
                      title="Click and speak into your microphone"
                    >
                      {isRecordingSugg ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-amber-600" />}
                      <span>{isRecordingSugg ? 'Listening...' : '🎙️ Tap to Speak (STT)'}</span>
                    </button>
                  )}
                </div>

                <textarea
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  placeholder={
                    language === 'hi' || language === 'mr'
                      ? 'उदा. काम सुरू करण्यापूर्वी ३ मिनिटांचा व्हिडिओ दाखवावा...'
                      : 'e.g. Adding a short 3-minute video demonstration before the assembly line begins...'
                  }
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-[#0f2b5c] hover:bg-[#091b3b] active:bg-[#061226] text-white font-black text-sm shadow-xl shadow-blue-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover-lift disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-sky-300" />
                    <span>Submit Verified Feedback</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Verified Feedback Certificate Pass */
          <div className="bg-white rounded-[32px] p-8 sm:p-10 shadow-2xl border border-slate-200/90 text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Thank You for Your Feedback! 🎉
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Your feedback has been translated by Gemini AI and permanently indexed in the Seva Experience Ledger.
              </p>
            </div>

            {/* Pass Certificate */}
            <div className="p-6 rounded-3xl bg-slate-950 text-white text-left font-mono border border-slate-800 shadow-2xl relative overflow-hidden space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-sky-400" />
                  <span className="text-xs font-bold text-sky-300">
                    SEVASAHAYOG VOLUNTEER PASS
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-sans">
                  {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 text-[10px] block">Volunteer:</span>
                  <strong className="text-white font-sans text-sm">{submittedData.volunteerName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Partner Company:</span>
                  <strong className="text-sky-400 font-sans text-sm">{submittedData.partner}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Activity Code:</span>
                  <span className="text-white font-bold">{submittedData.activityCode}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Overall Rating:</span>
                  <span className="text-amber-400 font-bold">★ {submittedData.rating}.0 / 5.0</span>
                </div>
              </div>

              {submittedData.translatedExperience && submittedData.language !== 'en' && (
                <div className="pt-2 border-t border-white/10 text-[11px] font-sans">
                  <span className="text-sky-300 font-bold block mb-1">
                    🤖 Gemini AI English Translation:
                  </span>
                  <p className="text-slate-300 italic">"{submittedData.translatedExperience}"</p>
                </div>
              )}

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-sans">
                <span>Verified CSR Volunteering Contribution</span>
                <span className="text-sky-400 font-bold">100% Validated in Database</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/"
                className="w-full py-3.5 rounded-2xl bg-[#0f2b5c] text-white font-bold text-xs shadow-lg hover:bg-[#091b3b] transition-colors inline-block"
              >
                Return to Home Page
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* OTP AUTH MODAL */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-center space-y-5">
            <button
              onClick={() => setIsOtpModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 text-xs font-bold"
            >
              ✕
            </button>

            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto border border-blue-100">
              <KeyRound className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">Volunteer OTP Login</h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter your corporate email or mobile number to receive instant OTP.
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

            <div className="space-y-3 text-xs text-left">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Email or Mobile Number</label>
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
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
              >
                Send 6-Digit OTP
              </button>

              <div className="space-y-1 pt-2">
                <label className="font-bold text-slate-700">Enter 6-Digit OTP Code (Sent to Email Inbox)</label>
                <input
                  type="text"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="Enter 6-digit OTP code"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-mono font-bold text-center text-lg tracking-widest text-slate-900"
                />
              </div>
            </div>

            <button
              onClick={handleVerifyOtp}
              className="w-full py-3.5 rounded-2xl bg-[#0f2b5c] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              Verify OTP &amp; Proceed to Feedback
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VolunteerFeedbackPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-bold text-slate-400">Loading feedback experience...</div>}>
      <FeedbackContent />
    </Suspense>
  );
}
