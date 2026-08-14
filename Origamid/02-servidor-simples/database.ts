import { DatabaseSync } from 'node:sqlite';
import fs from "node:fs/promises"

await fs.mkdir("./db", {recursive: true})
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
    console.error(err);
    return null;
  }
}

export function addAula({ cursoSlug, slug, nome }) {
  try {
    return db
      .prepare(
        /*sql*/ `
      INSERT OR IGNORE INTO "aulas"
        ("slug", "nome", "curso_id")
      VALUES
        (?, ? ,(SELECT "id" FROM "cursos" WHERE "slug" = ?))
    `,
      )
      .run(slug, nome, cursoSlug);
  } catch (err) {
    console.error(err);
    return null;
  }
}

export function getCursos() {
  try {
    return db.prepare(/*sql*/ `SELECT * FROM "cursos"`).all();
  } catch (err) {
    console.error(err);
    return null;
  }
}

export function getCurso({ slug }) {
  try {
    return db
      .prepare(
        /*sql*/ `
      SELECT * FROM "cursos"
      WHERE "slug"= ?`,
      )
      .get(slug);
  } catch (err) {
    console.error(err);
    return null;
  }
}

export function getAulas({ cursoSlug }) {
  try {
    return db
      .prepare(
        /*sql*/ `
      SELECT * FROM "aulas"
      WHERE "curso_id" = (
        SELECT "id" FROM "cursos" WHERE "slug" = ?
      )
    `,
      )
      .all(cursoSlug);
  } catch (err) {
    console.error(err);
    return null;
  }
}

export function getAula({ slug, curso }) {
  try {
    return db
      .prepare(
        /*sql*/ `
        SELECT * FROM "aulas"
        WHERE "curso_id" = (
          SELECT "id" FROM "cursos" WHERE "slug" = ?
        ) AND "slug" = ?
      `,
      )
      .get(curso, slug);
  } catch (err) {
    console.error(err);
    return null;
  }
}
