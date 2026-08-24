import { promisify } from 'node:util';
import { randomBytes } from 'node:crypto';

export const randomBytesAsync = promisify(randomBytes);
