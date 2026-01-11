/**
 * Shared formatting and parsing utilities
 *
 * Common functions used across analytics-generator and cache-tests modules.
 */

/**
 * Cache status from x-cache header
 */
export type CacheStatus = "HIT" | "MISS" | "BYPASS" | "UNKNOWN";

/**
 * Parse cache status from x-cache header
 *
 * @param header - The x-cache header value
 * @returns Parsed cache status
 */
export function parseCacheStatus(header: string | null): CacheStatus {
  if (!header) return "UNKNOWN";
  if (header.includes("HIT")) return "HIT";
  if (header.includes("MISS")) return "MISS";
  if (header.includes("BYPASS") || header.includes("PASS")) return "BYPASS";
  return "UNKNOWN";
}

/**
 * Print a horizontal divider to console
 *
 * @param width - Width of the divider in characters (default: 40)
 */
export function printDivider(width = 40): void {
  console.log("\u2500".repeat(width));
}
