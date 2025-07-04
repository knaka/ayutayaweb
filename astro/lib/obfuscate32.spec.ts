import { describe, expect, test } from "vitest";
import { obfuscate32, deobfuscate32, HASHING_CONST_32 } from "./obfuscate32.js";

describe("Feistel cipher for 32-bit unsigned integers", () => {
  test("Does not go over max integer", () => {
    const value = 0xFFFF;
    const rounds = 2;
    const result = (value + 10 >>> 0 << rounds) * HASHING_CONST_32;
    expect(result).toBeLessThanOrEqual(Number.MAX_SAFE_INTEGER)
  });

  test("encrypt/decrypt", () => {
    const originalExpecteds = [
      [0x00000000, 0xe6c4ff0c],
      [0x00000001, 0x6075cb6c],
      [0x00000002, 0xda2697cc],
      [0x00000003, 0x53d7642c],
      [0x00000004, 0xcd883094],
      [0x00000005, 0x4739fcf4],
      [0x00000006, 0xc0eac954],
      [0x00000007, 0x3a9b95b4],
      [0x00000008, 0xb44c621c],
      [0x00000009, 0x2dfd2e7c],
      [0xfffffffd, 0x864e788b],
      [0xfffffffe, 0x0c9d44eb],
      [0xffffffff, 0x92ec114b],
    ];
    for (const [original, expected] of originalExpecteds) {
      const encrypted = obfuscate32(original);
      // console.log(`0x${original.toString(16).padStart(8, '0')} -> 0x${encrypted.toString(16)}`);
      const decrypted = deobfuscate32(encrypted);
      expect(decrypted).toBe(original);
      expect(encrypted).toBe(expected);
    }
  });
});
