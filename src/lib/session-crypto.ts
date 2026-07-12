// Browser-only AES-GCM helpers used by Confidential mode for at-rest
// encryption of ephemeral text buffers. Keys live in memory only.

export interface EncryptedBlob {
  iv: string; // base64
  ct: string; // base64
}

function toAB(u8: Uint8Array): ArrayBuffer {
  const ab = new ArrayBuffer(u8.byteLength);
  new Uint8Array(ab).set(u8);
  return ab;
}

function b64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}
function unb64(s: string): Uint8Array {
  const raw = atob(s);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

export async function generateSessionKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
    "encrypt",
    "decrypt",
  ]);
}

export async function encryptText(key: CryptoKey, text: string): Promise<EncryptedBlob> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = new TextEncoder().encode(text);
  const ct = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: toAB(iv) },
    key,
    toAB(data),
  );
  return { iv: b64(toAB(iv)), ct: b64(ct) };
}

export async function decryptText(key: CryptoKey, blob: EncryptedBlob): Promise<string> {
  const pt = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: toAB(unb64(blob.iv)) },
    key,
    toAB(unb64(blob.ct)),
  );
  return new TextDecoder().decode(pt);
}

export async function fingerprintKey(key: CryptoKey): Promise<string> {
  const raw = await crypto.subtle.exportKey("raw", key);
  const hash = await crypto.subtle.digest("SHA-256", raw);
  return b64(hash).slice(0, 12);
}
