'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { RegistrationRecord, PaymentStatus } from '@/app/lib/types';
import { 
  updatePaymentStatus, 
  toggleCheckIn, 
  exportRegistrationsCsv 
} from '@/app/actions/admin';
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Loader2,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  RotateCcw
} from 'lucide-react';

interface RegistrationsTableProps {
  initialData: RegistrationRecord[];
  totalRecords: number;
  currentPage: number;
  totalPages: number;
}

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

  // Local rows state
  const [data, setData] = useState<RegistrationRecord[]>(initialData);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  // Sync state when props change
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Read URL search params
  const currentSearch = searchParams.get('search') || '';
  const currentStatus = searchParams.get('status') || 'all';
  const currentBatch = searchParams.get('batch') || 'all';
  const currentGender = searchParams.get('gender') || 'all';
  const currentPaymentMethod = searchParams.get('paymentMethod') || 'all';
  const currentCheckedIn = searchParams.get('checkedIn') || 'all';
  const currentSortBy = searchParams.get('sortBy') || 'created_at';
  const currentSortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';

  // Local input for search bar
  const [searchInput, setSearchInput] = useState(currentSearch);

  // Push filter/sort updates to Next.js URL
  const updateUrlParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Unless switching pages specifically, reset page to 1 on any filter change
    if (!('page' in updates)) {
      params.set('page', '1');
    }

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === 'all' || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrlParams({ search: searchInput.trim() });
  };

  const handleSort = (column: string) => {
    if (currentSortBy === column) {
      // Toggle order
      const nextOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
      updateUrlParams({ sortBy: column, sortOrder: nextOrder });
    } else {
      // Default to ascending for new column
      updateUrlParams({ sortBy: column, sortOrder: 'asc' });
    }
  };

  const resetAllFilters = () => {
    setSearchInput('');
    startTransition(() => {
      router.push(pathname);
    });
  };

  // Status mutation
  const handleStatusChange = async (id: string, newStatus: PaymentStatus) => {
    setActionLoadingId(id);
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, payment_status: newStatus } : item
      )
    );

    const res = await updatePaymentStatus(id, newStatus);
    setActionLoadingId(null);
    if (!res.success) {
      alert(res.error || 'স্ট্যাটাস আপডেট করা সম্ভব হয়নি।');
      setData(initialData);
    } else {
      router.refresh();
    }
  };

  // Check-in mutation
  const handleCheckInToggle = async (id: string, currentVal: boolean) => {
    setActionLoadingId(id);
    const targetVal = !currentVal;

    setData((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              checked_in: targetVal,
              checked_in_at: targetVal ? new Date().toISOString() : null,
            }
          : item
      )
    );

    const res = await toggleCheckIn(id, targetVal);
    setActionLoadingId(null);
    if (!res.success) {
      alert(res.error || 'চেক-ইন স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে।');
      setData(initialData);
    } else {
      router.refresh();
    }
  };

  // CSV Export
  const handleExportCsv = async () => {
    try {
      setExporting(true);
      const res = await exportRegistrationsCsv();
      if (!res.success || !res.data) {
        alert(res.error || 'CSV ডাউনলোড করা সম্ভব হয়নি।');
        return;
      }
      const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `ku_event_registrations_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert('CSV ডাউনলোডে ত্রুটি দেখা দিয়েছে।');
    } finally {
      setExporting(false);
    }
  };

  // Header Sort Icon helper
  const renderSortIcon = (column: string) => {
    if (currentSortBy !== column) {
      return <ArrowUpDown className="w-3 h-3 text-slate-300 dark:text-slate-600 group-hover:text-slate-500" />;
    }
    return currentSortOrder === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
    ) : (
      <ArrowDown className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
    );
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5">
        
        {/* Row 1: Search and Action Buttons */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="নাম, স্টুডেন্ট আইডি, ট্রানজ্যাকশন আইডি অথবা মোবাইল..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-20 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3.5 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg text-xs font-bold hover:opacity-90 transition cursor-pointer"
            >
              খুঁজুন
            </button>
          </form>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetAllFilters}
              title="ফিল্টার রিসেট করুন"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>রিসেট</span>
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              disabled={exporting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs disabled:opacity-50 cursor-pointer shrink-0"
            >
              {exporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>CSV এক্সপোর্ট</span>
            </button>
          </div>
        </div>

        {/* Row 2: Five Quick Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          {/* Status Filter */}
          <select
            value={currentStatus}
            onChange={(e) => updateUrlParams({ status: e.target.value })}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden text-slate-700 dark:text-slate-200 font-medium"
          >
            <option value="all">সব স্ট্যাটাস</option>
            <option value="approved">অনুমোদিত (Approved)</option>
            <option value="pending">অপেক্ষমাণ (Pending)</option>
            <option value="rejected">বাতিল (Rejected)</option>
          </select>

          {/* Batch Filter */}
          <select
            value={currentBatch}
            onChange={(e) => updateUrlParams({ batch: e.target.value })}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden text-slate-700 dark:text-slate-200 font-medium"
          >
            <option value="all">সব ব্যাচ</option>
            <option value="26">২৬ ব্যাচ (Freshers)</option>
            <option value="25">২৫ ব্যাচ</option>
            <option value="24">২৪ ব্যাচ</option>
            <option value="23">২৩ ব্যাচ</option>
            <option value="22">২২ ব্যাচ</option>
            <option value="21">২১ ব্যাচ বা পূর্ববর্তী</option>
          </select>

          {/* Gender Filter */}
          <select
            value={currentGender}
            onChange={(e) => updateUrlParams({ gender: e.target.value })}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden text-slate-700 dark:text-slate-200 font-medium"
          >
            <option value="all">সব জেন্ডার</option>
            <option value="male">ভাই (Male)</option>
            <option value="female">বোন (Female)</option>
          </select>

          {/* Payment Method Filter */}
          <select
            value={currentPaymentMethod}
            onChange={(e) => updateUrlParams({ paymentMethod: e.target.value })}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden text-slate-700 dark:text-slate-200 font-medium"
          >
            <option value="all">সব পেমেন্ট মাধ্যম</option>
            <option value="bkash">বিকাশ (bKash)</option>
            <option value="nagad">নগদ (Nagad)</option>
            <option value="ambassador">অ্যাম্বাসেডর (ক্যাশ)</option>
          </select>

          {/* Gate Attendance Filter */}
          <select
            value={currentCheckedIn}
            onChange={(e) => updateUrlParams({ checkedIn: e.target.value })}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden text-slate-700 dark:text-slate-200 font-medium"
          >
            <option value="all">সব উপস্থিতি</option>
            <option value="true">উপস্থিত (Checked-In)</option>
            <option value="false">অনুপস্থিত (Not Checked)</option>
          </select>
        </div>
      </div>

      {/* Main Registrations Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden relative">
        {isPending && (
          <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold select-none">
                {/* Column 1: Full Name & Roll (Sortable) */}
                <th
                  onClick={() => handleSort('full_name')}
                  className="py-3 px-4 cursor-pointer group hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <div className="flex items-center gap-1.5">
                    <span>শিক্ষার্থীর নাম ও রোল</span>
                    {renderSortIcon('full_name')}
                  </div>
                </th>

                {/* Column 2: Discipline & Batch (Sortable) */}
                <th
                  onClick={() => handleSort('discipline')}
                  className="py-3 px-4 cursor-pointer group hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <div className="flex items-center gap-1.5">
                    <span>ডিসিপ্লিন ও ব্যাচ</span>
                    {renderSortIcon('discipline')}
                  </div>
                </th>

                {/* Column 3: Gender (Sortable) */}
                <th
                  onClick={() => handleSort('gender')}
                  className="py-3 px-4 cursor-pointer group hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <div className="flex items-center gap-1.5">
                    <span>জেন্ডার</span>
                    {renderSortIcon('gender')}
                  </div>
                </th>

                {/* Column 4: Fee & Trx (Sortable) */}
                <th
                  onClick={() => handleSort('fee_amount')}
                  className="py-3 px-4 cursor-pointer group hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <div className="flex items-center gap-1.5">
                    <span>পেমেন্ট বিবরণ (ফি)</span>
                    {renderSortIcon('fee_amount')}
                  </div>
                </th>

                {/* Column 5: Payment Status (Sortable) */}
                <th
                  onClick={() => handleSort('payment_status')}
                  className="py-3 px-4 cursor-pointer group hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <div className="flex items-center gap-1.5">
                    <span>পেমেন্ট স্ট্যাটাস</span>
                    {renderSortIcon('payment_status')}
                  </div>
                </th>

                {/* Column 6: Gate Check-In (Sortable) */}
                <th
                  onClick={() => handleSort('checked_in')}
                  className="py-3 px-4 cursor-pointer group hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <div className="flex items-center gap-1.5">
                    <span>উপস্থিতি</span>
                    {renderSortIcon('checked_in')}
                  </div>
                </th>

                {/* Column 7: Actions */}
                <th className="py-3 px-4 text-right">পদক্ষেপ</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 font-medium">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-slate-400">
                    ফিল্টার অনুযায়ী কোনো আবেদন পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                data.map((reg) => {
                  const isLoading = actionLoadingId === reg.id;

                  return (
                    <tr
                      key={reg.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Name & Contact */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-slate-100">
                          {reg.full_name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          ID: <span className="font-mono font-semibold">{reg.student_id}</span> • {reg.phone}
                        </div>
                      </td>

                      {/* Discipline & Batch */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-[11px]">
                          {reg.discipline}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          ব্যাচ {reg.batch_year} {reg.is_continuing_26 && '(২৬ এর সাথে)'}
                        </div>
                      </td>

                      {/* Gender Badge */}
                      <td className="py-3 px-4">
                        {reg.gender === 'male' ? (
                          <span className="inline-block px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-[10px]">
                            ভাই (Male)
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded-md bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 font-bold text-[10px]">
                            বোন (Female)
                          </span>
                        )}
                      </td>

                      {/* Payment Fee & Method */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-slate-100">
                          {reg.fee_amount} ৳
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {reg.payment_method === 'ambassador' ? (
                            <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                              অ্যাম্বাসেডর: {reg.ambassador_name || 'N/A'}
                            </span>
                          ) : (
                            <span className="font-mono text-slate-600 dark:text-slate-300">
                              {reg.payment_method?.toUpperCase()} • {reg.transaction_id || 'N/A'}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Payment Status Badge */}
                      <td className="py-3 px-4">
                        {reg.payment_status === 'approved' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[11px]">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>অনুমোদিত</span>
                          </span>
                        )}
                        {reg.payment_status === 'pending' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold text-[11px]">
                            <Clock className="w-3 h-3" />
                            <span>অপেক্ষমাণ</span>
                          </span>
                        )}
                        {reg.payment_status === 'rejected' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold text-[11px]">
                            <XCircle className="w-3 h-3" />
                            <span>বাতিল</span>
                          </span>
                        )}
                      </td>

                      {/* Gate Check-In Button */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          disabled={isLoading || reg.payment_status !== 'approved'}
                          onClick={() => handleCheckInToggle(reg.id, Boolean(reg.checked_in))}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                            reg.checked_in
                              ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/50'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          {reg.checked_in ? (
                            <>
                              <UserCheck className="w-3 h-3" />
                              <span>উপস্থিত</span>
                            </>
                          ) : (
                            <>
                              <UserX className="w-3 h-3" />
                              <span>অনুপস্থিত</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Action Triggers */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                          ) : (
                            <>
                              {reg.payment_status !== 'approved' && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(reg.id, 'approved')}
                                  title="অনুমোদন করুন"
                                  className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition cursor-pointer"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                              )}
                              {reg.payment_status !== 'rejected' && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(reg.id, 'rejected')}
                                  title="বাতিল করুন"
                                  className="p-1.5 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900 transition cursor-pointer"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              )}
                              {reg.payment_status !== 'pending' && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(reg.id, 'pending')}
                                  title="অপেক্ষমাণ রাখুন"
                                  className="p-1.5 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900 transition cursor-pointer"
                                >
                                  <Clock className="w-4 h-4" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="py-3.5 px-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            মোট <strong className="text-slate-900 dark:text-white">{totalRecords}</strong> টির মধ্যে পৃষ্ঠা{' '}
            <strong className="text-slate-900 dark:text-white">{currentPage}</strong> / {totalPages}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1 || isPending}
              onClick={() => updateUrlParams({ page: String(currentPage - 1) })}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages || isPending}
              onClick={() => updateUrlParams({ page: String(currentPage + 1) })}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}