import { env } from '@/lib/env/server-env';

export function getCurrentUserId(): string {
  return env.DEMO_USER_ID;
}
