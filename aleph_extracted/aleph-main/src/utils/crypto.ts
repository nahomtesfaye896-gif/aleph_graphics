const enc = new TextEncoder();
const dec = new TextDecoder();

const HASH_ITERATIONS = 100_000;
const VAULT_ITERATIONS = 60_000;

function toB64(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function fromB64(b64: string): Uint8Array<ArrayBuffer> {
  const bin = atob(b64);
  const bytes = new Uint8Array(new ArrayBuffer(bin.length));
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export function randomBytes(len: number): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(new ArrayBuffer(len));
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < len; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return bytes;
}

export function randomHex(hexLen = 16): string {
  return Array.from(randomBytes(Math.ceil(hexLen / 2)), (b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, hexLen);
}

export function subtleAvailable(): boolean {
  return typeof crypto !== "undefined" && typeof crypto.subtle !== "undefined";
}

async function pbkdf2Bytes(
  password: string,
  salt: BufferSource,
  iterations: number,
  length: number,
): Promise<Uint8Array<ArrayBuffer>> {
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations, hash: "SHA-256" }, key, length * 8);
  return new Uint8Array(bits);
}

/** Weak synchronous digest used ONLY when WebCrypto is unavailable (non-secure context). */
function fallbackDigest(input: string): string {
  let h1 = 0xdeadbeef ^ 0;
  let h2 = 0x41c6ce57 ^ 0;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h2 >>> 0).toString(16).padStart(8, "0") + (h1 >>> 0).toString(16).padStart(8, "0");
}

export interface PasswordHash {
  hash: string;
  salt: string;
}

export async function hashPassword(password: string): Promise<PasswordHash> {
  const salt = randomBytes(16);
  if (subtleAvailable()) {
    const derived = await pbkdf2Bytes(password, salt, HASH_ITERATIONS, 32);
    return { hash: toB64(derived), salt: toB64(salt) };
  }
  return { hash: fallbackDigest(`${toB64(salt)}:${password}`), salt: toB64(salt) };
}

export async function verifyPassword(password: string, saltB64: string, expectedHash: string): Promise<boolean> {
  try {
    const salt = fromB64(saltB64);
    if (subtleAvailable()) {
      const derived = await pbkdf2Bytes(password, salt, HASH_ITERATIONS, 32);
      return toB64(derived) === expectedHash;
    }
    return fallbackDigest(`${saltB64}:${password}`) === expectedHash;
  } catch {
    return false;
  }
}

// --- Vault encryption (at-rest protection for saved credentials) ---
// Blobs embed a random salt so each entry is keyed independently and a stolen
// localStorage/Supabase snapshot cannot be read without the admin password.

function obfuscate(plain: string, password: string, saltB64: string): string {
  const keyStr = `${saltB64}:${password}`;
  const data = enc.encode(plain);
  const out = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) out[i] = data[i] ^ keyStr.charCodeAt(i % keyStr.length);
  return toB64(out);
}

function deobfuscate(payload: string, password: string, saltB64: string): string {
  const keyStr = `${saltB64}:${password}`;
  const data = fromB64(payload);
  const out = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) out[i] = data[i] ^ keyStr.charCodeAt(i % keyStr.length);
  return dec.decode(out);
}

/**
 * Encrypt `plain` with an AES-GCM key derived from `password` (PBKDF2) when
 * WebCrypto is available, otherwise fall back to a lightweight XOR obfuscation.
 * Returns "v1.<salt>.<iv>.<ct>" or "v0.<salt>.<ct>".
 */
export async function encryptText(plain: string, password: string): Promise<string> {
  const salt = randomBytes(16);
  if (subtleAvailable()) {
    const derived = await pbkdf2Bytes(password, salt, VAULT_ITERATIONS, 32);
    const key = await crypto.subtle.importKey("raw", derived, "AES-GCM", false, ["encrypt"]);
    const iv = randomBytes(12);
    const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(plain));
    return `v1.${toB64(salt)}.${toB64(iv)}.${toB64(new Uint8Array(ct))}`;
  }
  return `v0.${toB64(salt)}.${obfuscate(plain, password, toB64(salt))}`;
}

/**
 * Decrypt a vault blob produced by encryptText. Legacy plaintext values
 * (pre-encryption installs) are returned unchanged so migrations keep working.
 */
export async function decryptText(payload: string, password: string): Promise<string> {
  if (!payload) return "";
  const parts = payload.split(".");
  if (parts[0] === "v1" && parts.length === 4) {
    if (!subtleAvailable()) return "";
    try {
      const salt = fromB64(parts[1]);
      const derived = await pbkdf2Bytes(password, salt, VAULT_ITERATIONS, 32);
      const key = await crypto.subtle.importKey("raw", derived, "AES-GCM", false, ["decrypt"]);
      const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromB64(parts[2]) }, key, fromB64(parts[3]));
      return dec.decode(pt);
    } catch {
      return "";
    }
  }
  if (parts[0] === "v0" && parts.length === 3) {
    return deobfuscate(parts[2], password, parts[1]);
  }
  return payload;
}