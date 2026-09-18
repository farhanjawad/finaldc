'use client';

import React, { useState, useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { RegistrationRecord, PaymentStatus } from '@/app/lib/types';
import { 
  updatePaymentStatus, 
  toggleCheckIn, 
  exportRegistrationsCsv 
} from '@/app/actions/admin';
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Loader2,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

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

  // Local state for instant feedback
  const [data, setData] = useState<RegistrationRecord[]>(initialData);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  // Filter controls synchronized with URL
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [batchFilter, setBatchFilter] = useState(searchParams.get('batch') || 'all');
  const [checkedInFilter, setCheckedInFilter] = useState(searchParams.get('checkedIn') || 'all');

  // Push filter parameters to Next.js URL
  const applyFilters = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Reset to page 1 on filter changes unless explicit page is provided
    if (!newParams.page) {
      params.set('page', '1');
    }

    Object.entries(newParams).forEach(([key, value]) => {
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
    applyFilters({ search: searchTerm });
  };

  const handleStatusChange = async (id: string, newStatus: PaymentStatus) => {
    setActionLoadingId(id);
    // Optimistic UI update
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, payment_status: newStatus } : item
      )
    );

    const res = await updatePaymentStatus(id, newStatus);
    setActionLoadingId(null);
    if (!res.success) {
      alert(res.error || 'স্ট্যাটাস আপডেট করা সম্ভব হয়নি।');
      // Revert from props
      setData(initialData);
    } else {
      router.refresh();
    }
  };

  const handleCheckInToggle = async (id: string, currentVal: boolean) => {
    setActionLoadingId(id);
    const targetVal = !currentVal;

    // Optimistic UI update
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

  return (
    <div className="space-y-4">
      {/* Top Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="নাম, স্টুডেন্ট আইডি, ট্রানজ্যাকশন কোড বা মোবাইল..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-20 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg text-xs font-semibold hover:opacity-90 transition"
          >
            খুঁজুন
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              applyFilters({ status: e.target.value });
            }}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden text-slate-700 dark:text-slate-200"
          >
            <option value="all">সকল পেমেন্ট স্ট্যাটাস</option>
            <option value="approved">অনুমোদিত (Approved)</option>
            <option value="pending">অপেক্ষমাণ (Pending)</option>
            <option value="rejected">বাতিল (Rejected)</option>
          </select>

          {/* Batch Filter */}
          <select
            value={batchFilter}
            onChange={(e) => {
              setBatchFilter(e.target.value);
              applyFilters({ batch: e.target.value });
            }}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden text-slate-700 dark:text-slate-200"
          >
            <option value="all">সকল ব্যাচ</option>
            <option value="26">২৬ ব্যাচ</option>
            <option value="25">২৫ ব্যাচ</option>
            <option value="other">অন্যান্য ব্যাচ</option>
          </select>

          {/* Gate Attendance Filter */}
          <select
            value={checkedInFilter}
            onChange={(e) => {
              setCheckedInFilter(e.target.value);
              applyFilters({ checkedIn: e.target.value });
            }}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden text-slate-700 dark:text-slate-200"
          >
            <option value="all">উপস্থিতি (সব)</option>
            <option value="true">উপস্থিত (Checked-in)</option>
            <option value="false">অনুপস্থিত (Not Checked)</option>
          </select>

          {/* CSV Export Button */}
          <button
            onClick={handleExportCsv}
            disabled={exporting}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs disabled:opacity-50 cursor-pointer"
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

      {/* Main Table View */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold">
                <th className="py-3 px-4">রেজিস্ট্রেশন কোড</th>
                <th className="py-3 px-4">শিক্ষার্থীর নাম ও আইডি</th>
                <th className="py-3 px-4">ডিসিপ্লিন ও ব্যাচ</th>
                <th className="py-3 px-4">পেমেন্ট বিবরণ (ফি)</th>
                <th className="py-3 px-4">পেমেন্ট স্ট্যাটাস</th>
                <th className="py-3 px-4">গেট উপস্থিতি</th>
                <th className="py-3 px-4 text-right">পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    কোনো আবেদন পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                data.map((reg) => {
                  const isLoading = actionLoadingId === reg.id;

                  return (
                    <tr
                      key={reg.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Registration Code */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                        <div className="flex items-center gap-1.5">
                          <span>{reg.reg_code}</span>
                          <Link
                            href={`/track?code=${reg.reg_code}`}
                            target="_blank"
                            title="পাস দেখুন"
                            className="text-slate-400 hover:text-emerald-600 transition"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal block mt-0.5">
                          {new Date(reg.created_at).toLocaleDateString('bn-BD')}
                        </span>
                      </td>

                      {/* Name & Contact */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {reg.full_name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          ID: <span className="font-mono">{reg.student_id}</span> | {reg.phone}
                        </div>
                      </td>

                      {/* Discipline & Batch */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                          {reg.discipline}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          ব্যাচ {reg.batch_year} {reg.is_continuing_26 && '(২৬ এর সাথে)'}
                        </div>
                      </td>

                      {/* Payment Details */}
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
                              Trx: {reg.transaction_id || 'N/A'}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status Badge */}
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

                      {/* Gate Check-In Toggle */}
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

        {/* Pagination Footer */}
        <div className="py-3 px-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            মোট <strong className="text-slate-900 dark:text-white">{totalRecords}</strong> টির মধ্যে পৃষ্ঠা{' '}
            <strong className="text-slate-900 dark:text-white">{currentPage}</strong> / {totalPages}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1 || isPending}
              onClick={() => applyFilters({ page: String(currentPage - 1) })}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages || isPending}
              onClick={() => applyFilters({ page: String(currentPage + 1) })}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}