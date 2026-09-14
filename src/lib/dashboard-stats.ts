import { prisma } from '@/lib/prisma';

export async function getDashboardStats(
    yearParam?: string,
    monthFromParam?: string,
    monthToParam?: string,
) {
    const currentYear = new Date().getFullYear().toString();
    const selectedYear = yearParam || currentYear;
    const monthFrom = monthFromParam || 'all';
    const monthTo   = monthToParam   || 'all';

    const is6Months = selectedYear === '6m';

    // ── Date boundaries ──────────────────────────────────────────────────────
    let startDate: Date;
    let endDate: Date;

    if (is6Months) {
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 6);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date();
        endDate.setHours(23, 59, 59, 999);
    } else {
        const yNum = parseInt(selectedYear) || parseInt(currentYear);

        if (monthFrom !== 'all') {
            const mFromNum = parseInt(monthFrom) - 1; // 0-indexed
            const mToNum   = monthTo !== 'all' ? parseInt(monthTo) - 1 : 11;
            startDate = new Date(Date.UTC(yNum, mFromNum, 1, 0, 0, 0));
            // day-0 of (mToNum+1) = last day of mToNum
            endDate   = new Date(Date.UTC(yNum, mToNum + 1, 0, 23, 59, 59, 999));
        } else {
            startDate = new Date(Date.UTC(yNum, 0,  1,  0,  0,  0,   0));
            endDate   = new Date(Date.UTC(yNum, 11, 31, 23, 59, 59, 999));
        }
    }

    const dateFilter = { createdAt: { gte: startDate, lte: endDate } };

    // ── Summary cards + recent lists (all filtered by date range) ────────────
    const [
        totalZakat,
        totalInfaq,
        pendingZakat,
        pendingInfaq,
        riwayatTerbaru,
        riwayatInfaqTerbaru,
    ] = await Promise.all([
        prisma.zakat.aggregate({ where: { status: 'lunas', ...dateFilter }, _sum: { jumlahZakat: true } }),
        prisma.infaq.aggregate({ where: { status: 'lunas', ...dateFilter }, _sum: { jumlahInfaq: true } }),
        prisma.zakat.count({ where: { status: 'pending', ...dateFilter } }),
        prisma.infaq.count({ where: { status: 'pending', ...dateFilter } }),
        prisma.zakat.findMany({ where: dateFilter, orderBy: { createdAt: 'desc' }, take: 5 }),
        prisma.infaq.findMany({
            where: dateFilter,
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: { kampanye: true },
        }),
    ]);

    // ── Available years ───────────────────────────────────────────────────────
    const [yearsZakatRaw, yearsInfaqRaw] = await Promise.all([
        prisma.$queryRaw<{ tahun: string }[]>`
            SELECT DISTINCT TO_CHAR(created_at, 'YYYY') as tahun
            FROM zakats WHERE created_at IS NOT NULL
        `,
        prisma.$queryRaw<{ tahun: string }[]>`
            SELECT DISTINCT TO_CHAR(created_at, 'YYYY') as tahun
            FROM infaqs WHERE created_at IS NOT NULL
        `,
    ]);

    const yearSet = new Set<string>([
        currentYear,
        ...yearsZakatRaw.map(r => r.tahun).filter(Boolean),
        ...yearsInfaqRaw.map(r => r.tahun).filter(Boolean),
    ]);
    const availableYears = Array.from(yearSet).sort((a, b) => parseInt(b) - parseInt(a));

    // ── Chart raw data ────────────────────────────────────────────────────────
    const [grafikBulananRaw, grafikBulananInfaqRaw, grafikJenisRaw, grafikJenisInfaqRaw] =
        await Promise.all([
            prisma.$queryRaw<{ bulan: string; total: bigint | number }[]>`
                SELECT TO_CHAR(created_at, 'YYYY-MM') as bulan, SUM(jumlah_zakat) as total
                FROM zakats
                WHERE status = 'lunas'
                  AND created_at >= ${startDate} AND created_at <= ${endDate}
                GROUP BY bulan ORDER BY bulan ASC
            `,
            prisma.$queryRaw<{ bulan: string; total: bigint | number }[]>`
                SELECT TO_CHAR(created_at, 'YYYY-MM') as bulan, SUM(jumlah_infaq) as total
                FROM infaqs
                WHERE status = 'lunas'
                  AND created_at >= ${startDate} AND created_at <= ${endDate}
                GROUP BY bulan ORDER BY bulan ASC
            `,
            prisma.zakat.groupBy({
                by: ['jenisZakat'],
                where: { status: 'lunas', ...dateFilter },
                _sum: { jumlahZakat: true },
            }),
            prisma.infaq.groupBy({
                by: ['jenisInfaq'],
                where: { status: 'lunas', ...dateFilter },
                _sum: { jumlahInfaq: true },
            }),
        ]);

    // ── Format monthly chart data ─────────────────────────────────────────────
    let formattedGrafikBulanan:      { bulan: string; total: number }[] = [];
    let formattedGrafikBulananInfaq: { bulan: string; total: number }[] = [];

    if (!is6Months) {
        const yNum  = selectedYear;
        const mFrom = monthFrom !== 'all' ? parseInt(monthFrom) : 1;
        const mTo   = monthTo   !== 'all' ? parseInt(monthTo)   : 12;

        // Generate list of months in range
        const monthsList = Array.from({ length: mTo - mFrom + 1 }, (_, i) => {
            const m = String(mFrom + i).padStart(2, '0');
            return `${yNum}-${m}`;
        });

        const zakatMap = new Map(grafikBulananRaw.map(item => [item.bulan, Number(item.total)]));
        const infaqMap = new Map(grafikBulananInfaqRaw.map(item => [item.bulan, Number(item.total)]));

        formattedGrafikBulanan      = monthsList.map(bulan => ({ bulan, total: zakatMap.get(bulan) || 0 }));
        formattedGrafikBulananInfaq = monthsList.map(bulan => ({ bulan, total: infaqMap.get(bulan) || 0 }));
    } else {
        formattedGrafikBulanan      = grafikBulananRaw.map(item      => ({ bulan: item.bulan, total: Number(item.total) }));
        formattedGrafikBulananInfaq = grafikBulananInfaqRaw.map(item => ({ bulan: item.bulan, total: Number(item.total) }));
    }

    return {
        selectedYear,
        monthFrom,
        monthTo,
        availableYears,
        totalZakat:   Number(totalZakat._sum.jumlahZakat ?? 0),
        totalInfaq:   Number(totalInfaq._sum.jumlahInfaq ?? 0),
        pendingZakat,
        pendingInfaq,
        riwayatTerbaru: riwayatTerbaru.map(z => ({
            id:          z.id,
            nama:        z.nama,
            jenisZakat:  z.jenisZakat,
            jumlahZakat: z.jumlahZakat,
            status:      z.status,
            createdAt:   z.createdAt,
        })),
        riwayatInfaqTerbaru: riwayatInfaqTerbaru.map(i => ({
            id:          i.id,
            nama:        i.nama,
            jenisInfaq:  i.kampanye?.judul || i.jenisInfaq,
            jumlahInfaq: i.jumlahInfaq,
            status:      i.status,
            createdAt:   i.createdAt,
        })),
        grafikBulanan:      formattedGrafikBulanan,
        grafikJenis:        grafikJenisRaw.map(item => ({
            jenis: item.jenisZakat,
            total: Number(item._sum.jumlahZakat ?? 0),
        })),
        grafikBulananInfaq: formattedGrafikBulananInfaq,
        grafikJenisInfaq:   grafikJenisInfaqRaw.map(item => ({
            jenis: item.jenisInfaq,
            total: Number(item._sum.jumlahInfaq ?? 0),
        })),
    };
}