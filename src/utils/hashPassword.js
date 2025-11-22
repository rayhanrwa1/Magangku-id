import { scrypt } from "scrypt-js";

export async function hashPassword(password, salt) {
  const passwordUint8 = new TextEncoder().encode(password);
  const saltUint8 = new TextEncoder().encode(salt);

  const N = 16384; // Firebase mem_cost 14 → 2^14 = 16384
  const r = 8; // rounds
  const p = 1;
  const dkLen = 64;

  const derivedKey = await scrypt(passwordUint8, saltUint8, N, r, p, dkLen);

  const hashBase64 = btoa(String.fromCharCode(...derivedKey));

  return hashBase64;
}
