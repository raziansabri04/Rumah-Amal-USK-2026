import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublicProgramBySlug } from '@/actions/pendaftaran-publik';
import FormPendaftaranClient from './FormPendaftaranClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublicProgramBySlug(slug);

  if (!result.success || !result.data) {
    return {
      title: 'Program Tidak Ditemukan | Rumah Amal USK',
    };
  }

  return {
    title: `Pendaftaran ${result.data.nama} | Rumah Amal USK`,
    description: result.data.deskripsi || `Formulir pendaftaran resmi ${result.data.nama} Rumah Amal USK.`,
  };
}

export const dynamic = 'force-dynamic';

export default async function PendaftaranDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getPublicProgramBySlug(slug);

  if (!result.success || !result.data) {
    notFound();
  }

  return <FormPendaftaranClient program={result.data} />;
}
