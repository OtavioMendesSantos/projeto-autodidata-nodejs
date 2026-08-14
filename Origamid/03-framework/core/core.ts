import { createServer } from 'node:http';
import type { IncomingMessage, ServerResponse, Server } from 'node:http';
import { Router } from './router.ts';
import { customRequest } from './http/custom-request.ts';
import { customResponse } from './http/custom-response.ts';

export default class Core {
  PORT = 3000;
  router: Router;
  server: Server;

  constructor() {
    this.router = new Router();
    this.server = createServer(this.handler);
  }

  handler = async (request: IncomingMessage, response: ServerResponse) => {
    const req = await customRequest(request);
    const res = customResponse(response);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');

    console.log('[Request received]', req.method, req.pathname);
    console.log('[Request headers]', req.headers);
    if (req.body) console.log('[Request body]', req.body);

    const handler = this.router.find(req.method || '', req.pathname);
    if (handler) {
      handler(req, res);
    } else {
      res.status(404).end('Não encontrado');
    }
  };

  init = () => {
    this.server.listen(this.PORT, () => {
      console.log(`Server running on http://localhost:${this.PORT}/`);
    });
  };
}
