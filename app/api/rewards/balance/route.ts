import { NextResponse } from 'next/server';
import { getRewardBalance } from '@/services/rewards/reward-service';
import { getCurrentUserId } from '@/services/auth/auth-service';
import { toErrorResponse } from '@/lib/errors/http';

export async function GET() {
  try {
    return NextResponse.json({ data: await getRewardBalance(getCurrentUserId()) });
  } catch (error) {
    return toErrorResponse(error);
  }
}
