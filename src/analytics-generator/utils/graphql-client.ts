/**
 * GraphQL client for analytics generation
 */

import type { RequestResult, CacheStatus } from "./types.js";

/**
 * Parse cache status from x-cache header
 */
function parseCacheStatus(header: string | null): CacheStatus {
  if (!header) return "UNKNOWN";
  if (header.includes("HIT")) return "HIT";
  if (header.includes("MISS")) return "MISS";
  if (header.includes("BYPASS") || header.includes("PASS")) return "BYPASS";
  return "UNKNOWN";
}

/**
 * Send a GraphQL request and return timing/cache info
 */
export async function sendRequest(
  endpoint: string,
  query: string,
  type: string
): Promise<RequestResult> {
  const start = Date.now();

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Fastly-Debug": "1",
      },
      body: JSON.stringify({ query }),
    });

    const duration = Date.now() - start;
    const cacheHeader = response.headers.get("x-cache") || "";

    return {
      type,
      status: response.status,
      duration,
      cacheStatus: parseCacheStatus(cacheHeader),
      hasSurrogateKeys: !!response.headers.get("surrogate-key"),
      hasPurgeKeys: !!response.headers.get("x-purge-keys"),
    };
  } catch (error) {
    return {
      type,
      status: 0,
      duration: Date.now() - start,
      cacheStatus: "UNKNOWN",
      hasSurrogateKeys: false,
      hasPurgeKeys: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
