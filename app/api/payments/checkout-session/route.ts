import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createCheckoutSession } from '@/services/payments/payment-service';
import { getCurrentUserId } from '@/services/auth/auth-service';
import { toErrorResponse } from '@/lib/errors/http';

const schema = z.object({ productId: z.string().uuid(), idempotencyKey: z.string().min(8) });

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    return NextResponse.json({ data: await createCheckoutSession(getCurrentUserId(), body.productId, body.idempotencyKey) });
  } catch (error) {
    return toErrorResponse(error);
  }
}
