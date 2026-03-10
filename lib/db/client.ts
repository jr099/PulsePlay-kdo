import { Pool } from 'pg';
import { env } from '@/lib/env/server-env';

export const pool = new Pool({ connectionString: env.DATABASE_URL });

export async function query<T>(text: string, params: unknown[] = []): Promise<T[]> {
  const result = await pool.query<T>(text, params);
  return result.rows;
}
