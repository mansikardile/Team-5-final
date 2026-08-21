'use client';

import React from 'react';
import { ArrowRight, UserCheck, PlayCircle, CheckCircle2, AlertCircle } from 'lucide-react';

interface FunnelVisualizerProps {
  funnel?: {
    registered: number;
    started: number;
    completed: number;
    accepted: number;
    rejected: number;
    startedPercentage: number;
    completionPercentage: number;
  };
  totalLeads: number;
}

export default function FunnelVisualizer({
  funnel,
  totalLeads,
}: FunnelVisualizerProps) {
  const registeredCount = funnel?.registered ?? 0;
  const startedCount = funnel?.started ?? 0;
  const completedCount = (funnel?.completed ?? 0) + (funnel?.accepted ?? 0);

  const stages = [
    {
      title: '1. Registered Lead',
      description: 'Expressed interest at event',
      count: registeredCount,
      percent: totalLeads > 0 ? 100 : 0,
      icon: UserCheck,
      color: 'bg-sky-500',
      textColor: 'text-sky-700',
      badgeBg: 'bg-sky-50 border-sky-200',
    },
    {
      title: '2. Application Started',
      description: 'Opened & initiated form',
      count: startedCount,
      percent: funnel?.startedPercentage ?? 0,
      icon: PlayCircle,
      color: 'bg-amber-500',
      textColor: 'text-amber-700',
      badgeBg: 'bg-amber-50 border-amber-200',
    },
    {
      title: '3. Application Completed',
      description: 'Submitted full documentation',
      count: completedCount,
      percent: funnel?.completionPercentage ?? 0,
      icon: CheckCircle2,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      badgeBg: 'bg-emerald-50 border-emerald-200',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Conversion Funnel
          </h2>
          <p className="text-xs text-slate-500">
            Real-time pipeline: Registered &rarr; Started &rarr; Completed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
            Total Leads: {totalLeads}
          </span>
        </div>
      </div>

      {totalLeads === 0 ? (
        <div className="py-8 text-center bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
          <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No Lead Funnel Data Yet</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Create an outreach event and share the registration link to see live student conversions through each funnel stage.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Progress Bar Header */}
          <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex gap-1 p-0.5">
            <div
              style={{ width: `${Math.max(15, 100 - (funnel?.startedPercentage || 0))}%` }}
              className="bg-sky-400 rounded-full transition-all duration-500"
              title="Registered"
            />
            <div
              style={{ width: `${Math.max(10, (funnel?.startedPercentage || 0) - (funnel?.completionPercentage || 0))}%` }}
              className="bg-amber-400 rounded-full transition-all duration-500"
              title="Started"
            />
            <div
              style={{ width: `${Math.max(10, funnel?.completionPercentage || 0)}%` }}
              className="bg-emerald-500 rounded-full transition-all duration-500"
              title="Completed"
            />
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stages.map((stage, i) => {
              const Icon = stage.icon;
              return (
                <div
                  key={i}
                  className={`p-4 rounded-xl border ${stage.badgeBg} flex flex-col justify-between transition-all`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${stage.textColor}`} />
                      <span className={`text-xs font-bold ${stage.textColor}`}>
                        {stage.title}
                      </span>
                    </div>
                    <span className="text-xs font-extrabold text-slate-800">
                      {stage.percent}%
                    </span>
                  </div>

                  <div>
                    <div className="text-2xl font-black text-slate-900 mb-1">
                      {stage.count}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {stage.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
