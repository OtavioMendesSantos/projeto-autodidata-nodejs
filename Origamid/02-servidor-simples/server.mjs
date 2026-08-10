import { createServer } from 'node:http';

const PORT = 3000;

const server = createServer(async (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Cache
  // res.setHeader('Cache-Control', 'max-age=300, must-revalidate');

  const url = new URL(req.url || '/', 'http://localhost:' + PORT);
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const body = Buffer.concat(chunks).toString('utf-8');

  console.log('[Request received]', req.method, url.pathname);
  console.log('[Request headers]', req.headers);
  if (body != undefined && body != '') {
    const safeParse = (() => {
      try {
        return JSON.parse(body);
      } catch {
        return undefined;
      }
    })();
    if (safeParse) console.log('[Request body]', safeParse);
  }
  
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
  } else if (req.method === 'GET' && url.pathname === '/') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(`<html>
      <head>
        <title>Hello World!</title>
      </head>
      <body>
        <h1>Hello World!</h1>
      </body>
    </html>`);
  } else if (req.method === 'GET' && url.pathname === '/produtos') {
    res.statusCode = 200;

    const cor = url.searchParams.get('cor');
    const tamanho = url.searchParams.get('tamanho');
    console.log(url.searchParams, cor, tamanho);

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'GET!' }));
  } else if (req.method === 'POST' && url.pathname === '/produtos') {
    res.statusCode = 201;
    res.end('POST!');
  } else if (req.method === 'POST' && url.pathname === '/login') {
    res.statusCode = 200;
    // Cookie
    res.setHeader(
      'Set-Cookie',
      'token=123; HttpOnly; SameSite=Strict; Max-Age=3600; Path=/; Secure;',
    );
    res.end('LOGIN!');
  } else {
    res.statusCode = 404;
    res.end('Página não encontrada!');
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
