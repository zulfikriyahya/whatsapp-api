import { randomBytes } from 'crypto';

export function generateApiToken(): string {
  return randomBytes(24).toString('hex');
}

export function generateTempToken(): string {
  return randomBytes(16).toString('hex');
}

export function generateWebhookSecret(): string {
  return randomBytes(32).toString('hex');
}

export function generateHexToken(bytes = 24): string {
  return randomBytes(bytes).toString('hex');
}
