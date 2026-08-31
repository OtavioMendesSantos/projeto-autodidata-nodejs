import type { IncomingMessage } from 'node:http';
import { parseCookies } from '../utils/parse-cookies.ts';
import type { Session } from '../../api/auth/services/session.ts';

export interface CustomRequest extends IncomingMessage {
  query: URLSearchParams;
  pathname: string;
  body: Record<string, any>;
  params: Record<string, any>;
  ip: string;
  cookies: Record<string, string | undefined>;
  session: Session | null;
  baseurl: string
}

export async function customRequest(request: IncomingMessage) {
  const req = request as CustomRequest;
  const url = new URL(req.url || '/', 'http://localhost:3000');
  req.query = url.searchParams;
  req.pathname = url.pathname;
  req.params = {};
  req.body = {};
  req.ip = req.socket.remoteAddress || '127.0.0.1';
  req.cookies = parseCookies(req.headers.cookie);
  req.session = null;
  req.baseurl = 'http://localhost:3000/'

  return req;
}
