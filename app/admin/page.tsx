import React from 'react';
import Link from 'next/link';
import { getDashboardStats } from '@/app/actions/admin';
import StatsOverview from '@/app/components/admin/StatsOverview';
import { 
  Users, 
  QrCode, 
  ArrowRight, 
  Sparkles, 
  CalendarCheck,
  ShieldCheck
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const statsRes = await getDashboardStats();
  
  const defaultStats = {
    totalRegistrations: 0,
    approvedCount: 0,
    pendingCount: 0,
    rejectedCount: 0,
    checkedInCount: 0,
    totalCollectedBdt: 0,
  };

  const stats = statsRes.success && statsRes.data ? statsRes.data : defaultStats;

  return (
    <div className="space-y-8">
      {/* Top Welcome & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              অ্যাডমিনিস্ট্রেশন প্যানেল
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            ইভেন্ট সারাংশ ও নিয়ন্ত্রণ কেন্দ্র
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            খুলনা বিশ্ববিদ্যালয় দ্বীনি কমিউনিটি • ইভেন্ট কন্ট্রোল
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/scan"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
          >
            <QrCode className="w-4 h-4" />
            <span>গেট স্ক্যানার খুলুন</span>
          </Link>
        </div>
      </div>

      {/* Metrics & Statistics Grid */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          রিয়েল-টাইম মেট্রিক্স (Live Metrics)
        </h2>
        <StatsOverview stats={stats} />
      </section>

      {/* Operational Quick Action Modules */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Registration Table Management Banner */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              নিবন্ধন পরিচালনা ও পেমেন্ট অনুমোদন
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              শিক্ষার্থীদের আবেদন ব্রাউজ করুন, bKash/Nagad ট্রানজ্যাকশন আইডি যাচাই করে অনুমোদন বা বাতিল করুন এবং এক্সেল ফ্রেন্ডলি CSV শিট ডাউনলোড করুন।
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              অপেক্ষমাণ: <strong className="text-amber-600 dark:text-amber-400">{stats.pendingCount}</strong> টি
            </span>
            <Link
              href="/admin/registrations"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <span>তালিকায় যান</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Gate Scanner Banner */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              ভলান্টিয়ার গেট চেকিং (QR Code & ID)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              প্রোগ্রামের দিন প্রবেশদ্বারে শিক্ষার্থীদের ডিজিটাল টিকিটের কিউআর কোড স্ক্যান করুন অথবা স্টুডেন্ট রোল টাইপ করে দ্রুত চেক-ইন সম্পন্ন করুন।
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              উপস্থিত: <strong className="text-indigo-600 dark:text-indigo-400">{stats.checkedInCount}</strong> জন
            </span>
            <Link
              href="/admin/scan"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <span>স্ক্যান শুরু করুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* System & Audit Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              ডাটাবেস ও নিরাপত্তা সমন্বয়
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Neon PostgreSQL সার্ভারলেস কানেকশন সক্রিয় এবং এসকিউএল ইনজেকশন সুরক্ষিত।
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
          <CalendarCheck className="w-4 h-4" />
          <span>লাইভ ট্র্যাকিং</span>
        </div>
      </div>
    </div>
  );
}