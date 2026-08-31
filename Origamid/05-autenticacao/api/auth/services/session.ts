import { CoreProvider } from '../../../core/utils/abstract.ts';
import { AuthQuery } from '../query.ts';
import { randomBytesAsync, sha256 } from '../utils/utils.ts';
import type { UserRole } from '../query.ts';

export const COOKIE_SID_NAME = '__Secure-sid';

const TTL_SEC_15_DAYS = 60 * 60 * 24 * 15;
const TTL_SEC_5_DAYS = 60 * 60 * 24 * 5;

export type Session = {
  userId: number;
  role: UserRole;
  expires_ms: number;
};

function sidCookie(sid: string, expires: number) {
  return `${COOKIE_SID_NAME}=${sid}; Path=/; HttpOnly; Secure; Max-Age=${expires}; SameSite=Lax`;
}

export class SessionService extends CoreProvider {
  query = new AuthQuery(this.db);

  async create({ userId, ip, ua }: { userId: number; ip: string; ua: string }) {
    const expires_ms = Date.now() + TTL_SEC_15_DAYS * 1000; // 15 dias

    const sid = (await randomBytesAsync(32)).toString('base64url');
    const sid_hash = sha256(sid);

    this.query.insertSession({
      sid_hash,
      user_id: userId,
      ip,
      ua,
      expires_ms,
    });

    const cookie = sidCookie(sid, TTL_SEC_15_DAYS);

    return { cookie };
  }
  async validate(sid: string) {
    const now = Date.now();
    const sid_hash = sha256(sid);
    const session = this.query.selectSession({ sid_hash });

    if (!session || session.revoked) {
      return {
        valid: false,
        cookie: sidCookie('', 0),
      };
    }

    let expires_ms = session.expires_ms;

    if (now >= session.expires_ms) {
      this.query.revokeSession({ sid_hash });
      return {
        valid: false,
        cookie: sidCookie('', 0),
      };
    }

    if (now >= session.expires_ms - 1000 * TTL_SEC_5_DAYS) {
      const expires_msUpdate = now + TTL_SEC_15_DAYS * 1000;
      this.query.updateSessionExpires({
        sid_hash,
        expires_ms: expires_msUpdate,
      });
      expires_ms = expires_msUpdate;
    }

    const user = this.query.selectUserRole({ user_id: session.user_id });
    if (!user) {
      this.query.revokeSession({ sid_hash });
      return {
        valid: false,
        cookie: sidCookie('', 0),
      };
    }

    return {
      valid: true,
      cookie: sidCookie(sid, Math.floor((expires_ms - now) / 1000)),
      session: {
        userId: session.user_id,
        role: user.role,
        expires_ms,
      },
    };
  }
  async inValidate(sid: string | undefined) {
    const cookie = sidCookie('', 0);
    try {
      if (sid) {
        const sid_hash = sha256(sid);
        this.query.revokeSession({ sid_hash });
      }
    } catch {}
    return {
      cookie,
    };
  }
  async inValidateAll(user_id: number) {
    this.query.revokeSessions({ user_id });
  }
  async resetToken({
    userId,
    ip,
    ua,
  }: {
    userId: number;
    ip: string;
    ua: string;
  }) {
    const token = (await randomBytesAsync(32)).toString('base64url');
    const token_hash = sha256(token);
    const expires_ms = Date.now() + 1000 * 60 * 30;
    this.query.insertReset({
      user_id: userId,
      token_hash,
      ua,
      ip,
      expires_ms,
    });
    return { token };
  }
}
