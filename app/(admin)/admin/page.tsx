import React from 'react';
import Link from 'next/link';
import { getDashboardStats, getRegistrations } from '@/app/actions/admin';
import DashboardMetrics from '@/app/components/admin/DashboardMetrics';
import { 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Users, 
  QrCode,
  AlertCircle 
} from 'lucide-react';
export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'ড্যাশবোর্ড ওভারভিউ | KU Deeni Admin',
};

export default async function AdminDashboardOverviewPage() {
  const [statsRes, recentRes] = await Promise.all([
    getDashboardStats(),
    getRegistrations({ limit: 6 }),
  ]);

  const stats = statsRes.success && statsRes.data ? statsRes.data : {
    totalRegistrations: 0,
    approvedCount: 0,
    pendingCount: 0,
    rejectedCount: 0,
    checkedInCount: 0,
    totalCollectedBdt: 0,
  };

  const recentRegistrations = recentRes.success && recentRes.data ? recentRes.data.data : [];

  return (
    <div className="space-y-8">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            অ্যাডমিন ড্যাশবোর্ড
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            ইভেন্ট রেজিস্ট্রেশন এবং গেট ভেরিফিকেশনের সামগ্রিক পরিসংখ্যান।
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/scan"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>গেট স্ক্যানার খুলুন</span>
          </Link>
          <Link
            href="/admin/registrations"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-750 transition-all"
          >
            <Users className="w-4 h-4" />
            <span>সকল নিবন্ধন</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <DashboardMetrics stats={stats} />

      {/* Recent Activity / Pending Submissions */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              সাম্প্রতিক নিবন্ধনসমূহ
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              সর্বশেষ জমা হওয়া আবেদন ও লেনদেন
            </p>
          </div>
          <Link
            href="/admin/registrations"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <span>সবগুলো দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentRegistrations.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs">
            এখনও কোনো রেজিস্ট্রেশন জমা পড়েনি।
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentRegistrations.map((item) => (
              <div
                key={item.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 first:pt-0 last:pb-0"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {item.full_name}
                    </span>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {item.reg_code}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span>{item.student_id}</span>
                    <span>•</span>
                    <span>{item.discipline}</span>
                    <span>•</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {item.fee_amount} ৳ ({item.payment_method})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {item.payment_status === 'approved' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300/30">
                      <CheckCircle2 className="w-3 h-3" />
                      অনুমোদিত
                    </span>
                  )}
                  {item.payment_status === 'pending' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300/30">
                      <Clock className="w-3 h-3" />
                      অপেক্ষমাণ
                    </span>
                  )}
                  {item.payment_status === 'rejected' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-300/30">
                      <AlertCircle className="w-3 h-3" />
                      বাতিল
                    </span>
                  )}

                  <Link
                    href={`/admin/registrations?search=${item.reg_code}`}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="ম্যানেজ করুন"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}