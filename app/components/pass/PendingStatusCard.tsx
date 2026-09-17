'use client';

import React, { useState } from 'react';
import { RegistrationRecord } from '@/app/lib/types';
import { 
  Clock, 
  Copy, 
  Check, 
  AlertCircle, 
  HelpCircle, 
  CreditCard, 
  UserCheck, 
  PhoneCall, 
  Calendar 
} from 'lucide-react';

interface PendingStatusCardProps {
  attendee: RegistrationRecord | any;
  dict?: any;
}

export default function PendingStatusCard({ attendee, dict }: PendingStatusCardProps) {
  const [copied, setCopied] = useState(false);

  const trackingUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/track/${attendee.reg_code}`
    : `/track/${attendee.reg_code}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isRejected = attendee.payment_status === 'rejected';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Status Header */}
      <div className="text-center space-y-3">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto ${
            isRejected
              ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
              : 'bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
          }`}
        >
          {isRejected ? <AlertCircle className="w-7 h-7" /> : <Clock className="w-7 h-7" />}
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {isRejected ? 'রেজিস্ট্রেশন বা পেমেন্ট বাতিল করা হয়েছে' : 'পেমেন্ট ভেরিফিকেশন প্রক্রিয়াধীন রয়েছে'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            {isRejected
              ? 'আপনার প্রদত্ত পেমেন্ট তথ্যে অসঙ্গতি পাওয়া গেছে। বিস্তারিত জানতে অ্যাডমিনের সাথে যোগাযোগ করুন।'
              : 'অ্যাডমিন প্যানেল থেকে আপনার ট্রানজেকশন যাচাই সম্পন্ন হলেই অফিসিয়াল প্রবেশ পাস ও কিউআর কোড আনলক হবে।'}
          </p>
        </div>
      </div>

      {/* Tracking Link Box */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-300 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-center sm:text-left overflow-hidden w-full">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            সরাসরি ট্র্যাকিং লিংক
          </span>
          <p className="font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300 truncate">
            {trackingUrl}
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'কপি হয়েছে' : 'লিংক কপি'}</span>
        </button>
      </div>

      {/* Submitted Payment Summary */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3 text-xs sm:text-sm">
        <div className="flex justify-between items-center text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700/60 pb-2">
          <span className="flex items-center gap-1.5 text-slate-400">
            <CreditCard className="w-4 h-4" /> মাধ্যম:
          </span>
          <span className="font-semibold uppercase text-slate-800 dark:text-slate-100">
            {attendee.payment_method === 'ambassador' ? 'অ্যাম্বাসেডর' : attendee.payment_method}
          </span>
        </div>

        <div className="flex justify-between items-center text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700/60 pb-2">
          <span className="flex items-center gap-1.5 text-slate-400">
            {attendee.payment_method === 'ambassador' ? (
              <UserCheck className="w-4 h-4" />
            ) : (
              <CreditCard className="w-4 h-4" />
            )}
            {attendee.payment_method === 'ambassador' ? 'অ্যাম্বাসেডরের নাম:' : 'ট্রানজেকশন আইডি (TrxID):'}
          </span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
            {attendee.payment_method === 'ambassador'
              ? attendee.ambassador_name || 'N/A'
              : attendee.transaction_id || 'N/A'}
          </span>
        </div>

        {attendee.created_at && (
          <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Calendar className="w-4 h-4" /> আবেদনের সময়:
            </span>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {new Date(attendee.created_at).toLocaleDateString('bn-BD', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        )}
      </div>

      {/* Support Instructions */}
      <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-xs space-y-1.5">
        <div className="flex items-center gap-2 font-bold">
          <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>পেমেন্ট যাচাইকরণ সংক্রান্ত তথ্য:</span>
        </div>
        <p className="leading-relaxed text-amber-800 dark:text-amber-300 pl-6">
          সাধারণত আবেদনের কয়েক ঘণ্টার মধ্যে ট্রানজেকশন ভেরিফাই করা হয়। ২৪ ঘণ্টার বেশি সময় অতিক্রম হলে আপনার ট্র্যাকিং কোড 
          <span className="font-mono font-bold mx-1">({attendee.reg_code})</span> সহ হেল্পলাইনে যোগাযোগ করুন।
        </p>
      </div>

      {/* Contact Support Footer */}
      <div className="pt-2 text-center">
        <a
          href="tel:+8801700000000"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>প্রয়োজনে যোগাযোগ করুন: +880 1700-000000</span>
        </a>
      </div>
    </div>
  );
}