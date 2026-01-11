/**
 * Type definitions for cache tests
 */

import type { Endpoints, CacheStatus } from "../../shared/index.js";

// Re-export CacheStatus for backwards compatibility
export type { CacheStatus };

/**
 * Result of a single test execution
 */
export interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration: number;
}

/**
 * A test suite containing multiple related tests
 */
export interface TestSuite {
  name: string;
  run: (endpoints: Endpoints) => Promise<TestResult[]>;
}

/**
 * Parsed response from a GraphQL request
 */
export interface GraphQLResponse {
  status: number;
  body: Record<string, unknown> | null;
  rawBody: string;
  cacheStatus: CacheStatus;
  surrogateKeys: string | null;
  purgeKeys: string | null;
  cacheControl: string;
}

/**
 * Summary of test suite execution
 */
export interface TestSuiteSummary {
  name: string;
  passed: number;
  failed: number;
  results: TestResult[];
}

/**
 * Overall test run summary
 */
export interface TestRunSummary {
  totalPassed: number;
  totalFailed: number;
  suites: TestSuiteSummary[];
}

// Re-export Endpoints for convenience
export type { Endpoints } from "../../shared/index.js";
