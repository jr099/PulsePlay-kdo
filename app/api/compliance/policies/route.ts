import { NextResponse } from 'next/server';
import { getPolicies } from '@/services/compliance/compliance-service';
import { toErrorResponse } from '@/lib/errors/http';

export async function GET() {
  try {
    return NextResponse.json({ data: await getPolicies() });
  } catch (error) {
    return toErrorResponse(error);
  }
}
