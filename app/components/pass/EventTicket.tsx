'use client';

import React from 'react';
import { RegistrationRecord } from '@/app/lib/types';
import QrCodeRenderer from '../pass/QrCodeRenderer';
import { 
  Printer, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  User, 
  Hash, 
  GraduationCap, 
  Clock 
} from 'lucide-react';

interface EventTicketProps {
  attendee: RegistrationRecord | any;
  dict?: any;
}

export default function EventTicket({ attendee }: EventTicketProps) {
  const trackingUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/track/${attendee.reg_code}`
    : `https://kudeen.vercel.app/track/${attendee.reg_code}`;

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex justify-between items-center print:hidden">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">অফিসিয়াল ইভেন্ট পাস প্রস্তুত</span>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <Printer className="w-4 h-4" />
          <span>পাস প্রিন্ট / ডাউনলোড</span>
        </button>
      </div>

      {/* Printable Event Pass Card */}
      <div className="relative bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg print:border-2 print:border-slate-800 print:shadow-none print:m-0 print:w-full print:rounded-2xl">
        {/* Top Decorative Header */}
        <div className="bg-emerald-600 dark:bg-emerald-700 px-6 py-6 text-white relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span className="text-[10px] tracking-widest uppercase font-bold text-emerald-200 block">
                Official Entry Pass
              </span>
              <h2 className="text-lg sm:text-xl font-black">দ্বীনের পথে, নবীনদের সাথে ২.০</h2>
              <p className="text-xs text-emerald-100">খুলনা বিশ্ববিদ্যালয় দ্বীনি কমিউনিটি</p>
            </div>
            <div className="text-left sm:text-right mt-2 sm:mt-0">
              <span className="text-[10px] uppercase font-bold text-emerald-200 block">গেট পাস নম্বর</span>
              <span className="font-mono text-base sm:text-lg font-black bg-emerald-700/80 dark:bg-emerald-800/80 px-2.5 py-1 rounded-lg">
                {attendee.reg_code}
              </span>
            </div>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Left Details Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  অংশগ্রহণকারীর নাম
                </span>
                <p className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mt-0.5">
                  <User className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">{attendee.full_name}</span>
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  স্টুডেন্ট আইডি
                </span>
                <p className="text-sm sm:text-base font-bold font-mono text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mt-0.5">
                  <Hash className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{attendee.student_id}</span>
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  ডিসিপ্লিন
                </span>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mt-0.5">
                  <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>ডিসিপ্লিন: {attendee.discipline || '29'}</span>
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  ভেরিফিকেশন স্ট্যাটাস
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  পেমেন্ট অনুমোদিত
                </span>
              </div>
            </div>

            {/* Event Logistics Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span>তারিখ: নির্ধারিত তারিখে</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>সময়: সকাল ৯:০০ টা</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>স্থান: খুলনা বিশ্ববিদ্যালয় ক্যাম্পাস</span>
              </div>
            </div>
          </div>

          {/* Right QR Column */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 rounded-2xl">
            <div className="bg-white p-2.5 rounded-xl shadow-xs border border-slate-200">
              <QrCodeRenderer value={trackingUrl} size={135} />
            </div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-2">
              স্ক্যান করে প্রবেশ করুন
            </span>
          </div>
        </div>

        {/* Perforation Separation Strip */}
        <div className="relative border-t-2 border-dashed border-slate-200 dark:border-slate-800 px-6 py-3 bg-slate-50/50 dark:bg-slate-950/30 flex items-center justify-between text-[11px] text-slate-400">
          <span>অনুগ্রহ করে প্রবেশের সময় টিকিট প্রদর্শন করুন</span>
          <span className="font-mono text-[10px]">{attendee.reg_code}</span>
        </div>
      </div>
    </div>
  );
}