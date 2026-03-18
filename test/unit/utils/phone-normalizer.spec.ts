import {
  normalizePhone,
  toJid,
  isGroupJid,
} from "../../../src/common/utils/phone-normalizer.util";
import { BadRequestException } from "@nestjs/common";

describe("phone-normalizer.util", () => {
  describe("normalizePhone", () => {
    it("converts 08xx to 628xx", () => {
      expect(normalizePhone("081234567890")).toBe("6281234567890");
    });

    it("strips non-digit characters", () => {
      expect(normalizePhone("+62-812-3456-7890")).toBe("6281234567890");
    });

    it("keeps number already starting with 62", () => {
      expect(normalizePhone("6281234567890")).toBe("6281234567890");
    });

    it("strips leading +", () => {
      expect(normalizePhone("+6281234567890")).toBe("6281234567890");
    });

    it("throws BadRequestException for empty string", () => {
      expect(() => normalizePhone("")).toThrow(BadRequestException);
    });

    it("throws BadRequestException for too-short number", () => {
      expect(() => normalizePhone("123")).toThrow(BadRequestException);
    });
  });

  describe("toJid", () => {
    it("returns JID with @s.whatsapp.net suffix", () => {
      expect(toJid("081234567890")).toBe("6281234567890@s.whatsapp.net");
    });
  });

  describe("isGroupJid", () => {
    it("returns true for group JID", () => {
      expect(isGroupJid("120363000000@g.us")).toBe(true);
    });

    it("returns false for regular JID", () => {
      expect(isGroupJid("6281234567890@s.whatsapp.net")).toBe(false);
    });
  });
});
