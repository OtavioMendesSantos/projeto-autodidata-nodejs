import Core from './core/core.ts';
import db from './core/database.ts';
import type { Handler } from './core/router.ts';

const core = new Core();

core.router.post('/', (req, res) => {
  res.status(200).json({ message: 'hello world' });
});

core.init();
