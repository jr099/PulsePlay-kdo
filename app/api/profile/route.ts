import { NextResponse } from 'next/server';
import { patchProfileSchema } from '@/lib/validation/profile-schemas';
import { toErrorResponse } from '@/lib/errors/http';
import { getCurrentUserId } from '@/services/auth/auth-service';
import { updateProfile } from '@/services/profile/profile-service';

export async function PATCH(req: Request) {
  try {
    const body = patchProfileSchema.parse(await req.json());
    const profile = await updateProfile(getCurrentUserId(), body.displayName);
    return NextResponse.json({ data: profile });
  } catch (error) {
    return toErrorResponse(error);
  }
}
