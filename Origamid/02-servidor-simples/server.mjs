import { createServer } from 'node:http';

const PORT = 3000;

// const frase1 = Promise.resolve('Ola ');
// const frase2 = Promise.resolve('Mundo');
// const frase3 = Promise.resolve('!');
// const frasesPromisses = [frase1, frase2, frase3];
// const frases = [];
// for await (const frase of frasesPromisses) {
//   frases.push(frase);
// }
// console.log(frases.join(''));

// const parte1 = Buffer.from('Olá ');
// const parte2 = Buffer.from('Mundo');
// const final = Buffer.concat([parte1, parte2]).toString('utf-8');
// console.log(final);

const server = createServer(async (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  const url = new URL(req.url || '/', 'http://localhost:' + PORT);
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const body = Buffer.concat(chunks).toString("utf-8")
  
  console.log('[Request received]', req.method, url.pathname);
  console.log('[Request headers]', req.headers);
  console.log('[Request body]', JSON.parse(body));
  
  if (req.method === 'GET' && url.pathname === '/produtos') {
    res.statusCode = 200;

    const cor = url.searchParams.get('cor');
    const tamanho = url.searchParams.get('tamanho');
    console.log(url.searchParams, cor, tamanho);

    res.end('GET!');
  } else if (req.method === 'POST' && url.pathname === '/produtos') {
    res.statusCode = 201;
    res.end('POST!');
  } else if (req.method === 'POST' && url.pathname === '/login') {
    res.statusCode = 200;
    res.end('LOGIN!');
  } else {
    res.statusCode = 404;
    res.end('Página não encontrada!');
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
