import React from 'react';
import GateScannerView from '@/app/components/admin/GateScannerView';
import { QrCode } from 'lucide-react';
export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'গেট চেক-ইন স্ক্যানার | KU Deeni Admin',
  description: 'ইভেন্ট গেটে অংশগ্রহণকারীদের QR কোড যাচাই এবং ডিজিটাল হাজিরা গ্রহণ পোর্টাল',
};

export default function AdminScanPage() {
  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
            <QrCode className="w-4 h-4" />
            <span>গেট ভেরিফিকেশন ও এন্ট্রি কন্ট্রোল</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            উপস্থিতি ও পাস স্ক্যানার
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            ক্যামেরা দিয়ে অংশগ্রহণকারীর ইভেন্ট পাস স্ক্যান করুন অথবা কোড দিয়ে ম্যানুয়ালি যাচাই করুন।
          </p>
        </div>
      </div>

      {/* Camera & Lookup Engine */}
      <GateScannerView />
    </div>
  );
}