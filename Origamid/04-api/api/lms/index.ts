import { Api } from '../../core/utils/abstract.ts';
import { RouteError } from '../../core/utils/route-error.ts';
import { LmsQuery } from './query.ts';
import { lmsTables } from './tables.ts';

export default class lmsApi extends Api {
  query = new LmsQuery(this.db);

  handlers = {
    postCourse: (req, res) => {
      const { slug, title, description, lessons, hours } = req.body;

      const writeResult = this.query.insertCourse({
        slug,
        title,
        description,
        lessons,
        hours,
      });

      if (!writeResult.changes)
        throw new RouteError(400, 'Erro ao criar curso');

      res.status(201).json({
        title: 'Curso criado',
        id: writeResult.lastInsertRowid,
        changes: writeResult.changes,
      });
    },
    postLesson: (req, res) => {
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

      const writeResult = this.query.insertLesson({
        courseSlug,
        slug,
        title,
        seconds,
        video,
        description,
        order,
        free,
      });

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
    this.router.post('/lms/course', this.handlers.postCourse);
    this.router.post('/lms/lesson', this.handlers.postLesson);
  }
}
