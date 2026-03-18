import { BadRequestException } from "@nestjs/common";
import { ErrorCodes } from "../constants/error-codes.constant";

const IPV4_REGEX = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/;
const IPV6_REGEX = /^([0-9a-fA-F:]+)(\/\d{1,3})?$/;

export function validateIpWhitelist(input: string): void {
  if (!input) return;
  const ips = input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const ip of ips) {
    if (!IPV4_REGEX.test(ip) && !IPV6_REGEX.test(ip)) {
      throw new BadRequestException({ code: ErrorCodes.INVALID_IP_FORMAT, ip });
    }
  }
}

export function isIpAllowed(clientIp: string, whitelist: string): boolean {
  if (!whitelist) return true;
  const ips = whitelist
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return ips.some(
    (ip) => ip.startsWith(clientIp) || clientIp === ip.split("/")[0],
  );
}
