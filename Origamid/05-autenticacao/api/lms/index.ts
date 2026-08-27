import { Api } from '../../core/utils/abstract.ts';
import { RouteError } from '../../core/utils/route-error.ts';
import { AuthMiddleware } from '../auth/middleware/auth.ts';
import { LmsQuery } from './query.ts';
import { lmsTables } from './tables.ts';

export default class lmsApi extends Api {
  query = new LmsQuery(this.db);
  authMiddleware = new AuthMiddleware(this.core);

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
    getCourses: (req, res) => {
      const courses = this.query.selectCourses();
      if (!courses.length) {
        throw new RouteError(404, 'Nenhum curso encontrado');
      }
      res.status(200).json({ title: 'Cursos encontrados', data: courses });
    },
    getCourse: (req, res) => {
      const { slug } = req.params;
      const course = this.query.selectCourse(slug);
      if (!course) {
        throw new RouteError(404, 'Curso não encontrado');
      }

      let completed: { lesson_id: number; completed: string }[] = [];

      if (req.session) {
        completed = this.query.selectLessonsCompleted({
          userId: req.session.userId,
          courseId: course.id,
        });
      }

      const lessons = this.query.selectLessons(slug);
      res
        .status(200)
        .json({ title: 'Curso encontrado', course, lessons, completed });
    },
    resetCourse: (req, res) => {
      const userId = 1;
      const { courseId } = req.body;
      const writeResult = this.query.deleteLessonsCompleted({
        userId,
        courseId,
      });
      if (!writeResult.changes)
        throw new RouteError(400, 'Erro ao resetar curso');
      res.status(200).json({ title: 'Curso resetado' });
    },
    getLesson: (req, res) => {
      const { courseSlug, lessonSlug } = req.params;
      const lesson = this.query.selectLesson({ courseSlug, lessonSlug });
      const nav = this.query.selectLessonNav({ courseSlug, lessonSlug });
      if (!lesson) {
        throw new RouteError(404, 'Aula não encontrada');
      }

      const i = nav.findIndex((l) => l.slug === lesson.slug);
      const prev = i === 0 ? null : nav.at(i - 1)?.slug;
      const next = nav.at(i + 1)?.slug ?? null;

      const userId = 1;
      let completed = '';
      if (userId) {
        const lessonCompleted = this.query.selectLessonCompleted({
          userId,
          lessonId: lesson.id,
        });
        if (lessonCompleted) completed = lessonCompleted.completed;
      }

      res.status(200).json({
        title: 'Aula encontrada',
        lesson: { ...lesson, prev, next, completed },
      });
    },
    completeLesson: (req, res) => {
      const userId = 1;
      const { courseId, lessonId } = req.body;

      const writeResult = this.query.insertLessonCompleted({
        courseId,
        lessonId,
        userId,
      });
      if (!writeResult.changes)
        throw new RouteError(400, 'Erro ao completar aula');

      const progress = this.query.selectProgress({ courseId, userId });
      const incompleteLessons = progress.filter((l) => !l.completed);
      console.log(incompleteLessons);
      if (progress.length > 0 && incompleteLessons.length === 0) {
        const certificate = this.query.insertCertificate({ userId, courseId });
        if (!certificate) {
          throw new RouteError(500, 'Erro ao gerar certificado');
        }
        res
          .status(201)
          .json({ title: 'Aula concluída', certificate: certificate.id });
        return;
      }

      res.status(201).json({ title: 'Aula concluída', certificate: null });
    },
    getCertificates: (req, res) => {
      const userId = 1;
      const certificates = this.query.selectCertificates({ userId });
      if (!certificates.length) {
        throw new RouteError(404, 'Nenhum certificado encontrado');
      }
      res
        .status(200)
        .json({ title: 'Certificados encontrados com sucesso', certificates });
    },
    getCertificate: (req, res) => {
      const { id } = req.params;
      const certificate = this.query.selectCertificate({ id });
      if (!certificate) {
        throw new RouteError(404, 'Certificado não encontrado');
      }
      res
        .status(200)
        .json({ title: 'Certificado encontrado com sucesso', certificate });
    },
  } satisfies Api['handlers'];

  tables() {
    this.db.exec(lmsTables);
  }

  routes() {
    this.router.post('/lms/course', this.handlers.postCourse);
    this.router.get('/lms/courses', this.handlers.getCourses);
    this.router.get('/lms/course/:slug', this.handlers.getCourse, [this.authMiddleware.optional]);
    this.router.delete('/lms/course/reset', this.handlers.resetCourse);
    this.router.post('/lms/lesson', this.handlers.postLesson);
    this.router.get(
      '/lms/lesson/:courseSlug/:lessonSlug',
      this.handlers.getLesson,
    );
    this.router.post('/lms/lesson/complete', this.handlers.completeLesson);
    this.router.get('/lms/certificates', this.handlers.getCertificates);
    this.router.get('/lms/certificate/:id', this.handlers.getCertificate);
  }
}
