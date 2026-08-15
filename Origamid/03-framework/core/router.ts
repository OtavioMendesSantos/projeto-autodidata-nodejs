import type { CustomRequest } from './http/custom-request.ts';
import type { CustomResponse } from './http/custom-response.ts';

export type Handler = (
  req: CustomRequest,
  res: CustomResponse,
) => Promise<void> | void;

export class Router {
  routes: Record<string, Record<string, Handler>> = {
    GET: {},
    POST: {},
    PUT: {},
    PATCH: {},
    DELETE: {},
    HEAD: {},
    OPTIONS: {},
  };

  get(route: string, handler: Handler) {
    this.routes['GET'][route] = handler;
  }
  post(route: string, handler: Handler) {
    this.routes['POST'][route] = handler;
  }
  put(route: string, handler: Handler) {
    this.routes['PUT'][route] = handler;
  }
  patch(route: string, handler: Handler) {
    this.routes['PATCH'][route] = handler;
  }
  delete(route: string, handler: Handler) {
    this.routes['DELETE'][route] = handler;
  }
  head(route: string, handler: Handler) {
    this.routes['HEAD'][route] = handler;
  }
  options(route: string, handler: Handler) {
    this.routes['OPTIONS'][route] = handler;
  }

  find(
    method: string,
    pathname: string,
  ): { route: Handler; params: Record<string, string> } | null {
    const routesByMethod = this.routes[method];
    if (!routesByMethod) return null;

    const matchedRoute = routesByMethod[pathname];
    if (matchedRoute) return { route: matchedRoute, params: {} };

    const reqParts = pathname.split('/').filter(Boolean);
    for (const route of Object.keys(routesByMethod)) {
      if (!route.includes(':')) continue;
      const routeParts = route.split('/').filter(Boolean);
      if (reqParts.length !== routeParts.length) continue;
      if (reqParts[0] !== routeParts[0]) continue;

      const params: Record<string, string> = {};
      let ok = true;
      for (let i = 0; i < reqParts.length; i++) {
        const segment = routeParts[i];
        const value = reqParts[i];
        if (segment.startsWith(':')) {
          params[segment.slice(1)] = value;
        } else if (segment !== value) {
          ok = false;
          break;
        }
      }
      if (ok) {
        return { route: routesByMethod[route], params };
      }
    }
    return null;
  }
}
