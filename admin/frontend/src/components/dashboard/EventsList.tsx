'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Building2,
  MapPin,
  QrCode,
  Copy,
  ExternalLink,
  Users,
  Trash2,
  Check,
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface EventItem {
  id: string;
  code: string;
  title: string;
  collegeName: string;
  location: string | null;
  eventDate: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  totalLeads: number;
  funnelBreakdown: {
    registered: number;
    started: number;
    completed: number;
  };
}

interface EventsListProps {
  events: EventItem[];
  isLoading: boolean;
  onOpenCreateModal: () => void;
  onOpenQRCode: (event: EventItem) => void;
  selectedEventId: string;
  onSelectEvent: (id: string) => void;
}

export default function EventsList({
  events,
  isLoading,
  onOpenCreateModal,
  onOpenQRCode,
  selectedEventId,
  onSelectEvent,
}: EventsListProps) {
  const queryClient = useQueryClient();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/events/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-analytics'] });
    },
  });

  const handleCopyLink = (code: string) => {
    const url = `http://localhost:3000/register/${code}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete the event "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Outreach Events Directory
          </h2>
          <p className="text-xs text-slate-500">
            Create unique event campaigns & track student engagement per college
          </p>
        </div>
        <button
          onClick={onOpenCreateModal}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5 self-start sm:self-auto"
        >
          <span>+ New Outreach Event</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-xs text-slate-400">
          Loading events from Supabase...
        </div>
      ) : events.length === 0 ? (
        <div className="py-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <Calendar className="w-9 h-9 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-700">No Events Created Yet</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
            Start by creating your first outreach event to generate a unique link & QR code for student registrations.
          </p>
          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            Create Your First Event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => {
            const isSelected = selectedEventId === event.id;
            const dateStr = new Date(event.eventDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={event.id}
                onClick={() => onSelectEvent(isSelected ? 'ALL' : event.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50/40 shadow-sm ring-2 ring-sky-500/20'
                    : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div>
                  {/* Top Bar: Code Badge + Actions */}
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="font-mono text-[11px] font-extrabold text-sky-700 bg-sky-100/70 px-2 py-0.5 rounded-md tracking-wide">
                      {event.code}
                    </span>
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        title="Copy registration link"
                        onClick={() => handleCopyLink(event.code)}
                        className="p-1 text-slate-400 hover:text-sky-600 rounded-md hover:bg-sky-50 transition-colors"
                      >
                        {copiedCode === event.code ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        title="View QR Code"
                        onClick={() => onOpenQRCode(event)}
                        className="p-1 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Delete Event"
                        onClick={() => handleDelete(event.id, event.title)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & College */}
                  <h3 className="font-bold text-slate-900 text-sm leading-snug mb-1">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{event.collegeName}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-2">
                      <MapPin className="w-3 h-3 text-slate-300 shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  )}
                </div>

                {/* Bottom Metadata & Leads Pill */}
                <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {dateStr}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    <Users className="w-3 h-3 text-slate-500" />
                    <span>{event.totalLeads} Leads</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
