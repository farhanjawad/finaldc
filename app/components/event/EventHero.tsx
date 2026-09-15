'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import { Calendar, MapPin } from 'lucide-react';

export default function EventHero() {
  const { dict } = useLanguage();

  return (
    <section className="relative w-full py-16 md:py-24 bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Subtle Background Backdrop */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay"
        style={{ backgroundImage: `url('/images/hero-campus.jpg')` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-radial from-transparent to-slate-950/80" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
        {/* Info Badges (Date & Venue) */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 backdrop-blur-xs">
            <Calendar className="w-3.5 h-3.5" />
            {dict.eventDetails.dateBadge}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-700/60 text-slate-200 border border-slate-600/50 backdrop-blur-xs">
            <MapPin className="w-3.5 h-3.5" />
            {dict.eventDetails.venueBadge}
          </span>
        </div>

        {/* Seminar Main Title */}
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          {dict.eventDetails.title}
        </h1>

        {/* Subtitle / Hook */}
        <p className="mt-5 max-w-2xl text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed">
          {dict.eventDetails.subtitle}
        </p>

        {/* Register CTA Button */}
        <div className="mt-8">
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-8 py-3 text-sm sm:text-base font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-full shadow-lg shadow-amber-400/25 transition-all duration-200"
          >
            {dict.eventDetails.registerBtn}
          </Link>
        </div>
      </div>
    </section>
  );
}