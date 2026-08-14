import { ServerResponse } from 'node:http';

export function customResponse(res: ServerResponse) {
  res.status = (statusCode) => {
    res.statusCode = statusCode;
    return res;
  };
  res.json = (value) => {
    try {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(value));
    } catch {
      res.status(500).end('Erro');
    }
  };
  return res;
}
