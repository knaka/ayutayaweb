/**
 * This is a simple 32-bit obfuscation algorithm that is used to obfuscate the
 * IDs of the entities in the database. It is used to prevent the users from
 * guessing the IDs of the entities and to prevent the enumeration of the
 * entities.
 * 
 * The algorithm is Feistel cipher with only 2 rounds. It is not secure and
 * should not be used for any security purposes. It is only used to prevent
 * the users from guessing the IDs of the entities.
 */

export const HASHING_CONST_32 = 2654435761;

function round(value: number, key: number) {
  // return (Number(BigInt(value + (key + 1 >>> 0 << 2)) * BigInt(HASHING_CONST_32) % 0x100000000n) >>> 0)
  // Does not exceed Number.MAX_SAFE_INTEGER
  return ((value + ((key + 1) << 2)) * HASHING_CONST_32 >>> 0);
}

const rounds = 2;

export function obfuscate32(n: number) {
  let [left, right] = [(n >>> 16) & 0xFFFF, n & 0xFFFF];
  for (let i = 0; i < rounds; i++) {
    [left, right] = [right, left ^ round(right, i) & 0xFFFF];
  }
  return ((left << 16) | right) >>> 0;
}

export function deobfuscate32(x: number) {
  let [left, right] = [(x >>> 16) & 0xFFFF, x & 0xFFFF];
  for (let i = rounds - 1; i >= 0; i--) {
    [left, right] = [right ^ round(left, i) & 0xFFFF, left];
  }
  return ((left << 16) | right) >>> 0;
}
