import { NextResponse } from 'next/server';
import { listCatalog } from '@/services/rewards/reward-service';
import { toErrorResponse } from '@/lib/errors/http';

export async function GET() {
  try {
    return NextResponse.json({ data: await listCatalog() });
  } catch (error) {
    return toErrorResponse(error);
  }
}
