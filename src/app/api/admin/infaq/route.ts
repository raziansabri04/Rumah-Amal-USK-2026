import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20')));
        const search = searchParams.get('search')?.trim() || '';
        const status = searchParams.get('status') || 'all';
        const tab = searchParams.get('tab') || 'bebas'; // 'bebas' | 'terikat'
        const jenis = (searchParams.get('jenisInfaq') || searchParams.get('jenis') || 'all').trim();
        const unitKerja = (searchParams.get('unitKerja') || 'all').trim();
        const skip = (page - 1) * limit;

        // Tab filter
        const tabFilter: Prisma.InfaqWhereInput =
            tab === 'bebas'
                ? { kampanyeId: null }
                : { kampanyeId: { not: null } };

        // Search filter
        const searchFilter: Prisma.InfaqWhereInput = search
            ? {
                OR: [
                    { nama: { contains: search, mode: 'insensitive' } },
                    { nip: { contains: search } },
                    { kampanye: { judul: { contains: search, mode: 'insensitive' } } },
                    { muzakki: { nama: { contains: search, mode: 'insensitive' } } },
                ],
            }
            : {};

        // Jenis filter
        let jenisFilter: Prisma.InfaqWhereInput = {};
        if (jenis && jenis !== 'all') {
            if (tab === 'terikat') {
                jenisFilter = {
                    OR: [
                        { kampanyeId: jenis },
                        { jenisInfaq: { equals: jenis, mode: 'insensitive' } },
                        { kampanye: { judul: { equals: jenis, mode: 'insensitive' } } },
                    ],
                };
            } else {
                jenisFilter = {
                    jenisInfaq: { equals: jenis, mode: 'insensitive' },
                };
            }
        }

        // Unit Kerja filter (from muzakki relation)
        const unitKerjaFilter: Prisma.InfaqWhereInput =
            unitKerja && unitKerja !== 'all'
                ? { muzakki: { unitKerja: { equals: unitKerja, mode: 'insensitive' } } }
                : {};

        // Full where (includes status filter)
        const whereMain: Prisma.InfaqWhereInput = {
            AND: [tabFilter, searchFilter, jenisFilter, unitKerjaFilter, status !== 'all' ? { status } : {}],
        };

        // Where without status filter (for per-status counts within current tab + search + jenis + unitKerja)
        const whereForStatusCounts: Prisma.InfaqWhereInput = {
            AND: [tabFilter, searchFilter, jenisFilter, unitKerjaFilter],
        };

        const [
            infaqs, total,
            allCount, pendingCount, lunasCount, ditolakCount,
            bebasCount, terikatCount,
            distinctBebasRaw,
            kampanyeList,
            distinctUnitKerja,
        ] = await Promise.all([
            prisma.infaq.findMany({
                where: whereMain,
                include: { kampanye: true, muzakki: true },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.infaq.count({ where: whereMain }),
            prisma.infaq.count({ where: whereForStatusCounts }),
            prisma.infaq.count({ where: { ...whereForStatusCounts, status: 'pending' } }),
            prisma.infaq.count({ where: { ...whereForStatusCounts, status: 'lunas' } }),
            prisma.infaq.count({ where: { ...whereForStatusCounts, status: 'ditolak' } }),
            // Tab counts (global)
            prisma.infaq.count({ where: { kampanyeId: null } }),
            prisma.infaq.count({ where: { kampanyeId: { not: null } } }),
            // Distinct jenis infaq for bebas tab
            prisma.infaq.findMany({
                select: { jenisInfaq: true },
                distinct: ['jenisInfaq'],
                where: { kampanyeId: null, jenisInfaq: { not: '' } },
                orderBy: { jenisInfaq: 'asc' },
            }),
            // Kampanye list for terikat tab
            prisma.kampanye.findMany({
                select: { id: true, judul: true },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.muzakki.findMany({
                select: { unitKerja: true },
                where: { unitKerja: { not: null } },
                distinct: ['unitKerja'],
                orderBy: { unitKerja: 'asc' },
            }),
        ]);

        let availableJenis: { value: string; label: string }[] = [];
        if (tab === 'bebas') {
            const allBebas = Array.from(new Set([
                ...distinctBebasRaw.map(d => d.jenisInfaq.trim().toLowerCase()).filter(Boolean),
            ]));
            availableJenis = allBebas.map(j => ({
                value: j,
                label: `${j.charAt(0).toUpperCase() + j.slice(1)}`,
            }));
        } else {
            availableJenis = kampanyeList.map(k => ({
                value: k.id,
                label: k.judul,
            }));
        }

        const availableUnitKerja = distinctUnitKerja
            .map(d => d.unitKerja?.trim())
            .filter((u): u is string => Boolean(u && u.length > 0));

        const formattedData = infaqs.map(i => ({
            id: i.id,
            nama: i.nama,
            nip: i.nip,
            noHp: i.noHp,
            muzakki: i.muzakki ? {
                nip: i.muzakki.nip,
                nama: i.muzakki.nama,
                npwp: i.muzakki.npwp,
                alamat: i.muzakki.alamat,
                unitKerja: i.muzakki.unitKerja,
                noHp: i.muzakki.noHp,
            } : null,
            tipePembayar: i.tipePembayar,
            jenisInfaq: i.kampanye?.judul || i.jenisInfaq,
            kampanyeId: i.kampanyeId,
            kampanyeJudul: i.kampanye?.judul || null,
            jumlahInfaq: i.jumlahInfaq,
            buktiPembayaran: i.buktiPembayaran,
            tanggal: new Date(i.createdAt).toLocaleDateString('id-ID'),
            pesan: i.pesan || '-',
            status: i.status,
        }));

        return NextResponse.json({
            data: formattedData,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            statusCounts: {
                all: allCount,
                pending: pendingCount,
                lunas: lunasCount,
                ditolak: ditolakCount,
            },
            tabCounts: {
                bebas: bebasCount,
                terikat: terikatCount,
            },
            availableJenis,
            availableUnitKerja,
        });
    } catch (error) {
        console.error('Error fetching infaq:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}


