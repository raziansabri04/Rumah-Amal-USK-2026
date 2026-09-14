import prisma from '../src/lib/prisma';
import { autoTranslateAll, fixProperNouns } from '../src/lib/translate';

async function main() {
  console.log('🚀 Fetching all newsletters for translation...');
  const newsletters = await prisma.newsletter.findMany();
  console.log(`📌 Found ${newsletters.length} newsletters.`);

  for (const item of newsletters) {
    console.log(`\n----------------------------------------`);
    console.log(`ID: ${item.id}`);
    console.log(`Indonesian: "${item.judul}"`);

    // Auto-translate using lib/translate
    const translated = await autoTranslateAll({ title: item.judul });
    let judulEn = translated.titleEn;
    let judulAr = translated.titleAr;

    // Apply proper noun fixes
    judulEn = fixProperNouns(judulEn, 'en');
    judulAr = fixProperNouns(judulAr, 'ar');

    console.log(`English   : "${judulEn}"`);
    console.log(`Arabic    : "${judulAr}"`);

    await prisma.newsletter.update({
      where: { id: item.id },
      data: {
        judulEn,
        judulAr,
      },
    });

    console.log(`✅ Updated Newsletter ID: ${item.id}`);
  }

  console.log('\n🎉 All existing newsletters translated and updated in DB successfully!');
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error('❌ Error during newsletter translation:', e);
  await prisma.$disconnect();
  process.exit(1);
});
