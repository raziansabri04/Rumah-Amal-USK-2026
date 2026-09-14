import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Menghapus file dari Supabase Storage berdasarkan public URL file tersebut
 */
export async function deleteStorageFileByUrl(publicUrl: string | null | undefined) {
  if (!publicUrl || !publicUrl.includes('/storage/v1/object/public/')) return;
  try {
    const url = new URL(publicUrl);
    const parts = url.pathname.split('/storage/v1/object/public/');
    if (parts.length < 2) return;
    const bucketAndPath = decodeURIComponent(parts[1]);
    const slashIdx = bucketAndPath.indexOf('/');
    if (slashIdx === -1) return;
    const bucket = bucketAndPath.slice(0, slashIdx);
    const filePath = bucketAndPath.slice(slashIdx + 1);

    if (bucket && filePath) {
      await supabase.storage.from(bucket).remove([filePath]);
    }
  } catch (err) {
    console.error('[deleteStorageFileByUrl Error]', err);
  }
}
