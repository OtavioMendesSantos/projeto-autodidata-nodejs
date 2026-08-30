import {
  type BinaryLike,
  type ScryptOptions,
  createHmac,
  randomBytes,
  scrypt,
  timingSafeEqual,
} from 'node:crypto';
import { promisify } from 'node:util';

const randomBytesAsync = promisify(randomBytes);

const scryptAsync: (
  password: BinaryLike,
  salt: BinaryLike,
  keylen: number,
  options?: ScryptOptions,
) => Promise<Buffer> = promisify(scrypt);

export class Password {
  private PEPPER: string;
  private NORM = 'NFC';
  private DK_LEN = 32;
  private SALT_LEN = 16;
  private SCRYPT_OPTIONS: ScryptOptions = {
    N: 2 ** 14,
    r: 8,
    p: 1,
  };

  constructor(PEPPER: string) {
    this.PEPPER = PEPPER;
  }

  /**
   * Retorna as partes que compõe a senha
   * @param password_hash
   */
  parse(password_hash: string) {
    const [id, v, norm, options, stored_salt_hex, stored_dk_hex] =
      password_hash.split('$');

    const stored_norm = norm.replace('norm=', '');
    const stored_options = options
      .split(',')
      .reduce<Record<string, number>>((acc, kv) => {
        const [k, v] = kv.split('=');
        acc[k] = Number(v);
        return acc;
      }, {});
    const stored_dk = Buffer.from(stored_dk_hex, 'hex');
    const stored_salt = Buffer.from(stored_salt_hex, 'hex');
    return { stored_norm, stored_options, stored_dk, stored_salt };
  }

  /**
   * Transforma a senha informada em um hash seguro
   * @param password
   */
  async hash(password: string) {
    const password_normalized = password.normalize(this.NORM);
    const password_hmac = createHmac('sha256', this.PEPPER)
      .update(password_normalized)
      .digest();
    const salt = await randomBytesAsync(this.SALT_LEN);

    // console.time('scrypt');
    const dk = await scryptAsync(
      password_hmac,
      salt,
      this.DK_LEN,
      this.SCRYPT_OPTIONS,
    );
    // console.timeEnd('scrypt');

    return (
      `scrypt$v1$norm=${this.NORM}$N=${this.SCRYPT_OPTIONS.N},r=${this.SCRYPT_OPTIONS.r},p=${this.SCRYPT_OPTIONS.p}` +
      `$${salt.toString('hex')}$${dk.toString('hex')}`
    );
  }

  /**
   * Verifica se a senha informada está correta
   * @param password
   * @param password_hash
   */
  async verify(password: string, password_hash: string) {
    try {
      const { stored_dk, stored_options, stored_salt, stored_norm } =
        this.parse(password_hash);
      const password_normalized = password.normalize(stored_norm);
      const password_hmac = createHmac('sha256', this.PEPPER)
        .update(password_normalized)
        .digest();
      const dk = await scryptAsync(
        password_hmac,
        stored_salt,
        this.DK_LEN,
        stored_options,
      );
      if (dk.length !== stored_dk.length) return false;
      return timingSafeEqual(dk, stored_dk);
    } catch (err) {
      console.error(err)
      return false
    }
  }
}
