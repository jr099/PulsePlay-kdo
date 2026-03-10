import { NextResponse } from 'next/server';
import { getCurrentSeason } from '@/services/seasons/season-service';
import { toErrorResponse } from '@/lib/errors/http';

export async function GET() {
  try {
    return NextResponse.json({ data: await getCurrentSeason() });
  } catch (error) {
    return toErrorResponse(error);
  }
}
