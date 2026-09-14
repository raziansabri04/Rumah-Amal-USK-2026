'use server';

import { signIn, signOut } from '@/lib/auth';
import { AuthError } from 'next-auth';

export async function loginAdmin(prevState: string | null, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return 'Email dan password wajib diisi.';
    }

    try {
        await signIn('credentials', {
            email,
            password,
            redirectTo: '/admin/dashboard',
        });
    } catch (error: any) {
        // Next.js redirect throw error khusus dengan nama 'NEXT_REDIRECT'
        if (error?.message === 'NEXT_REDIRECT' || error?.digest?.startsWith('NEXT_REDIRECT')) {
            throw error; // Harus dilempar ulang agar redirect berhasil
        }

        if (error instanceof AuthError) {
            return 'Email atau password salah.';
        }

        // Kembalikan error lain agar tampil di web untuk debugging
        return `Error sistem: ${error?.message || 'Terjadi kesalahan'}`;
    }
    return null;
}

export async function logoutAdmin() {
    await signOut({ redirectTo: '/admin/login' });
}