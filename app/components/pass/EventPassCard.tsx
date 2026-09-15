'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { RegistrationRecord } from '../../lib/types';
import { Printer, CheckCircle2, ShieldCheck, MapPin, Calendar } from 'lucide-react';

interface EventPassCardProps {
  registration: RegistrationRecord;
}

export default function EventPassCard({ registration }: EventPassCardProps) {
  const handlePrint = () => {
    window.print();
  };

  // QR code encodes the verification endpoint URL for gate check-in volunteers
  const qrValue = `${typeof window !== 'undefined' ? window.location.origin : ''}/verify/${registration.reg_code}`;

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center">
      {/* Printable Ticket Pass Container */}
      <div 
        id="printable-pass"
        className="w-full bg-white dark:bg-slate-900 border-2 border-emerald-600/30 rounded-3xl overflow-hidden shadow-2xl transition-all print:border-slate-800 print:shadow-none print:text-black print:bg-white"
      >
        {/* Pass Header Banner */}
        <div className="bg-linear-to-r from-emerald-800 to-emerald-700 text-white p-6 text-center relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-xs mb-2 text-emerald-100">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>অফিসিয়াল ইভেন্ট পাস / Official Pass</span>
          </div>
          <h2 className="text-xl font-black tracking-tight">
            দ্বীনের পথে, নবীনদের সাথে ২.০
          </h2>
          <p className="text-xs text-emerald-100 mt-1">
            খুলনা বিশ্ববিদ্যালয় দ্বীনি কমিউনিটি
          </p>

          {/* Decorative Notch Punch-outs */}
          <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-slate-50 dark:bg-slate-950 rounded-full print:hidden" />
          <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-slate-50 dark:bg-slate-950 rounded-full print:hidden" />
        </div>

        {/* Pass Body */}
        <div className="p-6 space-y-6">
          
          {/* QR Code Section */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 print:bg-white print:border-slate-300">
            <div className="p-3 bg-white rounded-xl shadow-xs">
              <QRCodeSVG
                value={qrValue}
                size={160}
                level="H"
                includeMargin={false}
              />
            </div>
            <div className="mt-3 text-center">
              <p className="text-xs font-mono uppercase tracking-widest text-slate-400">
                Tracking Code
              </p>
              <p className="text-xl font-mono font-black text-slate-900 dark:text-white mt-0.5">
                {registration.reg_code}
              </p>
            </div>
          </div>

          {/* Participant Credentials */}
          <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <p className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                অংশগ্রহণকারী / Name
              </p>
              <p className="font-bold text-slate-800 dark:text-white mt-0.5 truncate">
                {registration.full_name}
              </p>
            </div>

            <div>
              <p className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                স্টুডেন্ট আইডি / Student ID
              </p>
              <p className="font-mono font-bold text-slate-800 dark:text-white mt-0.5">
                {registration.student_id}
              </p>
            </div>

            <div>
              <p className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                ডিসিপ্লিন / Discipline
              </p>
              <p className="font-medium text-slate-700 dark:text-slate-200 mt-0.5 truncate">
                {registration.discipline}
              </p>
            </div>

            <div>
              <p className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                ব্যাচ / Batch
              </p>
              <p className="font-mono font-medium text-slate-700 dark:text-slate-200 mt-0.5">
                Batch {registration.batch_year || 'N/A'}
              </p>
            </div>
          </div>

          {/* Event Details Footer Bar */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              ১২ সেপ্টেম্বর, ২:০০ PM
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              কেন্দ্রীয় মসজিদ, খুবি
            </span>
          </div>

          {/* Verified Badge Indicator */}
          <div className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold text-xs border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>পেমেন্ট ভেরিফাইড (প্রবেশের জন্য প্রযোজ্য)</span>
          </div>

        </div>
      </div>

      {/* Print Action Trigger (Hidden in Print View) */}
      <button
        onClick={handlePrint}
        type="button"
        className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 font-bold text-xs sm:text-sm shadow-lg transition-all print:hidden"
      >
        <Printer className="w-4 h-4" />
        <span>ইভেন্ট পাস প্রিন্ট / ডাউনলোড করুন</span>
      </button>
    </div>
  );
}