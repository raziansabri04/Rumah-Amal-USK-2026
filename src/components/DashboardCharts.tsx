'use client';

import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';

export const WARNA_ZAKAT = ['#F5B016', '#D97706', '#B45309', '#FBBF24', '#FCD34D', '#94a3b8'];
export const WARNA_INFAQ = ['#063A1E', '#059669', '#10B981', '#34D399', '#0D9488', '#14B8A6'];

const NAMA_BULAN: Record<string, string> = {
    '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
    '05': 'Mei', '06': 'Jun', '07': 'Jul', '08': 'Agu',
    '09': 'Sep', '10': 'Okt', '11': 'Nov', '12': 'Des',
};

function formatBulanLabel(bulanStr: string) {
    if (!bulanStr) return '';
    const parts = bulanStr.split('-');
    if (parts.length === 2) {
        const m = parts[1];
        const y = parts[0].slice(2);
        return `${NAMA_BULAN[m] || m} '${y}`;
    }
    return bulanStr;
}

function formatRupiahSingkat(angka: number) {
    if (angka >= 1_000_000_000) return `${(angka / 1_000_000_000).toFixed(1)}M`;
    if (angka >= 1_000_000) return `${(angka / 1_000_000).toFixed(1)}jt`;
    if (angka >= 1_000) return `${(angka / 1_000).toFixed(0)}rb`;
    return String(angka);
}

function formatRupiahTooltip(value: number | string | Array<number | string> | undefined): string {
    if (value === undefined) return '-';
    const angka = Array.isArray(value) ? Number(value[0]) : Number(value);
    return `Rp ${angka.toLocaleString('id-ID')}`;
}

export function ChartBulanan({
    data,
    strokeColor = '#F5B016',
    emptyMessage = 'Belum ada data pembayaran lunas.',
}: {
    data: { bulan: string; total: number }[];
    strokeColor?: string;
    emptyMessage?: string;
}) {
    if (data.length === 0 || data.every(d => d.total === 0)) {
        return (
            <div className="flex flex-col items-center justify-center h-[260px] text-gray-400">
                <p className="text-xs">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                    dataKey="bulan"
                    tickFormatter={formatBulanLabel}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                />
                <YAxis
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={formatRupiahSingkat}
                    axisLine={false}
                    tickLine={false}
                />
                <Tooltip
                    labelFormatter={(label) => formatBulanLabel(String(label))}
                    formatter={(value: any) => [formatRupiahTooltip(value), 'Total']}
                    contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                        fontSize: '12px',
                    }}
                />
                <Line
                    type="monotone"
                    dataKey="total"
                    stroke={strokeColor}
                    strokeWidth={3}
                    dot={{ r: 4, fill: strokeColor, stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: strokeColor }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

export function ChartJenis({
    data,
    colors = WARNA_ZAKAT,
    emptyMessage = 'Belum ada data pembayaran lunas untuk ditampilkan.',
}: {
    data: { jenis: string; total: number }[];
    colors?: string[];
    emptyMessage?: string;
}) {
    if (data.length === 0 || data.every(d => d.total === 0)) {
        return (
            <div className="flex flex-col items-center justify-center h-[260px] text-gray-400">
                <p className="text-xs">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={260}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="total"
                    nameKey="jenis"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={85}
                    paddingAngle={3}
                    label={(props) => {
                        const payload = (props as { payload?: { jenis?: string } }).payload;
                        return payload?.jenis ? (payload.jenis.length > 12 ? `${payload.jenis.slice(0, 10)}...` : payload.jenis) : '';
                    }}
                >
                    {data.map((_, index) => (
                        <Cell key={index} fill={colors[index % colors.length]} />
                    ))}
                </Pie>
                <Tooltip
                    formatter={(value: any, name: any) => [formatRupiahTooltip(value), String(name)]}
                    contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                        fontSize: '12px',
                    }}
                />
                <Legend
                    wrapperStyle={{ fontSize: 11, paddingTop: '10px' }}
                    formatter={(value) => <span className="text-gray-700 capitalize">{value}</span>}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}