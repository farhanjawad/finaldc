import React from 'react';
import { getDashboardStats, getRegistrations } from '@/app/actions/admin';
import RegistrationsTable from '../../../components/admin/RegistrationsTable';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  UserCheck, 
  BadgeDollarSign 
} from 'lucide-react';

interface AdminDashboardProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    discipline?: string;
    batch?: string;
    paymentMethod?: string;
    gender?: string;
    checkedIn?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function AdminDashboardOverviewPage({
  searchParams,
}: AdminDashboardProps) {
  const resolvedParams = await searchParams;

  const [statsRes, listRes] = await Promise.all([
    getDashboardStats(),
    getRegistrations({
      search: resolvedParams.search,
      status: resolvedParams.status as any,
      discipline: resolvedParams.discipline,
      batch: resolvedParams.batch,
      paymentMethod: resolvedParams.paymentMethod,
      gender: resolvedParams.gender,
      checkedIn: resolvedParams.checkedIn as any,
      page: resolvedParams.page ? parseInt(resolvedParams.page, 10) : 1,
      limit: resolvedParams.limit ? parseInt(resolvedParams.limit, 10) : 20,
    }),
  ]);

  const stats = statsRes.data || {
    totalRegistrations: 0,
    approvedCount: 0,
    pendingCount: 0,
    rejectedCount: 0,
    checkedInCount: 0,
    totalCollectedBdt: 0,
  };

  const tableData = listRes.data?.data || [];
  const totalRecords = listRes.data?.total || 0;
  const currentPage = listRes.data?.page || 1;
  const totalPages = listRes.data?.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Top Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <Users className="w-4 h-4 text-slate-500" />
            <span>মোট আবেদন</span>
          </div>
          <p className="mt-2 text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {stats.totalRegistrations}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>অনুমোদিত</span>
          </div>
          <p className="mt-2 text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {stats.approvedCount}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-medium">
            <Clock className="w-4 h-4" />
            <span>অপেক্ষমাণ</span>
          </div>
          <p className="mt-2 text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
            {stats.pendingCount}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-medium">
            <XCircle className="w-4 h-4" />
            <span>বাতিল</span>
          </div>
          <p className="mt-2 text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400">
            {stats.rejectedCount}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-medium">
            <UserCheck className="w-4 h-4" />
            <span>উপস্থিত (Checked)</span>
          </div>
          <p className="mt-2 text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {stats.checkedInCount}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <BadgeDollarSign className="w-4 h-4 text-emerald-600" />
            <span>মোট সংগৃহীত</span>
          </div>
          <p className="mt-2 text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {stats.totalCollectedBdt} ৳
          </p>
        </div>
      </div>

      {/* Main Registrations Table with Embedded Filters */}
      <RegistrationsTable
        initialData={tableData}
        totalRecords={totalRecords}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
}