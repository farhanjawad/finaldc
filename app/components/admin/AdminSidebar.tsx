'use client';

import React, { useTransition } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logoutAdmin } from '@/app/actions/auth';
import { AdminUser } from '@/app/lib/types';
import { 
  LayoutDashboard, 
  Users, 
  QrCode, 
  LogOut, 
  ShieldCheck, 
  UserCheck, 
  ExternalLink,
  Loader2
} from 'lucide-react';

interface AdminSidebarProps {
  admin: AdminUser;
  isOpen?: boolean;
  onClose?: () => void;
}

const NAV_ITEMS = [
  {
    label: 'ড্যাশবোর্ড / Overview',
    href: '/admin',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: 'নিবন্ধন তালিকা / Registrations',
    href: '/admin/registrations',
    icon: Users,
    exact: false,
  },
  {
    label: 'গেট ভেরিফিকেশন / Gate Scanner',
    href: '/admin/scan',
    icon: QrCode,
    exact: false,
  },
];

export default function AdminSidebar({ admin, isOpen = true, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAdmin();
      router.push('/login');
      router.refresh();
    });
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && onClose && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs md:hidden" 
          aria-hidden="true" 
        />
      )}

      {/* Sidebar Navigation Panel */}
      <aside className={`fixed md:sticky top-0 left-0 z-50 h-screen w-72 bg-slate-900 text-white flex flex-col justify-between border-r border-slate-800 transition-transform duration-300 md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Top: Branding & Admin Profile */}
        <div>
          {/* Platform Identity */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-sm font-black tracking-tight text-white leading-tight">
                  KU Deeni Admin
                </h2>
                <p className="text-[11px] text-slate-400">
                  ইভেন্ট ম্যানেজমেন্ট পোর্টাল
                </p>
              </div>
            </div>
          </div>

          {/* Logged-in User Profile Card */}
          <div className="mx-4 mt-4 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs uppercase">
              {admin.username.slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {admin.username}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  admin.role === 'super_admin'
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                    : 'bg-indigo-400/20 text-indigo-300 border border-indigo-400/30'
                }`}>
                  {admin.role === 'super_admin' ? 'Super Admin' : 'Volunteer'}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 px-4 space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = item.exact 
                ? pathname === item.href 
                : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom: External Site Link & Logout Action */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>মূল সাইটে যান (Public Site)</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold transition disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>লগআউট হচ্ছে...</span>
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                <span>লগআউট (Sign Out)</span>
              </>
            )}
          </button>
        </div>

      </aside>
    </>
  );
}