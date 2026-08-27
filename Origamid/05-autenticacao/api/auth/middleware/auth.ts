import type { Middleware } from '../../../core/router.ts';
import { CoreProvider } from '../../../core/utils/abstract.ts';
import { COOKIE_SID_NAME, SessionService } from '../services/session.ts';

export class AuthMiddleware extends CoreProvider {
  session = new SessionService(this.core);

  optional: Middleware = async (req, res) => {
    const sid = req.cookies[COOKIE_SID_NAME];
    if (!sid) {
      return;
    }
    const { valid, cookie, session } = await this.session.validate(sid);
    res.setCookie(cookie);
    if (!valid || !session) {
      return;
    }
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('Vary', 'Cookie');
    req.session = session;
  };
}
