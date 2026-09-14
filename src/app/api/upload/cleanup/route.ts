import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * DELETE /api/upload/cleanup
 * Body: { paths: string[] }  — array of "bucket/filename" paths
 *
 * Dipanggil ketika:
 * 1. User klik tombol "Batal" pada form pengumuman
 * 2. User tutup tab / navigasi tanpa menyimpan (via sendBeacon)
 *
 * Menghapus file yang sudah terupload ke Supabase Storage
 * namun belum tersimpan ke database (orphan files).
 */
export async function DELETE(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: 'Konfigurasi Supabase belum diset.' },
      { status: 500 }
    );
  }

  let paths: string[] = [];
  try {
    const body = await req.json();
    paths = Array.isArray(body?.paths) ? body.paths : [];
  } catch {
    return NextResponse.json({ error: 'Body tidak valid.' }, { status: 400 });
  }

  if (paths.length === 0) {
    return NextResponse.json({ deleted: [] });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Group paths by bucket
  // Path format: "bucket/filename"
  const byBucket: Record<string, string[]> = {};
  for (const p of paths) {
    const [bucket, ...rest] = p.split('/');
    if (!bucket || rest.length === 0) continue;
    const filePath = rest.join('/');
    if (!byBucket[bucket]) byBucket[bucket] = [];
    byBucket[bucket].push(filePath);
  }

  const results: Array<{ bucket: string; path: string; ok: boolean; error?: string }> = [];

  for (const [bucket, filePaths] of Object.entries(byBucket)) {
    const { error } = await supabase.storage.from(bucket).remove(filePaths);
    for (const fp of filePaths) {
      results.push({ bucket, path: fp, ok: !error, error: error?.message });
    }
  }

  const failed = results.filter((r) => !r.ok);
  if (failed.length > 0) {
    console.warn('[Cleanup] Beberapa file gagal dihapus:', failed);
  }

  return NextResponse.json({ deleted: results.filter((r) => r.ok).length, results });
}

// sendBeacon mengirim request sebagai POST dengan Content-Type text/plain
// Kita tangani juga POST agar bisa digunakan dari sendBeacon
export async function POST(req: NextRequest) {
  // sendBeacon sends as text/plain or application/x-www-form-urlencoded
  // We reuse the DELETE handler logic
  const deleteReq = new Request(req.url, {
    method: 'DELETE',
    headers: req.headers,
    body: req.body,
    // @ts-ignore
    duplex: 'half',
  });
  return DELETE(new NextRequest(deleteReq));
}
