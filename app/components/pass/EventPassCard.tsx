'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { trackRegistration } from '@/app/actions/track';
import { RegistrationRecord } from '@/app/lib/types';
import EventTicket from '@/app/components/pass/EventTicket';
import PendingStatusCard from '../pass/PendingStatusCard';
import { 
  Search, 
  Loader2, 
  AlertCircle, 
  Ticket, 
  User, 
  Hash, 
  GraduationCap, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';

interface TrackStatusViewProps {
  initialCode?: string;
  dict?: any;
}

export default function TrackStatusView({ initialCode = '', dict }: TrackStatusViewProps) {
  const [code, setCode] = useState(initialCode);
  const [record, setRecord] = useState<RegistrationRecord | any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleLookup = (lookupCode: string) => {
    const cleanCode = lookupCode.trim();
    if (!cleanCode) return;

    setErrorMessage(null);
    setRecord(null);

    startTransition(async () => {
      const res = await trackRegistration(cleanCode);
      if (res.success && res.data) {
        setRecord(res.data);
      } else {
        setErrorMessage(res.error || 'রেজিস্ট্রেশন তথ্য পাওয়া যায়নি। অনুগ্রহ করে কোডটি পুনরায় যাচাই করুন।');
      }
    });
  };

  useEffect(() => {
    if (initialCode) {
      handleLookup(initialCode);
    }
  }, [initialCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLookup(code);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Search Input Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              রেজিস্ট্রেশন ট্র্যাকিং ও পাস
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              আপনার ট্র্যাকিং কোড বা স্টুডেন্ট আইডি দিয়ে স্ট্যাটাস যাচাই করুন
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="উদাঃ KU-26-XXXX অথবা স্টুডেন্ট আইডি"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={isPending || !code.trim()}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900 text-white text-xs sm:text-sm font-bold transition disabled:opacity-50 flex items-center gap-2 shrink-0 cursor-pointer"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'যাচাই করুন'}
          </button>
        </form>

        {errorMessage && (
          <div className="mt-4 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Dynamic Results Display */}
      {record && (
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  রেজিস্ট্রেশন নম্বর
                </span>
                <span className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {record.reg_code}
                </span>
              </div>

              {/* Status Badge */}
              <div>
                {record.payment_status === 'approved' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    অনুমোদিত (পাস সক্রিয়)
                  </span>
                ) : record.payment_status === 'rejected' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300">
                    <XCircle className="w-3.5 h-3.5" />
                    বাতিল করা হয়েছে
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300">
                    <Clock className="w-3.5 h-3.5" />
                    যাচাই প্রক্রিয়াধীন (বকেয়া)
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm mt-5">
              <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-semibold truncate">{record.full_name}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                <Hash className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-mono">{record.student_id}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                <span>ডিসিপ্লিন: {record.discipline || '29'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                <DollarSign className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {record.fee_amount || 0} ৳
                </span>
              </div>
            </div>
          </div>

          {/* Conditional Ticket or Pending View */}
          {record.payment_status === 'approved' ? (
            <EventTicket attendee={record} dict={dict} />
          ) : (
            <PendingStatusCard attendee={record} dict={dict} />
          )}
        </div>
      )}
    </div>
  );
}