import { NextResponse } from 'next/server';
import { approveInfaq, rejectInfaq } from '@/actions/infaq';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string, action: string }> }
) {
    try {
        const { id, action } = await params;
        
        if (action === 'approve') {
            await approveInfaq(id);
        } else if (action === 'reject') {
            await rejectInfaq(id);
        } else {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating infaq status:", error);
        return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
    }
}
