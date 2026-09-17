'use server';

import { sql } from '../db';
import { getCurrentAdmin } from '@/app/actions/auth';
import { 
  RegistrationRecord, 
  PaymentStatus, 
  ActionResponse 
} from '../lib/types';
import { revalidatePath } from 'next/cache';

export interface DashboardStats {
  totalRegistrations: number;
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
  checkedInCount: number;
  totalCollectedBdt: number;
}

export interface RegistrationsFilterParams {
  search?: string;
  status?: PaymentStatus | 'all';
  discipline?: string;
  batch?: string;
  checkedIn?: 'all' | 'true' | 'false';
  page?: number;
  limit?: number;
}

export interface PaginatedRegistrations {
  data: RegistrationRecord[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Fetch top-level dashboard metrics across all registrations.
 */
export async function getDashboardStats(): Promise<ActionResponse<DashboardStats>> {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return { success: false, error: 'অননুমোদিত অ্যাক্সেস। অনুগ্রহ করে লগইন করুন।' };
    }

    const rows = await sql`
      SELECT
        COUNT(*)::int AS total_registrations,
        COUNT(CASE WHEN payment_status = 'approved' THEN 1 END)::int AS approved_count,
        COUNT(CASE WHEN payment_status = 'pending' THEN 1 END)::int AS pending_count,
        COUNT(CASE WHEN payment_status = 'rejected' THEN 1 END)::int AS rejected_count,
        COUNT(CASE WHEN checked_in = TRUE THEN 1 END)::int AS checked_in_count,
        COALESCE(SUM(CASE WHEN payment_status = 'approved' THEN fee_amount ELSE 0 END), 0)::int AS total_collected_bdt
      FROM registrations;
    `;

    const raw = rows[0];
    const stats: DashboardStats = {
      totalRegistrations: raw.total_registrations || 0,
      approvedCount: raw.approved_count || 0,
      pendingCount: raw.pending_count || 0,
      rejectedCount: raw.rejected_count || 0,
      checkedInCount: raw.checked_in_count || 0,
      totalCollectedBdt: raw.total_collected_bdt || 0,
    };

    return { success: true, data: stats };
  } catch (err) {
    console.error('getDashboardStats error:', err);
    return { success: false, error: 'ড্যাশবোর্ড পরিসংখ্যান লোড করতে সমস্যা হয়েছে।' };
  }
}

/**
 * Query registrations with multi-attribute filtering, search, and pagination.
 */
export async function getRegistrations(
  params: RegistrationsFilterParams = {}
): Promise<ActionResponse<PaginatedRegistrations>> {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return { success: false, error: 'অননুমোদিত অ্যাক্সেস।' };
    }

    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, Math.min(100, params.limit || 20));
    const offset = (page - 1) * limit;

    const searchPattern = params.search?.trim() ? `%${params.search.trim()}%` : null;
    const statusFilter = params.status && params.status !== 'all' ? params.status : null;
    const disciplineFilter = params.discipline && params.discipline !== 'all' ? params.discipline : null;
    const batchFilter = params.batch && params.batch !== 'all' ? params.batch : null;
    const checkedInFilter =
      params.checkedIn === 'true' ? true : params.checkedIn === 'false' ? false : null;

    // Total count query matching applied filters
    const countRows = await sql`
      SELECT COUNT(*)::int AS count
      FROM registrations
      WHERE
        (${searchPattern}::text IS NULL OR (
          full_name ILIKE ${searchPattern} OR
          student_id ILIKE ${searchPattern} OR
          reg_code ILIKE ${searchPattern} OR
          phone ILIKE ${searchPattern} OR
          transaction_id ILIKE ${searchPattern}
        ))
        AND (${statusFilter}::text IS NULL OR payment_status = ${statusFilter})
        AND (${disciplineFilter}::text IS NULL OR discipline = ${disciplineFilter})
        AND (${batchFilter}::text IS NULL OR batch_year = ${batchFilter})
        AND (${checkedInFilter}::boolean IS NULL OR checked_in = ${checkedInFilter});
    `;

    const totalCount = countRows[0]?.count || 0;

    // Data query with offset and limit
    const dataRows = await sql`
      SELECT 
        id,
        reg_code,
        full_name,
        email,
        phone,
        student_id,
        discipline,
        gender,
        batch_year,
        is_continuing_26,
        fee_amount,
        payment_method,
        transaction_id,
        sender_number,
        ambassador_name,
        payment_status,
        checked_in,
        checked_in_at,
        created_at,
        updated_at
      FROM registrations
      WHERE
        (${searchPattern}::text IS NULL OR (
          full_name ILIKE ${searchPattern} OR
          student_id ILIKE ${searchPattern} OR
          reg_code ILIKE ${searchPattern} OR
          phone ILIKE ${searchPattern} OR
          transaction_id ILIKE ${searchPattern}
        ))
        AND (${statusFilter}::text IS NULL OR payment_status = ${statusFilter})
        AND (${disciplineFilter}::text IS NULL OR discipline = ${disciplineFilter})
        AND (${batchFilter}::text IS NULL OR batch_year = ${batchFilter})
        AND (${checkedInFilter}::boolean IS NULL OR checked_in = ${checkedInFilter})
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset};
    `;

    return {
      success: true,
      data: {
        data: dataRows as RegistrationRecord[],
        total: totalCount,
        page,
        totalPages: Math.ceil(totalCount / limit) || 1,
      },
    };
  } catch (err) {
    console.error('getRegistrations error:', err);
    return { success: false, error: 'রেজিস্ট্রেশন তালিকা লোড করতে ব্যর্থ হয়েছে।' };
  }
}

/**
 * Update verification status (Approved/Rejected/Pending).
 */
export async function updatePaymentStatus(
  id: number,
  status: PaymentStatus
): Promise<ActionResponse<void>> {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return { success: false, error: 'অননুমোদিত অ্যাক্সেস।' };
    }

    await sql`
      UPDATE registrations
      SET payment_status = ${status},
          updated_at = NOW()
      WHERE id = ${id};
    `;

    revalidatePath('/admin');
    revalidatePath('/admin/registrations');
    return { success: true, message: `স্ট্যাটাস সফলভাবে ${status} করা হয়েছে।` };
  } catch (err) {
    console.error('updatePaymentStatus error:', err);
    return { success: false, error: 'স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে।' };
  }
}

/**
 * Toggle check-in status directly from admin panel.
 * checkedIn defaults to true so callers passing just (id) won't trigger TS2554.
 */
export async function toggleCheckIn(
  id: number,
  checkedIn: boolean = true
): Promise<ActionResponse<void>> {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return { success: false, error: 'অননুমোদিত অ্যাক্সেস।' };
    }

    await sql`
      UPDATE registrations
      SET checked_in = ${checkedIn},
          checked_in_at = ${checkedIn ? sql`NOW()` : null},
          updated_at = NOW()
      WHERE id = ${id};
    `;

    revalidatePath('/admin');
    revalidatePath('/admin/registrations');
    return { success: true, message: 'চেক-ইন স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে।' };
  } catch (err) {
    console.error('toggleCheckIn error:', err);
    return { success: false, error: 'চেক-ইন আপডেট করতে সমস্যা হয়েছে।' };
  }
}

/**
 * Export all approved or filtered registrations as raw CSV string.
 */
export async function exportRegistrationsCsv(): Promise<ActionResponse<string>> {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return { success: false, error: 'অননুমোদিত অ্যাক্সেস।' };
    }

    const rows = await sql`
      SELECT 
        reg_code,
        full_name,
        email,
        phone,
        student_id,
        discipline,
        gender,
        batch_year,
        fee_amount,
        payment_method,
        transaction_id,
        sender_number,
        ambassador_name,
        payment_status,
        checked_in,
        checked_in_at,
        created_at
      FROM registrations
      ORDER BY id ASC;
    `;

    const headers = [
      'Reg Code',
      'Full Name',
      'Email',
      'Phone',
      'Student ID',
      'Discipline',
      'Gender',
      'Batch',
      'Fee Amount',
      'Payment Method',
      'TrxID',
      'Sender Number',
      'Ambassador',
      'Payment Status',
      'Checked In',
      'Check-In Time',
      'Registered At'
    ];

    const escapeCsv = (val: unknown) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const csvLines = [
      headers.join(','),
      ...rows.map((r) => [
        escapeCsv(r.reg_code),
        escapeCsv(r.full_name),
        escapeCsv(r.email),
        escapeCsv(r.phone),
        escapeCsv(r.student_id),
        escapeCsv(r.discipline),
        escapeCsv(r.gender),
        escapeCsv(r.batch_year),
        escapeCsv(r.fee_amount),
        escapeCsv(r.payment_method),
        escapeCsv(r.transaction_id),
        escapeCsv(r.sender_number),
        escapeCsv(r.ambassador_name),
        escapeCsv(r.payment_status),
        escapeCsv(r.checked_in ? 'YES' : 'NO'),
        escapeCsv(r.checked_in_at || ''),
        escapeCsv(r.created_at)
      ].join(','))
    ];

    return {
      success: true,
      data: csvLines.join('\n')
    };
  } catch (err) {
    console.error('exportRegistrationsCsv error:', err);
    return { success: false, error: 'CSV এক্সপোর্ট তৈরি করতে সমস্যা হয়েছে।' };
  }
}