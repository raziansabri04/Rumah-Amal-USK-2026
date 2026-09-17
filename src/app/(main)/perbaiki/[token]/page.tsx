import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSubmissionByToken } from '@/actions/pendaftaran-perbaikan';
import PerbaikiClient from './PerbaikiClient';

interface PageProps {
  params: Promise<{ token: string }>;
}

export const metadata: Metadata = {
  title: 'Perbaikan Berkas Pendaftaran | Rumah Amal USK',
  description: 'Halaman resmi perbaikan berkas pendaftaran bantuan dan beasiswa Rumah Amal USK.',
};

export const dynamic = 'force-dynamic';

export default async function PerbaikiPage({ params }: PageProps) {
  const { token } = await params;
  const result = await getSubmissionByToken(token);

  if (!result.success || !result.data) {
    notFound();
  }

  return <PerbaikiClient submission={result.data as any} />;
}
