'use client';

import React, { useState } from 'react';
import { trackRegistration, TrackResult } from '@/app/actions/track';
import { useLanguage } from '@/app/context/LanguageContext';
import {
  Search,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  Printer,
  QrCode,
  AlertCircle
} from 'lucide-react';

export default function TrackPage() {
  const { language } = useLanguage();
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<TrackResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const res = await trackRegistration(searchInput);
      if (res.success) {
        setResult(res.data);
      } else {
        setErrorMsg(res.error);
      }
    } catch (err: any) {
      setErrorMsg(
        language === 'bn'
          ? 'সার্ভার সংযোগে ত্রুটি হয়েছে।'
          : 'Failed to connect to the server.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: TrackResult['payment_status'], isCheckedIn: boolean) => {
    if (isCheckedIn) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-300/30">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {language === 'bn' ? 'উপস্থিত (Checked-In)' : 'Checked-In'}
        </span>
      );
    }

    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {language === 'bn' ? 'অনুমোদিত (Approved)' : 'Approved'}
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300/30">
            <XCircle className="w-3.5 h-3.5" />
            {language === 'bn' ? 'বাতিলকৃত (Rejected)' : 'Rejected'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300/30">
            <Clock className="w-3.5 h-3.5" />
            {language === 'bn' ? 'যাচাই প্রক্রিয়াধীন (Pending)' : 'Pending Verification'}
          </span>
        );
    }
  };

  return (
    <main className="min-h-screen py-10 md:py-16 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {language === 'bn' ? 'রেজিস্ট্রেশন ও পাস ট্র্যাকিং' : 'Track Registration & Pass'}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {language === 'bn'
              ? 'আপনার রেজিস্ট্রেশন কোড অথবা স্টুডেন্ট আইডি দিয়ে স্ট্যাটাস যাচাই করুন।'
              : 'Enter your registration code or student ID to check status.'}
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={language === 'bn' ? 'রেজিস্ট্রেশন কোড বা স্টুডেন্ট আইডি...' : 'e.g. KU-32CBB5 or 261815'}
              className="w-full px-4 py-3.5 pl-11 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              required
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5" />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{language === 'bn' ? 'খোঁজা হচ্ছে...' : 'Searching...'}</span>
                </>
              ) : (
                <span>{language === 'bn' ? 'যাচাই করুন' : 'Verify'}</span>
              )}
            </button>
          </div>
        </form>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-4 mb-6 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-rose-700 dark:text-rose-300 font-medium">
              {errorMsg}
            </p>
          </div>
        )}

        {/* Result Card */}
        {result && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden print:shadow-none print:border-none">

            {/* Top Bar / Status */}
            <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase block mb-1">
                  {language === 'bn' ? 'ট্র্যাকিং কোড' : 'Registration Code'}
                </span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 tracking-wider font-mono">
                  {result.reg_code}
                </span>
              </div>
              <div>{getStatusBadge(result.payment_status, result.checked_in)}</div>
            </div>

            {/* Attendee Details Grid */}
            <div className="p-6 sm:p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">
                    {language === 'bn' ? 'নাম' : 'Name'}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {result.full_name}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">
                    {language === 'bn' ? 'স্টুডেন্ট আইডি' : 'Student ID'}
                  </span>
                  <span className="text-sm sm:text-base font-bold font-mono text-slate-900 dark:text-white">
                    {result.student_id}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">
                    {language === 'bn' ? 'ডিসিপ্লিন' : 'Discipline'}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {result.discipline || '29'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">
                    {language === 'bn' ? 'ফি পরিমাণ' : 'Fee Amount'}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {result.fee_amount ? `${result.fee_amount} ৳` : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Status Specific Message & Actions */}
              {result.payment_status === 'pending' && (
                <div className="mt-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-xs sm:text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                  {language === 'bn'
                    ? 'আপনার পেমেন্ট ভেরিফিকেশন এখনও সম্পন্ন হয়নি। ভেরিফিকেশন সম্পন্ন হলে আপনার ডিজিটাল পাসটি প্রদর্শিত হবে।'
                    : 'Your payment verification is in progress. The official pass will be unlocked once approved by the administrators.'}
                </div>
              )}

              {result.payment_status === 'approved' && (
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <QrCode className="w-5 h-5" />
                    <span>{language === 'bn' ? 'ইভেন্ট ভেন্যু পাস সক্রিয়' : 'Official Entry Pass Active'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900 text-white text-xs font-bold transition shadow"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{language === 'bn' ? 'পাস প্রিন্ট করুন' : 'Print Pass'}</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </main>
  );
}