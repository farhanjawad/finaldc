'use client';

import React from 'react';
import { TrackResult } from '@/app/actions/track';
import { useLanguage } from '../../context/LanguageContext';
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Printer, 
  QrCode, 
  User, 
  Hash, 
  GraduationCap, 
  Receipt,
  CreditCard,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface TrackStatusViewProps {
  data: TrackResult;
}

export default function TrackStatusView({ data }: TrackStatusViewProps) {
  const { language } = useLanguage();

  const isBn = language === 'bn';

  const renderStatusBadge = () => {
    if (data.checked_in) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-300/40">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {isBn ? 'উপস্থিত (Checked-In)' : 'Checked-In'}
        </span>
      );
    }

    switch (data.payment_status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {isBn ? 'অনুমোদিত (Approved)' : 'Approved'}
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300/40">
            <XCircle className="w-3.5 h-3.5" />
            {isBn ? 'বাতিলকৃত (Rejected)' : 'Rejected'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300/40">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            {isBn ? 'যাচাই প্রক্রিয়াধীন (Pending)' : 'Pending Verification'}
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden print:shadow-none print:border-none">
      {/* Top Banner Header */}
      <div className="p-6 sm:p-8 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
            {isBn ? 'ট্র্যাকিং কোড' : 'Tracking Code'}
          </span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-wider">
            {data.reg_code}
          </span>
        </div>
        <div>{renderStatusBadge()}</div>
      </div>

      {/* Details Grid */}
      <div className="p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Full Name */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 flex items-start gap-3">
            <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                {isBn ? 'অংশগ্রহণকারীর নাম' : 'Attendee Name'}
              </p>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {data.full_name}
              </p>
            </div>
          </div>

          {/* Student ID */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 flex items-start gap-3">
            <Hash className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                {isBn ? 'স্টুডেন্ট আইডি' : 'Student ID'}
              </p>
              <p className="text-sm font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                {data.student_id}
              </p>
            </div>
          </div>

          {/* Discipline */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 flex items-start gap-3">
            <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                {isBn ? 'ডিসিপ্লিন' : 'Discipline'}
              </p>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {data.discipline || '29'}
              </p>
            </div>
          </div>

          {/* Fee & Payment Method */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 flex items-start gap-3">
            <Receipt className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                {isBn ? 'নিবন্ধন ফি' : 'Registration Fee'}
              </p>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {data.fee_amount ? `${data.fee_amount} ৳` : 'N/A'}
                {data.payment_method && (
                  <span className="ml-2 text-xs font-normal text-slate-500">
                    ({data.payment_method})
                  </span>
                )}
              </p>
            </div>
          </div>

        </div>

        {/* Dynamic Contextual Notices */}
        {data.payment_status === 'pending' && (
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 leading-relaxed space-y-1">
              <p className="font-bold">
                {isBn ? 'পেমেন্ট যাচাইকরণ প্রক্রিয়াধীন' : 'Payment Verification In Progress'}
              </p>
              <p className="text-xs text-amber-700/90 dark:text-amber-400/90">
                {isBn
                  ? 'আপনার প্রদত্ত ট্রানজেকশন আইডি বা অ্যাম্বাসেডর তথ্য অ্যাডমিন প্যানেল থেকে যাচাই করা হচ্ছে। অনুমোদন সম্পন্ন হলে এই পৃষ্ঠাতেই আপনার প্রবেশ পাসটি প্রদর্শিত হবে।'
                  : 'Your transaction details are currently being verified by the team. Once verified, your entry pass with QR code will appear here.'}
              </p>
            </div>
          </div>
        )}

        {data.payment_status === 'rejected' && (
          <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 flex items-start gap-3">
            <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-rose-800 dark:text-rose-300 leading-relaxed space-y-1">
              <p className="font-bold">
                {isBn ? 'পেমেন্ট অনুমোদন বাতিল করা হয়েছে' : 'Registration Payment Rejected'}
              </p>
              <p className="text-xs text-rose-700/90 dark:text-rose-400/90">
                {isBn
                  ? 'আপনার দেওয়া ট্রানজেকশন বা পেমেন্ট তথ্যে অসঙ্গতি পাওয়া গিয়েছে। সমস্যা সমাধানে অনুগ্রহ করে ইভেন্ট হেল্পডেস্ক বা অ্যাম্বাসেডরের সাথে যোগাযোগ করুন।'
                  : 'An issue was encountered while verifying your transaction. Please get in touch with the event organizers or your ambassador for assistance.'}
              </p>
            </div>
          </div>
        )}

        {data.payment_status === 'approved' && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <span>
                {isBn ? 'ইভেন্ট ভেন্যু প্রবেশাধিকার সক্রিয়' : 'Event Entry Access Authorized'}
              </span>
            </div>
            
            <button
              type="button"
              onClick={() => window.print()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900 text-white text-xs font-bold transition shadow"
            >
              <Printer className="w-4 h-4" />
              <span>{isBn ? 'পাস প্রিন্ট করুন' : 'Print Pass'}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}