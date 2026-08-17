import { DatabaseSync, type StatementSync } from 'node:sqlite';

export class Database extends DatabaseSync {
  queries: Record<string, StatementSync>;

  constructor(path: string) {
    super(path);
    this.queries = {};
    this.exec(/*sql*/ `
      PRAGMA foreign_keys = 1;
      PRAGMA journal_mode = WAL;
      PRAGMA synchronous = NORMAL;

      PRAGMA cache_size = 2000;
      PRAGMA busy_timeout = 5000;
      PRAGMA temp_store = MEMORY;
    `);
  }

  query(sql: string) {
    if (!this.queries[sql]) {
      this.queries[sql] = this.prepare(sql);
    }
    return this.queries[sql]
  }
}

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const dbDir = path.join(__dirname, 'db');
// const dbPath = path.join(dbDir, 'database.sqlite');
// await fs.mkdir(dbDir, { recursive: true });
