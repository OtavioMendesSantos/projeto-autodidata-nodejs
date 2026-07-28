import { createServer } from 'node:http';

const PORT = 3000;

const server = createServer((req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  // res.setHeader('Content-Type', 'text/plain; charset=utf-8'); 

  const url = new URL(req.url || '/', 'http://localhost:' + PORT);
  console.log('[Request received]', req.method, url.pathname);
  console.log('[Request headers]', req.headers);

  if (req.method === 'GET' && url.pathname === '/produtos') {
    res.statusCode = 200;

    const cor = url.searchParams.get('cor');
    const tamanho = url.searchParams.get('tamanho');
    console.log(url.searchParams, cor, tamanho);

    res.end('GET!');
  } else if (req.method === 'POST' && url.pathname === '/produtos') {
    res.statusCode = 201;
    res.end('POST!');
  } else {
    res.statusCode = 404;
    res.end('Página não encontrada!');
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
