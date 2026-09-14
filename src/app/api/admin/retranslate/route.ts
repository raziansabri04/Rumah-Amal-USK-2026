import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { autoTranslate } from '@/lib/translate';
import { auth } from '@/lib/auth';

// Patterns that indicate the content has custom elements that may have been corrupted
const NEEDS_RETRANSLATE_PATTERN = /data-type="(?:link-button|download-button|bank-banner)"/i;

export async function POST(req: NextRequest) {
  // Auth check
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const {
      models = ['announcements', 'news', 'programs'], // which models to retranslate
      forceAll = false, // if true, retranslate ALL records; if false, only those with custom elements
      dryRun = false,   // if true, only show what would be updated (no actual DB writes)
    } = body;

    const results: Record<string, { total: number; updated: number; skipped: number; errors: number }> = {};

    // ─── ANNOUNCEMENTS ─────────────────────────────────────────────────────────
    if (models.includes('announcements')) {
      const items = await prisma.announcement.findMany({
        select: { id: true, title: true, content: true, contentEn: true, contentAr: true },
      });

      let updated = 0, skipped = 0, errors = 0;

      for (const item of items) {
        const needsUpdate = forceAll || NEEDS_RETRANSLATE_PATTERN.test(item.content);
        if (!needsUpdate) { skipped++; continue; }

        try {
          const [contentEn, contentAr] = await Promise.all([
            autoTranslate(item.content, 'en'),
            autoTranslate(item.content, 'ar'),
          ]);

          if (!dryRun) {
            await prisma.announcement.update({
              where: { id: item.id },
              data: { contentEn, contentAr },
            });
          }
          updated++;
        } catch (err) {
          console.error(`[retranslate] Announcement ${item.id} error:`, err);
          errors++;
        }
      }

      results.announcements = { total: items.length, updated, skipped, errors };
    }

    // ─── NEWS ──────────────────────────────────────────────────────────────────
    if (models.includes('news')) {
      const items = await prisma.news.findMany({
        select: { id: true, title: true, content: true, contentEn: true, contentAr: true },
      });

      let updated = 0, skipped = 0, errors = 0;

      for (const item of items) {
        const needsUpdate = forceAll || NEEDS_RETRANSLATE_PATTERN.test(item.content);
        if (!needsUpdate) { skipped++; continue; }

        try {
          const [contentEn, contentAr] = await Promise.all([
            autoTranslate(item.content, 'en'),
            autoTranslate(item.content, 'ar'),
          ]);

          if (!dryRun) {
            await prisma.news.update({
              where: { id: item.id },
              data: { contentEn, contentAr },
            });
          }
          updated++;
        } catch (err) {
          console.error(`[retranslate] News ${item.id} error:`, err);
          errors++;
        }
      }

      results.news = { total: items.length, updated, skipped, errors };
    }

    // ─── PROGRAMS ──────────────────────────────────────────────────────────────
    if (models.includes('programs')) {
      const items = await prisma.program.findMany({
        select: { id: true, title: true, content: true, contentEn: true, contentAr: true },
      });

      let updated = 0, skipped = 0, errors = 0;

      for (const item of items) {
        const needsUpdate = forceAll || NEEDS_RETRANSLATE_PATTERN.test(item.content);
        if (!needsUpdate) { skipped++; continue; }

        try {
          const [contentEn, contentAr] = await Promise.all([
            autoTranslate(item.content, 'en'),
            autoTranslate(item.content, 'ar'),
          ]);

          if (!dryRun) {
            await prisma.program.update({
              where: { id: item.id },
              data: { contentEn, contentAr },
            });
          }
          updated++;
        } catch (err) {
          console.error(`[retranslate] Program ${item.id} error:`, err);
          errors++;
        }
      }

      results.programs = { total: items.length, updated, skipped, errors };
    }

    const totalUpdated = Object.values(results).reduce((acc, r) => acc + r.updated, 0);

    return NextResponse.json({
      success: true,
      dryRun,
      forceAll,
      message: dryRun
        ? `[DRY RUN] Would update ${totalUpdated} records`
        : `Successfully re-translated ${totalUpdated} records`,
      results,
    });
  } catch (error) {
    console.error('[POST /api/admin/retranslate]', error);
    return NextResponse.json(
      { error: `Internal Server Error: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
