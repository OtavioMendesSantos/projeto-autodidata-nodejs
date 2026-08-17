import { DatabaseSync, type StatementSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

export class Database extends DatabaseSync {
  queries: Record<string, StatementSync>;

  constructor(dbPath: string) {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    super(dbPath);
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
    return this.queries[sql];
  }
}
