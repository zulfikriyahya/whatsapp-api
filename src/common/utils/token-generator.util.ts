import { randomBytes } from "crypto";

export function generateApiToken(): string {
  return randomBytes(24).toString("hex"); // 48-char hex
}

export function generateTempToken(): string {
  return randomBytes(16).toString("hex");
}

export function generateWebhookSecret(): string {
  return randomBytes(32).toString("hex");
}
