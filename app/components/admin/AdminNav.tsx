'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  QrCode, 
  LogOut, 
  ExternalLink 
} from 'lucide-react';
import { logoutAdmin } from '@/app/actions/auth';

export default function AdminNav() {
  const pathname = usePathname();

  const navLinks = [
    {
      name: 'ড্যাশবোর্ড',
      href: '/admin',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: 'রেজিস্ট্রেশন তালিকা',
      href: '/admin/registrations',
      icon: Users,
      exact: false,
    },
    {
      name: 'গেট স্ক্যানার',
      href: '/admin/scan',
      icon: QrCode,
      exact: false,
    },
  ];

  const isLinkActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await logoutAdmin();
    window.location.href = '/login';
  };

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hidden md:flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <Link href="/admin" className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
              Event Management
            </span>
            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
              KU Control Panel
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 text-sm font-semibold">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isLinkActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                  active
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <span>মূল সাইট দেখুন</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition text-left cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>লগআউট</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Navigation Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
        <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
          KU Admin
        </span>
        <div className="flex items-center gap-1.5 text-xs font-bold">
          {navLinks.map((item) => {
            const active = isLinkActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg transition ${
                  active
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </header>
    </>
  );
}