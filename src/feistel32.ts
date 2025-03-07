const HASHING_CONST_32 = 2654435761;

function round(value: number, key: number) {
  return ((value * HASHING_CONST_32 + key) >>> 0)
}

export function encodeUint32(n: number, rounds = 3) {
  let left = (n >>> 16) & 0xFFFF;
  let right = n & 0xFFFF;
  for (let i = 0; i < rounds; i++) {
    [left, right] = [right, (left ^ round(right, i)) & 0xFFFF];
  }
  return ((left << 16) | right) >>> 0;
}

export function decodeUint32(x: number, rounds = 3) {
  let left = (x >>> 16) & 0xFFFF;
  let right = x & 0xFFFF;
  for (let i = rounds - 1; i >= 0; i--) {
    [left, right] = [(right ^ round(left, i)) & 0xFFFF, left];
  }
  return ((left << 16) | right) >>> 0;
}
