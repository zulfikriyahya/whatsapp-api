import { BadRequestException } from "@nestjs/common";
import { ErrorCodes } from "../constants/error-codes.constant";

export function normalizePhone(input: string): string {
  let num = input.replace(/[^\d]/g, "");
  if (!num) throw new BadRequestException({ code: ErrorCodes.INVALID_PHONE });
  if (num.startsWith("0")) num = "62" + num.slice(1);
  if (num.startsWith("+")) num = num.slice(1);
  if (num.length < 8)
    throw new BadRequestException({ code: ErrorCodes.INVALID_PHONE });
  return num;
}

export function toJid(phone: string): string {
  return `${normalizePhone(phone)}@s.whatsapp.net`;
}

export function isGroupJid(jid: string): boolean {
  return jid.endsWith("@g.us");
}
