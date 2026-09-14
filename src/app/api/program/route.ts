import { NextRequest, NextResponse } from 'next/server';
import { getActivePrograms } from '@/actions/program';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;

    let programs = await getActivePrograms(category);

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      programs = programs.filter(
        (p) => p.title.toLowerCase().includes(q) || p.excerpt?.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ programs });
  } catch (error) {
    console.error('API Program GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch programs' }, { status: 500 });
  }
}
