import { NextResponse } from 'next/server';
import { getGameBySlug } from '@/services/games/game-service';
import { toErrorResponse } from '@/lib/errors/http';

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  try {
    return NextResponse.json({ data: await getGameBySlug(params.slug) });
  } catch (error) {
    return toErrorResponse(error);
  }
}
