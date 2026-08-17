import { Api } from '../../core/utils/abstract.ts';
import { RouteError } from '../../core/utils/route-error.ts';
import { lmsTables } from './tables.ts';

export default class lmsApi extends Api {
  handlers = {
    postCourses: (req, res) => {
      const { slug, title, description, lessons, hours } = req.body;

      const writeResult = this.db
        .query(
          /* sql */ `
        INSERT OR IGNORE INTO "courses"
          ("slug","title","description","lessons","hours")
        VALUES (?,?,?,?,?)
      `,
        )
        .run(slug, title, description, lessons, hours);

      if (!writeResult.changes) throw new RouteError(400, 'Erro ao criar curso');
      
      res.status(201).json({
        title: 'Curso criado',
        id: writeResult.lastInsertRowid,
        changes: writeResult.changes,
      });
    },
  } satisfies Api['handlers'];

  tables() {
    this.db.exec(lmsTables);
  }

  routes() {
    this.router.post('/lms/courses', this.handlers.postCourses);
  }
}
