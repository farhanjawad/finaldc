'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';

export default function HeroBanner() {
  const { dict } = useLanguage();

  return (
    <section className="relative w-full min-h-130 md:min-h-145 flex items-center justify-center text-center overflow-hidden bg-slate-900">
      {/* Background Graphic & Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000"
        style={{
          backgroundImage: `url('/images/ku.jpg')`,
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-linear-to-b from-slate-950/80 via-slate-900/70 to-slate-950" />

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-16 flex flex-col items-center">
        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight drop-shadow-md">
          {dict.home.hero.title}
        </h1>

        {/* Quranic Ayah Box */}
        <div className="mt-8 mb-8 max-w-2xl px-4">
          <p className="font-serif text-xl sm:text-2xl md:text-3xl text-emerald-300 font-medium leading-relaxed tracking-wide drop-shadow-sm">
            &ldquo;{dict.home.hero.ayahArabic}&rdquo;
          </p>
          <p className="mt-3 text-sm sm:text-base md:text-lg text-slate-200 font-medium">
            {dict.home.hero.ayahTranslation}
          </p>
          <span className="inline-block mt-1 text-xs sm:text-sm text-slate-400 font-mono">
            {dict.home.hero.ayahReference}
          </span>
        </div>

        {/* Call to Action Button */}
        <div className="mt-2">
          <Link
            href="/events/deener-pothe-nobinder-shathe-2"
            className="inline-flex items-center justify-center px-7 py-3 text-sm font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-full shadow-lg shadow-amber-400/20 transition-all duration-200"
          >
            {dict.home.hero.ctaButton}
          </Link>
        </div>
      </div>
    </section>
  );
}