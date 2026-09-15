'use server';

import { sql } from '../db';
import { RegistrationRecord, ActionResponse } from '../lib/types';

export async function getRegistrationStatus(
  query: string
): Promise<ActionResponse<RegistrationRecord>> {
  try {
    const cleanQuery = query.trim();

    if (!cleanQuery) {
      return {
        success: false,
        error: 'অনুগ্রহ করে রেজিস্ট্রেশন কোড অথবা স্টুডেন্ট আইডি প্রদান করুন।',
      };
    }

    // Lookup by reg_code (case-insensitive) or exact student_id
    const rows = await sql`
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
      WHERE UPPER(reg_code) = UPPER(${cleanQuery})
         OR student_id = ${cleanQuery}
      ORDER BY created_at DESC
      LIMIT 1;
    `;

    if (rows.length === 0) {
      return {
        success: false,
        error: 'উক্ত তথ্য দিয়ে কোনো রেজিস্ট্রেশন খুঁজে পাওয়া যায়নি। তথ্যটি যাচাই করে আবার চেষ্টা করুন।',
      };
    }

    const registration = rows[0] as RegistrationRecord;

    return {
      success: true,
      data: registration,
    };
  } catch (err) {
    console.error('Error fetching registration status:', err);
    return {
      success: false,
      error: 'সার্ভারে সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর পুনরায় চেষ্টা করুন।',
    };
  }
}