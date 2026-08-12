import { createServer } from 'node:http';
import { Router } from './router.mjs';
import { customRequest } from './utils/custom-request.mjs';
import { customResponse } from './utils/custom-response.mjs';
import {
  handleAddProduto,
  handleGetProduto,
  handleGetProdutos,
} from './handlers.mjs';

const router = new Router();

router.post('/produtos', (req, res) => handleAddProduto(req, res));
router.get('/produtos', (req, res) => handleGetProdutos(req, res));
router.get('/produto', (req, res) => handleGetProduto(req, res));

const server = createServer(async (request, response) => {
  const req = await customRequest(request);
  const res = customResponse(response);
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*'); 

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
    res.status(404).end('Não encontrado');
  }
});

server.listen(3000, () => {
  console.log(`Server running on http://localhost:${3000}/`);
});
