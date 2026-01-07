/**
 * Cache Test Runner
 *
 * Main entry point for running cache tests.
 * Reads endpoints from terraform state and runs all test suites.
 */

import { log } from "@clack/prompts";
import { getEndpointsFromState } from "../shared/index.js";
import {
  runAllSuites,
  printDivider,
  printEndpoint,
  printFinalSummary,
  type TestSuite,
} from "./utils/index.js";
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
 * Run the cache test suite
 */
export async function runCacheTests(): Promise<void> {
  log.info("ORION Cache Test Suite");
  printDivider();

  let endpoints;
  try {
    endpoints = await getEndpointsFromState();
  } catch (error) {
    log.error(
      error instanceof Error ? error.message : "Failed to get endpoints",
    );
    return;
  }

  printEndpoint(endpoints.vclService);

  const suites = buildTestSuites();
  const summary = await runAllSuites(suites, endpoints);

  printFinalSummary(summary.totalPassed, summary.totalFailed);
}
