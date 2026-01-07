/**
 * Cache Tests - CLI Presentation Layer
 *
 * Wraps core logic with CLI prompts and console output.
 * Used by orion-cli for terminal display.
 */

import { log, select, isCancel } from "@clack/prompts";
import { executeCacheTests } from "./core.js";
import {
  printDivider,
  printEndpoint,
  printSuiteResult,
  printFinalSummary,
} from "./utils/output.js";
import type { CacheTestsResult, TestSuiteSummary } from "../types.js";

/**
 * Run cache tests with CLI output
 *
 * @returns The structured result (for consumers who want both CLI output and data)
 */
export async function runCacheTestsCLI(): Promise<CacheTestsResult> {
  log.info("ORION Cache Test Suite");
  printDivider();

  const result = await executeCacheTests((suite: TestSuiteSummary) => {
    // Print each suite as it completes
    printSuiteResult(suite.name, suite.results);
  });

  if (result.error) {
    log.error(result.error);
  } else {
    printEndpoint(result.endpoint);
    printFinalSummary(result.totalPassed, result.totalFailed);
  }

  // Pause to allow user to review results
  console.log();
  const choice = await select({
    message: "Test results displayed above",
    options: [{ value: "return", label: "Return to Demo Tools Menu" }],
  });

  if (isCancel(choice)) {
    // Still return result even if cancelled
  }

  return result;
}
