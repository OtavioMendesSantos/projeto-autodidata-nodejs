import { createServer } from 'node:http';
import type { IncomingMessage, ServerResponse, Server } from 'node:http';
import { Router } from './router.ts';
import { customRequest } from './http/custom-request.ts';
import { customResponse } from './http/custom-response.ts';

export default class Core {
  PORT = 3000;
  router: Router;
  server: Server;
  showCoreLogs: Boolean;

  constructor(showCoreLogs = false) {
    this.router = new Router();
    this.server = createServer(this.handler);
    this.showCoreLogs = showCoreLogs;
  }

  handler = async (request: IncomingMessage, response: ServerResponse) => {
    const req = await customRequest(request);
    const res = customResponse(response);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (this.showCoreLogs) {
      console.log('[Request received]', req.method, req.pathname);
      console.log('[Request headers]', req.headers);
      if (req.body) console.log('[Request body]', req.body);
    }

    const matched = this.router.find(req.method || '', req.pathname);
    if (!matched) return res.status(404).end('Não encontrado');
    const { route, params } = matched;
    req.params = params;
    await route(req, res);
  };

  init = () => {
    this.server.listen(this.PORT, () => {
      console.log(`Server running on http://localhost:${this.PORT}/`);
    });
  };
}
