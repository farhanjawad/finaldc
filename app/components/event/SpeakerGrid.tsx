'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const SPEAKER_IMAGES = [
  '/images/speakers/speaker-1.jpg',
  '/images/speakers/speaker-2.jpg',
];

export default function SpeakerGrid() {
  const { dict } = useLanguage();

  return (
    <section className="w-full py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {dict.eventDetails.speakersHeading}
          </h2>
          <div className="mt-2 w-12 h-1 bg-emerald-600 mx-auto rounded-full" />
        </div>

        {/* 2-Column Speaker Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {dict.eventDetails.speakers.map((speaker, index) => (
            <div
              key={index}
              className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col items-center text-center group hover:shadow-md transition-shadow duration-300"
            >
              {/* Speaker Avatar / Photo */}
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white dark:border-slate-700 shadow-sm mb-4 bg-slate-200 dark:bg-slate-700">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: `url('${SPEAKER_IMAGES[index] || '/images/avatar-placeholder.jpg'}')`,
                  }}
                />
              </div>

              {/* Speaker Name & Role */}
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {speaker.name}
              </h3>
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-1">
                {speaker.designation}
              </p>

              {/* Speaker Bio */}
              <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex-grow">
                {speaker.bio}
              </p>

              {/* Profile / Learn More Button */}
              <div className="mt-5">
                <button
                  type="button"
                  className="px-5 py-2 text-xs font-semibold rounded-full bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors"
                >
                  {speaker.profileBtn}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}