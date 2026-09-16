import React from 'react';
import { getRegistrations } from '@/app/actions/admin';
import RegistrationsTable from '@/app/components/admin/RegistrationsTable';
import { PaymentStatus } from '@/app/lib/types';
import { Users } from 'lucide-react';

interface RegistrationsPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
  }>;
}

export const metadata = {
  title: 'নিবন্ধন তালিকা ও ব্যবস্থাপনা | KU Deeni Admin',
  description: 'খুলনা বিশ্ববিদ্যালয় দ্বীনি কমিউনিটি ইভেন্টের সকল আবেদন ও পেমেন্ট যাচাই তালিকা',
};

export default async function RegistrationsAdminPage({ searchParams }: RegistrationsPageProps) {
  const resolvedParams = await searchParams;

  const search = resolvedParams.search || '';
  const status = (resolvedParams.status as PaymentStatus | 'all') || 'all';
  const page = parseInt(resolvedParams.page || '1', 10) || 1;

  // Query registrations using server action
  const res = await getRegistrations({
    search,
    status,
    page,
    limit: 15,
  });

  const registrationsData = res.success && res.data ? res.data.data : [];
  const totalRecords = res.success && res.data ? res.data.total : 0;
  const currentPage = res.success && res.data ? res.data.page : 1;
  const totalPages = res.success && res.data ? res.data.totalPages : 1;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
            <Users className="w-4 h-4" />
            <span>অংশগ্রহণকারী ব্যবস্থাপনা</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            নিবন্ধন ও পেমেন্ট ডাটাবেস
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            অনলাইন ট্রানজেকশন ও অ্যাম্বাসেডর ক্যাশ পেমেন্ট অনুমোদন বা বাতিল করুন।
          </p>
        </div>
      </div>

      {/* Registrations Interactive Grid */}
      <RegistrationsTable
        initialData={registrationsData}
        totalRecords={totalRecords}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
}