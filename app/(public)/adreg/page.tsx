import React from 'react';
import RegistrationForm from '../../components/register/RegistrationForm';

export const metadata = {
  title: 'রেজিস্ট্রেশন | KU Deeni Community',
  description: 'খুলনা বিশ্ববিদ্যালয় ইসলামিক সেমিনারে অংশগ্রহণের জন্য রেজিস্ট্রেশন সম্পন্ন করুন।',
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen py-12 md:py-20 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300/30 mb-3">
            দ্বীনের পথে, নবীনদের সাথে ২.০
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            ইভেন্ট রেজিস্ট্রেশন ফরম
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            সঠিক তথ্য প্রদান করে আপনার আসনটি নিশ্চিত করুন।
          </p>
        </div>

        {/* Multi-Step Interactive Form */}
        <RegistrationForm />
      </div>
    </main>
  );
}