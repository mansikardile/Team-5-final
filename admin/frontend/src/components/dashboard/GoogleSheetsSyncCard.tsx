'use client';

import React, { useState } from 'react';
import { FileSpreadsheet, RefreshCw, CheckCircle2, ExternalLink, ShieldCheck } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function GoogleSheetsSyncCard() {
  const [syncStatus, setSyncStatus] = useState<{
    syncedAt: string;
    syncedLeadsCount: number;
    sheetUrl: string;
  } | null>(null);

  const syncMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/integrations/google-sheets/sync');
      return res.data;
    },
    onSuccess: (res) => {
      setSyncStatus(res.data);
    },
  });

  return (
    <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 text-white rounded-2xl p-6 border border-emerald-500/20 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Google Sheets Live Sync
              </h3>
              <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 max-w-lg">
              Synchronize event attendee leads and application conversion stages directly with external NGO spreadsheets in real time.
            </p>
            {syncStatus && (
              <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  Last synced {syncStatus.syncedLeadsCount} records at{' '}
                  {new Date(syncStatus.syncedAt).toLocaleTimeString()}
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => syncMutation.mutate()}
            disabled={syncMutation.isPending}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                syncMutation.isPending ? 'animate-spin' : ''
              }`}
            />
            <span>{syncMutation.isPending ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
