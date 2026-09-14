'use client';

import { useState } from 'react';
import { ChartBulanan, ChartJenis, WARNA_ZAKAT, WARNA_INFAQ } from '@/components/DashboardCharts';
import StatusBadge from '@/components/StatusBadge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCoins,
    faHandHoldingHeart,
    faCalendarAlt,
    faFilter,
    faClock,
    faArrowTrendUp,
    faChartPie,
    faHistory,
    faSpinner,
    faXmark,
    faArrowRight,
} from '@fortawesome/free-solid-svg-icons';

function formatRupiah(angka: number) {
    return 'Rp ' + angka.toLocaleString('id-ID');
}

const BULAN_OPTIONS = [
    { value: '01', label: 'Januari' },
    { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' },
    { value: '04', label: 'April' },
    { value: '05', label: 'Mei' },
    { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' },
    { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
];

function getBulanLabel(value: string) {
    return BULAN_OPTIONS.find(b => b.value === value)?.label ?? value;
}

interface DashboardStatsData {
    selectedYear: string;
    monthFrom: string;
    monthTo: string;
    availableYears: string[];
    totalZakat: number;
    totalInfaq: number;
    pendingZakat: number;
    pendingInfaq: number;
    riwayatTerbaru: Array<{
        id: string;
        nama: string;
        jenisZakat: string;
        jumlahZakat: number;
        status: string;
        createdAt: string | Date;
    }>;
    riwayatInfaqTerbaru: Array<{
        id: string;
        nama: string;
        jenisInfaq: string;
        jumlahInfaq: number;
        status: string;
        createdAt: string | Date;
    }>;
    grafikBulanan: Array<{ bulan: string; total: number }>;
    grafikJenis: Array<{ jenis: string; total: number }>;
    grafikBulananInfaq: Array<{ bulan: string; total: number }>;
    grafikJenisInfaq: Array<{ jenis: string; total: number }>;
}

export default function DashboardClient({ initialStats }: { initialStats: DashboardStatsData }) {
    const [stats, setStats] = useState<DashboardStatsData>(initialStats);
    const [selectedYear, setSelectedYear] = useState<string>(
        initialStats.selectedYear || new Date().getFullYear().toString()
    );
    const [monthFrom, setMonthFrom] = useState<string>(initialStats.monthFrom || 'all');
    const [monthTo,   setMonthTo]   = useState<string>(initialStats.monthTo   || 'all');
    const [loading, setLoading]     = useState(false);

    // ── Apply filter ────────────────────────────────────────────────────────
    async function applyFilter(year: string, from: string, to: string) {
        setSelectedYear(year);
        setMonthFrom(from);
        setMonthTo(to);
        setLoading(true);
        try {
            const params = new URLSearchParams({ year });
            if (from !== 'all') params.set('monthFrom', from);
            if (to   !== 'all') params.set('monthTo',   to);
            const res = await fetch(`/api/admin/dashboard-stats?${params}`);
            if (res.ok) setStats(await res.json());
        } catch (err) {
            console.error('Failed to update dashboard stats:', err);
        } finally {
            setLoading(false);
        }
    }

    // ── Handlers ────────────────────────────────────────────────────────────
    function handleYearChange(year: string) {
        applyFilter(year, monthFrom, monthTo);
    }

    function handleMonthFromChange(value: string) {
        let newTo = monthTo;
        // Auto-correct: if new FROM > current TO, push TO = FROM
        if (value !== 'all' && monthTo !== 'all' && parseInt(monthTo) < parseInt(value)) {
            newTo = value;
            setMonthTo(value);
        }
        // If FROM becomes 'all', reset TO as well
        if (value === 'all') {
            newTo = 'all';
            setMonthTo('all');
        }
        // If FROM is set but TO is still 'all', auto-set TO = December
        if (value !== 'all' && newTo === 'all') {
            newTo = '12';
            setMonthTo('12');
        }
        setMonthFrom(value);
        applyFilter(selectedYear, value, newTo);
    }

    function handleMonthToChange(value: string) {
        // Clamp: TO cannot be less than FROM
        let clamped = value;
        if (value !== 'all' && monthFrom !== 'all' && parseInt(value) < parseInt(monthFrom)) {
            clamped = monthFrom;
        }
        setMonthTo(clamped);
        applyFilter(selectedYear, monthFrom, clamped);
    }

    function resetRange() {
        applyFilter(selectedYear, 'all', 'all');
    }

    // ── Period label ────────────────────────────────────────────────────────
    const hasRange = monthFrom !== 'all';
    let periodLabel: string;

    if (selectedYear === '6m') {
        periodLabel = '6 Bulan Terakhir';
    } else if (!hasRange) {
        periodLabel = `Tahun ${selectedYear}`;
    } else {
        const fromLabel = getBulanLabel(monthFrom);
        const toLabel   = monthTo !== 'all' ? getBulanLabel(monthTo) : 'Desember';
        periodLabel = fromLabel === toLabel
            ? `Tahun ${selectedYear} · ${fromLabel}`
            : `Tahun ${selectedYear} · ${fromLabel} – ${toLabel}`;
    }

    // ── Month options for TO (only months >= FROM) ──────────────────────────
    const monthToOptions = monthFrom !== 'all'
        ? BULAN_OPTIONS.filter(b => parseInt(b.value) >= parseInt(monthFrom))
        : BULAN_OPTIONS;

    return (
        <div className="space-y-8 pb-10">
            {/* Header & Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2.5">
                        <span>Dashboard Analytics</span>
                        {loading && <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 text-[#063A1E] animate-spin" />}
                    </h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Ringkasan statistik penerimaan Zakat dan Infaq Rumah Amal USK — Periode:{' '}
                        <span className="font-semibold text-gray-800">{periodLabel}</span>
                    </p>
                </div>

                {/* ── Filter Bar: 2 baris (tahun atas, bulan bawah) ───────── */}
                <div className="bg-gray-50 rounded-xl border border-gray-200/80 overflow-hidden">
                    {/* Baris 1: Label + Tahun */}
                    <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-gray-200/60">
                        <div className="flex items-center gap-1.5">
                            <FontAwesomeIcon icon={faFilter} className="w-3 h-3 text-[#063A1E]" />
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                                Filter Grafik
                            </span>
                        </div>
                        <select
                            value={selectedYear}
                            onChange={e => handleYearChange(e.target.value)}
                            disabled={loading}
                            className="text-xs font-semibold bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-800 focus:outline-none focus:border-[#063A1E] shadow-2xs cursor-pointer disabled:opacity-50"
                        >
                            <option value="6m">6 Bulan Terakhir</option>
                            {stats.availableYears?.map(year => (
                                <option key={year} value={year}>Tahun {year}</option>
                            ))}
                        </select>
                    </div>

                    {/* Baris 2: Rentang Bulan */}
                    <div className="flex items-center gap-2 px-3 py-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide shrink-0">
                            Bulan
                        </span>

                        {/* Dari */}
                        <select
                            value={monthFrom}
                            onChange={e => handleMonthFromChange(e.target.value)}
                            disabled={loading || selectedYear === '6m'}
                            className="text-xs font-semibold bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-800 focus:outline-none focus:border-[#063A1E] shadow-2xs cursor-pointer disabled:opacity-50 flex-1 min-w-0"
                        >
                            <option value="all">Semua Bulan</option>
                            {BULAN_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>

                        {/* Arrow + Sampai (hanya muncul saat range aktif) */}
                        {hasRange && (
                            <>
                                <FontAwesomeIcon icon={faArrowRight} className="w-2.5 h-2.5 text-gray-400 shrink-0" />
                                <select
                                    value={monthTo === 'all' ? '12' : monthTo}
                                    onChange={e => handleMonthToChange(e.target.value)}
                                    disabled={loading}
                                    className="text-xs font-semibold bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-800 focus:outline-none focus:border-[#063A1E] shadow-2xs cursor-pointer disabled:opacity-50 flex-1 min-w-0"
                                >
                                    {monthToOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={resetRange}
                                    disabled={loading}
                                    title="Reset ke Semua Bulan"
                                    className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 hover:bg-red-100 hover:text-red-500 text-gray-500 transition-colors disabled:opacity-50 cursor-pointer shrink-0"
                                >
                                    <FontAwesomeIcon icon={faXmark} className="w-2.5 h-2.5" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-100/90 relative overflow-hidden group hover:border-[#1D7E05]/30 transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Total Zakat (Lunas)</span>
                        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <FontAwesomeIcon icon={faCoins} className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-[#1D7E05] tracking-tight">{formatRupiah(stats.totalZakat)}</p>
                    <p className="text-[11px] text-gray-400 mt-1">
                        {hasRange ? `Zakat terverifikasi · ${periodLabel}` : 'Akumulasi seluruh zakat terverifikasi'}
                    </p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-100/90 relative overflow-hidden group hover:border-[#063A1E]/30 transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Total Infaq (Lunas)</span>
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#063A1E] flex items-center justify-center">
                            <FontAwesomeIcon icon={faHandHoldingHeart} className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-[#063A1E] tracking-tight">{formatRupiah(stats.totalInfaq)}</p>
                    <p className="text-[11px] text-gray-400 mt-1">
                        {hasRange ? `Infaq terverifikasi · ${periodLabel}` : 'Akumulasi infaq bebas & terikat'}
                    </p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-100/90 relative overflow-hidden group hover:border-yellow-300 transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Zakat Menunggu</span>
                        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <FontAwesomeIcon icon={faClock} className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-amber-600 tracking-tight">
                        {stats.pendingZakat} <span className="text-xs font-semibold text-gray-400">transaksi</span>
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">Perlu verifikasi admin</p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-100/90 relative overflow-hidden group hover:border-yellow-300 transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Infaq Menunggu</span>
                        <div className="w-8 h-8 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
                            <FontAwesomeIcon icon={faClock} className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-yellow-600 tracking-tight">
                        {stats.pendingInfaq} <span className="text-xs font-semibold text-gray-400">transaksi</span>
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">Perlu verifikasi admin</p>
                </div>
            </div>

            {/* SECTION 1: GRAFIK ZAKAT */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <h2 className="text-base font-black text-gray-900">Statistik Penerimaan Zakat</h2>
                    </div>
                    <span className="text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full">
                        {periodLabel}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Line Chart Zakat */}
                    <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faArrowTrendUp} className="text-amber-500 w-3.5 h-3.5" />
                                    Tren Zakat Bulanan
                                </h3>
                                <p className="text-[11px] text-gray-400">Grafik penerimaan zakat lunas</p>
                            </div>
                        </div>
                        <ChartBulanan
                            data={stats.grafikBulanan}
                            strokeColor="#F5B016"
                            emptyMessage={`Belum ada data zakat lunas pada ${periodLabel}.`}
                        />
                    </div>

                    {/* Pie Chart Zakat */}
                    <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faChartPie} className="text-amber-500 w-3.5 h-3.5" />
                                    Distribusi per Jenis Zakat
                                </h3>
                                <p className="text-[11px] text-gray-400">Porsi zakat maal, profesi, emas, dsb.</p>
                            </div>
                        </div>
                        <ChartJenis
                            data={stats.grafikJenis}
                            colors={WARNA_ZAKAT}
                            emptyMessage={`Belum ada data distribusi zakat pada ${periodLabel}.`}
                        />
                    </div>
                </div>
            </div>

            {/* SECTION 2: GRAFIK INFAQ */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#063A1E]" />
                        <h2 className="text-base font-black text-gray-900">Statistik Penerimaan Infaq</h2>
                    </div>
                    <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        {periodLabel}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Line Chart Infaq */}
                    <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faArrowTrendUp} className="text-[#063A1E] w-3.5 h-3.5" />
                                    Tren Infaq Bulanan
                                </h3>
                                <p className="text-[11px] text-gray-400">Grafik penerimaan infaq lunas</p>
                            </div>
                        </div>
                        <ChartBulanan
                            data={stats.grafikBulananInfaq}
                            strokeColor="#063A1E"
                            emptyMessage={`Belum ada data infaq lunas pada ${periodLabel}.`}
                        />
                    </div>

                    {/* Pie Chart Infaq */}
                    <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faChartPie} className="text-[#063A1E] w-3.5 h-3.5" />
                                    Distribusi per Jenis Infaq & Kampanye
                                </h3>
                                <p className="text-[11px] text-gray-400">Porsi infaq umum, pendidikan, kampanye, dsb.</p>
                            </div>
                        </div>
                        <ChartJenis
                            data={stats.grafikJenisInfaq}
                            colors={WARNA_INFAQ}
                            emptyMessage={`Belum ada data distribusi infaq pada ${periodLabel}.`}
                        />
                    </div>
                </div>
            </div>

            {/* SECTION 3: TRANSAKSI TERBARU */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faHistory} className="text-gray-700 w-4 h-4" />
                    <h2 className="text-base font-black text-gray-900">Aktivitas Pembayaran Terbaru</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pembayaran Zakat Terbaru */}
                    <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                                <FontAwesomeIcon icon={faCoins} className="text-amber-500 w-3 h-3" />
                                Pembayaran Zakat Terbaru
                            </h3>
                        </div>
                        {stats.riwayatTerbaru.length === 0 ? (
                            <p className="text-xs text-gray-400 py-6 text-center">Belum ada data pembayaran zakat.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs text-left">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                                            <th className="pb-2.5">Nama</th>
                                            <th className="pb-2.5">Jenis</th>
                                            <th className="pb-2.5">Jumlah</th>
                                            <th className="pb-2.5 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {stats.riwayatTerbaru.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50/50">
                                                <td className="py-2.5 font-semibold text-gray-800 max-w-[120px] truncate">{item.nama}</td>
                                                <td className="py-2.5 capitalize text-gray-600">{item.jenisZakat}</td>
                                                <td className="py-2.5 font-bold text-emerald-700">{formatRupiah(Number(item.jumlahZakat))}</td>
                                                <td className="py-2.5 text-right"><StatusBadge status={item.status} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Pembayaran Infaq Terbaru */}
                    <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                                <FontAwesomeIcon icon={faHandHoldingHeart} className="text-[#063A1E] w-3 h-3" />
                                Pembayaran Infaq Terbaru
                            </h3>
                        </div>
                        {stats.riwayatInfaqTerbaru?.length === 0 ? (
                            <p className="text-xs text-gray-400 py-6 text-center">Belum ada data pembayaran infaq.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs text-left">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                                            <th className="pb-2.5">Nama</th>
                                            <th className="pb-2.5">Program / Jenis</th>
                                            <th className="pb-2.5">Jumlah</th>
                                            <th className="pb-2.5 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {stats.riwayatInfaqTerbaru?.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50/50">
                                                <td className="py-2.5 font-semibold text-gray-800 max-w-[120px] truncate">{item.nama}</td>
                                                <td className="py-2.5 text-gray-600 max-w-[140px] truncate">{item.jenisInfaq}</td>
                                                <td className="py-2.5 font-bold text-[#063A1E]">{formatRupiah(Number(item.jumlahInfaq))}</td>
                                                <td className="py-2.5 text-right"><StatusBadge status={item.status} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}
