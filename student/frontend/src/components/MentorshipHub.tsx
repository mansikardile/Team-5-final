'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  HeartHandshake,
  Building2,
  Briefcase,
  Sparkles,
  Calendar,
  Video,
  CheckCircle2,
  Clock,
  UserCheck,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export default function MentorshipHub({ student }: { student: any }) {
  const queryClient = useQueryClient();
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  const [goalsInput, setGoalsInput] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Fetch all corporate mentors
  const { data: mentors, isLoading: isMentorsLoading } = useQuery({
    queryKey: ['mentorsList'],
    queryFn: async () => {
      const res = await api.get('/mentorship/mentors');
      return res.data.data;
    },
  });

  // Fetch my active mentorship matches
  const { data: myRequests, isLoading: isRequestsLoading } = useQuery({
    queryKey: ['myMentorshipRequests'],
    queryFn: async () => {
      const res = await api.get('/mentorship/my-requests');
      return res.data.data;
    },
  });

  // Request mentorship mutation
  const requestMutation = useMutation({
    mutationFn: async ({ mentorId, goalsNotes }: { mentorId: string; goalsNotes: string }) => {
      const res = await api.post('/mentorship/request', {
        mentorId,
        goalsNotes,
      });
      return res.data;
    },
    onSuccess: (data) => {
      setSuccessToast(data.message);
      setSelectedMentor(null);
      setGoalsInput('');
      queryClient.invalidateQueries({ queryKey: ['myMentorshipRequests'] });
      setTimeout(() => setSuccessToast(null), 5000);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Failed to request mentorship');
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

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white shadow-xl">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-bold">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Katalyst 1:1 Corporate Mentorship Program</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Learn from Senior Women Tech Leaders
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Every Katalyst scholar is paired with a dedicated engineering executive from global technology companies for monthly career roadmaps, mock coding interviews, and resume mentorship.
          </p>
        </div>
      </div>

      {/* My Active Mentorship Session Card (if matched) */}
      {myRequests && myRequests.length > 0 && (
        <div className="p-6 rounded-3xl bg-white border border-indigo-200 shadow-md">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-extrabold text-slate-900">
                Your Assigned 1:1 Corporate Mentor
              </h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Matched & Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myRequests.map((req: any) => (
              <div key={req.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                <div className="flex items-start gap-3.5">
                  <img
                    src={req.mentor?.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100'}
                    alt={req.mentor?.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{req.mentor?.name}</h4>
                    <p className="text-xs font-semibold text-indigo-600">{req.mentor?.roleTitle}</p>
                    <p className="text-[11px] text-slate-500 font-medium">{req.mentor?.company}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-rose-500" />
                    <span>Next Sync: {req.scheduledDate ? new Date(req.scheduledDate).toLocaleDateString() : 'Next Week'}</span>
                  </span>
                  <a
                    href={req.meetingLink || 'https://meet.google.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Google Meet</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Corporate Mentors Grid */}
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Explore Katalyst Mentor Network
          </h3>
          <p className="text-xs text-slate-500">
            Browse corporate technology leaders available for 1:1 guidance, resume teardowns, and interview prep.
          </p>
        </div>

        {isMentorsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-44 bg-slate-200/60 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mentors?.map((mentor: any) => (
              <div
                key={mentor.id}
                className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={mentor.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100'}
                        alt={mentor.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{mentor.name}</h4>
                        <p className="text-xs font-bold text-indigo-600">{mentor.company}</p>
                        <p className="text-[11px] text-slate-500 font-medium leading-tight">{mentor.roleTitle}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                      {mentor.experienceYrs}+ yrs exp
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                    {mentor.bio}
                  </p>

                  <div className="inline-block px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-[10px] font-semibold">
                    Expertise: {mentor.expertise}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Available for 1:1 Matching
                  </span>
                  <button
                    onClick={() => setSelectedMentor(mentor)}
                    className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1"
                  >
                    <span>Request Match</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Request Match Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Request 1:1 Mentorship with {selectedMentor.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {selectedMentor.roleTitle} at <span className="font-bold text-slate-700">{selectedMentor.company}</span>
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                requestMutation.mutate({
                  mentorId: selectedMentor.id,
                  goalsNotes: goalsInput,
                });
              }}
              className="space-y-3.5"
            >
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  What specific areas would you like mentorship in? *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="e.g. Preparing for summer software internships, reviewing my coding projects, learning cloud architecture..."
                  value={goalsInput}
                  onChange={(e) => setGoalsInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedMentor(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={requestMutation.isPending}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{requestMutation.isPending ? 'Connecting...' : 'Confirm Mentorship Request'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
