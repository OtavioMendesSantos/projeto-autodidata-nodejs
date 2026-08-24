import Core from './core/core.ts';
import authApi from './api/auth/index.ts';
import lmsApi from './api/lms/index.ts';
import { logger } from './core/middleware/logger.ts';
import { readFile } from 'node:fs/promises';
import { RouteError } from './core/utils/route-error.ts';
import { sha256 } from './api/auth/utils.ts';

const core = new Core();
// core.router.use([logger]);

new authApi(core).init();
new lmsApi(core).init();

core.router.get('/', async (req, res) => {
  const index = await readFile('./front/index.html', 'utf-8');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).end(index);
});
core.router.get('/segura', async (req, res) => {
  const sid = req.cookies['__Secure-sid'];
  if (!sid) throw new RouteError(401, 'Não autenticado');
  
  const sid_hash = sha256(sid);

  const session = core.db
    .query(
      /*sql*/ `
        SELECT "user_id" 
        FROM "sessions" WHERE "sid_hash" = ?
      `,
    )
    .get(sid_hash);

  if (!session) throw new RouteError(404, 'Usuário não encontrado');

  res.status(200).json({
    title: 'sucesso',
    session,
  });
});
core.init();
