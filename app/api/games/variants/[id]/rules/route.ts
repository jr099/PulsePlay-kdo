import { NextResponse } from 'next/server';
import { toErrorResponse } from '@/lib/errors/http';
import { getVariantRules } from '@/services/games/game-service';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    return NextResponse.json({ data: await getVariantRules(params.id) });
  } catch (error) {
    return toErrorResponse(error);
  }
}
