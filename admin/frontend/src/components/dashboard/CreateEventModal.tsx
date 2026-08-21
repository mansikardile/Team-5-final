'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { X, Calendar, Building2, MapPin, FileText, Hash, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

const createEventSchema = z.object({
  title: z.string().min(3, 'Event title is required (min 3 chars)'),
  collegeName: z.string().min(2, 'College / Institution name is required'),
  location: z.string().optional(),
  eventDate: z.string().min(1, 'Event date is required'),
  code: z
    .string()
    .min(3, 'Code must be at least 3 characters')
    .optional()
    .or(z.literal('')),
  description: z.string().optional(),
});

type CreateEventFormData = z.infer<typeof createEventSchema>;

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateEventModal({
  isOpen,
  onClose,
}: CreateEventModalProps) {
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successEvent, setSuccessEvent] = useState<any | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: '',
      collegeName: '',
      location: '',
      eventDate: new Date().toISOString().split('T')[0],
      code: '',
      description: '',
    },
  });

  const collegeVal = watch('collegeName');

  const createEventMutation = useMutation({
    mutationFn: async (data: CreateEventFormData) => {
      const payload = {
        ...data,
        code: data.code?.trim() ? data.code.trim() : undefined,
      };
      const res = await api.post('/events', payload);
      return res.data;
    },
    onSuccess: (res) => {
      setServerError(null);
      setSuccessEvent(res.data);
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-analytics'] });
    },
    onError: (err: any) => {
      setServerError(
        err.response?.data?.message || 'Failed to create outreach event'
      );
    },
  });

  const handleAutoGenerateCode = () => {
    const cleanName = (collegeVal || 'STEM')
      .replace(/[^A-Za-z0-9]/g, '')
      .substring(0, 4)
      .toUpperCase();
    const year = new Date().getFullYear();
    const rand = Math.floor(100 + Math.random() * 900);
    setValue('code', `KAT-${year}-${cleanName}-${rand}`, { shouldValidate: true });
  };

  const handleClose = () => {
    reset();
    setServerError(null);
    setSuccessEvent(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Create Outreach Event
            </h3>
            <p className="text-xs text-slate-500">
              Generate a unique event code and student registration link.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Success Modal View */}
        {successEvent ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">
                Event Created Successfully!
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Students can now register using the unique identifier.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Event Code
                </span>
                <p className="text-sm font-mono font-bold text-sky-700">
                  {successEvent.code}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Registration URL
                </span>
                <p className="text-xs font-mono text-slate-600 break-all bg-white p-2 rounded-lg border border-slate-200">
                  http://localhost:3000/register/{successEvent.code}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `http://localhost:3000/register/${successEvent.code}`
                  );
                  alert('Registration link copied to clipboard!');
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-sky-50 text-sky-700 font-medium text-xs hover:bg-sky-100 transition-colors"
              >
                Copy Link
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 text-white font-medium text-xs hover:bg-slate-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Create Form */
          <form
            onSubmit={handleSubmit((data) => createEventMutation.mutate(data))}
            className="space-y-4"
          >
            {/* Event Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Event Title *
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Katalyst STEM Outreach Drive 2025"
                  {...register('title')}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none"
                />
              </div>
              {errors.title && (
                <p className="text-[11px] text-rose-600 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* College / Institution */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                College / Institution *
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. College of Engineering Pune (COEP)"
                  {...register('collegeName')}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none"
                />
              </div>
              {errors.collegeName && (
                <p className="text-[11px] text-rose-600 mt-1">
                  {errors.collegeName.message}
                </p>
              )}
            </div>

            {/* Date & Location Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Event Date *
                </label>
                <input
                  type="date"
                  {...register('eventDate')}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none"
                />
                {errors.eventDate && (
                  <p className="text-[11px] text-rose-600 mt-1">
                    {errors.eventDate.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Location / City
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pune, Maharashtra"
                  {...register('location')}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none"
                />
              </div>
            </div>

            {/* Custom / Auto Unique Identifier */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Unique Event Code (Optional)
                </label>
                <button
                  type="button"
                  onClick={handleAutoGenerateCode}
                  className="text-[11px] font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  Auto-generate
                </button>
              </div>
              <input
                type="text"
                placeholder="Leave blank for auto code (e.g. KAT-2025-COEP-492)"
                {...register('code')}
                className="w-full px-3.5 py-2.5 text-xs font-mono uppercase rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none"
              />
              {errors.code && (
                <p className="text-[11px] text-rose-600 mt-1">
                  {errors.code.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Description / Outreach Notes
              </label>
              <textarea
                rows={2}
                placeholder="Details about target branches, auditorium, or session agenda..."
                {...register('description')}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-medium text-xs hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createEventMutation.isPending}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 text-white font-medium text-xs hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {createEventMutation.isPending ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create Event</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
