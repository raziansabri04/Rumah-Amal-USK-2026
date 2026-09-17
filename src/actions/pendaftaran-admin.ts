'use server';

import { neonPrisma } from '@/lib/neon-prisma';
import { revalidatePath } from 'next/cache';

// Helper slugify
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// =======================================================================
// 1. PROGRAM BANTUAN CRUD
// =======================================================================

export async function getProgramBantuanList(search = '', statusFilter = '') {
  try {
    const where: any = {};

    if (search) {
      where.OR = [
        { nama: { contains: search, mode: 'insensitive' } },
        { deskripsi: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (statusFilter && statusFilter !== 'all') {
      where.status = statusFilter;
    }

    const programs = await neonPrisma.programBantuan.findMany({
      where,
      include: {
        _count: {
          select: {
            documentFields: true,
            biodataFields: true,
            submissions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: programs };
  } catch (error: any) {
    console.error('[getProgramBantuanList error]', error);
    return { success: false, error: error.message || 'Gagal memuat daftar program.' };
  }
}

export async function getProgramBantuanById(id: string) {
  try {
    const program = await neonPrisma.programBantuan.findUnique({
      where: { id },
      include: {
        documentFields: {
          orderBy: { order: 'asc' },
        },
        biodataFields: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { submissions: true },
        },
      },
    });

    if (!program) {
      return { success: false, error: 'Program bantuan tidak ditemukan.' };
    }

    return { success: true, data: program };
  } catch (error: any) {
    console.error('[getProgramBantuanById error]', error);
    return { success: false, error: error.message || 'Gagal mengambil detail program.' };
  }
}

export async function createProgramBantuan(formData: {
  nama: string;
  slug?: string;
  deskripsi?: string;
  gambarUrl?: string;
  status?: string;
  tanggalBuka?: string | null;
  tanggalTutup?: string | null;
  linkDriveTemplate?: string;
}) {
  try {
    if (!formData.nama?.trim()) {
      return { success: false, error: 'Nama program wajib diisi.' };
    }

    let slug = formData.slug?.trim() || generateSlug(formData.nama);
    const existing = await neonPrisma.programBantuan.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const newProgram = await neonPrisma.programBantuan.create({
      data: {
        nama: formData.nama.trim(),
        slug,
        deskripsi: formData.deskripsi?.trim() || null,
        gambarUrl: formData.gambarUrl?.trim() || null,
        status: formData.status || 'draft',
        tanggalBuka: formData.tanggalBuka ? new Date(formData.tanggalBuka) : null,
        tanggalTutup: formData.tanggalTutup ? new Date(formData.tanggalTutup) : null,
        linkDriveTemplate: formData.linkDriveTemplate?.trim() || null,
      },
    });

    revalidatePath('/admin/pendaftaran');
    return { success: true, data: newProgram };
  } catch (error: any) {
    console.error('[createProgramBantuan error]', error);
    return { success: false, error: error.message || 'Gagal membuat program baru.' };
  }
}

export async function updateProgramBantuan(
  id: string,
  formData: {
    nama?: string;
    slug?: string;
    deskripsi?: string;
    gambarUrl?: string;
    status?: string;
    tanggalBuka?: string | null;
    tanggalTutup?: string | null;
    linkDriveTemplate?: string;
  }
) {
  try {
    const updateData: any = {};
    if (formData.nama !== undefined) updateData.nama = formData.nama.trim();
    if (formData.deskripsi !== undefined) updateData.deskripsi = formData.deskripsi.trim() || null;
    if (formData.gambarUrl !== undefined) updateData.gambarUrl = formData.gambarUrl.trim() || null;
    if (formData.status !== undefined) updateData.status = formData.status;
    if (formData.linkDriveTemplate !== undefined) updateData.linkDriveTemplate = formData.linkDriveTemplate.trim() || null;
    if (formData.tanggalBuka !== undefined) {
      updateData.tanggalBuka = formData.tanggalBuka ? new Date(formData.tanggalBuka) : null;
    }
    if (formData.tanggalTutup !== undefined) {
      updateData.tanggalTutup = formData.tanggalTutup ? new Date(formData.tanggalTutup) : null;
    }

    if (formData.slug?.trim()) {
      const slug = generateSlug(formData.slug);
      const existing = await neonPrisma.programBantuan.findFirst({
        where: { slug, NOT: { id } },
      });
      if (!existing) {
        updateData.slug = slug;
      }
    }

    const updated = await neonPrisma.programBantuan.update({
      where: { id },
      data: updateData,
    });

    revalidatePath('/admin/pendaftaran');
    revalidatePath(`/admin/pendaftaran/${id}`);
    revalidatePath('/pendaftaran');
    return { success: true, data: updated };
  } catch (error: any) {
    console.error('[updateProgramBantuan error]', error);
    return { success: false, error: error.message || 'Gagal memperbarui program.' };
  }
}

export async function deleteProgramBantuan(id: string) {
  try {
    await neonPrisma.programBantuan.delete({
      where: { id },
    });

    revalidatePath('/admin/pendaftaran');
    revalidatePath('/pendaftaran');
    return { success: true };
  } catch (error: any) {
    console.error('[deleteProgramBantuan error]', error);
    return { success: false, error: error.message || 'Gagal menghapus program.' };
  }
}

export async function toggleProgramStatus(id: string, status: 'draft' | 'dibuka' | 'ditutup') {
  try {
    const updated = await neonPrisma.programBantuan.update({
      where: { id },
      data: { status },
    });

    revalidatePath('/admin/pendaftaran');
    revalidatePath(`/admin/pendaftaran/${id}`);
    revalidatePath('/pendaftaran');
    return { success: true, data: updated };
  } catch (error: any) {
    console.error('[toggleProgramStatus error]', error);
    return { success: false, error: error.message || 'Gagal mengubah status program.' };
  }
}

// =======================================================================
// 2. DOCUMENT FIELD BUILDER
// =======================================================================

export async function addDocumentField(
  programId: string,
  field: {
    key: string;
    label: string;
    required: boolean;
    maxAgeMonths?: number | null;
    expectedKeywords?: string[];
    nameCheckApplicable: boolean;
    isSingleCombinedUpload: boolean;
    needsStampCheck: boolean;
  }
) {
  try {
    if (!field.label?.trim()) {
      return { success: false, error: 'Label syarat dokumen wajib diisi.' };
    }

    const key = (field.key || generateSlug(field.label)).replace(/-/g, '_');

    // Cek duplikasi key dalam program
    const existing = await neonPrisma.documentField.findUnique({
      where: { programId_key: { programId, key } },
    });
    if (existing) {
      return { success: false, error: `Key dokumen "${key}" sudah ada di program ini. Gunakan nama/key yang berbeda.` };
    }

    // Hitung urutan terakhir
    const count = await neonPrisma.documentField.count({ where: { programId } });

    const created = await neonPrisma.documentField.create({
      data: {
        programId,
        key,
        label: field.label.trim(),
        required: field.required ?? true,
        maxAgeMonths: field.maxAgeMonths ? Number(field.maxAgeMonths) : null,
        expectedKeywords: field.expectedKeywords || [],
        nameCheckApplicable: field.nameCheckApplicable ?? false,
        isSingleCombinedUpload: field.isSingleCombinedUpload ?? false,
        needsStampCheck: field.needsStampCheck ?? false,
        order: count,
      },
    });

    revalidatePath(`/admin/pendaftaran/${programId}`);
    return { success: true, data: created };
  } catch (error: any) {
    console.error('[addDocumentField error]', error);
    return { success: false, error: error.message || 'Gagal menambahkan syarat dokumen.' };
  }
}

export async function updateDocumentField(
  id: string,
  field: {
    key?: string;
    label?: string;
    required?: boolean;
    maxAgeMonths?: number | null;
    expectedKeywords?: string[];
    nameCheckApplicable?: boolean;
    isSingleCombinedUpload?: boolean;
    needsStampCheck?: boolean;
  }
) {
  try {
    const existing = await neonPrisma.documentField.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: 'Syarat dokumen tidak ditemukan.' };
    }

    const updateData: any = {};
    if (field.label !== undefined) updateData.label = field.label.trim();
    if (field.required !== undefined) updateData.required = field.required;
    if (field.maxAgeMonths !== undefined) updateData.maxAgeMonths = field.maxAgeMonths ? Number(field.maxAgeMonths) : null;
    if (field.expectedKeywords !== undefined) updateData.expectedKeywords = field.expectedKeywords;
    if (field.nameCheckApplicable !== undefined) updateData.nameCheckApplicable = field.nameCheckApplicable;
    if (field.isSingleCombinedUpload !== undefined) updateData.isSingleCombinedUpload = field.isSingleCombinedUpload;
    if (field.needsStampCheck !== undefined) updateData.needsStampCheck = field.needsStampCheck;

    if (field.key && field.key !== existing.key) {
      const key = field.key.replace(/-/g, '_').trim();
      const duplicate = await neonPrisma.documentField.findUnique({
        where: { programId_key: { programId: existing.programId, key } },
      });
      if (duplicate) {
        return { success: false, error: `Key "${key}" sudah digunakan oleh dokumen lain di program ini.` };
      }
      updateData.key = key;
    }

    const updated = await neonPrisma.documentField.update({
      where: { id },
      data: updateData,
    });

    revalidatePath(`/admin/pendaftaran/${existing.programId}`);
    return { success: true, data: updated };
  } catch (error: any) {
    console.error('[updateDocumentField error]', error);
    return { success: false, error: error.message || 'Gagal mengupdate syarat dokumen.' };
  }
}

export async function deleteDocumentField(id: string) {
  try {
    const existing = await neonPrisma.documentField.findUnique({ where: { id } });
    if (!existing) return { success: false, error: 'Field tidak ditemukan.' };

    await neonPrisma.documentField.delete({ where: { id } });

    revalidatePath(`/admin/pendaftaran/${existing.programId}`);
    return { success: true };
  } catch (error: any) {
    console.error('[deleteDocumentField error]', error);
    return { success: false, error: error.message || 'Gagal menghapus syarat dokumen.' };
  }
}

// =======================================================================
// 3. BIODATA FIELD BUILDER
// =======================================================================

export async function addBiodataField(
  programId: string,
  field: {
    key: string;
    label: string;
    tipe: string;
    options?: string[];
    required: boolean;
  }
) {
  try {
    if (!field.label?.trim()) {
      return { success: false, error: 'Label syarat biodata wajib diisi.' };
    }

    const key = (field.key || generateSlug(field.label)).replace(/-/g, '_');

    // Cek larangan khusus di requirement: "tanggal pendaftaran/tanggal daftar"
    if (key.includes('tanggal_daftar') || key.includes('tanggal_pendaftaran')) {
      return {
        success: false,
        error: 'Tanggal pendaftaran tidak boleh dibuat manual sebagai field biodata (otomatis diambil dari timestamp sistem).',
      };
    }

    const existing = await neonPrisma.biodataField.findUnique({
      where: { programId_key: { programId, key } },
    });
    if (existing) {
      return { success: false, error: `Key field "${key}" sudah ada di program ini.` };
    }

    const count = await neonPrisma.biodataField.count({ where: { programId } });

    const created = await neonPrisma.biodataField.create({
      data: {
        programId,
        key,
        label: field.label.trim(),
        tipe: field.tipe || 'text',
        options: field.options || [],
        required: field.required ?? true,
        order: count,
      },
    });

    revalidatePath(`/admin/pendaftaran/${programId}`);
    return { success: true, data: created };
  } catch (error: any) {
    console.error('[addBiodataField error]', error);
    return { success: false, error: error.message || 'Gagal menambahkan field biodata.' };
  }
}

export async function updateBiodataField(
  id: string,
  field: {
    key?: string;
    label?: string;
    tipe?: string;
    options?: string[];
    required?: boolean;
  }
) {
  try {
    const existing = await neonPrisma.biodataField.findUnique({ where: { id } });
    if (!existing) return { success: false, error: 'Field biodata tidak ditemukan.' };

    const updateData: any = {};
    if (field.label !== undefined) updateData.label = field.label.trim();
    if (field.tipe !== undefined) updateData.tipe = field.tipe;
    if (field.options !== undefined) updateData.options = field.options;
    if (field.required !== undefined) updateData.required = field.required;

    if (field.key && field.key !== existing.key) {
      const key = field.key.replace(/-/g, '_').trim();
      const duplicate = await neonPrisma.biodataField.findUnique({
        where: { programId_key: { programId: existing.programId, key } },
      });
      if (duplicate) {
        return { success: false, error: `Key "${key}" sudah digunakan oleh field lain.` };
      }
      updateData.key = key;
    }

    const updated = await neonPrisma.biodataField.update({
      where: { id },
      data: updateData,
    });

    revalidatePath(`/admin/pendaftaran/${existing.programId}`);
    return { success: true, data: updated };
  } catch (error: any) {
    console.error('[updateBiodataField error]', error);
    return { success: false, error: error.message || 'Gagal mengupdate field biodata.' };
  }
}

export async function deleteBiodataField(id: string) {
  try {
    const existing = await neonPrisma.biodataField.findUnique({ where: { id } });
    if (!existing) return { success: false, error: 'Field tidak ditemukan.' };

    await neonPrisma.biodataField.delete({ where: { id } });

    revalidatePath(`/admin/pendaftaran/${existing.programId}`);
    return { success: true };
  } catch (error: any) {
    console.error('[deleteBiodataField error]', error);
    return { success: false, error: error.message || 'Gagal menghapus field biodata.' };
  }
}

// =======================================================================
// 4. SUBMISSIONS & SELEKSI
// =======================================================================

export async function getSubmissionsByProgram(
  programId: string,
  options: {
    status?: string;
    page?: number;
    limit?: number;
    search?: string;
  } = {}
) {
  try {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = { programId };

    if (options.status && options.status !== 'all') {
      where.status = options.status;
    }

    const [items, total] = await Promise.all([
      neonPrisma.submission.findMany({
        where,
        include: {
          documents: true,
        },
        orderBy: { submittedAt: 'desc' },
        skip,
        take: limit,
      }),
      neonPrisma.submission.count({ where }),
    ]);

    // Status counter untuk tab badge
    const counts = await Promise.all([
      neonPrisma.submission.count({ where: { programId } }),
      neonPrisma.submission.count({ where: { programId, status: 'menunggu_diproses' } }),
      neonPrisma.submission.count({ where: { programId, status: 'sedang_diproses' } }),
      neonPrisma.submission.count({ where: { programId, status: 'belum_diseleksi' } }),
      neonPrisma.submission.count({ where: { programId, status: 'lolos' } }),
      neonPrisma.submission.count({ where: { programId, status: 'tidak_lolos' } }),
      neonPrisma.submission.count({ where: { programId, status: 'gagal_diproses' } }),
    ]);

    return {
      success: true,
      data: items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      statusCounts: {
        all: counts[0],
        menunggu_diproses: counts[1],
        sedang_diproses: counts[2],
        belum_diseleksi: counts[3],
        lolos: counts[4],
        tidak_lolos: counts[5],
        gagal_diproses: counts[6],
      },
    };
  } catch (error: any) {
    console.error('[getSubmissionsByProgram error]', error);
    return { success: false, error: error.message || 'Gagal memuat data pendaftaran.' };
  }
}

export async function updateSubmissionStatus(submissionId: string, newStatus: string) {
  try {
    const updated = await neonPrisma.submission.update({
      where: { id: submissionId },
      data: { status: newStatus },
    });

    revalidatePath(`/admin/pendaftaran/${updated.programId}`);
    return { success: true, data: updated };
  } catch (error: any) {
    console.error('[updateSubmissionStatus error]', error);
    return { success: false, error: error.message || 'Gagal memperbarui status pendaftar.' };
  }
}

// =======================================================================
// 5. TRIGGER WORKER MANUAL
// =======================================================================

export async function triggerWorkerManual() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const cronSecret = process.env.CRON_SECRET || 'secret';

    const res = await fetch(`${baseUrl}/api/worker/proses-antrean`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cronSecret}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorText = await res.text();
      return { success: false, error: `Worker error (${res.status}): ${errorText}` };
    }

    const data = await res.json();
    revalidatePath('/admin/pendaftaran');
    return { success: true, data };
  } catch (error: any) {
    console.error('[triggerWorkerManual error]', error);
    return { success: false, error: error.message || 'Gagal memicu worker antrean.' };
  }
}
