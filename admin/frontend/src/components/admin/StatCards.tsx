'use client';

import React from 'react';
import { Calendar, Users, TrendingUp, Building2 } from 'lucide-react';

interface StatCardsProps {
  analytics?: {
    totalEvents: number;
    totalLeads: number;
    uniqueCollegesCount: number;
    funnel: {
      registered: number;
      started: number;
      completed: number;
      accepted: number;
      startedPercentage: number;
      completionPercentage: number;
    };
  };
  data?: any;
  isLoading: boolean;
}

export default function StatCards({ analytics, data, isLoading }: StatCardsProps) {
  const stats = analytics || data;

  const cards = [
    {
      title: 'Total Outreach Events',
      value: isLoading ? '...' : stats?.totalEvents ?? 0,
      subtext: stats?.totalEvents ? 'Active college drives' : 'No events created yet',
      icon: Calendar,
      bgColor: 'bg-sky-50',
      iconColor: 'text-sky-600',
      borderColor: 'border-sky-100',
    },
    {
      title: 'Total Student Leads',
      value: isLoading ? '...' : stats?.totalLeads ?? 0,
      subtext: stats?.totalLeads ? 'Real-time Supabase sync' : 'Awaiting student registrations',
      icon: Users,
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      borderColor: 'border-indigo-100',
    },
    {
      title: 'Funnel Completion Rate',
      value: isLoading ? '...' : `${stats?.funnel?.completionPercentage ?? 0}%`,
      subtext: `${stats?.funnel?.completed ?? 0} completed applications`,
      icon: TrendingUp,
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-100',
    },
    {
      title: 'Partner Institutions',
      value: isLoading ? '...' : stats?.uniqueCollegesCount ?? 0,
      subtext: 'Colleges represented',
      icon: Building2,
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      borderColor: 'border-amber-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500">
                {card.title}
              </span>
              <div
                className={`w-9 h-9 rounded-xl ${card.bgColor} ${card.iconColor} flex items-center justify-center shadow-sm`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {card.value}
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              {card.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
}
