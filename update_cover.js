require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL || '';
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function updateCover() {
  const updated = await prisma.announcement.update({
    where: { id: 'cms8qi5nn000iacdge3fxt1la' },
    data: {
      coverImageUrl: 'https://syardlwbunhoijlnnuvc.supabase.co/storage/v1/object/public/announcements/1785489822200-bb4xx4gepo.webp'
    }
  });
  console.log('✅ Updated successfully:', updated.id, updated.title, updated.coverImageUrl);
  await prisma.$disconnect();
}

updateCover().catch(console.error);
