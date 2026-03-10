import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createRedemption, listRedemptions } from '@/services/rewards/reward-service';
import { getCurrentUserId } from '@/services/auth/auth-service';
import { toErrorResponse } from '@/lib/errors/http';

const schema = z.object({ itemId: z.string().uuid(), idempotencyKey: z.string().min(8) });

export async function GET() {
  try {
    return NextResponse.json({ data: await listRedemptions(getCurrentUserId()) });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    return NextResponse.json({ data: await createRedemption(getCurrentUserId(), body.itemId, body.idempotencyKey) });
  } catch (error) {
    return toErrorResponse(error);
  }
}
