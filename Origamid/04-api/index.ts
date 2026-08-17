import Core from './core/core.ts';
import authApi from './api/auth/index.ts';
import lmsApi from './api/lms/index.ts';
import { logger } from './core/middleware/logger.ts';

const core = new Core();
core.router.use([logger]);

new authApi(core).init();
new lmsApi(core).init();

core.router.get('/', (req, res) => {
  res.status(200).json({ message: 'hello world!' });
});
core.init();
