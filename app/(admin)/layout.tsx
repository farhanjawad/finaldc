import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentAdmin, logoutAdmin } from '@/app/actions/auth';
import { 
  ShieldCheck, 
  QrCode, 
  Users, 
  LogOut, 
  LayoutDashboard,
  ExternalLink
} from 'lucide-react';

// Force dynamic server-side rendering for all admin sub-routes
export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();

  // If unauthenticated, redirect to the login screen
  if (!admin) {
    redirect('/login');
  }

  const isSuperAdmin = admin.role === 'super_admin';

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0 flex flex-col justify-between">
        <div>
          {/* Header & Role Indicator */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                  KU Deeni Admin
                </h2>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50 inline-block mt-1">
                  {admin.role.replace('_', ' ')}
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 truncate">
              User: <span className="font-semibold text-slate-700 dark:text-slate-300">@{admin.username}</span>
            </p>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1">
            {isSuperAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Dashboard & Records</span>
              </Link>
            )}

            <Link
              href="/admin/scan"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <QrCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Gate Check-In</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-850 transition"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Visit Public Site</span>
            </Link>
          </nav>
        </div>

        {/* Logout Section */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-900 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Admin View Content */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}