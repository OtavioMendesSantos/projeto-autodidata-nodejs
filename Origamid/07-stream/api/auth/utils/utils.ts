import { promisify } from 'node:util';
import { createHash, randomBytes } from 'node:crypto';

export const randomBytesAsync = promisify(randomBytes);

export function sha256(message: string) {
    return createHash('sha-256').update(message).digest();
}
