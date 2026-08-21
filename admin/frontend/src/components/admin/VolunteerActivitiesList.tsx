'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Building2,
  MapPin,
  Users,
  QrCode,
  Sparkles,
  PlusCircle,
  CheckCircle2,
  Clock,
  Download,
  Share2,
  RefreshCw,
  Mail,
  Send,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '@/lib/api';

export interface VolunteerActivity {
  id: string;
  code: string;
  title: string;
  partner: string;
  location: string;
  date: string;
  volunteersTarget: number;
  volunteersAttended: number;
  feedbacksReceived: number;
  avgRating: number;
  status: 'ACTIVE' | 'UPCOMING' | 'COMPLETED';
}

interface VolunteerActivitiesListProps {
  onOpenCreateModal: () => void;
}

export default function VolunteerActivitiesList({ onOpenCreateModal }: VolunteerActivitiesListProps) {
  const [activities, setActivities] = useState<VolunteerActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQRActivity, setSelectedQRActivity] = useState<VolunteerActivity | null>(null);

  const [dispatchingCode, setDispatchingCode] = useState<string | null>(null);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/events');
      if (res.data?.data) {
        setActivities(res.data.data);
      }
    } catch (err) {
      console.warn('Error fetching activities:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDispatchQrEmails = async (code: string) => {
    setDispatchingCode(code);
    setToastNotice(null);
    try {
      const res = await api.post('/spoc/dispatch-qr-emails', { activityCode: code });
      if (res.data?.success) {
        setToastNotice(res.data.message);
        setTimeout(() => setToastNotice(null), 6000);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to dispatch QR emails');
    } finally {
      setDispatchingCode(null);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification */}
      {toastNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-md animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{toastNotice}</span>
          </div>
          <button onClick={() => setToastNotice(null)} className="text-emerald-700 hover:text-emerald-950 font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
        <div>
          <h3 className="text-base font-black text-slate-900">
            Corporate Volunteering Activities Registry (Database)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage live drives, generate 1-minute feedback QR passes, and trigger automatic email notifications
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchActivities}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="Refresh Live Activities"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onOpenCreateModal}
            className="px-5 py-2.5 rounded-2xl bg-[#0f2b5c] hover:bg-[#091b3b] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-sky-300" />
            <span>Configure New Drive</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs font-bold text-slate-400">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Loading active volunteering drives from database...
        </div>
      ) : activities.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-500 space-y-2 bg-white rounded-3xl border border-slate-200">
          <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="font-bold text-slate-700">No volunteering drives configured yet.</p>
          <p className="text-slate-400">Click "Configure New Drive" above to create an event and dispatch feedback notification emails.</p>
        </div>
      ) : (
        /* Activities Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activities.map((act) => (
            <div
              key={act.id}
              className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-mono text-[11px] font-bold border border-slate-200">
                    {act.code}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      act.status === 'ACTIVE'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : act.status === 'COMPLETED'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {act.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                    {act.title}
                  </h4>
                  <p className="text-xs font-bold text-blue-700 mt-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>{act.partner}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-600 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{act.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{act.date}</span>
                  </div>
                </div>

                {/* Progress & Turnout HUD */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Volunteers</span>
                    <strong className="text-slate-900 font-bold font-mono">
                      {act.volunteersAttended}/{act.volunteersTarget}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Feedbacks</span>
                    <strong className="text-blue-700 font-bold font-mono">
                      {act.feedbacksReceived}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Avg CSAT</span>
                    <strong className="text-amber-600 font-bold font-mono">
                      {act.avgRating > 0 ? `★ ${act.avgRating}` : 'Pending'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setSelectedQRActivity(act)}
                  className="py-2.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5 text-blue-600" />
                  <span>1-Min QR Code</span>
                </button>

                <button
                  onClick={() => handleDispatchQrEmails(act.code)}
                  disabled={dispatchingCode === act.code}
                  className="py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold border border-blue-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Dispatch email with scannable QR Code to all registered corporate volunteers"
                >
                  {dispatchingCode === act.code ? (
                    <div className="w-3.5 h-3.5 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5 text-blue-700" />
                  )}
                  <span>📧 Dispatch QR Emails</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Activity QR Modal */}
      {selectedQRActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-center space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-[11px] font-bold mb-2">
                <QrCode className="w-3.5 h-3.5 text-blue-600" />
                <span>Volunteer Scan &amp; Go</span>
              </div>
              <h3 className="text-lg font-black text-slate-900">
                1-Minute Feedback QR
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-1">
                {selectedQRActivity.code} • {selectedQRActivity.partner}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 inline-block shadow-inner">
              <QRCodeSVG
                value={`http://192.168.28.60:3001/feedback?activityCode=${selectedQRActivity.code}`}
                size={180}
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-600 leading-relaxed">
                Volunteers scan this QR code with their phone camera to open the 1-minute feedback form.
              </p>

              <button
                onClick={() => handleDispatchQrEmails(selectedQRActivity.code)}
                disabled={dispatchingCode === selectedQRActivity.code}
                className="w-full py-3 rounded-2xl bg-[#0f2b5c] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:bg-[#091b3b] cursor-pointer"
              >
                <Send className="w-4 h-4 text-sky-300" />
                <span>Dispatch QR Code Email to Registered Volunteers</span>
              </button>
            </div>

            <button
              onClick={() => setSelectedQRActivity(null)}
              className="w-full py-2.5 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
