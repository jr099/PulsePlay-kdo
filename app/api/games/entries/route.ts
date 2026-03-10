import { NextResponse } from 'next/server';
import { toErrorResponse } from '@/lib/errors/http';
import { createGameEntrySchema } from '@/lib/validation/game-schemas';
import { getCurrentUserId } from '@/services/auth/auth-service';
import { createEntry } from '@/services/games/game-run-service';

export async function POST(req: Request) {
  try {
    const body = createGameEntrySchema.parse(await req.json());
    return NextResponse.json({ data: await createEntry(getCurrentUserId(), body.variantId, body.idempotencyKey) });
  } catch (error) {
    return toErrorResponse(error);
  }
}
