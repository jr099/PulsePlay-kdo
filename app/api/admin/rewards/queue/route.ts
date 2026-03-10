import { NextResponse } from 'next/server';
import { listRewardQueue } from '@/services/admin/admin-service';
import { toErrorResponse } from '@/lib/errors/http';

export async function GET() {
  try {
    return NextResponse.json({ data: await listRewardQueue() });
  } catch (error) {
    return toErrorResponse(error);
  }
}
