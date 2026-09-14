'use server';

import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';
import { autoTranslateAll } from '@/lib/translate';
import { revalidatePath } from 'next/cache';

type UploadResult = {
    success: boolean;
    error?: string;
};

export async function getPaginatedNewsletter(page: number = 1, limit: number = 5, search: string = '') {
    const skip = (page - 1) * limit;

    const where: any = search
        ? {
            OR: [
                { judul: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {};

    const [items, totalCount] = await Promise.all([
        prisma.newsletter.findMany({
            where,
            orderBy: { tanggal: 'desc' },
            skip,
            take: limit,
        }),
        prisma.newsletter.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit) || 1;

    return {
        items,
        totalCount,
        totalPages,
        page,
        limit,
    };
}

export async function addNewsletter(formData: FormData): Promise<UploadResult> {
    const judul = (formData.get('judul') as string).trim();
    const tanggalStr = formData.get('tanggal') as string;
    const imageUrl = (formData.get('imageUrl') as string | null)?.trim() || null;

    if (!judul || !tanggalStr || !imageUrl) {
        return { success: false, error: 'Judul, Tanggal, dan Gambar Newsletter wajib diisi.' };
    }

    let judulEn: string | null = null;
    let judulAr: string | null = null;
    try {
        const translated = await autoTranslateAll({ title: judul });
        judulEn = translated.titleEn || null;
        judulAr = translated.titleAr || null;
    } catch (e) {
        console.error('Auto translate newsletter action error:', e);
    }

    try {
        await prisma.newsletter.create({
            data: {
                judul,
                judulEn,
                judulAr,
                tanggal: new Date(tanggalStr),
                imageUrl,
            },
        });

        revalidatePath('/admin/newsletter');
        revalidatePath('/newsletter');
        revalidatePath('/');
        return { success: true };
    } catch (e) {
        return { success: false, error: `Gagal menyimpan: ${(e as Error).message}` };
    }
}

export async function uploadNewsletter(formData: FormData): Promise<UploadResult> {
    const judul = formData.get('judul') as string;
    const tanggalStr = formData.get('tanggal') as string;
    const file = formData.get('file') as File;

    if (!judul || !tanggalStr || !file || file.size === 0) {
        return { success: false, error: 'Data tidak lengkap.' };
    }

    let judulEn: string | null = null;
    let judulAr: string | null = null;
    try {
        const translated = await autoTranslateAll({ title: judul });
        judulEn = translated.titleEn || null;
        judulAr = translated.titleAr || null;
    } catch (e) {
        console.error('Auto translate newsletter upload error:', e);
    }

    try {
        const ext = file.name.split('.').pop() || 'jpg';
        const fileName = `newsletter-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error: uploadError } = await supabase.storage
            .from('Newsletter')
            .upload(fileName, file, { cacheControl: '3600', upsert: false });

        if (uploadError) {
            return { success: false, error: uploadError.message };
        }

        const { data } = supabase.storage.from('Newsletter').getPublicUrl(fileName);
        await prisma.newsletter.create({
            data: {
                judul,
                judulEn,
                judulAr,
                tanggal: new Date(tanggalStr),
                imageUrl: data.publicUrl
            },
        });

        revalidatePath('/admin/newsletter');
        revalidatePath('/newsletter');
        revalidatePath('/');
        return { success: true };
    } catch (e) {
        return { success: false, error: `Gagal menyimpan: ${(e as Error).message}` };
    }
}

export async function updateNewsletter(id: string, formData: FormData): Promise<UploadResult> {
    const judul = (formData.get('judul') as string).trim();
    const tanggalStr = formData.get('tanggal') as string;
    const imageUrl = (formData.get('imageUrl') as string | null)?.trim() || null;

    if (!judul || !tanggalStr || !imageUrl) {
        return { success: false, error: 'Judul, Tanggal, dan Gambar Newsletter wajib diisi.' };
    }

    let judulEn: string | null = null;
    let judulAr: string | null = null;
    try {
        const translated = await autoTranslateAll({ title: judul });
        judulEn = translated.titleEn || null;
        judulAr = translated.titleAr || null;
    } catch (e) {
        console.error('Auto translate newsletter action error:', e);
    }

    try {
        await prisma.newsletter.update({
            where: { id },
            data: {
                judul,
                ...(judulEn && { judulEn }),
                ...(judulAr && { judulAr }),
                tanggal: new Date(tanggalStr),
                imageUrl,
            },
        });

        revalidatePath('/admin/newsletter');
        revalidatePath('/newsletter');
        revalidatePath('/');
        return { success: true };
    } catch (e) {
        return { success: false, error: `Gagal memperbarui: ${(e as Error).message}` };
    }
}

export async function deleteNewsletter(id: string, imageUrl: string) {
    try {
        const url = new URL(imageUrl);
        const rawPath = url.pathname;
        const splitKey = rawPath.includes('/Newsletter/') ? '/Newsletter/' : '/newsletter/';
        const path = rawPath.split(splitKey)[1];

        if (path) {
            await supabase.storage.from('Newsletter').remove([path]);
        }
    } catch {
    }

    await prisma.newsletter.delete({ where: { id } });
    revalidatePath('/admin/newsletter');
    revalidatePath('/newsletter');
    revalidatePath('/');
}

