import React from 'react';
import GateScanner from '@/app/components/admin/GateScanner';
import { QrCode, ShieldAlert, CheckCircle, Info } from 'lucide-react';

export const metadata = {
  title: 'গেট স্ক্যানার ও প্রবেশ যাচাই | KU Deeni Community',
  description: 'ইভেন্ট গেটে কিউআর কোড স্ক্যান এবং শিক্ষার্থী উপস্থিতি যাচাই',
};

export default function AdminScanPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
              <QrCode className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              গেট কন্ট্রোল ও ভলান্টিয়ার প্যানেল
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            ডিজিটাল পাস স্ক্যানার ও চেক-ইন
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            প্রবেশদ্বারে অংশগ্রহণকারীর কিউআর কোড স্ক্যান করুন অথবা রোল নম্বর দিয়ে যাচাই করুন
          </p>
        </div>
      </div>

      {/* Main Interactive Scanner Component */}
      <GateScanner />

      {/* Volunteer Operational Guidelines */}
      <div className="max-w-2xl mx-auto rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-3">
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>ভলান্টিয়ারদের জন্য নির্দেশনা</span>
        </div>
        <ul className="space-y-2 pl-6 list-disc marker:text-emerald-500">
          <li>
            শিক্ষার্থীর মোবাইল ফোনের স্ক্রিন থেকে কিউআর কোড স্ক্যান করার জন্য ক্যামেরার ব্রাইটনেস ও ফোকাস ঠিক রাখুন।
          </li>
          <li>
            সবুজ চিহ্ন ও এক বীপ শব্দ আসলে প্রবেশ নিশ্চিত করুন।
          </li>
          <li>
            হলুদ সতর্কবার্তা আসলে বুঝবেন শিক্ষার্থী পূর্বে প্রবেশ করেছেন। কোনো সন্দেহ হলে স্টুডেন্ট আইডি কার্ড যাচাই করুন।
          </li>
          <li>
            ক্যামেরা অ্যাক্সেসে সমস্যা হলে ম্যানুয়াল বক্সে সরাসরি শিক্ষার্থীর রেজিস্ট্রেশন কোড (KU-XXXXXX) বা রোল নম্বর লিখে যাচাই বাটনে চাপুন।
          </li>
        </ul>
      </div>
    </div>
  );
}