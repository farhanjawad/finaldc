'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CheckCircle2, Sparkles } from 'lucide-react';

export default function EventDescription() {
  const { dict } = useLanguage();

  return (
    <section className="w-full py-12 md:py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {dict.eventDetails.aboutHeading}
          </h2>
          <div className="mt-2 w-12 h-1 bg-emerald-600 rounded-full" />
        </div>

        {/* Narrative Paragraphs */}
        <div className="space-y-4 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          <p className="font-semibold text-emerald-700 dark:text-emerald-400">
            {dict.eventDetails.audienceNote}
          </p>
          {dict.eventDetails.descriptionParagraphs.map((paragraph, index) => (
            <p key={index}>
              {paragraph}
            </p>
          ))}
        </div>

        {/* Fee Rules & Batch Eligibility Callout Box */}
        <div className="mt-10 p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 shadow-xs">
          <div className="flex items-center gap-2 mb-4 text-emerald-800 dark:text-emerald-300 font-bold text-base">
            <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>রেজিস্ট্রেশন ফি সংক্রান্ত নির্দেশনা</span>
          </div>

          <ul className="space-y-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
              <span>{dict.eventDetails.batch26Highlight}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
              <span>{dict.eventDetails.batch25Highlight}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-slate-500 dark:text-slate-400 mt-0.5 shrink-0" />
              <span>{dict.eventDetails.generalFeeNote}</span>
            </li>
          </ul>
        </div>

      </div>
    </section>
  );
}