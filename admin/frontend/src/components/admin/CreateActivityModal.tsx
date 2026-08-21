'use client';

import React, { useState } from 'react';
import {
  X,
  PlusCircle,
  Building2,
  Calendar,
  MapPin,
  Users,
  Sparkles,
  Mail,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { api } from '@/lib/api';

interface CreateActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateActivityModal({ isOpen, onClose }: CreateActivityModalProps) {
  const [code, setCode] = useState(`SEVA-${Date.now().toString().slice(-4)}`);
  const [title, setTitle] = useState('');
  const [partner, setPartner] = useState('Mastercard');
  const [location, setLocation] = useState('Pune Corporate Campus');
  const [date, setDate] = useState('2026-08-25');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessInfo(null);

    try {
      const res = await api.post('/events', {
        code: code.trim().toUpperCase(),
        title: title.trim(),
        collegeName: partner,
        location: location.trim(),
        eventDate: new Date(date).toISOString(),
        description: `Corporate volunteering initiative with ${partner}`,
      });

      if (res.data?.success) {
        setSuccessInfo(`Activity created! Automated feedback emails have been dispatched to registered volunteers.`);
        setTimeout(() => {
          setIsSubmitting(false);
          onClose();
          window.location.reload();
        }, 1200);
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to create activity.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-[#0f2b5c] via-blue-900 to-[#091b3b] text-white relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-sky-200 text-xs font-bold mb-2">
            <PlusCircle className="w-3.5 h-3.5 text-sky-300" />
            <span>Activity Configuration</span>
          </div>
          <h3 className="text-xl font-black text-white">Configure New Volunteering Drive</h3>
          <p className="text-xs text-sky-100/90 mt-0.5">
            Saves to database and automatically emails the 1-minute feedback invitation to corporate volunteers
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successInfo && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successInfo}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Activity Code *</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold text-slate-900"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Corporate Partner *</label>
              <select
                value={partner}
                onChange={(e) => setPartner(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-900"
              >
                <option value="Mastercard">Mastercard</option>
                <option value="Barclays">Barclays</option>
                <option value="TCS">TCS</option>
                <option value="Cummins">Cummins</option>
                <option value="Infosys">Infosys</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Activity Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Samutkarsh: 500 School Science Kits Assembly"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Location *</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Event Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900"
                required
              />
            </div>
          </div>

          {/* Email Notification Auto-Trigger Notice */}
          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-2.5 text-xs text-blue-900">
            <Mail className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Automated Email Dispatch:</strong> Upon creation, registered volunteers and SPOCs will automatically receive an email invitation with their personalized 1-minute feedback link.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-[#0f2b5c] hover:bg-[#091b3b] text-white font-bold text-xs shadow-md transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Creating Drive & Dispatched Emails...' : 'Create Drive & Dispatch Feedback Emails'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
