'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { submitRegistration } from '../../actions/register';
import { calculateRegistrationFee } from '../../lib/fee';
import { 
  KU_DISCIPLINES, 
  RegistrationFormData, 
  PaymentMethod, 
  Gender, 
  DisciplineType 
} from '../../lib/types';
import { 
  User, 
  CreditCard, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Loader2 
} from 'lucide-react';

export default function RegistrationForm() {
  const { dict } = useLanguage();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [formError, setFormError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: '',
    email: '',
    phone: '',
    studentId: '',
    discipline: '',
    gender: '',
    batchYear: '',
    isContinuing26: false,
    feeAmount: 100,
    paymentMethod: '',
    transactionId: '',
    senderNumber: '',
    ambassadorName: '',
  });

  // Recalculate fee whenever studentId or isContinuing26 changes
  const updateStudentIdOrContinuing = (studentId: string, isContinuing: boolean) => {
    const feeInfo = calculateRegistrationFee(studentId, isContinuing);
    setFormData((prev) => ({
      ...prev,
      studentId,
      isContinuing26: isContinuing,
      batchYear: feeInfo.batchYear,
      feeAmount: feeInfo.feeAmount,
    }));
  };

  // Step 1 Validation
  const handleNextStep = () => {
    setFormError(null);
    if (!formData.fullName.trim()) {
      setFormError('অনুগ্রহ করে আপনার নাম প্রদান করুন।');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setFormError('অনুগ্রহ করে সঠিক ইমেইল এড্রেস প্রদান করুন।');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setFormError('অনুগ্রহ করে সঠিক মোবাইল নম্বর প্রদান করুন।');
      return;
    }
    if (!formData.studentId.trim() || formData.studentId.length < 4) {
      setFormError('অনুগ্রহ করে সঠিক স্টুডেন্ট আইডি প্রদান করুন।');
      return;
    }
    if (!formData.discipline) {
      setFormError('অনুগ্রহ করে আপনার ডিসিপ্লিন নির্বাচন করুন।');
      return;
    }
    if (!formData.gender) {
      setFormError('অনুগ্রহ করে আপনার লিঙ্গ নির্বাচন করুন।');
      return;
    }
    setCurrentStep(2);
  };

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.paymentMethod) {
      setFormError('অনুগ্রহ করে পেমেন্ট মাধ্যম নির্বাচন করুন।');
      return;
    }

    if (
      (formData.paymentMethod === 'bkash' || formData.paymentMethod === 'nagad') &&
      (!formData.transactionId?.trim() || !formData.senderNumber?.trim())
    ) {
      setFormError('ট্রানজেকশন আইডি এবং প্রেরকের নম্বর উভয়ই আবশ্যক।');
      return;
    }

    if (formData.paymentMethod === 'ambassador' && !formData.ambassadorName?.trim()) {
      setFormError('অনুগ্রহ করে অ্যাম্বাসেডরের নাম উল্লেখ করুন।');
      return;
    }

    startTransition(async () => {
      const res = await submitRegistration(formData);
      if (res.success && res.data) {
        router.push(`/register/success?code=${res.data.regCode}&name=${encodeURIComponent(res.data.fullName)}`);
      } else {
        setFormError(res.error || dict.form.generalError);
      }
    });
  };

  const isBatch25 = formData.batchYear === '25';

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl">
      {/* Progress Tabs Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6 mb-8">
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center w-9 h-9 rounded-full font-bold text-sm transition-colors ${
            currentStep === 1 
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' 
              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
          }`}>
            <User className="w-4 h-4" />
          </div>
          <span className={`text-sm sm:text-base font-semibold ${
            currentStep === 1 ? 'text-slate-900 dark:text-white' : 'text-slate-400'
          }`}>
            {dict.form.step1Tab}
          </span>
        </div>

        <div className="h-0.5 w-12 bg-slate-200 dark:bg-slate-700" />

        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center w-9 h-9 rounded-full font-bold text-sm transition-colors ${
            currentStep === 2 
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' 
              : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
          }`}>
            <CreditCard className="w-4 h-4" />
          </div>
          <span className={`text-sm sm:text-base font-semibold ${
            currentStep === 2 ? 'text-slate-900 dark:text-white' : 'text-slate-400'
          }`}>
            {dict.form.step2Tab}
          </span>
        </div>
      </div>

      {/* Error Alert Box */}
      {formError && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-3 text-rose-700 dark:text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
          <span>{formError}</span>
        </div>
      )}

      {/* STEP 1: Personal Details */}
      {currentStep === 1 && (
        <div className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              {dict.form.fullName} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder={dict.form.fullNamePlaceholder}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          {/* Email & Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                {dict.form.email} <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder={dict.form.emailPlaceholder}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                {dict.form.phone} <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder={dict.form.phonePlaceholder}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>
          </div>

          {/* Student ID & Batch Identification */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              {dict.form.studentId} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.studentId}
              onChange={(e) => updateStudentIdOrContinuing(e.target.value, formData.isContinuing26)}
              placeholder={dict.form.studentIdPlaceholder}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          {/* Batch 25 Continuing With Batch 26 Conditional Toggle */}
          {isBatch25 && (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
              <label className="block text-xs sm:text-sm font-semibold text-amber-900 dark:text-amber-300 mb-3">
                {dict.form.batch25Question}
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => updateStudentIdOrContinuing(formData.studentId, true)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    formData.isContinuing26
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {dict.form.yes} (ফি ৫০ ৳)
                </button>
                <button
                  type="button"
                  onClick={() => updateStudentIdOrContinuing(formData.studentId, false)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    !formData.isContinuing26
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {dict.form.no} (ফি ১০০ ৳)
                </button>
              </div>
            </div>
          )}

          {/* Discipline Selection (All 29 KU Disciplines) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              {dict.form.discipline} <span className="text-rose-500">*</span>
            </label>
            <select
              required
              value={formData.discipline}
              onChange={(e) => setFormData({ ...formData, discipline: e.target.value as DisciplineType })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            >
              <option value="">{dict.form.disciplineSelectPlaceholder}</option>
              {KU_DISCIPLINES.map((disc) => (
                <option key={disc} value={disc}>
                  {disc}
                </option>
              ))}
            </select>
          </div>

          {/* Gender Radio Options */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              লিঙ্গ / Gender <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, gender: 'male' }))}
                className={`py-3 px-4 rounded-xl text-sm font-semibold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  formData.gender === 'male'
                    ? 'border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>পুরুষ / Male</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, gender: 'female' }))}
                className={`py-3 px-4 rounded-xl text-sm font-semibold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  formData.gender === 'female'
                    ? 'border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>মহিলা / Female</span>
              </button>
            </div>
          </div>

          {/* Fee Indicator Badge */}
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-emerald-900 dark:text-emerald-300">
              {dict.form.feeNoticeLabel}:
            </span>
            <span className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400">
              {formData.feeAmount} ৳
            </span>
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNextStep}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <span>{dict.form.nextToPayment}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: Payment Details */}
      {currentStep === 2 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Fee Summary Banner */}
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between border border-slate-200 dark:border-slate-700">
            <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              পরিশোধযোগ্য ফি:
            </span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {formData.feeAmount} BDT
            </span>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3">
              {dict.form.paymentMethod} <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: 'bkash' })}
                className={`p-4 rounded-xl border text-left transition-all ${
                  formData.paymentMethod === 'bkash' || formData.paymentMethod === 'nagad'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="font-bold text-sm">{dict.form.bkashNagad}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Send Money বা Cash In
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: 'ambassador' })}
                className={`p-4 rounded-xl border text-left transition-all ${
                  formData.paymentMethod === 'ambassador'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="font-bold text-sm">{dict.form.ambassador}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  ক্যাম্পাস অ্যাম্বাসেডরকে নগদ প্রদান
                </div>
              </button>
            </div>
          </div>

          {/* Instructions for bKash/Nagad */}
          {(formData.paymentMethod === 'bkash' || formData.paymentMethod === 'nagad') && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <p className="font-semibold">{dict.form.paymentInstructions}</p>
                <p className="font-mono text-emerald-700 dark:text-emerald-400 font-bold mt-1 text-base">
                  {dict.form.paymentNumbers}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  {dict.form.trxId} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.transactionId}
                  onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                  placeholder={dict.form.trxIdPlaceholder}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  {dict.form.senderNumber} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.senderNumber}
                  onChange={(e) => setFormData({ ...formData, senderNumber: e.target.value })}
                  placeholder={dict.form.senderNumberPlaceholder}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
            </div>
          )}

          {/* Input for Ambassador Name */}
          {formData.paymentMethod === 'ambassador' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                {dict.form.ambassadorName} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.ambassadorName}
                onChange={(e) => setFormData({ ...formData, ambassadorName: e.target.value })}
                placeholder={dict.form.ambassadorPlaceholder}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{dict.form.backBtn}</span>
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{dict.form.submitting}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{dict.form.submitBtn}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}