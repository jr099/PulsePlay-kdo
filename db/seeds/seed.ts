import { readFileSync } from 'fs';
import { pool } from '@/lib/db/client';

async function main() {
  const sql = readFileSync('db/seeds/seed.sql', 'utf-8');
  await pool.query(sql);
  console.log('Seed completed');
  await pool.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
