import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// Load .env manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');

if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  for (const line of envConfig.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...values] = trimmed.split('=');
      const val = values.join('=').replace(/^["']|["']$/g, '');
      if (key && !process.env[key.trim()]) {
        process.env[key.trim()] = val.trim();
      }
    }
  }
}

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;
if (!connectionString) {
  console.error('ERROR: No DATABASE_URL found in .env');
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function pct(filled, total) {
  if (total === 0) return '0% (0 data)';
  return ((filled / total) * 100).toFixed(1) + '%';
}

function analyzeField(items, enField, arField) {
  const total = items.length;
  const enFilled = items.filter(i => i[enField] && String(i[enField]).trim().length > 1).length;
  const arFilled = items.filter(i => i[arField] && String(i[arField]).trim().length > 1).length;
  const bothFilled = items.filter(i =>
    i[enField] && String(i[enField]).trim().length > 1 &&
    i[arField] && String(i[arField]).trim().length > 1
  ).length;

  return { total, enFilled, arFilled, bothFilled };
}

async function main() {
  console.log('\n================================================================================');
  console.log('       ANALISIS KELENGKAPAN TERJEMAHAN i18n DALAM DATABASE (DEEPL / ADMIN DATA)');
  console.log('================================================================================\n');

  // 1. BERITA
  const news = await prisma.news.findMany();
  const newsTitle = analyzeField(news, 'titleEn', 'titleAr');
  const newsContent = analyzeField(news, 'contentEn', 'contentAr');
  const newsExcerpt = analyzeField(news, 'excerpt', 'excerpt'); // check standard excerpt presence

  console.log(`📰 TABEL BERITA (Total: ${news.length} artikel)`);
  console.log(`   ├─ Judul (title)   ➜ EN: ${newsTitle.enFilled}/${newsTitle.total} (${pct(newsTitle.enFilled, newsTitle.total)}) | AR: ${newsTitle.arFilled}/${newsTitle.total} (${pct(newsTitle.arFilled, newsTitle.total)})`);
  console.log(`   └─ Isi (content)   ➜ EN: ${newsContent.enFilled}/${newsContent.total} (${pct(newsContent.enFilled, newsContent.total)}) | AR: ${newsContent.arFilled}/${newsContent.total} (${pct(newsContent.arFilled, newsContent.total)})`);

  // Sample check for actual translated text in news
  if (news.length > 0) {
    console.log('   📌 Contoh Artikel Berita:');
    news.slice(0, 3).forEach((n, idx) => {
      console.log(`      [${idx + 1}] ID: ${n.title.substring(0, 35)}...`);
      console.log(`          EN: ${n.titleEn ? `"${n.titleEn.substring(0, 35)}..."` : '❌ Kosong'}`);
      console.log(`          AR: ${n.titleAr ? `"${n.titleAr.substring(0, 35)}..."` : '❌ Kosong'}`);
    });
  }

  // 2. PENGUMUMAN
  const ann = await prisma.announcement.findMany();
  const annTitle = analyzeField(ann, 'titleEn', 'titleAr');
  const annContent = analyzeField(ann, 'contentEn', 'contentAr');

  console.log(`\n📢 TABEL PENGUMUMAN (Total: ${ann.length} pengumuman)`);
  console.log(`   ├─ Judul (title)   ➜ EN: ${annTitle.enFilled}/${annTitle.total} (${pct(annTitle.enFilled, annTitle.total)}) | AR: ${annTitle.arFilled}/${annTitle.total} (${pct(annTitle.arFilled, annTitle.total)})`);
  console.log(`   └─ Isi (content)   ➜ EN: ${annContent.enFilled}/${annContent.total} (${pct(annContent.enFilled, annContent.total)}) | AR: ${annContent.arFilled}/${annContent.total} (${pct(annContent.arFilled, annContent.total)})`);

  if (ann.length > 0) {
    console.log('   📌 Contoh Pengumuman:');
    ann.slice(0, 3).forEach((a, idx) => {
      console.log(`      [${idx + 1}] ID: ${a.title.substring(0, 35)}...`);
      console.log(`          EN: ${a.titleEn ? `"${a.titleEn.substring(0, 35)}..."` : '❌ Kosong'}`);
      console.log(`          AR: ${a.titleAr ? `"${a.titleAr.substring(0, 35)}..."` : '❌ Kosong'}`);
    });
  }

  // 3. KAMPANYE
  const kamp = await prisma.kampanye.findMany();
  const kampTitle = analyzeField(kamp, 'judulEn', 'judulAr');
  const kampDesc = analyzeField(kamp, 'deskripsiEn', 'deskripsiAr');

  console.log(`\n📊 TABEL KAMPANYE (Total: ${kamp.length} kampanye)`);
  console.log(`   ├─ Judul (judul)       ➜ EN: ${kampTitle.enFilled}/${kampTitle.total} (${pct(kampTitle.enFilled, kampTitle.total)}) | AR: ${kampTitle.arFilled}/${kampTitle.total} (${pct(kampTitle.arFilled, kampTitle.total)})`);
  console.log(`   └─ Deskripsi (desc)   ➜ EN: ${kampDesc.enFilled}/${kampDesc.total} (${pct(kampDesc.enFilled, kampDesc.total)}) | AR: ${kampDesc.arFilled}/${kampDesc.total} (${pct(kampDesc.arFilled, kampDesc.total)})`);

  if (kamp.length > 0) {
    console.log('   📌 Contoh Kampanye:');
    kamp.slice(0, 3).forEach((k, idx) => {
      console.log(`      [${idx + 1}] ID: ${k.judul.substring(0, 35)}...`);
      console.log(`          EN: ${k.judulEn ? `"${k.judulEn.substring(0, 35)}..."` : '❌ Kosong'}`);
      console.log(`          AR: ${k.judulAr ? `"${k.judulAr.substring(0, 35)}..."` : '❌ Kosong'}`);
    });
  }

  // 4. PROGRAM
  const prog = await prisma.program.findMany();
  const progTitle = analyzeField(prog, 'titleEn', 'titleAr');
  const progExcerpt = analyzeField(prog, 'excerptEn', 'excerptAr');
  const progContent = analyzeField(prog, 'contentEn', 'contentAr');

  console.log(`\n📦 TABEL PROGRAM (Total: ${prog.length} program)`);
  console.log(`   ├─ Judul (title)   ➜ EN: ${progTitle.enFilled}/${progTitle.total} (${pct(progTitle.enFilled, progTitle.total)}) | AR: ${progTitle.arFilled}/${progTitle.total} (${pct(progTitle.arFilled, progTitle.total)})`);
  console.log(`   ├─ Ringkasan (ex)  ➜ EN: ${progExcerpt.enFilled}/${progExcerpt.total} (${pct(progExcerpt.enFilled, progExcerpt.total)}) | AR: ${progExcerpt.arFilled}/${progExcerpt.total} (${pct(progExcerpt.arFilled, progExcerpt.total)})`);
  console.log(`   └─ Isi (content)   ➜ EN: ${progContent.enFilled}/${progContent.total} (${pct(progContent.enFilled, progContent.total)}) | AR: ${progContent.arFilled}/${progContent.total} (${pct(progContent.arFilled, progContent.total)})`);

  if (prog.length > 0) {
    console.log('   📌 Contoh Program:');
    prog.slice(0, 3).forEach((p, idx) => {
      console.log(`      [${idx + 1}] ID: ${p.title.substring(0, 35)}...`);
      console.log(`          EN: ${p.titleEn ? `"${p.titleEn.substring(0, 35)}..."` : '❌ Kosong'}`);
      console.log(`          AR: ${p.titleAr ? `"${p.titleAr.substring(0, 35)}..."` : '❌ Kosong'}`);
    });
  }

  // 5. NEWSLETTER
  const nl = await prisma.newsletter.findMany();
  const nlTitle = analyzeField(nl, 'judulEn', 'judulAr');

  console.log(`\n📰 TABEL NEWSLETTER (Total: ${nl.length} newsletter)`);
  console.log(`   └─ Judul (judul)   ➜ EN: ${nlTitle.enFilled}/${nlTitle.total} (${pct(nlTitle.enFilled, nlTitle.total)}) | AR: ${nlTitle.arFilled}/${nlTitle.total} (${pct(nlTitle.arFilled, nlTitle.total)})`);

  if (nl.length > 0) {
    console.log('   📌 Contoh Newsletter:');
    nl.slice(0, 3).forEach((n, idx) => {
      console.log(`      [${idx + 1}] ID: ${n.judul.substring(0, 35)}...`);
      console.log(`          EN: ${n.judulEn ? `"${n.judulEn.substring(0, 35)}..."` : '❌ Kosong'}`);
      console.log(`          AR: ${n.judulAr ? `"${n.judulAr.substring(0, 35)}..."` : '❌ Kosong'}`);
    });
  }

  // 6. DOKUMEN
  const docs = await prisma.document.findMany();
  const docsTitle = analyzeField(docs, 'judulEn', 'judulAr');

  console.log(`\n🗂️ TABEL DOKUMEN (Total: ${docs.length} dokumen)`);
  console.log(`   └─ Judul (judul)   ➜ EN: ${docsTitle.enFilled}/${docsTitle.total} (${pct(docsTitle.enFilled, docsTitle.total)}) | AR: ${docsTitle.arFilled}/${docsTitle.total} (${pct(docsTitle.arFilled, docsTitle.total)})`);

  if (docs.length > 0) {
    console.log('   📌 Contoh Dokumen:');
    docs.slice(0, 3).forEach((d, idx) => {
      console.log(`      [${idx + 1}] ID: ${d.judul.substring(0, 35)}...`);
      console.log(`          EN: ${d.judulEn ? `"${d.judulEn.substring(0, 35)}..."` : '❌ Kosong'}`);
      console.log(`          AR: ${d.judulAr ? `"${d.judulAr.substring(0, 35)}..."` : '❌ Kosong'}`);
    });
  }

  // 7. BANNER
  const ban = await prisma.banner.findMany();
  const banTitle = analyzeField(ban, 'titleEn', 'titleAr');

  console.log(`\n🖼️ TABEL BANNER (Total: ${ban.length} banner)`);
  console.log(`   └─ Judul (title)   ➜ EN: ${banTitle.enFilled}/${banTitle.total} (${pct(banTitle.enFilled, banTitle.total)}) | AR: ${banTitle.arFilled}/${banTitle.total} (${pct(banTitle.arFilled, banTitle.total)})`);

  if (ban.length > 0) {
    console.log('   📌 Contoh Banner:');
    ban.slice(0, 3).forEach((b, idx) => {
      console.log(`      [${idx + 1}] ID: ${b.title.substring(0, 35)}...`);
      console.log(`          EN: ${b.titleEn ? `"${b.titleEn.substring(0, 35)}..."` : '❌ Kosong'}`);
      console.log(`          AR: ${b.titleAr ? `"${b.titleAr.substring(0, 35)}..."` : '❌ Kosong'}`);
    });
  }

  // REKAP KESELURUHAN DATA DB
  const totalEntries = news.length + ann.length + kamp.length + prog.length + nl.length + docs.length + ban.length;
  const totalEnTitles = newsTitle.enFilled + annTitle.enFilled + kampTitle.enFilled + progTitle.enFilled + nlTitle.enFilled + docsTitle.enFilled + banTitle.enFilled;
  const totalArTitles = newsTitle.arFilled + annTitle.arFilled + kampTitle.arFilled + progTitle.arFilled + nlTitle.arFilled + docsTitle.arFilled + banTitle.arFilled;

  const articleCount = news.length + ann.length + prog.length + kamp.length;
  const articleEnBody = newsContent.enFilled + annContent.enFilled + progContent.enFilled + kampDesc.enFilled;
  const articleArBody = newsContent.arFilled + annContent.arFilled + progContent.arFilled + kampDesc.arFilled;

  console.log('\n================================================================================');
  console.log('                      RINGKASAN TOTAL DATABASE REAL');
  console.log('================================================================================');
  console.log(`  📌 Total Seluruh Entitas DB    : ${totalEntries} item`);
  console.log(`  🇬🇧 Terjemahan Judul EN Terisi : ${totalEnTitles}/${totalEntries} (${pct(totalEnTitles, totalEntries)})`);
  console.log(`  🇸🇦 Terjemahan Judul AR Terisi : ${totalArTitles}/${totalEntries} (${pct(totalArTitles, totalEntries)})`);
  console.log(`--------------------------------------------------------------------------------`);
  console.log(`  📌 Total Konten/Artikel Panjang : ${articleCount} item`);
  console.log(`  🇬🇧 Isi Artikel EN Terisi        : ${articleEnBody}/${articleCount} (${pct(articleEnBody, articleCount)})`);
  console.log(`  🇸🇦 Isi Artikel AR Terisi        : ${articleArBody}/${articleCount} (${pct(articleArBody, articleCount)})`);
  console.log('================================================================================\n');

  await pool.end();
}

main().catch(async (e) => {
  console.error(e);
  await pool.end();
  process.exit(1);
});
