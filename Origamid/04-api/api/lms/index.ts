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

      if (!writeResult.changes)
        throw new RouteError(400, 'Erro ao criar curso');

      res.status(201).json({
        title: 'Curso criado',
        id: writeResult.lastInsertRowid,
        changes: writeResult.changes,
      });
    },
    postLessons: (req, res) => {
      const {
        courseSlug,
        slug,
        title,
        seconds,
        video,
        description,
        order,
        free,
      } = req.body;

      const writeResult = this.db
        .query(
          /* sql */ `
        INSERT OR IGNORE INTO "lessons"
          ("course_id", "slug", "title", "seconds",
          "video", "description", "order", "free")
        VALUES ((SELECT "id" FROM "courses" WHERE "slug" = ?),?,?,?,?,?,?,?)
      `,
        )
        .run(courseSlug, slug, title, seconds, video, description, order, free);

      if (!writeResult.changes) throw new RouteError(400, 'Erro ao criar aula');

      res.status(201).json({
        title: 'Aula criada',
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
    this.router.post('/lms/lessons', this.handlers.postLessons);
  }
}
