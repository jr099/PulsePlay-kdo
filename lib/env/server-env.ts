import { z } from 'zod';

const schema = z.object({
  DATABASE_URL: z.string().min(1).default('postgres://postgres:postgres@localhost:5432/pulseplay'),
  DEMO_USER_ID: z.string().min(1).default('00000000-0000-0000-0000-000000000001')
});

export const env = schema.parse(process.env);
