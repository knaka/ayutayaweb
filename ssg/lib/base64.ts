/**
 * https://stackoverflow.com/a/78552144
 *
 * @param {ArrayBuffer} buffer
 * @return {string}
 */
export function toBase64(buffer: ArrayBuffer): string {
  const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  const byteLength = buffer.byteLength;
  const bufferView = new Uint8Array(buffer);
  const remainingBytesCount = byteLength % 3;
  const mainLength = byteLength - remainingBytesCount;

  let string = "";
  let i = 0;
  for (; i < mainLength; i += 3) {
      const chunk = (bufferView[i] << 16) | (bufferView[i + 1] << 8) | bufferView[i + 2];
      string += base64Chars[(chunk & 0b111111000000000000000000) >> 18];
      string += base64Chars[(chunk & 0b000000111111000000000000) >> 12];
      string += base64Chars[(chunk & 0b000000000000111111000000) >> 6];
      string += base64Chars[(chunk & 0b000000000000000000111111)];
  }
  if (remainingBytesCount === 2) {
      const chunk = (bufferView[i] << 16) | (bufferView[i + 1] << 8);
      string += base64Chars[(chunk & 0b111111000000000000000000) >> 18];
      string += base64Chars[(chunk & 0b000000111111000000000000) >> 12];
      string += base64Chars[(chunk & 0b000000000000111111000000) >> 6];
      string += "=";
  } else if (remainingBytesCount === 1) {
      const chunk = (bufferView[i] << 16);
      string += base64Chars[(chunk & 0b111111000000000000000000) >> 18];
      string += base64Chars[(chunk & 0b000000111111000000000000) >> 12];
      string += "==";
  }
  return string;
}
