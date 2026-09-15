'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import { Clock } from 'lucide-react';

export default function EventSchedule() {
  const { dict } = useLanguage();

  return (
    <section className="w-full py-16 bg-slate-50 dark:bg-slate-950/60 transition-colors">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {dict.eventDetails.scheduleHeading}
          </h2>
          <div className="mt-2 w-12 h-1 bg-emerald-600 mx-auto rounded-full" />
        </div>

        {/* Schedule Item List */}
        <div className="space-y-4">
          {dict.eventDetails.scheduleItems.map((item, index) => (
            <div
              key={index}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-4 transition-all duration-200 hover:border-emerald-500/40"
            >
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                <Clock className="w-5 h-5" />
              </div>

              <div className="flex-grow">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  {item.time}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Action Button */}
        <div className="mt-12 text-center">
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-8 py-3 text-sm sm:text-base font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-full shadow-md shadow-amber-400/25 transition-all duration-200"
          >
            {dict.eventDetails.bottomCta}
          </Link>
        </div>
      </div>
    </section>
  );
}