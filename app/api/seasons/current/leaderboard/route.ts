import { NextResponse } from 'next/server';
import { getLeaderboard } from '@/services/seasons/season-service';
import { toErrorResponse } from '@/lib/errors/http';

export async function GET() {
  try {
    return NextResponse.json({ data: await getLeaderboard() });
  } catch (error) {
    return toErrorResponse(error);
  }
}
