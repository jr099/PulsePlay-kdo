import { NextResponse } from 'next/server';
import { approveRedemption } from '@/services/admin/admin-service';
import { toErrorResponse } from '@/lib/errors/http';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    return NextResponse.json({ data: await approveRedemption(params.id, 'admin-demo') });
  } catch (error) {
    return toErrorResponse(error);
  }
}
