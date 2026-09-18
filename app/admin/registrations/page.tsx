import React, { Suspense } from 'react';
import { getRegistrations } from '@/app/actions/admin';
import RegistrationsTable from '@/app/components/admin/RegistrationsTable';
import { PaymentStatus } from '@/app/lib/types';
import { Users, Loader2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    batch?: string;
    discipline?: string;
    checkedIn?: string;
  }>;
}

export default async function AdminRegistrationsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  const page = parseInt(resolvedParams.page || '1', 10);
  const search = resolvedParams.search || '';
  const status = (resolvedParams.status as PaymentStatus | 'all') || 'all';
  const batch = resolvedParams.batch || 'all';
  const discipline = resolvedParams.discipline || 'all';
  const checkedIn = (resolvedParams.checkedIn as 'all' | 'true' | 'false') || 'all';

  const res = await getRegistrations({
    page,
    limit: 20,
    search,
    status,
    batch,
    discipline,
    checkedIn,
  });

  const registrationsData = res.success && res.data ? res.data : {
    data: [],
    total: 0,
    page: 1,
    totalPages: 1,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
              <Users className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              নিবন্ধন তালিকা ও অনুমোদন
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            আবেদনকারী শিক্ষার্থী তালিকা
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            শিক্ষার্থীদের নিবন্ধন যাচাই, পেমেন্ট অনুমোদন/বাতিল এবং উপস্থিতি নিয়ন্ত্রণ করুন
          </p>
        </div>
      </div>

      {/* Main Table with Suspense Boundary */}
      <Suspense
        fallback={
          <div className="p-16 flex flex-col items-center justify-center gap-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <p className="text-xs text-slate-500 font-semibold">
              নিবন্ধন তথ্য লোড করা হচ্ছে...
            </p>
          </div>
        }
      >
        <RegistrationsTable
          initialData={registrationsData.data}
          totalRecords={registrationsData.total}
          currentPage={registrationsData.page}
          totalPages={registrationsData.totalPages}
        />
      </Suspense>
    </div>
  );
}