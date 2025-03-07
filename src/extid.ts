import { encodeUint32, decodeUint32 } from "./feistel32.js";

const rounds = 3;

export const toExternalId = (id: number): string => 
  encodeUint32(id, rounds).toString(16).padStart(8, "0");;

export const toInternalId = (extId: string): number =>
  decodeUint32(parseInt(extId, 16), rounds);
