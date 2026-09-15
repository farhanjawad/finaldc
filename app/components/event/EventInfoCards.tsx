'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Calendar, Clock, MapPin } from 'lucide-react';

export default function EventInfoCards() {
  const { dict } = useLanguage();

  return (
    <section className="w-full py-10 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Date Card */}
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">তারিখ / Date</p>
              <p className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                {dict.eventDetails.infoCards.date.replace('তারিখ: ', '').replace('Date: ', '')}
              </p>
            </div>
          </div>

          {/* Time Card */}
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">সময় / Time</p>
              <p className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                {dict.eventDetails.infoCards.time.replace('সময়: ', '').replace('Time: ', '')}
              </p>
            </div>
          </div>

          {/* Venue Card */}
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">স্থান / Venue</p>
              <p className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 mt-0.5 leading-snug">
                {dict.eventDetails.infoCards.venue.replace('স্থান: ', '').replace('Venue: ', '')}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}