import Core from './core/core.ts';
import db from './core/database.ts';
import { logger } from './core/middleware/logger.ts';

const core = new Core();

core.router.use([logger]);

core.router.get('/', (req, res) => {
  res.status(200).json({ message: 'hello world' });
});
core.router.get(
  '/curso/:slug',
  (req, res) => {
    console.log(req.params);
    res.status(200).json({ message: 'hello world' });
  },
  [logger],
);
core.router.get('/curso/:slug/grade', (req, res) => {
  console.log(req.params);
  res.status(200).json({ message: 'hello world' });
});
core.router.get('/aula/:slug', (req, res) => {
  console.log(req.params);
  res.status(200).json({ message: 'hello world' });
});
core.init();
