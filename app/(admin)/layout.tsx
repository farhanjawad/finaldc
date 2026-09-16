import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/app/actions/auth';
import AdminSidebar from '../components/admin/AdminSidebar';

export const metadata = {
  title: 'অ্যাডমিন ড্যাশবোর্ড|',
  description: 'ইভেন্ট ম্যানেজমেন্ট এবং অংশগ্রহণকারী তথ্য নিয়ন্ত্রণ পোর্টাল',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side session verification
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect('/login?from=/admin');
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col md:flex-row">
      {/* Persistent Navigation Sidebar */}
      <AdminSidebar admin={admin} />

      {/* Main Administrative Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              ম্যানেজমেন্ট পোর্টাল
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              v2.0
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs font-medium text-slate-600 dark:text-slate-300">
              অপারেটর: <strong className="text-slate-900 dark:text-white">{admin.username}</strong>
            </span>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}