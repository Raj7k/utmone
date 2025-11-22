import { createHash, randomBytes } from 'crypto';

export interface APIKeyResult {
  fullKey: string;
  hash: string;
  prefix: string;
}

export function generateAPIKey(): APIKeyResult {
  const key = `utm_${randomBytes(32).toString('hex')}`;
  const hash = createHash('sha256').update(key).digest('hex');
  const prefix = key.substring(0, 12);
  
  return { fullKey: key, hash, prefix };
}

export function hashAPIKey(key: string): string {
  return createHash('sha256').update(key).digest('hex');
}

export function maskAPIKey(prefix: string): string {
  return `${prefix}${'*'.repeat(56)}`;
}
