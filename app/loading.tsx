import React from 'react';
import Image from 'next/image';

export default function GlobalLoading() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-16 bg-slate-50/50 dark:bg-slate-950/50 transition-colors">
      <div className="flex flex-col items-center text-center space-y-5">
        
        {/* Animated Brand Emblem Container */}
        <div className="relative flex items-center justify-center">
          {/* Subtle Outer Glowing Ripple */}
          <div className="absolute w-20 h-20 rounded-full bg-emerald-500/20 dark:bg-emerald-400/10 animate-ping" />
          
          {/* Rotating Subtle Accent Border */}
          <div className="absolute w-20 h-20 rounded-2xl border-2 border-dashed border-emerald-500/40 dark:border-emerald-400/30 animate-[spin_8s_linear_infinite]" />

          {/* Logo Badge */}
          <div className="relative w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex items-center justify-center p-2.5 z-10">
            <Image
              src="/images/logo.png"
              alt="KU Deeni Community Logo"
              width={48}
              height={48}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Loading Indicator & Status Text */}
        <div className="space-y-1.5">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-mono">
            লোড হচ্ছে...
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            খুলনা বিশ্ববিদ্যালয় দ্বীনি কমিউনিটি
          </p>
        </div>

      </div>
    </div>
  );
}