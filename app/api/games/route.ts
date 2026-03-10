import { NextResponse } from 'next/server';
import { listGames } from '@/services/games/game-service';
import { toErrorResponse } from '@/lib/errors/http';

export async function GET() {
  try {
    return NextResponse.json({ data: await listGames() });
  } catch (error) {
    return toErrorResponse(error);
  }
}
