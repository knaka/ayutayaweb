import { describe, expect, test } from "vitest";
import { toExternalId, toInternalId } from './extid.js'

describe("External ID encode/decode", () => {
  test("Exchange between internal and external IDs", () => {
    const mapIntIdExtId = new Map([
      [0x00000000, 'e6c4ff0c'],
      [0x00000001, '6075cb6c'],
      [0x00000002, 'da2697cc'],
      [0x00000003, '53d7642c'],
      [0x00000004, 'cd883094'],
      [0x00000005, '4739fcf4'],
      [0x00000006, 'c0eac954'],
      [0x00000007, '3a9b95b4'],
      [0x00000008, 'b44c621c'],
      [0x00000009, '2dfd2e7c'],
      [0xfffffffd, '864e788b'],
      [0xfffffffe, '0c9d44eb'],
      [0xffffffff, '92ec114b'],
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
