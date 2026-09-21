import { createHash, randomBytes } from 'crypto';

export function generateRawToken(bytes = 32): string {
  return randomBytes(bytes).toString('hex');
}

export function hashToken(rawToken: string): string {
  return createHash('sha256').update(rawToken).digest('hex');
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
