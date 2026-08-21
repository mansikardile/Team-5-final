'use client';

import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  UserX,
  Building2,
  Clock,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Mail,
  Phone,
} from 'lucide-react';
import { api } from '@/lib/api';

export interface PendingVolunteer {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  collegeName?: string;
  verificationStatus: string;
  createdAt: string;
}

export default function SpocVerificationTable() {
  const [volunteers, setVolunteers] = useState<PendingVolunteer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchPendingVolunteers = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/spoc/pending-volunteers');
      if (res.data?.data) {
        setVolunteers(res.data.data);
      }
    } catch (err) {
      console.warn('Error fetching pending volunteers for SPOC verification:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingVolunteers();
  }, []);

  const handleVerify = async (volunteerId: string, action: 'VERIFY' | 'REJECT') => {
    try {
      const res = await api.post('/spoc/verify-volunteer', { volunteerId, action });
      if (res.data?.success) {
        setActionNotice(res.data.message);
        fetchPendingVolunteers();
        setTimeout(() => setActionNotice(null), 4000);
      }
    } catch (err: any) {
      console.error('Error verifying volunteer:', err);
    }
  };

  const filtered = volunteers.filter((v) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      v.fullName.toLowerCase().includes(q) ||
      v.email.toLowerCase().includes(q) ||
      (v.collegeName || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-[11px] font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Corporate SPOC Verification Pipeline</span>
          </div>
          <h3 className="text-base font-black text-slate-900">
            Pending Corporate Volunteer Registrations
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Review and approve registered employees before allowing feedback submission
          </p>
        </div>

        <button
          onClick={fetchPendingVolunteers}
          className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0 cursor-pointer"
          title="Refresh List"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Main Table */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative w-full max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pending volunteers..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
            />
          </div>

          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200 shrink-0">
            {filtered.length} Pending Approval
          </span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-xs font-bold text-slate-400">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading pending volunteer signups...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="font-bold text-slate-800">All volunteer registrations are verified!</p>
            <p className="text-slate-400">New employee signups will appear here for SPOC review.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Volunteer Name</th>
                  <th className="py-3.5 px-6">Corporate Email &amp; Phone</th>
                  <th className="py-3.5 px-6">Company</th>
                  <th className="py-3.5 px-6">Registration Date</th>
                  <th className="py-3.5 px-6 text-right">SPOC Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <strong className="text-slate-900 font-bold block">{v.fullName}</strong>
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-[9px] border border-amber-200">
                        Pending SPOC Verification
                      </span>
                    </td>
                    <td className="py-4 px-6 space-y-0.5 font-mono text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{v.email}</span>
                      </div>
                      {v.phone && (
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{v.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-800 font-bold text-xs">
                        {v.collegeName || 'Mastercard'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-[11px]">
                      {new Date(v.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleVerify(v.id, 'VERIFY')}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Verify Volunteer</span>
                        </button>
                        <button
                          onClick={() => handleVerify(v.id, 'REJECT')}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
                          title="Reject Registration"
                        >
                          <UserX className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
