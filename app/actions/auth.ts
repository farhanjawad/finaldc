'use server';

import { sql } from '../db';
import { ActionResponse, AdminUser } from '../lib/types';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const SESSION_COOKIE_NAME = 'ku_admin_session';

export async function loginAdmin(
  formData: FormData
): Promise<ActionResponse<{ username: string; role: string }>> {
  try {
    const username = formData.get('username')?.toString().trim();
    const password = formData.get('password')?.toString();

    if (!username || !password) {
      return {
        success: false,
        error: 'ইউজারনেম এবং পাসওয়ার্ড উভয়ই আবশ্যক।',
      };
    }

    // Look up admin by username
    const rows = await sql`
      SELECT id, username, password_hash, role
      FROM admins
      WHERE username = ${username}
      LIMIT 1;
    `;

    if (rows.length === 0) {
      return {
        success: false,
        error: 'ভুল ইউজারনেম অথবা পাসওয়ার্ড।',
      };
    }

    const admin = rows[0] as {
      id: number;
      username: string;
      password_hash: string;
      role: 'super_admin' | 'volunteer';
    };

    // Verify bcrypt password hash
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return {
        success: false,
        error: 'ভুল ইউজারনেম অথবা পাসওয়ার্ড।',
      };
    }

    // Generate secure opaque session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Store active session in database
    await sql`
      INSERT INTO admin_sessions (admin_id, token, expires_at)
      VALUES (${admin.id}, ${sessionToken}, ${expiresAt});
    `;

    // Set secure HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: expiresAt,
    });

    return {
      success: true,
      data: {
        username: admin.username,
        role: admin.role,
      },
    };
  } catch (err: any) {
    if (err?.digest?.includes('DYNAMIC_SERVER_USAGE') || err?.digest?.includes('NEXT_REDIRECT')) {
      throw err;
    }
    console.error('Admin login error:', err);
    return {
      success: false,
      error: 'লগইন প্রক্রিয়ায় সমস্যা দেখা দিয়েছে। আবার চেষ্টা করুন।',
    };
  }
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  // Read cookies outside try-catch so Next.js can switch to dynamic rendering without logging a false error
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const rows = await sql`
      SELECT 
        a.id, 
        a.username, 
        a.role, 
        a.created_at
      FROM admin_sessions s
      JOIN admins a ON a.id = s.admin_id
      WHERE s.token = ${token}
        AND s.expires_at > NOW()
      LIMIT 1;
    `;

    if (rows.length === 0) return null;

    return rows[0] as AdminUser;
  } catch (err: any) {
    if (err?.digest?.includes('DYNAMIC_SERVER_USAGE')) {
      throw err;
    }
    console.error('Session retrieval error:', err);
    return null;
  }
}

export async function logoutAdmin(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (token) {
      await sql`
        DELETE FROM admin_sessions
        WHERE token = ${token};
      `;
    }

    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch (err: any) {
    if (err?.digest?.includes('DYNAMIC_SERVER_USAGE')) {
      throw err;
    }
    console.error('Logout error:', err);
  }
}