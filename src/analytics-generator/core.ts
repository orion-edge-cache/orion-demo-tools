/**
 * Analytics Generator - Core Logic
 *
 * Pure business logic that returns structured results.
 * No console output, no prompts - just data.
 */

import { getEndpointsFromState } from "../shared/index.js";
import {
  sendRequest,
  getQuery,
  getMutation,
  calculateStats,
  QUERY_TYPES,
  MUTATION_TYPES,
} from "./utils/index.js";
import type {
  AnalyticsResult,
  ProgressCallback,
  LatencyComparison,
  RequestResult,
  ErrorSample,
} from "../types.js";

/**
 * Calculate latency comparison between hits and misses
 */
function calculateLatencyComparison(
  results: RequestResult[],
): LatencyComparison | null {
  const hits = results.filter((r) => r.cacheStatus === "HIT");
  const misses = results.filter((r) => r.cacheStatus === "MISS");

  if (hits.length === 0 || misses.length === 0) {
    return null;
  }

  const avgHitLatency = hits.reduce((a, r) => a + r.duration, 0) / hits.length;
  const avgMissLatency =
    misses.reduce((a, r) => a + r.duration, 0) / misses.length;

  return {
    avgHitLatency,
    avgMissLatency,
    speedup: avgMissLatency / avgHitLatency,
  };
}

/**
 * Send batch of query requests
 */
async function sendQueries(
  endpoint: string,
  count: number,
  startIndex: number,
  total: number,
  onProgress?: ProgressCallback,
): Promise<RequestResult[]> {
  const results: RequestResult[] = [];

  for (let i = 0; i < count; i++) {
    const queryType = QUERY_TYPES[i % QUERY_TYPES.length]!;
    // Use valid IDs from db.json: users 1-5, posts 1-10, comments 1-20
    const userId = String((i % 5) + 1);
    const postId = String((i % 10) + 1);
    const commentId = String((i % 20) + 1);

    const query = getQuery(queryType, { userId, postId, commentId });
    results.push(await sendRequest(endpoint, query, `query:${queryType}`));

    if (onProgress && (startIndex + i + 1) % 10 === 0) {
      onProgress(startIndex + i + 1, total);
    }
  }

  return results;
}

/**
 * Send batch of mutation requests
 */
async function sendMutations(
  endpoint: string,
  count: number,
  startIndex: number,
  total: number,
  onProgress?: ProgressCallback,
): Promise<RequestResult[]> {
  const results: RequestResult[] = [];

  for (let i = 0; i < count; i++) {
    const mutationType = MUTATION_TYPES[i % MUTATION_TYPES.length]!;
    const uid = Date.now().toString().slice(-6) + i;
    // Use valid IDs from db.json: users 1-5, posts 1-10
    const userId = String((i % 5) + 1);
    const postId = String((i % 10) + 1);

    const query = getMutation(mutationType, { userId, postId, uid });
    results.push(
      await sendRequest(endpoint, query, `mutation:${mutationType}`),
    );

    if (onProgress && (startIndex + i + 1) % 10 === 0) {
      onProgress(startIndex + i + 1, total);
    }
  }

  return results;
}

/**
 * Run analytics generator and return structured results
 *
 * @param requestCount - Number of requests to send
 * @param onProgress - Optional callback for progress updates
 * @returns AnalyticsResult with all statistics
 */
export async function executeAnalyticsGenerator(
  requestCount: number,
  onProgress?: ProgressCallback,
): Promise<AnalyticsResult> {
  const startTime = Date.now();

  // Get endpoint
  let endpoint: string;
  try {
    const endpoints = await getEndpointsFromState();
    endpoint = endpoints.vclService;
  } catch (error) {
    return {
      success: false,
      endpoint: "",
      requestCount,
      duration: 0,
      stats: {
        total: 0,
        queries: 0,
        mutations: 0,
        cacheHits: 0,
        cacheMisses: 0,
        errors: 0,
        avgLatency: 0,
        minLatency: 0,
        maxLatency: 0,
        p50: 0,
        p95: 0,
        p99: 0,
      },
      latencyComparison: null,
      error: error instanceof Error ? error.message : "Failed to get endpoint",
    };
  }

  const queryCount = Math.floor(requestCount * 0.7);
  const mutationCount = requestCount - queryCount;

  // Send requests
  const queryResults = await sendQueries(
    endpoint,
    queryCount,
    0,
    requestCount,
    onProgress,
  );
  const mutationResults = await sendMutations(
    endpoint,
    mutationCount,
    queryCount,
    requestCount,
    onProgress,
  );

  const results = [...queryResults, ...mutationResults];
  const stats = calculateStats(results);
  const latencyComparison = calculateLatencyComparison(results);
  const duration = (Date.now() - startTime) / 1000;

  // Collect error samples (cap at 20)
  const errorSamples: ErrorSample[] = results
    .filter((r) => r.errorMessage)
    .slice(0, 20)
    .map((r) => ({
      type: r.type,
      status: r.status,
      query: r.query!,
      errorMessage: r.errorMessage!,
    }));

  return {
    success: stats.errors === 0,
    endpoint,
    requestCount,
    duration,
    stats,
    latencyComparison,
    errorSamples: errorSamples.length > 0 ? errorSamples : undefined,
  };
}
