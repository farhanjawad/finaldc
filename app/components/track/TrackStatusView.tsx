'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { getRegistrationStatus } from '../../actions/track';
import { RegistrationRecord } from '../../lib/types';
import EventPassCard from '../../components/pass/EventPassCard';
import { 
  Search, 
  Loader2, 
  Clock, 
  XCircle, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export default function TrackStatusView() {
  const { dict } = useLanguage();
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code') || '';

  const [query, setQuery] = useState(initialCode);
  const [isPending, startTransition] = useTransition();
  const [record, setRecord] = useState<RegistrationRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-search if `code` query parameter exists in the URL
  useEffect(() => {
    if (initialCode) {
      handleSearch(initialCode);
    }
  }, [initialCode]);

  const handleSearch = (searchVal: string) => {
    const clean = searchVal.trim();
    if (!clean) return;

    setErrorMessage(null);
    startTransition(async () => {
      const res = await getRegistrationStatus(clean);
      if (res.success && res.data) {
        setRecord(res.data);
      } else {
        setRecord(null);
        setErrorMessage(res.error || 'কোনো তথ্য পাওয়া যায়নি।');
      }
    });
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {/* Search Bar Input */}
      <form onSubmit={onFormSubmit} className="relative print:hidden">
        <div className="flex items-center gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={dict.track.searchPlaceholder}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm shadow-xs"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 shrink-0"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">খোঁজা হচ্ছে...</span>
              </>
            ) : (
              <span>{dict.track.checkStatusBtn}</span>
            )}
          </button>
        </div>
      </form>

      {/* Error / Not Found Alert */}
      {errorMessage && (
        <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-3 text-rose-700 dark:text-rose-300 text-sm print:hidden">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
          <div>
            <p className="font-bold">রেজিস্ট্রেশন পাওয়া যায়নি</p>
            <p className="mt-0.5 text-xs text-rose-600 dark:text-rose-400">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Record State Display */}
      {record && (
        <div className="space-y-6">
          {/* Status 1: PENDING */}
          {record.payment_status === 'pending' && (
            <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center mx-auto text-amber-700 dark:text-amber-300">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-lg font-black text-amber-900 dark:text-amber-200">
                পেমেন্ট ভেরিফিকেশন প্রক্রিয়াধীন
              </h3>
              <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300/80 max-w-md mx-auto leading-relaxed">
                আপনার প্রদত্ত পেমেন্ট তথ্যটি (TrxID: {record.transaction_id || 'Cash'}) আমাদের সুপার অ্যাডমিন টিম যাচাই করছে। যাচাই সম্পন্ন হলে আপনার ইভেন্ট পাসটি এখানে প্রদর্শিত হবে।
              </p>

              <div className="pt-3 border-t border-amber-200 dark:border-amber-800 text-xs font-mono text-amber-800 dark:text-amber-300">
                Registration Code: <span className="font-bold">{record.reg_code}</span>
              </div>
            </div>
          )}

          {/* Status 2: REJECTED */}
          {record.payment_status === 'rejected' && (
            <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/60 flex items-center justify-center mx-auto text-rose-700 dark:text-rose-300">
                <XCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-rose-900 dark:text-rose-200">
                পেমেন্ট অনুমোদন বাতিল হয়েছে
              </h3>
              <p className="text-xs sm:text-sm text-rose-800 dark:text-rose-300/80 max-w-md mx-auto leading-relaxed">
                আপনার প্রদত্ত লেনদেনের বিবরণে অসংগতি পাওয়ায় ভেরিফিকেশন বাতিল করা হয়েছে। সহায়তার জন্য অনুগ্রহ করে দ্বীনি কমিউনিটি হেল্পডেস্কে যোগাযোগ করুন।
              </p>
            </div>
          )}

          {/* Status 3: APPROVED */}
          {record.payment_status === 'approved' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-medium print:hidden">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>পেমেন্ট অনুমোদিত হয়েছে! নিচে আপনার অফিসিয়াল ইভেন্ট পাস সংযুক্ত করা হলো।</span>
              </div>

              {/* Verified Pass Card Component */}
              <EventPassCard registration={record} />
            </div>
          )}
        </div>
      )}

      {/* Default Informational Tip when no search query has been performed */}
      {!record && !errorMessage && (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
          <HelpCircle className="w-5 h-5 mx-auto text-slate-400" />
          <p>রেজিস্ট্রেশনের পর প্রাপ্ত ট্র্যাকিং কোড (যেমন: KU-XXXXXX) অথবা আপনার স্টুডেন্ট আইডি দিয়ে স্ট্যাটাস ও ইভেন্ট পাস চেক করুন।</p>
        </div>
      )}
    </div>
  );
}