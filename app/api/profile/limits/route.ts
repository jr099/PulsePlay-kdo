import { NextResponse } from 'next/server';
import { patchLimitsSchema } from '@/lib/validation/profile-schemas';
import { toErrorResponse } from '@/lib/errors/http';
import { getCurrentUserId } from '@/services/auth/auth-service';
import { getLimits, updateLimits } from '@/services/profile/profile-service';

export async function GET() {
  try {
    return NextResponse.json({ data: await getLimits(getCurrentUserId()) });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PATCH(req: Request) {
  try {
    const body = patchLimitsSchema.parse(await req.json());
    return NextResponse.json({ data: await updateLimits(getCurrentUserId(), body.dailyPlayLimit) });
  } catch (error) {
    return toErrorResponse(error);
  }
}
