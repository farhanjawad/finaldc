'use server';

import { sql } from '../db';
import { calculateRegistrationFee } from '../lib/fee';
import { 
  RegistrationFormData, 
  ActionResponse, 
  RegistrationSuccessData, 
  KU_DISCIPLINES,
  DisciplineType 
} from '../lib/types';
import crypto from 'crypto';

/**
 * Generates an 8-character uppercase tracking code (e.g. KU-9X4A2B).
 */
function generateRegistrationCode(): string {
  const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `KU-${randomHex}`;
}

export async function submitRegistration(
  formData: RegistrationFormData
): Promise<ActionResponse<RegistrationSuccessData>> {
  try {
    const fullName = formData.fullName.trim();
    const email = formData.email.trim().toLowerCase();
    const phone = formData.phone.trim();
    const studentId = formData.studentId.trim();
    const discipline = formData.discipline as DisciplineType;
    const gender = formData.gender;
    const isContinuing26 = Boolean(formData.isContinuing26);
    const paymentMethod = formData.paymentMethod;
    const transactionId = formData.transactionId?.trim() || null;
    const senderNumber = formData.senderNumber?.trim() || null;
    const ambassadorName = formData.ambassadorName?.trim() || null;

    // 1. Basic validation checks
    if (!fullName || !email || !phone || !studentId || !discipline || !gender || !paymentMethod) {
      return {
        success: false,
        error: 'অনুগ্রহ করে সকল আবশ্যকীয় তথ্য পূরণ করুন।',
      };
    }

    // Validate discipline against official 29 KU disciplines
    if (!KU_DISCIPLINES.includes(discipline)) {
      return {
        success: false,
        error: 'নির্বাচিত ডিসিপ্লিনটি সঠিক নয়।',
      };
    }

    // 2. Server-side fee recalculation (tamper-proof)
    const feeCalculation = calculateRegistrationFee(studentId, isContinuing26);
    const verifiedFeeAmount = feeCalculation.feeAmount;
    const batchYear = feeCalculation.batchYear;

    // 3. Payment details validation based on method
    if (paymentMethod === 'bkash' || paymentMethod === 'nagad') {
      if (!transactionId || !senderNumber) {
        return {
          success: false,
          error: 'বিকাশ অথবা নগদ পেমেন্টের ক্ষেত্রে ট্রানজেকশন আইডি এবং প্রেরকের নম্বর আবশ্যক।',
        };
      }
    } else if (paymentMethod === 'ambassador') {
      if (!ambassadorName) {
        return {
          success: false,
          error: 'অ্যাম্বাসেডরের মাধ্যমে পেমেন্টের ক্ষেত্রে অ্যাম্বাসেডরের নাম উল্লেখ করুন।',
        };
      }
    }

    // 4. Duplicate checks (student_id or email)
    const existingRows = await sql`
      SELECT id, student_id, email 
      FROM registrations 
      WHERE student_id = ${studentId} OR email = ${email}
      LIMIT 1;
    `;

    if (existingRows.length > 0) {
      const existing = existingRows[0];
      if (existing.student_id === studentId) {
        return {
          success: false,
          error: 'এই স্টুডেন্ট আইডি দিয়ে ইতিমধ্যে রেজিস্ট্রেশন সম্পন্ন হয়েছে।',
        };
      }
      if (existing.email === email) {
        return {
          success: false,
          error: 'এই ইমেইল অ্যাড্রেস দিয়ে ইতিমধ্যে রেজিস্ট্রেশন সম্পন্ন হয়েছে।',
        };
      }
    }

    // 5. Generate unique registration tracking code
    let regCode = generateRegistrationCode();
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 5) {
      const collisionCheck = await sql`
        SELECT id FROM registrations WHERE reg_code = ${regCode} LIMIT 1;
      `;
      if (collisionCheck.length === 0) {
        isUnique = true;
      } else {
        regCode = generateRegistrationCode();
        attempts++;
      }
    }

    // 6. Parameterized SQL insert into Neon
    await sql`
      INSERT INTO registrations (
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
        checked_in
      ) VALUES (
        ${regCode},
        ${fullName},
        ${email},
        ${phone},
        ${studentId},
        ${discipline},
        ${gender},
        ${batchYear},
        ${isContinuing26},
        ${verifiedFeeAmount},
        ${paymentMethod},
        ${transactionId},
        ${senderNumber},
        ${ambassadorName},
        'pending',
        FALSE
      );
    `;

    return {
      success: true,
      message: 'রেজিস্ট্রেশন সফলভাবে সম্পন্ন হয়েছে।',
      data: {
        fullName,
        regCode,
        trackingUrl: `/track?code=${regCode}`,
      },
    };
  } catch (err) {
    console.error('Registration submission error:', err);
    return {
      success: false,
      error: 'সার্ভারে সমস্যা দেখা দিয়েছে। কিছুক্ষণ পর পুনরায় চেষ্টা করুন।',
    };
  }
}