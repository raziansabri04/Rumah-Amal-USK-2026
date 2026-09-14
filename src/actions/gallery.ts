'use server';

import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

type UploadResult = {
    uploaded: { imageUrl: string }[];
    errors: string[];
};

export async function getPaginatedGallery(page: number = 1, limit: number = 8, search: string = '') {
    const skip = (page - 1) * limit;

    const where: any = search
        ? { imageUrl: { contains: search, mode: 'insensitive' as const } }
        : {};

    const [items, totalCount] = await Promise.all([
        prisma.gallery.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        }),
        prisma.gallery.count({ where }),
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

export async function addGalleryImage(imageUrl: string) {
    if (!imageUrl) throw new Error('URL Gambar tidak boleh kosong.');

    const created = await prisma.gallery.create({
        data: { imageUrl },
    });

    revalidatePath('/admin/galeri');
    revalidatePath('/galeri');
    revalidatePath('/');
    return created;
}

export async function updateGalleryImage(id: string, imageUrl: string) {
    if (!imageUrl) throw new Error('URL Gambar tidak boleh kosong.');

    const updated = await prisma.gallery.update({
        where: { id },
        data: { imageUrl },
    });

    revalidatePath('/admin/galeri');
    revalidatePath('/galeri');
    revalidatePath('/');
    return updated;
}


export async function uploadGalleryImages(formData: FormData): Promise<UploadResult> {
    const files = formData.getAll('files') as File[];
    const uploaded: { imageUrl: string }[] = [];
    const errors: string[] = [];

    for (const file of files) {
        if (!file || file.size === 0) continue;

        try {
            const ext = file.name.split('.').pop() || 'jpg';
            const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

            const { error } = await supabase.storage
                .from('Galeri')
                .upload(fileName, file, { cacheControl: '3600', upsert: false });

            if (error) {
                errors.push(`${file.name}: ${error.message}`);
                continue;
            }

            const { data } = supabase.storage.from('Galeri').getPublicUrl(fileName);

            const created = await prisma.gallery.create({
                data: { imageUrl: data.publicUrl },
            });

            uploaded.push({ imageUrl: created.imageUrl });
        } catch (e) {
            errors.push(`${file.name}: ${(e as Error).message}`);
        }
    }

    revalidatePath('/admin/galeri');
    revalidatePath('/galeri');
    revalidatePath('/');
    return { uploaded, errors };
}

export async function deleteGalleryImage(id: string, imageUrl: string) {
    try {
        const url = new URL(imageUrl);
        const rawPath = url.pathname;
        const splitKey = rawPath.includes('/Galeri/') ? '/Galeri/' : '/galeri/';
        const path = rawPath.split(splitKey)[1];

        if (path) {
            await supabase.storage.from('Galeri').remove([path]);
        }
    } catch {
    }

    await prisma.gallery.delete({ where: { id } });
    revalidatePath('/admin/galeri');
    revalidatePath('/galeri');
    revalidatePath('/');
}