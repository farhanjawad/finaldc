import React from 'react';
import Link from 'next/link';
import { Compass, Home, Search, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'পৃষ্ঠাটি পাওয়া যায়নি ',
  description: 'কাঙ্ক্ষিত ওয়েব ঠিকানা বা পাতাটি খুঁজে পাওয়া যায়নি।',
};

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="w-full max-w-lg text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xl">
        
        {/* Decorative Badge Icon */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center mx-auto mb-6 shadow-xs">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>

        {/* Status Numbers & Heading */}
        <span className="text-xs font-mono font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          Error 404
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">
          পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
          আপনি যে ঠিকানাটি খুঁজছেন তা মুছে ফেলা হয়েছে অথবা লিংকটি পরিবর্তিত হয়েছে।
        </p>

        {/* Quick Recovery Navigation Links */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>হোমপেজে যান</span>
          </Link>

          <Link
            href="/track"
            className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all"
          >
            <Search className="w-4 h-4" />
            <span>স্ট্যাটাস ট্র্যাক করুন</span>
          </Link>
        </div>

        {/* Secondary Help Link */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <span>ইভেন্টে নতুন নিবন্ধন করতে চান?</span>
          <Link
            href="/register"
            className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
          >
            <span>রেজিস্ট্রেশন করুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </main>
  );
}