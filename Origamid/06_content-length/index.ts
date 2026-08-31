import Core from './core/core.ts';
import authApi from './api/auth/index.ts';
import lmsApi from './api/lms/index.ts';
import { logger } from './core/middleware/logger.ts';
import { readFile } from 'node:fs/promises';

const core = new Core();
// core.router.use([logger]);

new authApi(core).init();
new lmsApi(core).init();

core.router.get('/', async (req, res) => {
  const index = await readFile('./front/index.html', 'utf-8');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).end(index);
});

core.init();
