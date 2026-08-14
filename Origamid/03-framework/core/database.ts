import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

async function createDatabase() {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const dbDir = path.join(__dirname, 'db');
    const dbPath = path.join(dbDir, 'database.sqlite');
    
    await fs.mkdir(dbDir, { recursive: true });
    return new DatabaseSync(dbPath);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

const db = await createDatabase()

db.exec(/*sql*/ `
  PRAGMA foreign_keys = 1;
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;

  PRAGMA cache_size = 2000;
  PRAGMA busy_timeout = 5000;
  PRAGMA temp_store = MEMORY;
`);

export default db;
