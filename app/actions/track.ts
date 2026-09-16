'use server';

import { sql } from '@/app/db';

export interface TrackResult {
  id: number;
  reg_code: string;
  full_name: string;
  email?: string;
  phone?: string;
  student_id: string;
  discipline?: string;
  gender?: string;
  fee_amount?: number;
  payment_method?: string;
  payment_status: 'pending' | 'approved' | 'rejected';
  checked_in: boolean;
  created_at?: string;
}

export type TrackResponse =
  | { success: true; data: TrackResult }
  | { success: false; error: string };

export async function trackRegistration(queryInput: string): Promise<TrackResponse> {
  try {
    const rawInput = (queryInput || '').trim();

    if (!rawInput) {
      return {
        success: false,
        error: 'অনুগ্রহ করে আপনার রেজিস্ট্রেশন কোড (যেমন: KU-32CBB5) অথবা স্টুডেন্ট আইডি লিখুন।',
      };
    }

    console.log('=== [TRACK QUERY INITIATED] ===');
    console.log('Raw search term:', rawInput);

    // Normalize: remove spaces, convert to uppercase
    const normalized = rawInput.replace(/\s+/g, '').toUpperCase();

    // Query Neon Postgres: match against reg_code OR student_id
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
        fee_amount,
        payment_method,
        payment_status,
        checked_in,
        created_at
      FROM registrations
      WHERE UPPER(TRIM(reg_code)) = ${normalized}
         OR UPPER(TRIM(student_id)) = ${normalized}
      ORDER BY id DESC
      LIMIT 1;
    `;

    console.log('Matching rows count:', rows?.length ?? 0);

    if (!rows || rows.length === 0) {
      console.warn(`[TRACK NOT FOUND] No record matched for: "${normalized}"`);
      return {
        success: false,
        error: `"${rawInput}" নম্বরে কোনো নিবন্ধন খুঁজে পাওয়া যায়নি। আপনার ট্র্যাকিং কোড বা স্টুডেন্ট আইডি সঠিকভাবে দেওয়া হয়েছে কিনা নিশ্চিত করুন।`,
      };
    }

    const matchedRecord = rows[0] as TrackResult;
    console.log('Found record successfully:', matchedRecord.reg_code, matchedRecord.full_name);

    return {
      success: true,
      data: matchedRecord,
    };
  } catch (error: any) {
    console.error('🔥 [CRITICAL DB ERROR IN trackRegistration]:', error);
    return {
      success: false,
      error: `ডাটাবেজ সংযোগে সমস্যা হয়েছে (${error?.message || 'Server error'})। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।`,
    };
  }
}