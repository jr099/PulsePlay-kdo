import { z } from 'zod';

export const patchProfileSchema = z.object({
  displayName: z.string().min(2).max(40)
});

export const patchLimitsSchema = z.object({
  dailyPlayLimit: z.number().int().min(0).max(500)
});
