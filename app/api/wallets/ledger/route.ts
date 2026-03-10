import { NextResponse } from 'next/server';
import { toErrorResponse } from '@/lib/errors/http';
import { getCurrentUserId } from '@/services/auth/auth-service';
import { getLedger } from '@/services/wallet/wallet-service';

export async function GET() {
  try {
    return NextResponse.json({ data: await getLedger(getCurrentUserId()) });
  } catch (error) {
    return toErrorResponse(error);
  }
}
