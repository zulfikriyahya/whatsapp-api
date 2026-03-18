import { createHash, randomBytes } from "crypto";

export function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

export function generateHexToken(bytes = 24): string {
  return randomBytes(bytes).toString("hex");
}
