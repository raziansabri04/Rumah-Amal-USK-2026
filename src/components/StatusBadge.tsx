export default function StatusBadge({ status }: { status: string }) {
    const map: Record<string, string> = {
        lunas: 'bg-green-100 text-green-700',
        pending: 'bg-yellow-100 text-yellow-700',
        ditolak: 'bg-red-100 text-red-700',
    };

    return (
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold capitalize ${map[status] ?? ''}`}>
            {status}
        </span>
    );
}