import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('./db/database.sqlite');

db.exec(/*sql*/ `
  PRAGMA foreign_keys = 1;
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;

  PRAGMA cache_size = 2000;
  PRAGMA busy_timeout = 5000;
  PRAGMA temp_store = MEMORY;

  CREATE TABLE IF NOT EXISTS "cursos" (
    "id" INTEGER PRIMARY KEY,
    "slug" TEXT NOT NULL COLLATE NOCASE UNIQUE,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL
  ) STRICT;

  CREATE TABLE IF NOT EXISTS "aulas" (
    "id" INTEGER PRIMARY KEY,
    "curso_id" INTEGER NOT NULL,
    "slug" TEXT NOT NULL COLLATE NOCASE,
    "nome" TEXT NOT NULL,
    FOREIGN KEY("curso_id") REFERENCES "cursos" ("id"),
    UNIQUE("curso_id", "slug")
  ) STRICT;
`);

export function addCurso({ slug, nome, descricao }) {
  try {
    return db
      .prepare(
        /*sql*/ `
      INSERT OR IGNORE INTO "cursos"
        ("slug", "nome", "descricao")
      VALUES
        (?, ? ,?)
    `,
      )
      .run(slug, nome, descricao);
  } catch (err) {
    console.err(err);
    return null;
  }
}

export function addAula({ curso_id, slug, nome }) {
  db.prepare(/*sql*/ `
  `);
}

export function getCursos({ slug }) {
  db.prepare(/*sql*/ `
  `);
}

export function getCurso({ slug }) {
  db.prepare(/*sql*/ `
  `);
}

export function getAulas({ slug, curso }) {
  db.prepare(/*sql*/ `
  `);
}

export function getAula({ slug, curso }) {
  db.prepare(/*sql*/ `
  `);
}
