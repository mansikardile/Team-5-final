'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Star,
  Building2,
  Calendar,
  MessageSquare,
  Tag,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Eye,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { api } from '@/lib/api';

export interface FeedbackRecord {
  id: string;
  activityCode: string;
  activityTitle: string;
  name: string;
  email: string;
  company: string;
  rating: number;
  theme?: string;
  experience?: string;
  comments: string;
  suggestion?: string;
  suggestions?: string;
  createdAt: string;
}

export default function VolunteerFeedbackTable() {
  const [records, setRecords] = useState<FeedbackRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState('ALL');
  const [selectedRating, setSelectedRating] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFeedbackModal, setActiveFeedbackModal] = useState<FeedbackRecord | null>(null);

  const fetchFeedbacks = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/feedback');
      if (res.data?.data) {
        setRecords(res.data.data);
      }
    } catch (err) {
      console.warn('Error fetching live feedback ledger:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Filter records
  const filteredRecords = records.filter((rec) => {
    if (selectedCompany !== 'ALL' && rec.company !== selectedCompany) return false;
    if (selectedRating !== 'ALL' && rec.rating !== Number(selectedRating)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        rec.name.toLowerCase().includes(q) ||
        rec.email.toLowerCase().includes(q) ||
        rec.activityCode.toLowerCase().includes(q) ||
        (rec.comments || rec.experience || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const exportToCSV = () => {
    const headers = ['Feedback ID', 'Activity Code', 'Activity Title', 'Volunteer Name', 'Corporate Email', 'Company', 'Rating', 'Experience Comments', 'Volunteer Suggestions', 'Timestamp'];
    const rows = filteredRecords.map((r) => [
      r.id,
      r.activityCode,
      `"${r.activityTitle}"`,
      `"${r.name}"`,
      r.email,
      r.company,
      r.rating,
      `"${(r.experience || r.comments || '').replace(/"/g, '""')}"`,
      `"${(r.suggestion || r.suggestions || '').replace(/"/g, '""')}"`,
      r.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SevaSahayog_Feedback_Live_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Search & Filter Ribbon */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by volunteer name, corporate email, activity code..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
          />
        </div>

        {/* Filters and Export Actions */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Company Filter */}
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
          >
            <option value="ALL">All Corporate Partners</option>
            <option value="Mastercard">Mastercard</option>
            <option value="Barclays">Barclays</option>
            <option value="TCS">TCS</option>
            <option value="Cummins">Cummins</option>
          </select>

          {/* Rating Filter */}
          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
          >
            <option value="ALL">All Ratings</option>
            <option value="5">5 Stars (Transformative)</option>
            <option value="4">4 Stars (Very Good)</option>
            <option value="3">3 Stars (Satisfactory)</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={fetchFeedbacks}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Refresh Live Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {/* Export Button */}
          <button
            onClick={exportToCSV}
            className="px-4 py-2.5 rounded-2xl bg-[#0f2b5c] hover:bg-[#091b3b] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-sky-300" />
            <span>Export CSV / Excel</span>
          </button>
        </div>
      </div>

      {/* Main Feedback Table */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900">
              Live Volunteer Experience Records (Database)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {filteredRecords.length} real-time verified submissions across corporate partner drives
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>PostgreSQL Live Sync</span>
          </span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-xs font-bold text-slate-400">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading real-time feedback submissions...
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-bold text-slate-700">No feedback submissions found yet.</p>
            <p className="text-slate-400">Corporate volunteers who submit the 1-minute feedback will appear here in real-time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Volunteer &amp; Company</th>
                  <th className="py-3.5 px-6">Activity Code &amp; Title</th>
                  <th className="py-3.5 px-6">Rating</th>
                  <th className="py-3.5 px-6">Experience Highlights</th>
                  <th className="py-3.5 px-6">Suggestions</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Volunteer Info */}
                    <td className="py-4 px-6 space-y-0.5">
                      <strong className="text-slate-900 font-bold block">{rec.name}</strong>
                      <span className="text-[11px] text-slate-500 font-mono block">{rec.email}</span>
                      <span className="inline-block px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px]">
                        {rec.company}
                      </span>
                    </td>

                    {/* Activity Info */}
                    <td className="py-4 px-6 space-y-0.5 max-w-xs">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-mono text-[10px] font-bold">
                        {rec.activityCode}
                      </span>
                      <p className="text-slate-800 font-semibold text-xs truncate">
                        {rec.activityTitle}
                      </p>
                    </td>

                    {/* Rating */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-4 h-4 fill-amber-500" />
                        <span>{rec.rating}.0</span>
                      </div>
                    </td>

                    {/* Experience Comments */}
                    <td className="py-4 px-6 max-w-xs">
                      <p className="text-slate-700 line-clamp-2 leading-relaxed">
                        "{rec.experience || rec.comments}"
                      </p>
                    </td>

                    {/* Suggestions */}
                    <td className="py-4 px-6 max-w-xs">
                      <p className="text-slate-500 line-clamp-2 italic">
                        {rec.suggestion || rec.suggestions || '—'}
                      </p>
                    </td>

                    {/* View Details */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setActiveFeedbackModal(rec)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 transition-colors cursor-pointer"
                        title="View Complete Dossier"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {activeFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-sans">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block">{activeFeedbackModal.id}</span>
                <h3 className="text-lg font-black text-slate-900">Volunteer Feedback Dossier</h3>
              </div>
              <button
                onClick={() => setActiveFeedbackModal(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div>
                  <span className="text-slate-400 text-[10px] block">Volunteer Name</span>
                  <strong className="text-slate-900">{activeFeedbackModal.name}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Corporate Partner</span>
                  <strong className="text-blue-700">{activeFeedbackModal.company}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Corporate Email</span>
                  <span className="font-mono text-slate-700">{activeFeedbackModal.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Overall Rating</span>
                  <span className="text-amber-600 font-bold">★ {activeFeedbackModal.rating}.0 / 5.0</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-bold block mb-1">Volunteering Experience:</span>
                <p className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-slate-800 leading-relaxed">
                  "{activeFeedbackModal.experience || activeFeedbackModal.comments}"
                </p>
              </div>

              {(activeFeedbackModal.suggestion || activeFeedbackModal.suggestions) && (
                <div>
                  <span className="text-slate-500 font-bold block mb-1">Volunteer Suggestions:</span>
                  <p className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-slate-800 leading-relaxed">
                    "{activeFeedbackModal.suggestion || activeFeedbackModal.suggestions}"
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveFeedbackModal(null)}
                className="w-full py-3 rounded-2xl bg-[#0f2b5c] text-white text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
