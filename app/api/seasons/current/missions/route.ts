import { NextResponse } from 'next/server';
import { getMissions } from '@/services/seasons/season-service';
import { getCurrentUserId } from '@/services/auth/auth-service';
import { toErrorResponse } from '@/lib/errors/http';

export async function GET() {
  try {
    return NextResponse.json({ data: await getMissions(getCurrentUserId()) });
  } catch (error) {
    return toErrorResponse(error);
  }
}
