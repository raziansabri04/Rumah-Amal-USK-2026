import { notFound } from 'next/navigation';
import { getProgramBantuanById, getSubmissionsByProgram } from '@/actions/pendaftaran-admin';
import ProgramDetailClient from './ProgramDetailClient';

export const dynamic = 'force-dynamic';

export default async function ProgramDetailPage(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const statusFilter = (searchParams.status as string) || 'all';
  const page = parseInt((searchParams.page as string) || '1', 10);

  const [progRes, subRes] = await Promise.all([
    getProgramBantuanById(id),
    getSubmissionsByProgram(id, { status: statusFilter, page, limit: 10 }),
  ]);

  if (!progRes.success || !progRes.data) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <ProgramDetailClient
        program={progRes.data}
        initialSubmissions={subRes.success && subRes.data ? subRes.data : []}
        submissionMeta={{
          total: subRes.total || 0,
          page: subRes.page || 1,
          totalPages: subRes.totalPages || 1,
          statusCounts: subRes.statusCounts || {
            all: 0,
            menunggu_diproses: 0,
            sedang_diproses: 0,
            belum_diseleksi: 0,
            lolos: 0,
            tidak_lolos: 0,
            gagal_diproses: 0,
          },
        }}
        initialStatus={statusFilter}
      />
    </div>
  );
}
