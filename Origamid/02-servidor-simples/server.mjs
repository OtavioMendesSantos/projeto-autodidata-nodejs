import { createServer } from 'node:http';
import { Router } from './router.mjs';
import { customRequest } from './custom-request.mjs';

const router = new Router();

router.get('/', (req, res) => {
  res.end('Home');
});
router.get('/produto/notebook', (req, res) => {
  res.end('Produto - Notebook');
});
router.post('/produto', (req, res) => {
  console.log(req.query.get('cor'), req.query.get('tamanho'));
  res.end('Notebook Post');
});

const server = createServer(async (request, res) => {
  const req = await customRequest(request);
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  // CORS
  // res.setHeader('Access-Control-Allow-Origin', '*');
  // res.setHeader(
  //   'Access-Control-Allow-Methods',
  //   'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  // );
  // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Cache
  // res.setHeader('Cache-Control', 'max-age=300, must-revalidate');

  console.log('[Request received]', req.method, req.pathname);
  console.log('[Request headers]', req.headers);
  if (req.body) console.log('[Request body]', req.body);

  const handler = router.find(req.method, req.pathname);
  if (handler) {
    handler(req, res);
  } else {
    res.statusCode = 404;
    res.end('Não encontrado');
  }
});

server.listen(3000, () => {
  console.log(`Server running on http://localhost:${3000}/`);
});
