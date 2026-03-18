import { sha256, generateHexToken } from "../../../src/common/utils/hash.util";

describe("hash.util", () => {
  describe("sha256", () => {
    it("returns consistent 64-char hex string", () => {
      const hash = sha256("test-input");
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[a-f0-9]+$/);
    });

    it("returns same hash for same input", () => {
      expect(sha256("abc")).toBe(sha256("abc"));
    });

    it("returns different hash for different inputs", () => {
      expect(sha256("abc")).not.toBe(sha256("def"));
    });
  });

  describe("generateHexToken", () => {
    it("returns 48-char hex string by default", () => {
      const token = generateHexToken();
      expect(token).toHaveLength(48);
      expect(token).toMatch(/^[a-f0-9]+$/);
    });

    it("returns unique tokens each time", () => {
      expect(generateHexToken()).not.toBe(generateHexToken());
    });
  });
});
