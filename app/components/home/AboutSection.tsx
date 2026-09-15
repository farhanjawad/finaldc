'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function AboutSection() {
  const { dict } = useLanguage();

  return (
    <section id="about" className="w-full py-16 md:py-24 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 items-center">

          {/* Left Column: Campus / Monument Visual */}
          <div className="md:col-span-5 relative">
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                style={{
                  backgroundImage: `url('/images/m3.jpg')`,
                }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
            </div>
            {/* Decorative subtle backdrop accent */}
            <div className="absolute -bottom-4 -right-4 -z-10 w-full h-full rounded-2xl border-2 border-emerald-500/20 dark:border-emerald-400/20" />
          </div>

          {/* Right Column: Narrative Copy */}
          <div className="md:col-span-7 flex flex-col justify-center text-left">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="h-1 w-8 bg-emerald-600 rounded-full" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {dict.home.about.heading}
              </h2>
            </div>

            <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              <p>
                {dict.home.about.p1}
              </p>
              <p>
                {dict.home.about.p2}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}