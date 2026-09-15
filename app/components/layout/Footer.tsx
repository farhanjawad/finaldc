'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';

export default function Footer() {
  const { dict } = useLanguage();

  return (
    <footer className="w-full bg-slate-900 text-slate-400 py-10 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        {/* Navigation Quick Links */}
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <Link href="/" className="hover:text-emerald-400 transition-colors">
            {dict.nav.home}
          </Link>
          <Link href="/#about" className="hover:text-emerald-400 transition-colors">
            {dict.nav.about}
          </Link>
          <Link
            href="/events/deener-pothe-nobinder-shathe-2"
            className="hover:text-emerald-400 transition-colors"
          >
            {dict.nav.events}
          </Link>
          <Link href="/track" className="hover:text-emerald-400 transition-colors">
            {dict.nav.track}
          </Link>
          <Link href="/login" className="hover:text-emerald-400 transition-colors">
            {dict.nav.login}
          </Link>
        </div>

        {/* Copyright Notice */}
        <p className="text-xs text-slate-400">
          {dict.footer.rights}
        </p>
      </div>
    </footer>
  );
}