/**
 * 🔐 PKCE (Proof Key for Code Exchange) Utilities
 * Used for secure Shopify Customer Account API authentication in public clients.
 */

export function generateCodeVerifier() {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return b64url(array);
}

export async function generateCodeChallenge(verifier: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return b64url(new Uint8Array(digest));
}

function b64url(array: Uint8Array) {
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
