import { NextRequest, NextResponse } from 'next/server';
import { getDashboardStats } from '@/lib/dashboard-stats';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const year      = searchParams.get('year')      || undefined;
        const monthFrom = searchParams.get('monthFrom') || undefined;
        const monthTo   = searchParams.get('monthTo')   || undefined;

        const stats = await getDashboardStats(year, monthFrom, monthTo);
        return NextResponse.json(stats);
    } catch (error) {
        console.error('Error fetching dashboard stats API:', error);
        return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
    }
}
