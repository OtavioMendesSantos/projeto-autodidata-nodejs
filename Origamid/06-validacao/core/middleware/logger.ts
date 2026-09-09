import type { Middleware } from '../router.ts';

export const logger: Middleware = (req, res) => {
  console.log(`${req.method} ${req.pathname}`);
  console.log('[Request received]', req.method, req.pathname);
  console.log('[Request headers]', req.headers);
  if (req.body) console.log('[Request body]', req.body);
};
