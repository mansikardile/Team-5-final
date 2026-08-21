'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '@/lib/api';
import {
  Sparkles,
  Building2,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  GraduationCap,
  Mail,
  Phone,
  User,
  ArrowRight,
} from 'lucide-react';

const registrationSchema = z.object({
  fullName: z.string().min(2, 'Full name is required (min 2 characters)'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Valid 10-digit phone number is required'),
  college: z.string().min(2, 'College name is required'),
  yearOfStudy: z.string().min(1, 'Please select your current year'),
  fieldOfStudy: z.string().min(2, 'Please select/enter your branch'),
  digitalConsent: z.boolean().refine((val) => val === true, {
    message: 'Consent is required to receive application guidance',
  }),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export default function StudentEventRegistrationPage() {
  const params = useParams();
  const eventCode = params?.code as string;
  const [isSuccess, setIsSuccess] = useState(false);
  const [studentTrackingId, setStudentTrackingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch Event details by unique code
  const { data: event, isLoading: isEventLoading, error: eventError } = useQuery({
    queryKey: ['event-public', eventCode],
    queryFn: async () => {
      const res = await api.get(`/events/code/${eventCode}`);
      return res.data.data;
    },
    enabled: !!eventCode,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      college: '',
      yearOfStudy: '1st Year (B.Tech/BE)',
      fieldOfStudy: 'Computer Science / IT',
      digitalConsent: true,
    },
  });

  // Auto-fill college name from event if present
  React.useEffect(() => {
    if (event?.collegeName) {
      setValue('college', event.collegeName);
    }
  }, [event, setValue]);

  const registerMutation = useMutation({
    mutationFn: async (data: RegistrationFormData) => {
      const payload = {
        ...data,
        eventId: event.id,
      };
      const res = await api.post('/leads/register', payload);
      return res.data;
    },
    onSuccess: (res) => {
      setIsSuccess(true);
      setStudentTrackingId(res.data.trackingId);
    },
    onError: (err: any) => {
      setErrorMessage(
        err.response?.data?.message ||
          'Registration failed. Please verify your information and try again.'
      );
    },
  });

  if (isEventLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sky-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-600">
            Loading Katalyst Outreach Event...
          </p>
        </div>
      </div>
    );
  }

  if (eventError || !event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full p-8 bg-white rounded-3xl shadow-sm border border-slate-200 text-center">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900 mb-1">
            Event Not Found
          </h2>
          <p className="text-xs text-slate-500">
            The event code <span className="font-mono font-bold text-slate-700">{eventCode}</span> does not exist or has ended.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen sky-bg py-8 px-4 sm:px-6 flex flex-col items-center justify-center">
      {/* Container */}
      <div className="w-full max-w-xl bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-9 shadow-xl border border-white/80">
        {/* Header Branding */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            K
          </div>
          <div>
            <div className="text-sm font-extrabold text-slate-900 tracking-tight leading-none">
              Katalyst India
            </div>
            <div className="text-[10px] text-sky-700 font-semibold uppercase tracking-wider">
              STEM Women Leadership Initiative
            </div>
          </div>
        </div>

        {/* Event Banner */}
        <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200/70 mb-6">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h1 className="text-base font-extrabold text-slate-900">
              {event.title}
            </h1>
            <span className="font-mono text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
              {event.code}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-2">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-sky-600" />
              {event.collegeName}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-sky-600" />
              {new Date(event.eventDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            {event.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                {event.location}
              </span>
            )}
          </div>
        </div>

        {/* Success View */}
        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Interest Registered Successfully!
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Thank you for taking the first step towards the Katalyst STEM Scholarship and Mentorship program.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400">
                Your Unique Tracking ID
              </span>
              <p className="text-xs font-mono font-bold text-sky-700 bg-white p-2.5 rounded-xl border border-slate-200">
                {studentTrackingId}
              </p>
              <p className="text-[11px] text-slate-500">
                A personalized application link has been linked to your profile and will be sent via SMS & Email.
              </p>
            </div>
          </div>
        ) : (
          /* Form View */
          <form
            onSubmit={handleSubmit((data) => registerMutation.mutate(data))}
            className="space-y-4"
          >
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  {...register('fullName')}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none"
                />
              </div>
              {errors.fullName && (
                <p className="text-[11px] text-rose-600 mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="name@college.edu"
                    {...register('email')}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none"
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-rose-600 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="9876543210"
                    {...register('phone')}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none"
                  />
                </div>
                {errors.phone && (
                  <p className="text-[11px] text-rose-600 mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            {/* College */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                College / Institution Name *
              </label>
              <input
                type="text"
                placeholder="College Name"
                {...register('college')}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none"
              />
              {errors.college && (
                <p className="text-[11px] text-rose-600 mt-1">
                  {errors.college.message}
                </p>
              )}
            </div>

            {/* Year & Field */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Current Year *
                </label>
                <select
                  {...register('yearOfStudy')}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:border-sky-500 outline-none"
                >
                  <option value="1st Year (B.Tech/BE)">1st Year (B.Tech/BE)</option>
                  <option value="2nd Year (B.Tech/BE)">2nd Year (B.Tech/BE)</option>
                  <option value="3rd Year (B.Tech/BE)">3rd Year (B.Tech/BE)</option>
                  <option value="4th Year (B.Tech/BE)">4th Year (B.Tech/BE)</option>
                  <option value="Diploma / Poly">Diploma</option>
                  <option value="B.Sc / Other STEM">B.Sc / Other STEM</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Field / Branch of Study *
                </label>
                <select
                  {...register('fieldOfStudy')}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:border-sky-500 outline-none"
                >
                  <option value="Computer Science / IT">Computer Science / IT</option>
                  <option value="Electronics & Telecommunication">Electronics & Telecom</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Data Science & AI">Data Science & AI</option>
                  <option value="Other STEM Field">Other STEM Field</option>
                </select>
              </div>
            </div>

            {/* Consent Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('digitalConsent')}
                  className="mt-0.5 rounded text-sky-600 focus:ring-sky-500"
                />
                <span>
                  I give digital consent to Katalyst to receive personalized application links, scholarship updates, and STEM mentorship notifications.
                </span>
              </label>
              {errors.digitalConsent && (
                <p className="text-[11px] text-rose-600 mt-1">
                  {errors.digitalConsent.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full mt-3 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {registerMutation.isPending ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Submitting Registration...</span>
                </>
              ) : (
                <>
                  <span>Submit Expression of Interest</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
