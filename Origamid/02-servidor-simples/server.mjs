import { createServer } from 'node:http';

const PORT = 3000;

const server = createServer((request, response) => {
  response.setHeader('Content-Type', 'text/plain');
  console.log("[Request received]", request.method, request.url);
  switch (request.method) {
    case 'GET':
      response.statusCode = 200;
      response.end('GET!');
      break;
    case 'POST':
      response.statusCode = 201;
      response.end('POST!');
      break;
    default:
      response.statusCode = 404;
      response.end('Página não encontrada!');
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
