import { CoreProvider } from '../../../core/utils/abstract.ts';
import { AuthQuery } from '../query.ts';
import { randomBytesAsync, sha256 } from '../utils.ts';

const TTL_SEC = 60 * 60 * 24 * 15;

export class SessionService extends CoreProvider {
  query = new AuthQuery(this.db);

  async create({ userId, ip, ua }: { userId: number; ip: string; ua: string }) {
    const expires_ms = Date.now() + TTL_SEC * 1000; // 15 dias

    const sid = (await randomBytesAsync(32)).toString('base64url');
    const sid_hash = sha256(sid);

    this.query.insertSession({
      sid_hash,
      user_id: userId,
      ip,
      ua,
      expires_ms,
    });

    const cookie = `__Secure-sid=${sid}; Path=/; HttpOnly; Secure; Max-Age=${TTL_SEC}; SameSite=Lax`;

    return { cookie };
  }
}
