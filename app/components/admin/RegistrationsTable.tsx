'use client';

import React, { useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { 
  updatePaymentStatus, 
  toggleCheckIn, 
  exportRegistrationsCsv 
} from '@/app/actions/admin';
import { RegistrationRecord, PaymentStatus, KU_DISCIPLINES } from '@/app/lib/types';
import { 
  Search, 
  Download, 
  CheckCircle2, 
  XCircle, 
  UserCheck, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  Loader2,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import Link from 'next/link';

interface RegistrationsTableProps {
  initialData: RegistrationRecord[];
  totalRecords: number;
  currentPage: number;
  totalPages: number;
}

const BATCHES = ['21', '22', '23', '24', '25', '26'];

export default function RegistrationsTable({
  initialData,
  totalRecords,
  currentPage,
  totalPages,
}: RegistrationsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [exporting, setExporting] = useState(false);

  // Active filter values from URL
  const currentStatus = searchParams.get('status') || 'all';
  const currentDiscipline = searchParams.get('discipline') || 'all';
  const currentBatch = searchParams.get('batch') || 'all';
  const currentMethod = searchParams.get('paymentMethod') || 'all';
  const currentGender = searchParams.get('gender') || 'all';
  const currentCheckedIn = searchParams.get('checkedIn') || 'all';

  // Update query params in URL
  const updateQuery = (key: string, val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val && val !== 'all') {
      params.set(key, val);
    } else {
      params.delete(key);
    }
    params.set('page', '1'); // reset page on filter change
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery('search', searchTerm);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    router.push(pathname);
  };

  const hasActiveFilters = 
    currentStatus !== 'all' ||
    currentDiscipline !== 'all' ||
    currentBatch !== 'all' ||
    currentMethod !== 'all' ||
    currentGender !== 'all' ||
    currentCheckedIn !== 'all' ||
    Boolean(searchParams.get('search'));

  const handleStatusChange = (id: number, status: PaymentStatus) => {
    startTransition(async () => {
      await updatePaymentStatus(id, status);
      router.refresh();
    });
  };

  const handleCheckInToggle = (id: number, currentStatusVal: boolean) => {
    startTransition(async () => {
      await toggleCheckIn(id, !currentStatusVal);
      router.refresh();
    });
  };

  const handleCsvExport = async () => {
    try {
      setExporting(true);
      const res = await exportRegistrationsCsv();
      if (res.success && res.data) {
        const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `ku-deeni-registrations-${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('CSV Export Error:', err);
    } finally {
      setExporting(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      
      {/* Table Toolbar */}
      <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 space-y-4">
        
        {/* Top Line: Search Bar + Export */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="নাম, রোল, কোড, ফোন বা TrxID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>

          <div className="flex items-center gap-2.5 self-end lg:self-auto">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ফিল্টার মুছুন</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCsvExport}
              disabled={exporting}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition disabled:opacity-50 cursor-pointer"
            >
              {exporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>CSV Export</span>
            </button>
          </div>
        </div>

        {/* Bottom Line: Multi-Attribute Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          
          {/* Discipline Select */}
          <select
            value={currentDiscipline}
            onChange={(e) => updateQuery('discipline', e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">ডিসিপ্লিন: সকল</option>
            {KU_DISCIPLINES && KU_DISCIPLINES.length > 0 ? (
              KU_DISCIPLINES.map((disc) => (
                <option key={disc} value={disc}>
                  {disc}
                </option>
              ))
            ) : (
              <option value="29">29 (Default)</option>
            )}
          </select>

          {/* Batch Select */}
          <select
            value={currentBatch}
            onChange={(e) => updateQuery('batch', e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">ব্যাচ: সকল</option>
            {BATCHES.map((b) => (
              <option key={b} value={b}>
                ব্যাচ {b}
              </option>
            ))}
          </select>

          {/* Payment Status Select */}
          <select
            value={currentStatus}
            onChange={(e) => updateQuery('status', e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">স্ট্যাটাস: সকল</option>
            <option value="pending">Pending (অপেক্ষমাণ)</option>
            <option value="approved">Approved (অনুমোদিত)</option>
            <option value="rejected">Rejected (বাতিল)</option>
          </select>

          {/* Payment Method Select */}
          <select
            value={currentMethod}
            onChange={(e) => updateQuery('paymentMethod', e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">পদ্ধতি: সকল</option>
            <option value="bkash">বিকাশ (bKash)</option>
            <option value="nagad">নগদ (Nagad)</option>
            <option value="ambassador">অ্যাম্বাসেডর</option>
          </select>

          {/* Gender Select */}
          <select
            value={currentGender}
            onChange={(e) => updateQuery('gender', e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">লিঙ্গ: সকল</option>
            <option value="male">পুরুষ</option>
            <option value="female">নারী</option>
          </select>

          {/* Check-In Select */}
          <select
            value={currentCheckedIn}
            onChange={(e) => updateQuery('checkedIn', e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">চেক-ইন: সকল</option>
            <option value="true">উপস্থিত</option>
            <option value="false">অনুপস্থিত</option>
          </select>

        </div>
      </div>

      {/* Registrations Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-3.5 px-4">কোড / ট্র্যাকিং</th>
              <th className="py-3.5 px-4">শিক্ষার্থীর তথ্য</th>
              <th className="py-3.5 px-4">ডিসিপ্লিন ও ব্যাচ</th>
              <th className="py-3.5 px-4">পেমেন্ট বিবরণ</th>
              <th className="py-3.5 px-4">স্ট্যাটাস</th>
              <th className="py-3.5 px-4">চেক-ইন</th>
              <th className="py-3.5 px-4 text-right">পদক্ষেপ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {initialData.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400 text-sm">
                  কোনো নিবন্ধনের তথ্য পাওয়া যায়নি।
                </td>
              </tr>
            ) : (
              initialData.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                  {/* Tracking Code */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="font-mono font-bold text-slate-900 dark:text-white">
                      {reg.reg_code}
                    </div>
                    <Link
                      href={`/track?code=${reg.reg_code}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline mt-0.5"
                    >
                      পাস ভিউ <ExternalLink className="w-2.5 h-2.5" />
                    </Link>
                  </td>

                  {/* Student Details */}
                  <td className="py-4 px-4">
                    <p className="font-bold text-slate-900 dark:text-white">{reg.full_name}</p>
                    <p className="text-[11px] font-mono text-slate-500 mt-0.5">{reg.student_id}</p>
                    <p className="text-[10px] text-slate-400">{reg.phone}</p>
                  </td>

                  {/* Discipline & Batch */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <p className="font-medium text-slate-800 dark:text-slate-200">{reg.discipline}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Batch {reg.batch_year} {reg.is_continuing_26 && '• Cont. 26'}
                    </p>
                  </td>

                  {/* Payment Details */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {reg.fee_amount} ৳
                    </div>
                    <p className="text-[11px] text-slate-400 uppercase">{reg.payment_method}</p>
                    {reg.transaction_id && (
                      <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                        Trx: {reg.transaction_id}
                      </p>
                    )}
                    {reg.ambassador_name && (
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Amb: {reg.ambassador_name}
                      </p>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    {reg.payment_status === 'approved' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300/30">
                        <CheckCircle2 className="w-3 h-3" />
                        অনুমোদিত
                      </span>
                    )}
                    {reg.payment_status === 'pending' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300/30">
                        <Clock className="w-3 h-3" />
                        অপেক্ষমাণ
                      </span>
                    )}
                    {reg.payment_status === 'rejected' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-300/30">
                        <XCircle className="w-3 h-3" />
                        বাতিল
                      </span>
                    )}
                  </td>

                  {/* Check-In Toggle */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <button
                      type="button"
                      disabled={isPending || reg.payment_status !== 'approved'}
                      onClick={() => handleCheckInToggle(Number(reg.id), reg.checked_in)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition ${
                        reg.checked_in
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300'
                          : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                      } ${reg.payment_status !== 'approved' ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}`}
                    >
                      <UserCheck className="w-3 h-3" />
                      <span>{reg.checked_in ? 'উপস্থিত' : 'অনুপস্থিত'}</span>
                    </button>
                  </td>

                  {/* Row Mutation Actions */}
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      {reg.payment_status !== 'approved' && (
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => handleStatusChange(Number(reg.id), 'approved')}
                          title="অনুমোদন করুন"
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900 text-emerald-600 dark:text-emerald-400 transition cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                      {reg.payment_status !== 'rejected' && (
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => handleStatusChange(Number(reg.id), 'rejected')}
                          title="বাতিল করুন"
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-400 transition cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div>
          মোট রেকর্ড: <span className="font-bold text-slate-800 dark:text-slate-200">{totalRecords}</span> টি
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1 || isPending}
            onClick={() => handlePageChange(currentPage - 1)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages || isPending}
            onClick={() => handlePageChange(currentPage + 1)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}