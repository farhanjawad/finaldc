'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';

const POSTER_IMAGE_MAP: Record<string, string> = {
  'dawah-seminar': '/images/ss.jpg',
  'gono-iftar-2026': '/images/gi.jpg',
  'seerat-conference-2024': '/images/seraath.jpg',
};

export default function PastEventsGrid() {
  const { dict } = useLanguage();

  return (
    <section className="w-full py-16 bg-slate-50 dark:bg-slate-950/60 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {dict.home.pastEvents.heading}
          </h2>
          <div className="mt-2 w-12 h-1 bg-emerald-600 mx-auto rounded-full" />
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dict.home.pastEvents.items.map((event) => (
            <div
              key={event.id}
              className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
            >
              {/* Event Poster Card Aspect Area */}
              <div className="relative aspect-4/3 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: `url('${POSTER_IMAGE_MAP[event.id] || '/images/event-placeholder.jpg'}')`,
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-60" />
              </div>

              {/* Event Text Info */}
              <div className="p-6 flex flex-col grow text-center">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {event.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed grow">
                  {event.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="mt-12 text-center">
          <Link
            href="/events/deener-pothe-nobinder-shathe-2"
            className="inline-flex items-center justify-center px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-full shadow-xs transition-colors"
          >
            {dict.home.pastEvents.viewMore}
          </Link>
        </div>
      </div>
    </section>
  );
}