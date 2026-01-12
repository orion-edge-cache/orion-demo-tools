/**
 * Orion Demo Tools
 *
 * Cache testing and analytics generation for Orion GraphQL Edge Cache.
 *
 * Exports:
 * - Core functions: Pure logic, return structured data (for orion-console)
 * - CLI functions: Terminal UI with prompts and output (for orion-cli)
 * - Types: Shared data structures for all consumers
 */

// ─────────────────────────────────────────────────────────────────────────────
// CORE FUNCTIONS (Programmatic API)
// ─────────────────────────────────────────────────────────────────────────────

export { executeCacheTests } from "./cache-tests/core.js";
export { executeAnalyticsGenerator } from "./analytics-generator/core.js";

// ─────────────────────────────────────────────────────────────────────────────
// CLI FUNCTIONS (Terminal UI)
// ─────────────────────────────────────────────────────────────────────────────

export { runCacheTestsCLI } from "./cache-tests/cli.js";
export { runAnalyticsGeneratorCLI } from "./analytics-generator/cli.js";

// Legacy exports (for backward compatibility with orion-cli)
export { runCacheTestsCLI as runCacheTests } from "./cache-tests/cli.js";
export { runAnalyticsGeneratorCLI as runAnalyticsGenerator } from "./analytics-generator/cli.js";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type {
  // Cache Tests
  TestResult,
  TestSuiteSummary,
  CacheTestsResult,
  SuiteCallback,

  // Analytics Generator
  CacheStatus,
  RequestResult,
  BatchStats,
  LatencyComparison,
  AnalyticsResult,
  ProgressCallback,
} from "./types.js";

export type { ResultCallback } from "./analytics-generator/core.js";

// ─────────────────────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

export { getEndpointsFromState, stateFileExists } from "./shared/index.js";
