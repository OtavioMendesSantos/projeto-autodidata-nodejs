import { type Middleware } from '../router.ts';
import { RouteError } from '../utils/route-error.ts';

type Request = {
  hits: number;
  reset: number;
};

export const rateLimit = (time: number, max: number): Middleware => {
  const requests = new Map<string, Request>();

  return (req, res) => {
    const key = req.ip;
    const now = Date.now();
    let request = requests.get(key);

    if (!request || now >= request.reset) {
      request = {
        hits: 0,
        reset: now + time,
      };
      requests.set(key, request);
    }

    request.hits += 1;

    if (request.hits > max) {
      throw new RouteError(429, 'Rate Limit');
    }
    console.log(requests);
  };
};
