/**
 * Orion Demo Tools - Shared Result Types
 *
 * These types are the standardized output format for all demo tools.
 * Consumers (orion-cli, orion-console) use these to display results.
 */

// ─────────────────────────────────────────────────────────────────────────────
// CACHE TESTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Result of a single test execution
 */
export interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  error?: string;
}

/**
 * Summary of a single test suite
 */
export interface TestSuiteSummary {
  name: string;
  passed: number;
  failed: number;
  results: TestResult[];
}

/**
 * Complete result from running cache tests
 */
export interface CacheTestsResult {
  success: boolean;
  endpoint: string;
  totalPassed: number;
  totalFailed: number;
  suites: TestSuiteSummary[];
  duration: number; // Total execution time in ms
  error?: string; // If failed to start (e.g., no endpoints)
}

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS GENERATOR
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Cache status from response headers
 */
export type CacheStatus = "HIT" | "MISS" | "BYPASS" | "UNKNOWN";

/**
 * Result of a single request
 */
export interface RequestResult {
  type: string;
  status: number;
  duration: number;
  cacheStatus: CacheStatus;
  hasSurrogateKeys: boolean;
  hasPurgeKeys: boolean;
  error?: string;
}

/**
 * Statistics from a batch of requests
 */
export interface BatchStats {
  total: number;
  queries: number;
  mutations: number;
  cacheHits: number;
  cacheMisses: number;
  errors: number;
  avgLatency: number;
  minLatency: number;
  maxLatency: number;
  p50: number;
  p95: number;
  p99: number;
}

/**
 * Latency comparison between cache hits and misses
 */
export interface LatencyComparison {
  avgHitLatency: number;
  avgMissLatency: number;
  speedup: number; // How many times faster hits are vs misses
}

/**
 * Complete result from running analytics generator
 */
export interface AnalyticsResult {
  success: boolean;
  endpoint: string;
  requestCount: number;
  duration: number; // Total execution time in seconds
  stats: BatchStats;
  latencyComparison: LatencyComparison | null;
  error?: string; // If failed to start
}

// ─────────────────────────────────────────────────────────────────────────────
// PROGRESS CALLBACKS (for real-time updates)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Progress callback for analytics generator
 */
export type ProgressCallback = (completed: number, total: number) => void;

/**
 * Suite completion callback for cache tests
 */
export type SuiteCallback = (suite: TestSuiteSummary) => void;
