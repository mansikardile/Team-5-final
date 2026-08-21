'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import DigitalQRCodeModal from './DigitalQRCodeModal';
import EventRegistrationQRModal from './EventRegistrationQRModal';
import {
  Calendar,
  MapPin,
  Building2,
  QrCode,
  CheckCircle2,
  Trash2,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Share2,
} from 'lucide-react';

export default function MySessionsManager({ student }: { student: any }) {
  const queryClient = useQueryClient();
  const [selectedPass, setSelectedPass] = useState<any>(null);
  const [scanQREvent, setScanQREvent] = useState<any>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Fetch my registrations
  const { data: myRegs, isLoading: isMyRegsLoading } = useQuery({
    queryKey: ['myRegistrations'],
    queryFn: async () => {
      const res = await api.get('/sessions/my-registrations');
      return res.data.data;
    },
  });

  // Fetch all available events
  const { data: allSessions, isLoading: isAllLoading } = useQuery({
    queryKey: ['availableSessions'],
    queryFn: async () => {
      const res = await api.get('/sessions');
      return res.data.data;
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const res = await api.post(`/sessions/${eventId}/register`);
      return res.data;
    },
    onSuccess: (data) => {
      setSuccessToast(data.message);
      queryClient.invalidateQueries({ queryKey: ['myRegistrations'] });
      queryClient.invalidateQueries({ queryKey: ['availableSessions'] });
      setTimeout(() => setSuccessToast(null), 4000);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Failed to register');
    },
  });

  // Cancel mutation
  const cancelMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const res = await api.delete(`/sessions/${eventId}/cancel`);
      return res.data;
    },
    onSuccess: (data) => {
      setSuccessToast(data.message);
      queryClient.invalidateQueries({ queryKey: ['myRegistrations'] });
      queryClient.invalidateQueries({ queryKey: ['availableSessions'] });
      setTimeout(() => setSuccessToast(null), 4000);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Failed to cancel registration');
    },
  });

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Accepted Fellow Status Banner */}
      {(student?.applicationStatus === 'ACCEPTED' || student?.leadStatus === 'ACCEPTED') && student?.leadStatus !== 'REJECTED' && student?.applicationStatus !== 'REJECTED' && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-purple-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/40 text-purple-300 flex items-center justify-center font-black shrink-0">
              <Sparkles className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-200 text-[10px] font-bold mb-0.5">
                <span>Admission Decision: ACCEPTED</span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-white">
                Official Katalyst Women in STEM Fellow 🎉
              </h3>
              <p className="text-[11px] text-slate-300">
                Your campus registration and fellowship application have been verified and approved by the evaluation committee.
              </p>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-xl bg-purple-500/30 border border-purple-400/50 text-purple-200 text-xs font-bold shrink-0">
            ✓ Full Grant Unlocked
          </span>
        </div>
      )}

      {/* Active Registered Sessions & Digital Pass Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              My Active Registered Campus Sessions
            </h3>
            <p className="text-xs text-slate-500">
              Show your digital QR code pass at the venue registration desk for instant entry.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            {myRegs?.length || 0} Active Passes
          </span>
        </div>

        {isMyRegsLoading ? (
          <div className="h-40 bg-slate-200/60 rounded-3xl animate-pulse" />
        ) : myRegs && myRegs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myRegs.map((reg: any) => {
              const isAccepted = (reg.leadStatus === 'ACCEPTED' || student?.applicationStatus === 'ACCEPTED' || student?.leadStatus === 'ACCEPTED') && student?.leadStatus !== 'REJECTED' && reg.leadStatus !== 'REJECTED' && student?.applicationStatus !== 'REJECTED';
              return (
                <div
                  key={reg.id}
                  className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 uppercase">
                          {reg.event.code}
                        </span>
                        {isAccepted && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                            Accepted Fellow
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(reg.event.eventDate).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                      {reg.event.title}
                    </h4>

                    <div className="space-y-1 text-xs text-slate-500 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{reg.event.collegeName}</span>
                      </div>
                      {reg.event.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{reg.event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => cancelMutation.mutate(reg.eventId)}
                      disabled={cancelMutation.isPending}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl text-xs transition-colors"
                      title="Cancel Registration"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setSelectedPass(reg)}
                      className={`px-4 py-2 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 ${
                        isAccepted
                          ? 'bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800'
                          : 'bg-slate-900 hover:bg-slate-800'
                      }`}
                    >
                      <QrCode className="w-4 h-4 text-purple-300" />
                      <span>{isAccepted ? 'View Fellow Entry Pass' : 'View Digital QR Pass'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <QrCode className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">No active session registrations</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Browse upcoming campus outreach drives below and register with 1 click.
            </p>
          </div>
        )}
      </div>

      {/* Available Events to Join */}
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            All Upcoming Campus Drives & Sessions
          </h3>
          <p className="text-xs text-slate-500">
            Explore newly scheduled drives across partner engineering institutions.
          </p>
        </div>

        {isAllLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 bg-slate-200/60 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allSessions?.map((ev: any) => {
              const isAccepted = ev.isRegisteredByMe && (student?.verificationStatus === 'VERIFIED_COLLEGE' || student?.applicationStatus === 'ACCEPTED' || student?.leadStatus === 'ACCEPTED');
              return (
                <div
                  key={ev.id}
                  className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {ev.code}
                      </span>
                      <span className="text-[11px] font-semibold text-rose-600">
                        {new Date(ev.eventDate).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 mb-1 leading-snug">
                      {ev.title}
                    </h4>
                    <p className="text-xs text-slate-500 mb-3 truncate">{ev.collegeName}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400">{ev.totalAttendees} registered</span>
                    <div className="flex items-center gap-1.5">
                      {/* Scan QR Button */}
                      <button
                        onClick={() => setScanQREvent(ev)}
                        className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-[11px] font-bold flex items-center gap-1 transition-colors"
                        title="Scan QR to Register on Mobile"
                      >
                        <QrCode className="w-3.5 h-3.5 text-rose-500" />
                        <span className="hidden sm:inline">QR Code</span>
                      </button>

                      {ev.isRegisteredByMe ? (
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                          isAccepted
                            ? 'text-purple-700 bg-purple-50 border-purple-200'
                            : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                        }`}>
                          {isAccepted ? '✓ Accepted Fellow' : 'Registered'}
                        </span>
                      ) : (
                        <button
                          onClick={() => registerMutation.mutate(ev.id)}
                          disabled={registerMutation.isPending}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1 disabled:opacity-50"
                        >
                          <span>Register</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* QR Code Attendee Pass Modal */}
      <DigitalQRCodeModal
        isOpen={!!selectedPass}
        onClose={() => setSelectedPass(null)}
        registration={selectedPass}
        studentName={student?.fullName || 'Katalyst Scholar'}
        isAccepted={
          (selectedPass?.leadStatus === 'ACCEPTED' ||
            student?.applicationStatus === 'ACCEPTED' ||
            student?.leadStatus === 'ACCEPTED') &&
          student?.leadStatus !== 'REJECTED' &&
          selectedPass?.leadStatus !== 'REJECTED' &&
          student?.applicationStatus !== 'REJECTED'
        }
      />

      {/* Event Scan-to-Register QR Modal */}
      <EventRegistrationQRModal
        isOpen={!!scanQREvent}
        onClose={() => setScanQREvent(null)}
        event={scanQREvent}
      />
    </div>
  );
}
