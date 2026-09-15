import React, { Suspense } from 'react';
import TrackStatusView from '../../components/track/TrackStatusView';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: 'রেজিস্ট্রেশন স্ট্যাটাস ট্র্যাক | KU Deeni Community',
  description: 'খুলনা বিশ্ববিদ্যালয় দ্বীনি কমিউনিটি ইভেন্ট রেজিস্ট্রেশনের অবস্থা ও ইভেন্ট পাস চেক করুন।',
};

function TrackFallback() {
  return (
    <div className="w-full flex items-center justify-center py-16 text-slate-400">
      <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mr-2" />
      <span className="text-sm">লোড হচ্ছে...</span>
    </div>
  );
}

export default function TrackPage() {
  return (
    <main className="min-h-screen py-12 md:py-20 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Header */}
        <div className="text-center mb-10 print:hidden">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300/30 mb-3">
            স্ট্যাটাস যাচাই
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            রেজিস্ট্রেশন স্ট্যাটাস ও ইভেন্ট পাস
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            আপনার রেজিস্ট্রেশন কোড বা স্টুডেন্ট আইডি দিয়ে পেমেন্ট অনুমোদন পরীক্ষা করুন এবং পাস সংগ্রহ করুন।
          </p>
        </div>

        {/* Dynamic Client View wrapped in Suspense */}
        <Suspense fallback={<TrackFallback />}>
          <TrackStatusView />
        </Suspense>

      </div>
    </main>
  );
}