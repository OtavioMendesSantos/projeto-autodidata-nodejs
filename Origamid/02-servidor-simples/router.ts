import type { CustomRequest } from './utils/custom-request.ts';
import type { CustomResponse } from './utils/custom-response.ts';

export type Handler = (
  req: CustomRequest,
  res: CustomResponse,
) => Promise<void> | void;

export class Router {
  routes: Record<string, Record<string, Handler>> = {
    GET: {},
    POST: {},
  };

  get(route: string, handler: Handler) {
    this.routes['GET'][route] = handler;
  }
  post(route: string, handler: Handler) {
    this.routes['POST'][route] = handler;
  }

  find(method: string, route: string) {
    return this.routes[method]?.[route] || null;
  }
}
