import React from 'react';
import { DashboardStats } from '@/app/actions/admin';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  UserCheck, 
  BadgeDollarSign 
} from 'lucide-react';

interface StatsOverviewProps {
  stats: DashboardStats;
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  const checkInRate = stats.approvedCount > 0 
    ? Math.round((stats.checkedInCount / stats.approvedCount) * 100) 
    : 0;

  const statCards = [
    {
      title: 'মোট আবেদন',
      value: stats.totalRegistrations,
      icon: Users,
      color: 'text-slate-700 dark:text-slate-200',
      bgColor: 'bg-slate-100 dark:bg-slate-800',
      borderColor: 'border-slate-200 dark:border-slate-800',
      subtitle: 'সর্বমোট নিবন্ধিত শিক্ষার্থী',
    },
    {
      title: 'অনুমোদিত পাস',
      value: stats.approvedCount,
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
      borderColor: 'border-emerald-200/50 dark:border-emerald-900/50',
      subtitle: 'পেমেন্ট ভেরিফাইড ও সক্রিয়',
    },
    {
      title: 'অপেক্ষমাণ পেমেন্ট',
      value: stats.pendingCount,
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40',
      borderColor: 'border-amber-200/50 dark:border-amber-900/50',
      subtitle: 'যাচাইয়ের অপেক্ষায় রয়েছে',
    },
    {
      title: 'বাতিলকৃত আবেদন',
      value: stats.rejectedCount,
      icon: XCircle,
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950/40',
      borderColor: 'border-rose-200/50 dark:border-rose-900/50',
      subtitle: 'পেমেন্ট অসঙ্গতি বা বাতিল',
    },
    {
      title: 'গেট চেক-ইন (উপস্থিতি)',
      value: `${stats.checkedInCount} (${checkInRate}%)`,
      icon: UserCheck,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/40',
      borderColor: 'border-indigo-200/50 dark:border-indigo-900/50',
      subtitle: 'অনুমোদিতদের মাঝে উপস্থিত',
    },
    {
      title: 'মোট সংগৃহীত ফান্ড',
      value: `${stats.totalCollectedBdt.toLocaleString()} ৳`,
      icon: BadgeDollarSign,
      color: 'text-teal-600 dark:text-teal-400',
      bgColor: 'bg-teal-50 dark:bg-teal-950/40',
      borderColor: 'border-teal-200/50 dark:border-teal-900/50',
      subtitle: 'অনুমোদিত ফি এর যোগফল',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
      {statCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border ${card.borderColor} shadow-xs flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {card.title}
              </span>
              <div className={`p-1.5 rounded-lg ${card.bgColor} ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3">
              <div className={`text-xl sm:text-2xl font-black tracking-tight ${card.color}`}>
                {card.value}
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 mt-1 truncate">
                {card.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}