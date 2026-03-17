/**
 * Encode an entity ID for use in URLs (base64url).
 * e.g. "1323760" -> "MTMyMzc2MA"
 */
export function encodeEntityId(id: string | number): string {
  const encoded = typeof window !== "undefined"
    ? btoa(String(id))
    : Buffer.from(String(id)).toString("base64")
  // Make URL-safe: replace + with -, / with _, remove =
  return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

/**
 * Decode a base64url-encoded entity ID back to the original.
 * e.g. "MTMyMzc2MA" -> "1323760"
 */
export function decodeEntityId(encoded: string): string {
  // Restore standard base64: replace - with +, _ with /
  let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/")
  // Add padding if needed
  while (base64.length % 4 !== 0) base64 += "="
  return typeof window !== "undefined"
    ? atob(base64)
    : Buffer.from(base64, "base64").toString("utf-8")
}
