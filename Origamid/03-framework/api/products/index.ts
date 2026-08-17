import { logger } from '../../core/middleware/logger.ts';
import { Api } from '../../core/utils/abstract.ts';
import { RouteError } from '../../core/utils/route-error.ts';

export class ProductsApi extends Api {
  handlers = {
    getProducts: (req, res) => {
      const { slug } = req.params;
      const product = this.db
        .query(`SELECT * FROM "products" WHERE "slug" = ?`)
        .get(slug);
      if (!product) {
        throw new RouteError(404, 'produto não encontrado');
      }
      res.status(200).json(product);
    },
  } satisfies Api['handlers'];

  tables() {
    this.db.exec(/*sql*/ `
      CREATE TABLE IF NOT EXISTS "products" (
        "id" INTEGER PRIMARY KEY,
        "name" TEXT,
        "slug" TEXT NOT NULL UNIQUE,
        "price" INTEGER
      );
      INSERT OR IGNORE INTO "products"
        ("name", "slug", "price") VALUES
        ('Notebook', 'notebook', 3000)
    `);
  }

  routes() {
    this.router.get('/products/:slug', this.handlers.getProducts, [logger]);
  }
}
