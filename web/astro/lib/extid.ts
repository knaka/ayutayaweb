import { obfuscate32, deobfuscate32 } from "./obfuscate32.js";

export const toExternalId = (id: number): string => 
  obfuscate32(id).toString(16).padStart(8, "0");;

export const toInternalId = (extId: string): number =>
  deobfuscate32(parseInt(extId, 16));
