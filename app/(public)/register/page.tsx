import React from 'react';
import Link from 'next/link';

export default function RegistrationClosedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
        {/* Status Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-8 w-8"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        </div>

        {/* Bengali Headings & Notice */}
        <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-rose-700 bg-rose-100 rounded-full mb-3">
          বিজ্ঞপ্তি
        </span>

        <h1 className="text-2xl font-bold text-slate-900 mb-3">
          নিবন্ধন কার্যক্রম সমাপ্ত হয়েছে
        </h1>

        <div className="mb-6 rounded-2xl border border-rose-100 bg-linear-to-br from-rose-50 to-orange-50 p-4 text-sm leading-relaxed text-slate-700 shadow-sm">
          <p className="font-medium text-slate-800">
            ইভেন্টের জন্য নির্ধারিত নিবন্ধনের সময়সীমা শেষ হয়ে গেছে।
          </p>
          <p className="mt-2">
            আপনার আগ্রহের জন্য ধন্যবাদ। তবে প্রোগ্রামটি সকলের জন্য উন্মুক্ত।
            আপনি প্রোগ্রাম এর সময়সূচি অনুযায়ী সেন্ট্রাল মসজিদে চলে আসুন।
          </p>
        </div>

        {/* Back to Home Button */}
        <Link
          href="/"
          className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}