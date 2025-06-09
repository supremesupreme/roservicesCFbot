// Encoding/decoding helpers
const enc = new TextEncoder();
const dec = new TextDecoder();

// Generate a key once and store it securely
async function getKey(secret) {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("somesalt"),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

// Encrypt a message
export async function encrypt(message, secret) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await getKey(secret);
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(message)
  );
  return btoa(
    JSON.stringify({
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(encrypted)),
    })
  );
}

// Decrypt it
export async function decrypt(encryptedBase64, secret) {
  const { iv, data } = JSON.parse(atob(encryptedBase64));
  const key = await getKey(secret);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(iv) },
    key,
    new Uint8Array(data)
  );
  return dec.decode(decrypted);
}
