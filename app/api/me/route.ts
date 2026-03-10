import { NextResponse } from 'next/server';
import { toErrorResponse } from '@/lib/errors/http';
import { getCurrentUserId } from '@/services/auth/auth-service';
import { getProfile } from '@/services/profile/profile-service';

export async function GET() {
  try {
    const userId = getCurrentUserId();
    const profile = await getProfile(userId);
    return NextResponse.json({ data: { userId, profile } });
  } catch (error) {
    return toErrorResponse(error);
  }
}
