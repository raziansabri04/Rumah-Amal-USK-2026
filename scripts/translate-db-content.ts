import { prisma } from '../src/lib/prisma';
import { autoTranslateAll } from '../src/lib/translate';

async function translateAllContent() {
  console.log('🚀 Starting batch translation for Announcement & News...');

  // 1. Announcements
  const announcements = await prisma.announcement.findMany();
  console.log(`📌 Found ${announcements.length} announcements to process.`);

  for (const ann of announcements) {
    console.log(`🔄 Translating Announcement: "${ann.title}"...`);
    try {
      const translated = await autoTranslateAll({
        title: ann.title,
        excerpt: ann.excerpt || '',
        content: ann.content || '',
      });

      await prisma.announcement.update({
        where: { id: ann.id },
        data: {
          titleEn: translated.titleEn,
          titleAr: translated.titleAr,
          contentEn: translated.contentEn,
          contentAr: translated.contentAr,
        },
      });

      console.log(`✅ Announcement "${ann.title}" translated successfully!`);
    } catch (err) {
      console.error(`❌ Failed to translate announcement ${ann.id}:`, err);
    }
  }

  // 2. News
  const newsList = await prisma.news.findMany();
  console.log(`📌 Found ${newsList.length} news items to process.`);

  for (const news of newsList) {
    console.log(`🔄 Translating News: "${news.title}"...`);
    try {
      const translated = await autoTranslateAll({
        title: news.title,
        excerpt: news.excerpt || '',
        content: news.content || '',
      });

      await prisma.news.update({
        where: { id: news.id },
        data: {
          titleEn: translated.titleEn,
          titleAr: translated.titleAr,
          contentEn: translated.contentEn,
          contentAr: translated.contentAr,
        },
      });

      console.log(`✅ News "${news.title}" translated successfully!`);
    } catch (err) {
      console.error(`❌ Failed to translate news ${news.id}:`, err);
    }
  }

  // 3. Documents
  const documents = await prisma.document.findMany();
  console.log(`📌 Found ${documents.length} documents to process.`);

  for (const doc of documents) {
    console.log(`🔄 Translating Document: "${doc.judul}"...`);
    try {
      const translated = await autoTranslateAll({
        title: doc.judul,
      });

      await prisma.document.update({
        where: { id: doc.id },
        data: {
          judulEn: translated.titleEn,
          judulAr: translated.titleAr,
        },
      });

      console.log(`✅ Document "${doc.judul}" translated successfully!`);
    } catch (err) {
      console.error(`❌ Failed to translate document ${doc.id}:`, err);
    }
  }

  console.log('🎉 Batch translation for Announcement, News & Documents complete!');
  await prisma.$disconnect();
}

translateAllContent().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
