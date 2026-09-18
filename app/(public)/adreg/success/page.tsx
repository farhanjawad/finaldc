'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../../context/LanguageContext';
import { CheckCircle2, Copy, Check, ArrowRight, Clock } from 'lucide-react';

interface SuccessPageProps {
  searchParams: Promise<{
    code?: string;
    name?: string;
  }>;
}

export default function RegistrationSuccessPage({ searchParams }: SuccessPageProps) {
  const { dict } = useLanguage();
  const params = use(searchParams);
  
  const regCode = params.code || 'KU-PENDING';
  const attendeeName = params.name ? decodeURIComponent(params.name) : 'অংশগ্রহণকারী';

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const trackingUrl = `${window.location.origin}/track?code=${regCode}`;
    await navigator.clipboard.writeText(trackingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <main className="min-h-screen py-16 md:py-24 bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl text-center">
        
        {/* Animated Check Icon */}
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        {/* Greeting & Notice */}
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          {dict.success.greeting.replace('{name}', attendeeName)}
        </h1>
        <p className="mt-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
          {dict.success.heading}
        </p>
        <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {dict.success.message}
        </p>

        {/* Registration Tracking Code Card */}
        <div className="mt-8 p-5 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700/80">
          <p className="text-xs uppercase font-bold tracking-wider text-slate-400">
            {dict.success.regCodeLabel}
          </p>
          <p className="mt-1 text-2xl sm:text-3xl font-mono font-black text-slate-900 dark:text-white tracking-widest">
            {regCode}
          </p>

          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2">
            <button
              onClick={handleCopy}
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{dict.success.copiedText}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{dict.success.copyLinkBtn}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Informational Guidance */}
        <div className="mt-6 flex items-start gap-2.5 text-left text-xs text-slate-500 dark:text-slate-400 bg-amber-50/50 dark:bg-amber-950/20 p-3.5 rounded-xl border border-amber-200/40 dark:border-amber-800/40">
          <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <span>{dict.success.instructionNote}</span>
        </div>

        {/* Action Link to Status Checking */}
        <div className="mt-8">
          <Link
            href={`/track?code=${regCode}`}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all"
          >
            <span>{dict.success.visitTrackPageBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </main>
  );
}