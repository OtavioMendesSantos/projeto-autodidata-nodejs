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

const SCRYPT_OPTIONS: ScryptOptions = {
  // quantidade de memória/CPU a ser utilizada, a partir de 15, deve configurar a quantidade máxima de memória
  N: 2 ** 14,
  r: 8, // Block size,
  p: 1, // Paralelismo
};

const PEPPER = 'sFCEZgrGAYuv';

function parsePasswordHash(password_hash: string) {
  const [stored_salt_hex, stored_dk_hex] = password_hash.split('$');
  const stored_dk = Buffer.from(stored_dk_hex, 'hex');
  const stored_salt = Buffer.from(stored_salt_hex, 'hex');
  return { stored_dk, stored_salt };
}

async function hashPassword(password: string) {
  const password_normalized = password.normalize('NFC');
  const password_hmac = createHmac('sha256', PEPPER)
    .update(password_normalized)
    .digest();
  const salt = await randomBytesAsync(16);

  console.time('scrypt');
  const dk = await scryptAsync(password_hmac, salt, 32, SCRYPT_OPTIONS);
  console.timeEnd('scrypt');

  return `${salt.toString('hex')}$${dk.toString('hex')}`;
}

async function verifyPassword(password: string, password_hash: string) {
  const { stored_dk, stored_salt } = parsePasswordHash(password_hash);
  const password_normalized = password.normalize('NFC');
  const password_hmac = createHmac('sha256', PEPPER)
    .update(password_normalized)
    .digest();
  const dk = await scryptAsync(password_hmac, stored_salt, 32, SCRYPT_OPTIONS);
  if (dk.length !== stored_dk.length) return false;
  return timingSafeEqual(dk, stored_dk);
}

const password = 'P@ssw0rd!';
const passwordHash = await hashPassword(password);

console.log(await verifyPassword(password, passwordHash));
console.log(await verifyPassword("P@ssw0rd!!", passwordHash));
