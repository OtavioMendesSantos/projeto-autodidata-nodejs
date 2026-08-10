import { createServer } from 'node:http';
import { routes } from './router.mjs';

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

  const handler = routes[req.method][url.pathname];
  if (handler) {
    handler(req, res);
  } else {
    res.statusCode = 404;
    res.end('Não encontrado');
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
