import { createHmac } from "crypto";

export function generateHmacSignature(payload: string, secret: string): string {
  return "sha256=" + createHmac("sha256", secret).update(payload).digest("hex");
}

export function verifyHmacSignature(
  payload: string,
  secret: string,
  signature: string,
): boolean {
  return generateHmacSignature(payload, secret) === signature;
}
