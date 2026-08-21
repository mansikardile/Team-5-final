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
  Eye,
  X,
  Laptop,
  GraduationCap,
  HeartHandshake,
  PenTool,
  CheckCircle2,
  AlertCircle,
  Check,
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { EventItem } from './EventsList';

export interface ScholarshipApplicationData {
  annualFamilyIncome?: string;
  primaryEarnerName?: string;
  primaryEarnerJob?: string;
  hasSingleParent?: boolean;
  hasFirstGenLearner?: boolean;
  whyStemEssay?: string;
  careerAspiration?: string;
  needsLaptopGrant?: boolean;
  status?: string;
  submittedAt?: string;
}

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
  signatureDataUrl?: string | null;
  personalizedUrl: string | null;
  eventId: string;
  notes?: string | null;
  createdAt: string;
  isCollegeVerified?: boolean;
  scholarshipApplication?: ScholarshipApplicationData | null;
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
  const [emailPreviewUrl, setEmailPreviewUrl] = useState<string | null>(null);

  // Modal States
  const [selectedLeadDetails, setSelectedLeadDetails] = useState<StudentLeadItem | null>(null);
  const [emailModalLead, setEmailModalLead] = useState<StudentLeadItem | null>(null);
  const [emailType, setEmailType] = useState<'ACCEPTANCE_OFFER' | 'APPLICATION_LINK' | 'INTERVIEW_CALL' | 'CUSTOM'>('ACCEPTANCE_OFFER');
  const [customSubject, setCustomSubject] = useState('');
  const [customMessage, setCustomMessage] = useState('');

  // Status Change Mutation
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await api.patch(`/leads/${id}/status`, { status });
      return res.data;
    },
    onSuccess: (res) => {
      setNotificationMsg(res.message);
      setEmailPreviewUrl(null);
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-analytics'] });
      setTimeout(() => setNotificationMsg(null), 3500);
    },
  });

  // Send Email Mutation
  const sendEmailMutation = useMutation({
    mutationFn: async ({ id, emailType, customSubject, customMessage }: { id: string; emailType: string; customSubject?: string; customMessage?: string }) => {
      const res = await api.post(`/leads/${id}/send-email`, {
        emailType,
        customSubject,
        customMessage,
      });
      return res.data;
    },
    onSuccess: (res) => {
      setNotificationMsg(`📧 ${res.message}`);
      setEmailPreviewUrl(res.data?.previewUrl || null);
      setEmailModalLead(null);
      setTimeout(() => {
        setNotificationMsg(null);
        setEmailPreviewUrl(null);
      }, 10000);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Failed to dispatch email');
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
      link.setAttribute('download', `katalyst_leads_${Date.now()}.csv`);
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
            Student Leads &amp; Candidate Tracking
          </h2>
          <p className="text-xs text-slate-500">
            Real-time candidate pipeline with event attribution, 4-step applications, digital signatures &amp; email dispatch
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
        <div className="mb-4 p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-in fade-in duration-200 shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
            <span>{notificationMsg}</span>
          </div>
          {emailPreviewUrl && (
            <a
              href={emailPreviewUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all inline-flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>🔗 View Live Sent Email in Browser</span>
            </a>
          )}
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
              <th className="py-3 px-4">Student &amp; Year</th>
              <th className="py-3 px-4">Contact Info</th>
              <th className="py-3 px-4">Institution &amp; Field</th>
              <th className="py-3 px-4">E-Signature</th>
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
                    <div className="font-bold text-slate-900 leading-tight flex items-center gap-1.5">
                      <span>{lead.fullName}</span>
                      {lead.status === 'ACCEPTED' && (
                        <span className="text-[9px] px-1.5 py-0.2 bg-purple-100 text-purple-700 font-bold rounded">
                          Fellow
                        </span>
                      )}
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

                  {/* E-Signature Status */}
                  <td className="py-3.5 px-4">
                    {lead.signatureDataUrl ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                        <PenTool className="w-3 h-3 text-indigo-600" />
                        <span>Signed</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">Pending</span>
                    )}
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
                  <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                    {/* View Application Details */}
                    <button
                      title="Review Full 4-Step Application & Digital Signature"
                      onClick={() => setSelectedLeadDetails(lead)}
                      className="p-1.5 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors inline-flex items-center gap-1 text-[11px] font-bold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review</span>
                    </button>

                    {/* Send Email / Official Acceptance */}
                    <button
                      title="Send Official Email Notification to Student"
                      onClick={() => {
                        setEmailModalLead(lead);
                        setEmailType(lead.status === 'ACCEPTED' ? 'ACCEPTANCE_OFFER' : 'APPLICATION_LINK');
                      }}
                      className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors inline-flex items-center gap-1 text-[11px] font-bold"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL 1: Candidate Application & Digital Signature Review Modal */}
      {selectedLeadDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-100 relative space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-bold uppercase mb-1">
                  <span>Candidate Application Dossier</span>
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  {selectedLeadDetails.fullName}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedLeadDetails.college} &bull; {selectedLeadDetails.fieldOfStudy}
                </p>
              </div>

              <button
                onClick={() => setSelectedLeadDetails(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-xs font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Funnel & Verification Status Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Funnel Stage</span>
                <span className={`text-xs font-extrabold px-2 py-0.5 rounded-md mt-1 inline-block ${getStatusBadge(selectedLeadDetails.status)}`}>
                  {selectedLeadDetails.status}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Digital Consent</span>
                <span className="text-xs font-bold text-emerald-700 mt-1 inline-block">
                  {selectedLeadDetails.digitalConsent ? '✓ Verified' : 'None'}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Laptop Grant</span>
                <span className="text-xs font-bold text-rose-700 mt-1 inline-block">
                  {selectedLeadDetails.scholarshipApplication?.needsLaptopGrant !== false ? '✓ Requested (100%)' : 'Not Requested'}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Tracking ID</span>
                <span className="text-[10px] font-mono font-bold text-slate-700 truncate block mt-1">
                  {selectedLeadDetails.trackingId}
                </span>
              </div>
            </div>

            {/* Step 1: Academic & Contact */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                <span>1. Academic &amp; Contact Information</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-600 font-medium">
                <p>&bull; <strong>Email:</strong> {selectedLeadDetails.email}</p>
                <p>&bull; <strong>Phone / WhatsApp:</strong> {selectedLeadDetails.phone}</p>
                <p>&bull; <strong>College:</strong> {selectedLeadDetails.college}</p>
                <p>&bull; <strong>Year of Study:</strong> {selectedLeadDetails.yearOfStudy}</p>
                <p>&bull; <strong>Stream / Branch:</strong> {selectedLeadDetails.fieldOfStudy}</p>
                <p>&bull; <strong>Drive Event:</strong> {selectedLeadDetails.event?.title || 'Campus Outreach'}</p>
              </div>
            </div>

            {/* Step 2: Socio-Economic Profile */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>2. Socio-Economic &amp; Family Profile</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-600 font-medium">
                <p>&bull; <strong>Family Income:</strong> <span className="font-bold text-slate-800">{selectedLeadDetails.scholarshipApplication?.annualFamilyIncome || 'Below ₹2,50,000 / annum'}</span></p>
                <p>&bull; <strong>Primary Earner:</strong> {selectedLeadDetails.scholarshipApplication?.primaryEarnerName || 'Guardian'}</p>
                <p>&bull; <strong>Earner Occupation:</strong> {selectedLeadDetails.scholarshipApplication?.primaryEarnerJob || 'Daily / Service worker'}</p>
                <p>&bull; <strong>Single Parent Household:</strong> {selectedLeadDetails.scholarshipApplication?.hasSingleParent ? 'Yes' : 'No'}</p>
                <p>&bull; <strong>First-Gen College Learner:</strong> {selectedLeadDetails.scholarshipApplication?.hasFirstGenLearner ? 'Yes' : 'No'}</p>
              </div>
            </div>

            {/* Step 3: Statement of Purpose & Aspirations */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                <span>3. Statement of Purpose &amp; Career Goals</span>
              </h4>
              <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-700">
                <div>
                  <span className="font-bold text-slate-900 block mb-0.5">Why STEM &amp; Engineering Passion:</span>
                  <p className="italic text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                    "{selectedLeadDetails.scholarshipApplication?.whyStemEssay || selectedLeadDetails.notes || 'Passionate about software engineering and emerging technologies to drive social change and leadership.'}"
                  </p>
                </div>
                {selectedLeadDetails.scholarshipApplication?.careerAspiration && (
                  <p>&bull; <strong>Target 4-Year Role:</strong> <span className="font-bold">{selectedLeadDetails.scholarshipApplication.careerAspiration}</span></p>
                )}
              </div>
            </div>

            {/* Step 4: Rendered Digital E-Signature */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <PenTool className="w-3.5 h-3.5 text-indigo-600" />
                <span>4. Digital Signature &amp; Legal Sign-off</span>
              </h4>
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-xs text-slate-600 text-center sm:text-left">
                  <div className="flex items-center gap-1.5 text-indigo-900 font-bold">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>Legally Verified E-Signature</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Digitally signed by <strong className="text-slate-800">{selectedLeadDetails.fullName}</strong>
                  </p>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-indigo-200 shadow-sm max-w-[220px] w-full flex items-center justify-center">
                  {selectedLeadDetails.signatureDataUrl ? (
                    <img
                      src={selectedLeadDetails.signatureDataUrl}
                      alt="Student Digital Signature"
                      className="max-h-16 object-contain"
                    />
                  ) : (
                    <span className="text-[11px] text-slate-400 italic py-3">
                      Standard Digital Consent Recorded
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Quick Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  const current = selectedLeadDetails;
                  setSelectedLeadDetails(null);
                  setEmailModalLead(current);
                  setEmailType(current.status === 'ACCEPTED' ? 'ACCEPTANCE_OFFER' : 'APPLICATION_LINK');
                }}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-rose-400" />
                <span>Send Email to {selectedLeadDetails.fullName.split(' ')[0]}</span>
              </button>

              <div className="flex items-center gap-2">
                {selectedLeadDetails.status !== 'ACCEPTED' && (
                  <button
                    type="button"
                    onClick={() => {
                      statusMutation.mutate({ id: selectedLeadDetails.id, status: 'ACCEPTED' });
                      setSelectedLeadDetails(null);
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Accept Candidate into Fellowship 🎉</span>
                  </button>
                )}

                {selectedLeadDetails.status !== 'REJECTED' && (
                  <button
                    type="button"
                    onClick={() => {
                      statusMutation.mutate({ id: selectedLeadDetails.id, status: 'REJECTED' });
                      setSelectedLeadDetails(null);
                    }}
                    className="px-3.5 py-2.5 text-rose-600 hover:bg-rose-50 font-bold text-xs rounded-xl border border-rose-200 transition-all"
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Send Email Notification Modal */}
      {emailModalLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Send Email to {emailModalLead.fullName}
                </h3>
                <p className="text-xs text-slate-500">{emailModalLead.email}</p>
              </div>
              <button
                onClick={() => setEmailModalLead(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-xs font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Template Selector */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-700">Choose Email Template:</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setEmailType('ACCEPTANCE_OFFER')}
                  className={`p-3 rounded-xl border text-left font-bold transition-all ${
                    emailType === 'ACCEPTANCE_OFFER'
                      ? 'bg-purple-50 border-purple-300 text-purple-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <p className="text-xs">🎉 Fellowship Acceptance</p>
                  <span className="text-[10px] font-normal text-slate-500">Official admission &amp; grant offer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEmailType('APPLICATION_LINK')}
                  className={`p-3 rounded-xl border text-left font-bold transition-all ${
                    emailType === 'APPLICATION_LINK'
                      ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <p className="text-xs">🔗 Personalized Link</p>
                  <span className="text-[10px] font-normal text-slate-500">Direct enrollment link to apply</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEmailType('INTERVIEW_CALL')}
                  className={`p-3 rounded-xl border text-left font-bold transition-all ${
                    emailType === 'INTERVIEW_CALL'
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <p className="text-xs">🎙️ 1:1 Interview Call</p>
                  <span className="text-[10px] font-normal text-slate-500">Committee review scheduling</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEmailType('CUSTOM')}
                  className={`p-3 rounded-xl border text-left font-bold transition-all ${
                    emailType === 'CUSTOM'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <p className="text-xs">✏️ Custom Notice</p>
                  <span className="text-[10px] font-normal text-slate-500">Compose custom message</span>
                </button>
              </div>
            </div>

            {/* Custom inputs if chosen */}
            {emailType === 'CUSTOM' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    placeholder="e.g. Action Required: Update Academic Marksheet"
                    className="w-full px-3 py-2 text-xs rounded-xl input-field outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Message Body</label>
                  <textarea
                    rows={4}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Enter custom email message..."
                    className="w-full px-3 py-2 text-xs rounded-xl input-field outline-none"
                  />
                </div>
              </div>
            )}

            {/* Email Preview */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 font-medium text-slate-600">
              <p>&bull; <strong>Recipient:</strong> {emailModalLead.email}</p>
              <p>&bull; <strong>Delivery Channel:</strong> High-priority Email Simulation Engine</p>
              <p>&bull; <strong>Status:</strong> Ready to dispatch</p>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEmailModalLead(null)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() =>
                  sendEmailMutation.mutate({
                    id: emailModalLead.id,
                    emailType,
                    customSubject,
                    customMessage,
                  })
                }
                disabled={sendEmailMutation.isPending}
                className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{sendEmailMutation.isPending ? 'Dispatching Email...' : 'Send Email Now'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
