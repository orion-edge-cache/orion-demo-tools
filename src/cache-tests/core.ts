/**
 * Cache Tests - Core Logic
 *
 * Pure business logic that returns structured results.
 * No console output, no prompts - just data.
 */

import { getEndpointsFromState } from "../shared/index.js";
import type {
  CacheTestsResult,
  TestSuiteSummary,
  SuiteCallback,
} from "../types.js";
import type { TestSuite, Endpoints } from "./utils/types.js";
import {
  runConnectivitySuite,
  runCacheMechanicsSuite,
  runSurrogateKeysSuite,
  runInvalidationSuite,
  runEdgeCasesSuite,
} from "./suites/index.js";

/**
 * Build the list of test suites to run
 */
function buildTestSuites(): TestSuite[] {
  return [
    { name: "Connectivity", run: runConnectivitySuite },
    { name: "Cache Mechanics", run: runCacheMechanicsSuite },
    { name: "Surrogate Keys", run: runSurrogateKeysSuite },
    { name: "Invalidation", run: runInvalidationSuite },
    { name: "Edge Cases", run: runEdgeCasesSuite },
  ];
}

/**
 * Run a single test suite (no output)
 */
async function runSuite(
  suite: TestSuite,
  endpoints: Endpoints,
): Promise<TestSuiteSummary> {
  const results = await suite.run(endpoints);
  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  return { name: suite.name, passed, failed, results };
}

/**
 * Run all cache tests and return structured results
 *
 * @param onSuiteComplete - Optional callback called after each suite completes
 * @returns CacheTestsResult with all test data
 */
export async function executeCacheTests(
  onSuiteComplete?: SuiteCallback,
): Promise<CacheTestsResult> {
  const startTime = Date.now();

  // Get endpoints
  let endpoints: Endpoints;
  try {
    endpoints = await getEndpointsFromState();
  } catch (error) {
    return {
      success: false,
      endpoint: "",
      totalPassed: 0,
      totalFailed: 0,
      suites: [],
      duration: Date.now() - startTime,
      error: error instanceof Error ? error.message : "Failed to get endpoints",
    };
  }

  // Run all suites
  const suites = buildTestSuites();
  const summaries: TestSuiteSummary[] = [];

  for (const suite of suites) {
    const summary = await runSuite(suite, endpoints);
    summaries.push(summary);

    // Notify consumer of progress
    if (onSuiteComplete) {
      onSuiteComplete(summary);
    }
  }

  const totalPassed = summaries.reduce((sum, s) => sum + s.passed, 0);
  const totalFailed = summaries.reduce((sum, s) => sum + s.failed, 0);

  return {
    success: totalFailed === 0,
    endpoint: endpoints.vclService,
    totalPassed,
    totalFailed,
    suites: summaries,
    duration: Date.now() - startTime,
  };
}
