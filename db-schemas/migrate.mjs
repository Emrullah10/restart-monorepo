import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeDatasource } from '@restart/datasource';
import { makeDatasourceConfig } from '@restart/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, 'migrations');

const { query, pool } = makeDatasource(makeDatasourceConfig());

try {
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();
  for (const file of files) {
    console.log(`Running migration: ${file}...`);
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    await query(sql);
    console.log(`✅ Applied: ${file}`);
  }
} catch (err) {
  console.error('❌ Migration failed:', err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
