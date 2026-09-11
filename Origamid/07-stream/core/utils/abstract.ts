import type Core from '../core.ts';
import type { Handler } from '../router.ts';

export abstract class CoreProvider {
  core: Core;
  router: Core['router'];
  db: Core['db'];

  constructor(core: Core) {
    this.core = core;
    this.router = core.router;
    this.db = core.db;
  }
}

export abstract class Api extends CoreProvider {
  /** Utilie para definir os handlers da Api.
   * Use *Arrow Functions* para declarar os métodos, evitando que o `this` se refira a classe `Api` ao invés do objeto pai (`handler`)
   */
  handlers: Record<string, Handler> = {};

  /** Utilize para criar as tabelas */
  tables() {}

  /** Utilize para registrar as rotas da Api */
  routes() {}

  init() {
    this.tables();
    this.routes();
  }
}

export abstract class Query {
  db: Core['db'];
  constructor(db: Core['db']) {
    this.db = db;
  }
}
