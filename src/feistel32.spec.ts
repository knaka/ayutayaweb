import { describe, expect, test } from "vitest";
import { encodeUint32, decodeUint32 } from "./feistel32.js";

const round = 3;

describe("feistel", () => {
  test("encrypt", async (ctx) => {
    const originals = [0xdbab30bb, 0x00000001, 0x12345678, 0x87654321, 0xffffffff];
    for (const original of originals) {
      const encrypted = encodeUint32(original, round);
      console.log(`0x${original.toString(16)} -> 0x${encrypted.toString(16)}`);
      const decrypted = decodeUint32(encrypted, round);
      expect(decrypted).toBe(original);
    }
  });

  test("encrypt", async (ctx) => {
    const encrypted = {
      '0xcc6362c4': 0x00000001,
      '0xbd75d82b': 0x12345678,
      '0xc65451a2': 0x87654321,
      '0xad4ec940': 0xffffffff,
      '0x00000001': 0xded76d14,
    };
    for (const [encryptedValueString, original] of Object.entries(encrypted)) {
      const encryptedValue = parseInt(encryptedValueString, 16);
      const decrypted = decodeUint32(encryptedValue, round);
      expect(decrypted).toBe(original);
    }
  });
});
