import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/app/actions/auth';
import AdminNav from '@/app/components/admin/AdminNav';

export const metadata = {
  title: 'এডমিন ড্যাশবোর্ড | KU Deeni Community',
  description: 'খুলনা বিশ্ববিদ্যালয় ইভেন্ট ম্যানেজমেন্ট এবং গেট কন্ট্রোল প্যানেল',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enforce server-side authentication check
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row">
      {/* Shared Navigation Sidebar & Mobile Header */}
      <AdminNav />

      {/* Main Administrative Content Viewport */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}