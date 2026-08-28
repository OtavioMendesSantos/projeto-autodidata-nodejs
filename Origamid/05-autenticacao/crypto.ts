import {
  type BinaryLike,
  type ScryptOptions,
  createHash,
  createHmac,
  randomBytes,
  scrypt,
} from 'node:crypto';
import { promisify } from 'node:util';

const PEPPER = 'sFCEZgrGAYuv';

const randomBytesAsync = promisify(randomBytes);

const scryptAsync: (
  password: BinaryLike,
  salt: BinaryLike,
  keylen: number,
  options?: ScryptOptions,
) => Promise<Buffer> = promisify(scrypt);

const salt = await randomBytesAsync(16);

// const sha = createHash('sha256').update('12345678').digest(); // Rainbow tables
const password = 'P@ssw0rd!';
const password_normalized = password.normalize('NFC');
const password_hmac = createHmac('sha-256', PEPPER)
  .update(password_normalized)
  .digest();

console.time('scrypt');
const SCRYPT_OPTIONS: ScryptOptions = {
  N: 2 ** 14, // quantidade de memória CPU a ser utilizada
  r: 8, // Block size,
  p: 1, // Paralelismo
};
const dk = await scryptAsync(password_hmac, salt, 32, SCRYPT_OPTIONS);
console.timeEnd('scrypt');

const password_hash = `${salt.toString('hex')}$${dk.toString('hex')}`;
console.log(password_hash);
