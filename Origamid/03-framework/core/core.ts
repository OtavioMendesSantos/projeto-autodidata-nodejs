import { createServer } from 'node:http';
import type { IncomingMessage, ServerResponse, Server } from 'node:http';
import { Router } from './router.ts';
import { customRequest } from './http/custom-request.ts';
import { customResponse } from './http/custom-response.ts';
import { bodyJson } from './middleware/body-json.ts';
import { RouteError } from './utils/route-error.ts';

export default class Core {
  PORT = 3000;
  router: Router;
  server: Server;

  constructor() {
    this.router = new Router();
    this.router.use([bodyJson]);
    this.server = createServer(this.handler);
  }

  handler = async (request: IncomingMessage, response: ServerResponse) => {
    try {
      const req = await customRequest(request);
      const res = customResponse(response);
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Access-Control-Allow-Origin', '*');

      for (const middleware of this.router.middlewares) {
        await middleware(req, res);
      }

      const matched = this.router.find(req.method || '', req.pathname);
      if (!matched) return res.status(404).end('Não encontrado');
      const { route, params } = matched;
      req.params = params;
      for (const middleware of route.middlewares) {
        await middleware(req, res);
      }
      await route.handler(req, res);
    } catch (err) {
      response.setHeader(
        'Content-Type',
        'application/problem+json; charset=utf-8',
      );
      let title = 'Um erro interno ocorreu.';
      let status = 500;
      if (err instanceof RouteError) {
        console.error(
          `[${request.method} ${request.url}] ${err.status} ${err.message}`,
        );
        status = err.status;
        title = err.message;
      } else {
        console.error(err);
      }
      response.statusCode = status;
      response.end(JSON.stringify({ message: title, status }));
    }
  };

  init = () => {
    this.server.listen(this.PORT, () => {
      console.log(`Server running on http://localhost:${this.PORT}/`);
    });
  };
}
