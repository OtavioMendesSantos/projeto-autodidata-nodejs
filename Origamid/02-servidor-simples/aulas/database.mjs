import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Evita criar o .sqlite fora da pasta /aulas independente de onde o código é executado
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'db.sqlite');

const db = new DatabaseSync(dbPath);

// Para visualizar o sqlite no VSCode, usa-se a extensão "SQLite3 Editor"
// Para marcar a sintaxe de sql no VSCode, usa-se a extensão "es6-string-html"

db.exec(/*sql*/` 
  PRAGMA foreign_keys = 1;
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;

  PRAGMA cache_size = 2000;
  PRAGMA busy_timeout = 5000;
  PRAGMA temp_store = MEMORY;
`)

db.exec(/*sql*/`
  CREATE TABLE IF NOT EXISTS "produtos" (
    "slug"      TEXT PRIMARY KEY,
    "nome"      TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "preco"     INTEGER NOT NULL
  )
`);

db.prepare(/*sql*/`SELECT * FROM "produtos"`).all();

db.prepare(/*sql*/`SELECT * FROM "produtos" where "slug"= ?`).get('notebook');

const insert = db.prepare(/*sql*/`
  INSERT OR IGNORE INTO "produtos" 
    ("slug", "nome", "categoria", "preco")
  VALUES
    (?, ?, ?, ?)
`)

insert.run('mouse', 'Mouse', 'eletronicos', 500);
insert.run('cadeira', 'Cadeira', 'escritorio', 600);
const item = insert.run('notebook', 'Notebook', 'eletronicos', 4000);
console.log(item);

const produtos = db.prepare(/*sql*/`SELECT * FROM "produtos"`).all();
console.log(produtos);

const firstProduto = db.prepare(/*sql*/`SELECT * FROM "produtos"`).get();
console.log(firstProduto);
