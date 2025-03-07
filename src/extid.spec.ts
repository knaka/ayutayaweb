import { describe, expect, test } from "vitest";
import { toExternalId, toInternalId } from './extid.js'

// cc6362c4
// 98c12511
// 652733ea
// 2d4ec940
// 800179b3
// ad4ec940
// a95a6edc
// 00000001

describe("extid", () => {
  test("convert", async (ctx) => {
    const mapIntIdExtId = new Map([
      [1, 'cc6362c4'],
      [2, '98c12511'],
      [3, '652733ea'],
      [0x7fffffff, '2d4ec940'],
      [0x80000000, '800179b3'],
      [0xffffffff, 'ad4ec940'],
      [0xdbab30bb, 'a95a6edc'],
      [0xded76d14, '00000001'],
    ]);
    for (const [originalId, expectedExtId] of mapIntIdExtId) {
      const extId = toExternalId(originalId);
      expect(extId).toHaveLength(8);
      expect(extId).toBe(expectedExtId);
      const intId = toInternalId(extId);
      expect(intId).toBe(originalId);
    }
  });
});
