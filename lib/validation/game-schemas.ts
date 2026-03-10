import { z } from 'zod';

export const createGameEntrySchema = z.object({
  variantId: z.string().uuid(),
  idempotencyKey: z.string().min(8)
});

export const completeRunSchema = z.object({
  score: z.number().int().nonnegative(),
  idempotencyKey: z.string().min(8)
});
