import { NextResponse } from 'next/server';
import { toErrorResponse } from '@/lib/errors/http';
import { completeRunSchema } from '@/lib/validation/game-schemas';
import { getCurrentUserId } from '@/services/auth/auth-service';
import { completeRun } from '@/services/games/game-run-service';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = completeRunSchema.parse(await req.json());
    return NextResponse.json({ data: await completeRun(getCurrentUserId(), params.id, body.score, body.idempotencyKey) });
  } catch (error) {
    return toErrorResponse(error);
  }
}
