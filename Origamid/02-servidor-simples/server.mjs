import { createServer } from 'node:http';
import { Router } from './router.mjs';
import { customRequest } from './custom-request.mjs';
import { customResponse } from './custom-response.mjs';
import {
  handleAddProduto,
  handleGetProduto,
  handleGetProdutos,
} from './handlers.mjs';

/*
1.  Crie 3 rotas
    POST /produtos
    GET  /produtos
    GET  /produto?categoria=valor&slug=valor

2.  POST /produtos
    Deve permitir a escrita de um json em um arquivo:
    {
      "nome": "Notebook",
      "slug": "notebook",
      "categoria": "eletronicos",
      "preco": 4000
    }

    O arquivo gerado deve ser: /produtos/${categoria}/${slug}.json

3.  GET  /produtos
    Retorna uma lista com todos os dados de todos os produtos em /produtos

4.  GET  /produto?categoria=valor&slug=valor
    Retorna o produto em: /produtos/${categoria}/${slug}.json

5.  Use try/catch para evitar quebrar os servidor. Sirva erros ao cliente em caso de erro.
*/

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
