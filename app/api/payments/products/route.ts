import { NextResponse } from 'next/server';
import { listProducts } from '@/services/payments/payment-service';
import { toErrorResponse } from '@/lib/errors/http';

export async function GET() {
  try {
    return NextResponse.json({ data: await listProducts() });
  } catch (error) {
    return toErrorResponse(error);
  }
}
