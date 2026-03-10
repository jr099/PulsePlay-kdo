import { NextResponse } from 'next/server';
import { getProbabilities } from '@/services/compliance/compliance-service';
import { toErrorResponse } from '@/lib/errors/http';

export async function GET() {
  try {
    return NextResponse.json({ data: await getProbabilities() });
  } catch (error) {
    return toErrorResponse(error);
  }
}
