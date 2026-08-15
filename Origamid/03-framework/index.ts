import Core from './core/core.ts';
import db from './core/database.ts';
import type { Handler } from './core/router.ts';

const core = new Core();

core.router.get('/', (req, res) => {
  res.status(200).json({ message: 'hello world' });
});
core.router.get('/curso/:slug', (req, res) => {
  console.log(req.params)
  res.status(200).json({ message: 'hello world' });
});
core.router.get('/curso/:slug/grade', (req, res) => {
  console.log(req.params)
  res.status(200).json({ message: 'hello world' });
});
core.router.get('/aula/:slug', (req, res) => {
  console.log(req.params)
  res.status(200).json({ message: 'hello world' });
});
core.init();
