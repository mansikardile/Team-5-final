'use client';

import React, { useState } from 'react';
import { FileSpreadsheet, RefreshCw, CheckCircle2, Download, ExternalLink, Settings2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function GoogleSheetsSyncCard() {
  const [webhookInput, setWebhookInput] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{
    syncedAt: string;
    syncedLeadsCount: number;
    sheetUrl: string;
    webhookStatus?: string;
  } | null>(null);

  React.useEffect(() => {
    const saved = localStorage.getItem('katalyst_sheets_webhook');
    if (saved) setWebhookInput(saved);
  }, []);

  const syncMutation = useMutation({
    mutationFn: async () => {
      if (webhookInput) {
        localStorage.setItem('katalyst_sheets_webhook', webhookInput);
      }
      const res = await api.post('/integrations/google-sheets/sync', {
        webhookUrl: webhookInput || undefined,
      });
      return res.data;
    },
    onSuccess: (res) => {
      setSyncStatus(res.data);
    },
  });

  const handleDownloadCsv = () => {
    window.open(`${api.defaults.baseURL}/leads/export/csv`, '_blank');
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 border border-indigo-500/20 shadow-md space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 shadow-md">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Google Sheets & Spreadsheet Sync Engine
              </h3>
              <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                Active & Verified
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 max-w-lg leading-relaxed">
              Synchronize event attendee leads, attribution sources, and student registration passes directly with spreadsheets or Google Sheets webhooks in real time.
            </p>
            {syncStatus && (
              <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  Successfully synchronized <strong>{syncStatus.syncedLeadsCount} records</strong> at{' '}
                  {new Date(syncStatus.syncedAt).toLocaleTimeString()}
                </span>
                {syncStatus.webhookStatus && syncStatus.webhookStatus !== 'NOT_CONFIGURED' && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[10px] text-emerald-300 border border-emerald-500/30">
                    {syncStatus.webhookStatus}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => syncMutation.mutate()}
            disabled={syncMutation.isPending}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                syncMutation.isPending ? 'animate-spin' : ''
              }`}
            />
            <span>{syncMutation.isPending ? 'Syncing...' : 'Sync Google Sheets'}</span>
          </button>

          <button
            onClick={handleDownloadCsv}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-all flex items-center gap-1.5"
            title="Download CSV formatted for Google Sheets and Microsoft Excel"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>

          <button
            onClick={() => setShowConfig(!showConfig)}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/15 text-xs transition-colors"
            title="Configure Custom Google Sheets Webhook"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Webhook Configuration Dropdown */}
      {showConfig && (
        <div className="pt-3 border-t border-white/10 text-xs space-y-2 animate-in fade-in duration-200">
          <label className="block font-bold text-slate-300">
            Custom Google Apps Script / Webhook Endpoint (Optional):
          </label>
          <div className="flex items-center gap-2">
            <input
              type="url"
              placeholder="https://script.google.com/macros/s/.../exec"
              value={webhookInput}
              onChange={(e) => setWebhookInput(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-emerald-500"
            />
            <button
              onClick={() => syncMutation.mutate()}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl"
            >
              Save &amp; Test Webhook
            </button>
          </div>
          <p className="text-[10px] text-slate-400">
            If provided, clicking 'Sync Google Sheets' will immediately send JSON rows of all student leads directly into your Google Apps Script endpoint to auto-insert rows into your live Google Sheet.
          </p>
        </div>
      )}
    </div>
  );
}
