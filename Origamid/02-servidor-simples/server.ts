import { createServer } from 'node:http';
import { Router } from './router.ts';
import { customRequest } from './utils/custom-request.ts';
import { customResponse } from './utils/custom-response.ts';
import {
  handleAddAula,
  handleAddCurso,
  handleGetAula,
  handleGetAulas,
  handleGetCurso,
  handleGetCursos,
} from './handlers.ts';

const router = new Router();

router.post('/cursos', (req, res) => handleAddCurso(req, res));
router.post('/aulas', (req, res) => handleAddAula(req, res));
router.get('/cursos', (req, res) => handleGetCursos(req, res));
router.get('/curso', (req, res) => handleGetCurso(req, res));
router.get('/aulas', (req, res) => handleGetAulas(req, res));
router.get('/aula', (req, res) => handleGetAula(req, res));

const server = createServer(async (request, response) => {
  const req = await customRequest(request);
  const res = customResponse(response);
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');

  console.log('[Request received]', req.method, req.pathname);
  console.log('[Request headers]', req.headers);
  if (req.body) console.log('[Request body]', req.body);

  const handler = router.find(req.method|| "", req.pathname);
  if (handler) {
    handler(req, res);
  } else {
    res.status(404).end('Não encontrado');
  }
});

server.listen(3000, () => {
  console.log(`Server running on http://localhost:${3000}/`);
});
