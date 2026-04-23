// Edge-compatible JWT verification (no Node.js crypto)
// Handles HS256 signed JWTs without the jsonwebtoken package

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, "=");
  return atob(padded);
}

async function hmacVerify(key: string, data: string, signature: string): Promise<boolean> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  const sigBytes = Uint8Array.from(
    atob(signature.replace(/-/g, "+").replace(/_/g, "/").padEnd(
      signature.length + (4 - (signature.length % 4)) % 4, "="
    )),
    (c) => c.charCodeAt(0)
  );

  return crypto.subtle.verify("HMAC", cryptoKey, sigBytes, enc.encode(data));
}

export async function verifyAdminTokenEdge(token: string): Promise<boolean> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const secret = process.env.JWT_SECRET || (process.env.NODE_ENV === "production" ? "" : "braidedbymae-dev-secret-change-in-prod");
    if (!secret) return false;
    const valid = await hmacVerify(secret, `${parts[0]}.${parts[1]}`, parts[2]);
    if (!valid) return false;

    const payload = JSON.parse(base64UrlDecode(parts[1]));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false;
    return payload.role === "admin";
  } catch {
    return false;
  }
}

// Sync version for non-edge (used in middleware as a quick check — the full verify is async)
export function verifyAdminToken(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false;
    return payload.role === "admin";
  } catch {
    return false;
  }
}
