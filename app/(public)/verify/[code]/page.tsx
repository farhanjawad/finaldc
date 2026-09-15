import React from 'react';
import Link from 'next/link';
import { sql } from '../../../db';
import { RegistrationRecord } from '../../../lib/types';
import { CheckCircle2, XCircle, AlertTriangle, UserCheck, ArrowLeft, Clock } from 'lucide-react';
import { revalidatePath } from 'next/cache';

interface VerifyPageProps {
  params: Promise<{
    code: string;
  }>;
}

export const metadata = {
  title: 'গেট ভেরিফিকেশন ও চেক-ইন | KU Deeni Community',
  description: 'ইভেন্ট ভলান্টিয়ার গেট চেক-ইন পোর্টাল',
};

export default async function GateVerifyPage({ params }: VerifyPageProps) {
  const { code } = await params;
  const cleanCode = code.trim().toUpperCase();

  const rows = await sql`
    SELECT *
    FROM registrations
    WHERE UPPER(reg_code) = ${cleanCode}
    LIMIT 1;
  `;

  const registration = (rows[0] as RegistrationRecord) || null;

  async function handleCheckIn() {
    'use server';
    await sql`
      UPDATE registrations
      SET checked_in = TRUE,
          checked_in_at = NOW(),
          updated_at = NOW()
      WHERE UPPER(reg_code) = ${cleanCode};
    `;
    revalidatePath(`/verify/${cleanCode}`);
  }

  return (
    <main className="min-h-screen py-12 px-4 bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center">
        
        {/* State 1: Invalid / Not Found */}
        {!registration && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-950/60 rounded-full flex items-center justify-center mx-auto text-rose-600 dark:text-rose-400">
              <XCircle className="w-10 h-10" />
            </div>
            <h1 className="text-xl font-black text-rose-600 dark:text-rose-400">
              অবৈধ পাস / Invalid Pass
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              কোড: <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{cleanCode}</span> দিয়ে কোনো নিবন্ধনের তথ্য পাওয়া যায়নি।
            </p>
          </div>
        )}

        {/* State 2: Found Registration */}
        {registration && (
          <div className="space-y-6">
            
            {/* Header Status Indicator */}
            {registration.payment_status === 'approved' ? (
              registration.checked_in ? (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 space-y-1">
                  <AlertTriangle className="w-8 h-8 mx-auto text-amber-600" />
                  <p className="font-black text-base">ইতিমধ্যে প্রবেশ করেছেন</p>
                  <p className="text-xs">
                    চেক-ইন সময়: {registration.checked_in_at ? new Date(registration.checked_in_at).toLocaleTimeString() : 'N/A'}
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 space-y-1">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
                  <p className="font-black text-base">বৈধ পাস / Entry Approved</p>
                  <p className="text-xs">পেমেন্ট ভেরিফায়েড ও প্রবেশের জন্য প্রস্তুত</p>
                </div>
              )
            ) : (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 space-y-1">
                <Clock className="w-8 h-8 mx-auto text-rose-600" />
                <p className="font-black text-base">অননুমোদিত পাস</p>
                <p className="text-xs">পেমেন্ট স্ট্যাটাস: {registration.payment_status.toUpperCase()}</p>
              </div>
            )}

            {/* Attendee Details Card */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="text-slate-400">রেজিস্ট্রেশন কোড:</span>
                <span className="font-mono font-black text-slate-800 dark:text-white">{registration.reg_code}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="text-slate-400">নাম:</span>
                <span className="font-bold text-slate-800 dark:text-white">{registration.full_name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="text-slate-400">স্টুডেন্ট আইডি:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-white">{registration.student_id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="text-slate-400">ডিসিপ্লিন:</span>
                <span className="font-medium text-slate-800 dark:text-white">{registration.discipline}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="text-slate-400">ব্যাচ:</span>
                <span className="font-mono font-medium text-slate-800 dark:text-white">Batch {registration.batch_year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">পরিশোধিত ফি:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{registration.fee_amount} ৳ ({registration.payment_method})</span>
              </div>
            </div>

            {/* Check-In Action Button */}
            {registration.payment_status === 'approved' && !registration.checked_in && (
              <form action={handleCheckIn}>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all"
                >
                  <UserCheck className="w-5 h-5" />
                  <span>প্রবেশ নিশ্চিত করুন (Check-In)</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Back Link */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Link
            href="/track"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ট্র্যাকিং পেজে ফিরে যান</span>
          </Link>
        </div>

      </div>
    </main>
  );
}