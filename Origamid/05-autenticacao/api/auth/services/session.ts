import { CoreProvider } from '../../../core/utils/abstract.ts';
import { AuthQuery } from '../query.ts';
import { randomBytesAsync } from '../utils.ts';

export class SessionService extends CoreProvider {
  query = new AuthQuery(this.db);

  async create({ userId, ip, ua }: { userId: number; ip: string; ua: string }) {
    const expires_ms = Date.now() + 60 * 60 * 24 * 15 * 1000; // 15 dias

    const sid_hash = (await randomBytesAsync(32)).toString('base64url');

    this.query.insertSession({
      sid_hash,
      user_id: userId,
      ip,
      ua,
      expires_ms,
    });

    return { sid_hash };
  }
}
