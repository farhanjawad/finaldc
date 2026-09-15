'use client';

import React from 'react';
import { DashboardStats } from '@/app/actions/admin';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  UserCheck, 
  Banknote 
} from 'lucide-react';

interface DashboardMetricsProps {
  stats: DashboardStats;
}

export default function DashboardMetrics({ stats }: DashboardMetricsProps) {
  const cards = [
    {
      title: 'মোট আবেদন / Total Registrations',
      value: stats.totalRegistrations,
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900',
    },
    {
      title: 'অনুমোদনের অপেক্ষায় / Pending',
      value: stats.pendingCount,
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900',
    },
    {
      title: 'অনুমোদিত / Approved',
      value: stats.approvedCount,
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900',
    },
    {
      title: 'উপস্থিতি / Checked In',
      value: stats.checkedInCount,
      icon: UserCheck,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-900',
    },
    {
      title: 'মোট সংগৃহীত ফি / Revenue',
      value: `${stats.totalCollectedBdt.toLocaleString()} ৳`,
      icon: Banknote,
      color: 'text-teal-600 dark:text-teal-400',
      bg: 'bg-teal-50 dark:bg-teal-950/50 border-teal-200 dark:border-teal-900',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`p-5 rounded-2xl border ${card.bg} flex flex-col justify-between transition-all duration-200`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl bg-white/80 dark:bg-slate-900/80 shadow-xs ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {card.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}