/**
 * fix-arabic-numerals.mjs
 *
 * Mendeteksi semua konten Arabic (titleAr, contentAr, judulAr, deskripsiAr, excerptAr)
 * di database yang masih menggunakan angka Latin (0-9), lalu menggantinya dengan
 * angka Arab-Indik (٠-٩) yang benar.
 *
 * Jalankan: node scripts/fix-arabic-numerals.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// ─── Load .env ───────────────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const envPath    = path.resolve(__dirname, '../.env');

if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...values] = trimmed.split('=');
      const val = values.join('=').replace(/^["']|["']$/g, '');
      if (key && !process.env[key.trim()]) process.env[key.trim()] = val.trim();
    }
  }
}

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;
if (!connectionString) { console.error('ERROR: No DATABASE_URL found'); process.exit(1); }

const pool    = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma  = new PrismaClient({ adapter });

// ─── Konversi angka Latin → Arab-Indik ───────────────────────────────────────
function toArabicNumerals(text) {
  if (!text) return text;
  return text.replace(/[0-9]/g, (d) => String.fromCharCode(d.charCodeAt(0) + 0x0630));
}

function hasLatinDigits(text) {
  return text && /[0-9]/.test(text);
}

// ─── Helper log ──────────────────────────────────────────────────────────────
let totalFixed = 0;
let totalChecked = 0;

function logFixed(table, id, field, before, after) {
  console.log(`   ✅ [${table}] ID: ...${id.slice(-8)}`);
  console.log(`      ${field}:`);
  console.log(`        Before: "${before.substring(0, 80)}..."`);
  console.log(`        After : "${after.substring(0, 80)}..."`);
}

// ─── Fix per tabel ───────────────────────────────────────────────────────────

async function fixNews() {
  const records = await prisma.news.findMany();
  totalChecked += records.length;
  console.log(`\n📰 Berita (${records.length} record):`);
  let fixed = 0;
  for (const r of records) {
    const newTitleAr   = r.titleAr   && hasLatinDigits(r.titleAr)   ? toArabicNumerals(r.titleAr)   : undefined;
    const newContentAr = r.contentAr && hasLatinDigits(r.contentAr) ? toArabicNumerals(r.contentAr) : undefined;
    if (newTitleAr || newContentAr) {
      const data = {};
      if (newTitleAr)   { data.titleAr   = newTitleAr;   logFixed('news', r.id, 'titleAr',   r.titleAr,   newTitleAr); }
      if (newContentAr) { data.contentAr = newContentAr; logFixed('news', r.id, 'contentAr', r.contentAr, newContentAr); }
      await prisma.news.update({ where: { id: r.id }, data });
      fixed++;
    }
  }
  totalFixed += fixed;
  if (fixed === 0) console.log('   ✔️  Semua angka sudah benar');
  else console.log(`   🔧 Fixed ${fixed}/${records.length} record`);
}

async function fixAnnouncements() {
  const records = await prisma.announcement.findMany();
  totalChecked += records.length;
  console.log(`\n📢 Pengumuman (${records.length} record):`);
  let fixed = 0;
  for (const r of records) {
    const newTitleAr   = r.titleAr   && hasLatinDigits(r.titleAr)   ? toArabicNumerals(r.titleAr)   : undefined;
    const newContentAr = r.contentAr && hasLatinDigits(r.contentAr) ? toArabicNumerals(r.contentAr) : undefined;
    if (newTitleAr || newContentAr) {
      const data = {};
      if (newTitleAr)   { data.titleAr   = newTitleAr;   logFixed('announcements', r.id, 'titleAr',   r.titleAr,   newTitleAr); }
      if (newContentAr) { data.contentAr = newContentAr; logFixed('announcements', r.id, 'contentAr', r.contentAr, newContentAr); }
      await prisma.announcement.update({ where: { id: r.id }, data });
      fixed++;
    }
  }
  totalFixed += fixed;
  if (fixed === 0) console.log('   ✔️  Semua angka sudah benar');
  else console.log(`   🔧 Fixed ${fixed}/${records.length} record`);
}

async function fixPrograms() {
  const records = await prisma.program.findMany();
  totalChecked += records.length;
  console.log(`\n📦 Program (${records.length} record):`);
  let fixed = 0;
  for (const r of records) {
    const newTitleAr    = r.titleAr   && hasLatinDigits(r.titleAr)   ? toArabicNumerals(r.titleAr)   : undefined;
    const newExcerptAr  = r.excerptAr && hasLatinDigits(r.excerptAr) ? toArabicNumerals(r.excerptAr) : undefined;
    const newContentAr  = r.contentAr && hasLatinDigits(r.contentAr) ? toArabicNumerals(r.contentAr) : undefined;
    if (newTitleAr || newExcerptAr || newContentAr) {
      const data = {};
      if (newTitleAr)   { data.titleAr   = newTitleAr;   logFixed('programs', r.id, 'titleAr',   r.titleAr,   newTitleAr); }
      if (newExcerptAr) { data.excerptAr = newExcerptAr; logFixed('programs', r.id, 'excerptAr', r.excerptAr, newExcerptAr); }
      if (newContentAr) { data.contentAr = newContentAr; logFixed('programs', r.id, 'contentAr', r.contentAr, newContentAr); }
      await prisma.program.update({ where: { id: r.id }, data });
      fixed++;
    }
  }
  totalFixed += fixed;
  if (fixed === 0) console.log('   ✔️  Semua angka sudah benar');
  else console.log(`   🔧 Fixed ${fixed}/${records.length} record`);
}

async function fixKampanye() {
  const records = await prisma.kampanye.findMany();
  totalChecked += records.length;
  console.log(`\n📊 Kampanye (${records.length} record):`);
  let fixed = 0;
  for (const r of records) {
    const newJudulAr    = r.judulAr    && hasLatinDigits(r.judulAr)    ? toArabicNumerals(r.judulAr)    : undefined;
    const newDeskripsiAr = r.deskripsiAr && hasLatinDigits(r.deskripsiAr) ? toArabicNumerals(r.deskripsiAr) : undefined;
    if (newJudulAr || newDeskripsiAr) {
      const data = {};
      if (newJudulAr)     { data.judulAr    = newJudulAr;    logFixed('kampanyes', r.id, 'judulAr',    r.judulAr,    newJudulAr); }
      if (newDeskripsiAr) { data.deskripsiAr = newDeskripsiAr; logFixed('kampanyes', r.id, 'deskripsiAr', r.deskripsiAr, newDeskripsiAr); }
      await prisma.kampanye.update({ where: { id: r.id }, data });
      fixed++;
    }
  }
  totalFixed += fixed;
  if (fixed === 0) console.log('   ✔️  Semua angka sudah benar');
  else console.log(`   🔧 Fixed ${fixed}/${records.length} record`);
}

async function fixNewsletters() {
  const records = await prisma.newsletter.findMany();
  totalChecked += records.length;
  console.log(`\n📄 Newsletter (${records.length} record):`);
  let fixed = 0;
  for (const r of records) {
    const newJudulAr = r.judulAr && hasLatinDigits(r.judulAr) ? toArabicNumerals(r.judulAr) : undefined;
    if (newJudulAr) {
      logFixed('newsletters', r.id, 'judulAr', r.judulAr, newJudulAr);
      await prisma.newsletter.update({ where: { id: r.id }, data: { judulAr: newJudulAr } });
      fixed++;
    }
  }
  totalFixed += fixed;
  if (fixed === 0) console.log('   ✔️  Semua angka sudah benar');
  else console.log(`   🔧 Fixed ${fixed}/${records.length} record`);
}

async function fixDocuments() {
  const records = await prisma.document.findMany();
  totalChecked += records.length;
  console.log(`\n🗂️  Dokumen (${records.length} record):`);
  let fixed = 0;
  for (const r of records) {
    const newJudulAr = r.judulAr && hasLatinDigits(r.judulAr) ? toArabicNumerals(r.judulAr) : undefined;
    if (newJudulAr) {
      logFixed('documents', r.id, 'judulAr', r.judulAr, newJudulAr);
      await prisma.document.update({ where: { id: r.id }, data: { judulAr: newJudulAr } });
      fixed++;
    }
  }
  totalFixed += fixed;
  if (fixed === 0) console.log('   ✔️  Semua angka sudah benar');
  else console.log(`   🔧 Fixed ${fixed}/${records.length} record`);
}

async function fixBanners() {
  const records = await prisma.banner.findMany();
  totalChecked += records.length;
  console.log(`\n🖼️  Banner (${records.length} record):`);
  let fixed = 0;
  for (const r of records) {
    const newTitleAr = r.titleAr && hasLatinDigits(r.titleAr) ? toArabicNumerals(r.titleAr) : undefined;
    if (newTitleAr) {
      logFixed('banners', r.id, 'titleAr', r.titleAr, newTitleAr);
      await prisma.banner.update({ where: { id: r.id }, data: { titleAr: newTitleAr } });
      fixed++;
    }
  }
  totalFixed += fixed;
  if (fixed === 0) console.log('   ✔️  Semua angka sudah benar');
  else console.log(`   🔧 Fixed ${fixed}/${records.length} record`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n══════════════════════════════════════════════════════════════════');
  console.log('  🔢  FIX ARABIC NUMERALS — Konversi Angka Latin → Arab-Indik');
  console.log('══════════════════════════════════════════════════════════════════');
  console.log('  0→٠  1→١  2→٢  3→٣  4→٤  5→٥  6→٦  7→٧  8→٨  9→٩');
  console.log('══════════════════════════════════════════════════════════════════');

  await fixNews();
  await fixAnnouncements();
  await fixPrograms();
  await fixKampanye();
  await fixNewsletters();
  await fixDocuments();
  await fixBanners();

  console.log('\n══════════════════════════════════════════════════════════════════');
  console.log(`  📊 SELESAI: ${totalFixed} record difix dari ${totalChecked} record yang dicek`);
  console.log('══════════════════════════════════════════════════════════════════\n');

  await pool.end();
}

main().catch(async (e) => {
  console.error(e);
  await pool.end();
  process.exit(1);
});
