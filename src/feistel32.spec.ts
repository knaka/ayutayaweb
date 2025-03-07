import { describe, expect, test } from "vitest";
import { encodeUint32, decodeUint32 } from "./feistel32.js";

const rounds = 10;

describe("Feisten cipher for 32-bit unsigned integers", () => {
  test("encrypt/decrypt", () => {
    const originals = [0xdbab30bb, 0x00000001, 0x12345678, 0x87654321, 0xffffffff];
    for (const original of originals) {
      const encrypted = encodeUint32(original, rounds);
      // console.log(`0x${original.toString(16)} -> 0x${encrypted.toString(16)}`);
      const decrypted = decodeUint32(encrypted, rounds);
      expect(decrypted).toBe(original);
    }
  });
});
