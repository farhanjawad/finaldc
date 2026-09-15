'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';

export default function FeaturedEventBanner() {
  const { dict } = useLanguage();

  return (
    <section className="w-full py-16 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Seminar Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {dict.home.featured.title}
        </h2>

        {/* Seminar Subtext / Date Announcement */}
        <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {dict.home.featured.dateNote}
        </p>

        {/* Call to Action: Link to Dedicated Seminar Page */}
        <div className="mt-8">
          <Link
            href="/events/deener-pothe-nobinder-shathe-2"
            className="inline-flex items-center justify-center px-8 py-3 text-sm font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-full shadow-md shadow-amber-400/20 transition-all duration-200"
          >
            {dict.home.featured.detailsBtn}
          </Link>
        </div>
      </div>
    </section>
  );
}