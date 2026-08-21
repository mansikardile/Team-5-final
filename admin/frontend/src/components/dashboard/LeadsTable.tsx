'use client';

import React, { useState } from 'react';
import {
  Search,
  Download,
  Send,
  CheckCircle,
  Clock,
  ChevronDown,
  Filter,
  Users,
  ShieldCheck,
  Building2,
  BookOpen,
  Phone,
  Mail,
  Sparkles,
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { EventItem } from './EventsList';

export interface StudentLeadItem {
  id: string;
  trackingId: string;
  fullName: string;
  email: string;
  phone: string;
  college: string;
  yearOfStudy: string;
  fieldOfStudy: string;
  status: 'REGISTERED' | 'STARTED' | 'COMPLETED' | 'ACCEPTED' | 'REJECTED';
  digitalConsent: boolean;
  personalizedUrl: string | null;
  eventId: string;
  createdAt: string;
  event?: {
    id: string;
    code: string;
    title: string;
    collegeName: string;
  };
}

interface LeadsTableProps {
  leads: StudentLeadItem[];
  events: EventItem[];
  isLoading: boolean;
  selectedEventId: string;
  onSelectEventId: (id: string) => void;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function LeadsTable({
  leads,
  events,
  isLoading,
  selectedEventId,
  onSelectEventId,
  selectedStatus,
  onSelectStatus,
  searchQuery,
  onSearchChange,
}: LeadsTableProps) {
  const queryClient = useQueryClient();
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Status Change Mutation
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await api.patch(`/leads/${id}/status`, { status });
      return res.data;
    },
    onSuccess: (res) => {
      setNotificationMsg(res.message);
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-analytics'] });
      setTimeout(() => setNotificationMsg(null), 3000);
    },
  });

  // Resend Link / Trigger SMS Mutation
  const resendMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post(`/leads/${id}/resend-link`);
      return res.data;
    },
    onSuccess: (res) => {
      setNotificationMsg(
        `Personalized link sent to ${res.data.studentName} (${res.data.email})`
      );
      setTimeout(() => setNotificationMsg(null), 4000);
    },
  });

  const handleExportCsv = async () => {
    try {
      const res = await api.get('/leads/export', {
        params: {
          eventId: selectedEventId,
          status: selectedStatus,
        },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `katalyst_leads_${Date.now()}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      alert('Failed to export CSV. Please try again.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'REGISTERED':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'STARTED':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'ACCEPTED':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'REJECTED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
      {/* Header & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Student Leads & Candidate Tracking
          </h2>
          <p className="text-xs text-slate-500">
            Real-time candidate pipeline with event attribution & status progression
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          disabled={leads.length === 0}
          className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5 self-start sm:self-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export to CSV</span>
        </button>
      </div>

      {/* Notification Toast */}
      {notificationMsg && (
        <div className="mb-4 p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-200">
          <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, email, phone, or college..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
          />
        </div>

        {/* Event Filter */}
        <div className="w-full md:w-56">
          <select
            value={selectedEventId}
            onChange={(e) => onSelectEventId(e.target.value)}
            className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:bg-white focus:border-sky-500 outline-none cursor-pointer"
          >
            <option value="ALL">All Outreach Events</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.code} - {ev.collegeName}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-44">
          <select
            value={selectedStatus}
            onChange={(e) => onSelectStatus(e.target.value)}
            className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:bg-white focus:border-sky-500 outline-none cursor-pointer"
          >
            <option value="ALL">All Funnel Stages</option>
            <option value="REGISTERED">Registered</option>
            <option value="STARTED">Started</option>
            <option value="COMPLETED">Completed</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Student & Year</th>
              <th className="py-3 px-4">Contact Info</th>
              <th className="py-3 px-4">Institution & Field</th>
              <th className="py-3 px-4">Event Source</th>
              <th className="py-3 px-4">Consent</th>
              <th className="py-3 px-4">Funnel Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  Fetching leads from Supabase...
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="font-semibold text-slate-700">No Student Leads Found</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {searchQuery || selectedEventId !== 'ALL' || selectedStatus !== 'ALL'
                      ? 'No results match your active filters.'
                      : 'Students who register through event links will appear here in real time.'}
                  </p>
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Name & Year */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 leading-tight">
                      {lead.fullName}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                      Year: {lead.yearOfStudy} &bull; ID: {lead.trackingId.slice(0, 8)}...
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[150px]">{lead.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{lead.phone}</span>
                    </div>
                  </td>

                  {/* College & Field */}
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800 truncate max-w-[170px]">
                      {lead.college}
                    </div>
                    <div className="text-[11px] text-sky-700 mt-0.5 truncate max-w-[170px]">
                      {lead.fieldOfStudy}
                    </div>
                  </td>

                  {/* Event Code */}
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {lead.event?.code || 'DIRECT'}
                    </span>
                  </td>

                  {/* Consent Badge */}
                  <td className="py-3.5 px-4">
                    {lead.digitalConsent ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-400">
                        None
                      </span>
                    )}
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-3.5 px-4">
                    <select
                      value={lead.status}
                      onChange={(e) =>
                        statusMutation.mutate({
                          id: lead.id,
                          status: e.target.value,
                        })
                      }
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border outline-none cursor-pointer transition-all ${getStatusBadge(
                        lead.status
                      )}`}
                    >
                      <option value="REGISTERED">Registered</option>
                      <option value="STARTED">Started</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="ACCEPTED">Accepted</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      title="Trigger Personalized Link Email/SMS"
                      onClick={() => resendMutation.mutate(lead.id)}
                      disabled={resendMutation.isPending}
                      className="p-1.5 text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded-lg transition-colors inline-flex items-center gap-1 text-[11px] font-medium"
                    >
                      <Send className="w-3 h-3" />
                      <span className="hidden sm:inline">Send Link</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
