'use server';

import { sql } from '@/app/db';
import { getCurrentAdmin } from '@/app/actions/auth';
import { 
  RegistrationRecord, 
  PaymentStatus, 
  ActionResponse 
} from '@/app/lib/types';
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
  paymentMethod?: string;
  gender?: string;
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
 * Fetch overview statistics for the admin dashboard.
 */
export async function getDashboardStats(): Promise<ActionResponse<DashboardStats>> {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return { success: false, error: 'অননুমোদিত অ্যাক্সেস।' };
    }

    const rows = await sql`
      SELECT 
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE payment_status = 'approved')::int AS approved,
        COUNT(*) FILTER (WHERE payment_status = 'pending')::int AS pending,
        COUNT(*) FILTER (WHERE payment_status = 'rejected')::int AS rejected,
        COUNT(*) FILTER (WHERE checked_in = true)::int AS checked_in,
        COALESCE(SUM(fee_amount) FILTER (WHERE payment_status = 'approved'), 0)::int AS total_collected
      FROM registrations;
    `;

    const row = rows[0] || {};

    return {
      success: true,
      data: {
        totalRegistrations: row.total || 0,
        approvedCount: row.approved || 0,
        pendingCount: row.pending || 0,
        rejectedCount: row.rejected || 0,
        checkedInCount: row.checked_in || 0,
        totalCollectedBdt: row.total_collected || 0,
      },
    };
  } catch (err) {
    console.error('getDashboardStats error:', err);
    return {
      success: false,
      error: 'পরিসংখ্যান লোড করতে ব্যর্থ হয়েছে।',
      data: {
        totalRegistrations: 0,
        approvedCount: 0,
        pendingCount: 0,
        rejectedCount: 0,
        checkedInCount: 0,
        totalCollectedBdt: 0,
      },
    };
  }
}

/**
 * Update payment approval status (Approved, Rejected, Pending).
 * Correctly casts UUID string to uuid and status to payment_status_enum.
 */
export async function updatePaymentStatus(
  id: string,
  status: PaymentStatus
): Promise<ActionResponse<void>> {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return { success: false, error: 'অননুমোদিত অ্যাক্সেস।' };
    }

    await sql`
      UPDATE registrations
      SET 
        payment_status = ${status}::payment_status_enum,
        updated_at = NOW()
      WHERE id = ${id}::uuid;
    `;

    revalidatePath('/admin');
    revalidatePath('/admin/registrations');
    return { success: true, message: `স্ট্যাটাস পরিবর্তিত হয়েছে: ${status}` };
  } catch (err) {
    console.error('updatePaymentStatus error:', err);
    return { success: false, error: 'পেমেন্ট স্ট্যাটাস পরিবর্তন করতে সমস্যা হয়েছে।' };
  }
}

/**
 * Toggle gate check-in status directly.
 */
export async function toggleCheckIn(
  id: string,
  checkedIn: boolean = true
): Promise<ActionResponse<void>> {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return { success: false, error: 'অননুমোদিত অ্যাক্সেস।' };
    }

    await sql`
      UPDATE registrations
      SET 
        checked_in = ${checkedIn},
        checked_in_at = ${checkedIn ? sql`NOW()` : null},
        checked_in_by = ${checkedIn ? admin.username : null},
        updated_at = NOW()
      WHERE id = ${id}::uuid;
    `;

    revalidatePath('/admin');
    revalidatePath('/admin/registrations');
    return { success: true, message: 'চেক-ইন স্ট্যাটাস আপডেট হয়েছে।' };
  } catch (err) {
    console.error('toggleCheckIn error:', err);
    return { success: false, error: 'চেক-ইন আপডেট করতে ব্যর্থ হয়েছে।' };
  }
}

/**
 * Validate and perform gate check-in via QR or manual code input.
 */
export async function verifyGateCheckIn(
  queryCode: string
): Promise<ActionResponse<{ registration: RegistrationRecord; alreadyCheckedIn: boolean }>> {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return { success: false, error: 'অননুমোদিত অ্যাক্সেস।' };
    }

    const cleanCode = queryCode.trim().toUpperCase();

    const rows = await sql`
      SELECT *
      FROM registrations
      WHERE UPPER(reg_code) = ${cleanCode}
         OR UPPER(student_id) = ${cleanCode}
      LIMIT 1;
    `;

    if (rows.length === 0) {
      return { success: false, error: 'কোনো বৈধ নিবন্ধন পাওয়া যায়নি।' };
    }

    const reg = rows[0] as RegistrationRecord;

    if (reg.payment_status !== 'approved') {
      return {
        success: false,
        error: `পেমেন্ট অনুমোদিত নয় (বর্তমান স্ট্যাটাস: ${reg.payment_status})।`,
        data: { registration: reg, alreadyCheckedIn: false },
      };
    }

    const wasAlreadyCheckedIn = Boolean(reg.checked_in);

    if (!wasAlreadyCheckedIn) {
      await sql`
        UPDATE registrations
        SET 
          checked_in = true,
          checked_in_at = NOW(),
          checked_in_by = ${admin.username},
          updated_at = NOW()
        WHERE id = ${reg.id}::uuid;
      `;
      reg.checked_in = true;
      reg.checked_in_at = new Date().toISOString();
      revalidatePath('/admin');
      revalidatePath('/admin/registrations');
    }

    return {
      success: true,
      message: wasAlreadyCheckedIn ? 'ইতিপূর্বে প্রবেশ করেছেন!' : 'প্রবেশ সফল হয়েছে!',
      data: {
        registration: reg,
        alreadyCheckedIn: wasAlreadyCheckedIn,
      },
    };
  } catch (err) {
    console.error('verifyGateCheckIn error:', err);
    return { success: false, error: 'গেট যাচাই প্রক্রিয়ায় ত্রুটি ঘটেছে।' };
  }
}

/**
 * Fetch registrations with multi-attribute filtering, search, and pagination.
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
    const methodFilter = params.paymentMethod && params.paymentMethod !== 'all' ? params.paymentMethod : null;
    const genderFilter = params.gender && params.gender !== 'all' ? params.gender : null;
    const checkedInFilter =
      params.checkedIn === 'true' ? true : params.checkedIn === 'false' ? false : null;

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
        AND (${statusFilter}::text IS NULL OR payment_status = ${statusFilter}::payment_status_enum)
        AND (${disciplineFilter}::text IS NULL OR discipline = ${disciplineFilter})
        AND (${batchFilter}::text IS NULL OR batch_year = ${batchFilter})
        AND (${methodFilter}::text IS NULL OR payment_method = ${methodFilter})
        AND (${genderFilter}::text IS NULL OR gender = ${genderFilter})
        AND (${checkedInFilter}::boolean IS NULL OR checked_in = ${checkedInFilter});
    `;

    const totalCount = countRows[0]?.count || 0;

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
        AND (${statusFilter}::text IS NULL OR payment_status = ${statusFilter}::payment_status_enum)
        AND (${disciplineFilter}::text IS NULL OR discipline = ${disciplineFilter})
        AND (${batchFilter}::text IS NULL OR batch_year = ${batchFilter})
        AND (${methodFilter}::text IS NULL OR payment_method = ${methodFilter})
        AND (${genderFilter}::text IS NULL OR gender = ${genderFilter})
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
    return { success: false, error: 'তালিকা আনতে সমস্যা হয়েছে।' };
  }
}

/**
 * Export all registrations to CSV string.
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
      ORDER BY created_at DESC;
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
      'Registration Time'
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
    return { success: false, error: 'CSV রূপান্তরে ত্রুটি হয়েছে।' };
  }
}