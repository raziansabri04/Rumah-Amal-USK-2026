import prisma from '../src/lib/prisma';
import { autoTranslateAll, fixProperNouns } from '../src/lib/translate';

async function main() {
  console.log('🚀 Fetching all documents for translation...');
  const docs = await prisma.document.findMany();
  console.log(`📌 Found ${docs.length} documents.`);

  for (const doc of docs) {
    console.log(`\n----------------------------------------`);
    console.log(`ID: ${doc.id}`);
    console.log(`Indonesian: "${doc.judul}"`);

    // Auto-translate using lib/translate
    const translated = await autoTranslateAll({ title: doc.judul });
    let judulEn = translated.titleEn;
    let judulAr = translated.titleAr;

    // Apply proper noun fixes
    judulEn = fixProperNouns(judulEn, 'en');
    judulAr = fixProperNouns(judulAr, 'ar');

    console.log(`English   : "${judulEn}"`);
    console.log(`Arabic    : "${judulAr}"`);

    await prisma.document.update({
      where: { id: doc.id },
      data: {
        judulEn,
        judulAr,
      },
    });

    console.log(`✅ Updated Document ID: ${doc.id}`);
  }

  console.log('\n🎉 All existing documents translated and updated in DB successfully!');
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error('❌ Error during document translation:', e);
  await prisma.$disconnect();
  process.exit(1);
});
