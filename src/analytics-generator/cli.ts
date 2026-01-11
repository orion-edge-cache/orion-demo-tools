/**
 * Analytics Generator - CLI Presentation Layer
 *
 * Wraps core logic with CLI prompts and console output.
 * Used by orion-cli for terminal display.
 */

import { spinner, log, text, isCancel, select } from "@clack/prompts";
import { getEndpointsFromState } from "../shared/index.js";
import { executeAnalyticsGenerator } from "./core.js";
import {
  printDivider,
  printConfig,
  printStats,
  printLatencyComparison,
  printErrorSummary,
  printFinalResult,
} from "./utils/output.js";
import type { AnalyticsResult, LatencyComparison } from "../types.js";

/**
 * Print latency comparison from structured result
 */
function printLatencyComparisonFromResult(comparison: LatencyComparison): void {
  console.log("\n  Latency Comparison");
  console.log(`    Avg HIT:   ${comparison.avgHitLatency.toFixed(2)}ms`);
  console.log(`    Avg MISS:  ${comparison.avgMissLatency.toFixed(2)}ms`);
  console.log(`    Speedup:   ${comparison.speedup.toFixed(1)}x faster`);
}

/**
 * Run analytics generator with CLI prompts and output
 *
 * @returns The structured result (for consumers who want both CLI output and data)
 */
export async function runAnalyticsGeneratorCLI(): Promise<AnalyticsResult | null> {
  log.info("ORION Analytics Generator");
  printDivider();

  // Get endpoint for display first
  let endpoint: string;
  try {
    const endpoints = await getEndpointsFromState();
    endpoint = endpoints.vclService;
  } catch (error) {
    log.error(
      error instanceof Error ? error.message : "Failed to get endpoint",
    );
    return null;
  }

  // Prompt for request count
  const countInput = await text({
    message: "Number of requests?",
    placeholder: "100",
    defaultValue: "100",
    validate: (v) => {
      const n = parseInt(v, 10);
      if (isNaN(n) || n < 1) return "Enter a valid number";
    },
  });

  if (isCancel(countInput)) return null;

  const requestCount = parseInt(countInput as string, 10);

  printConfig(requestCount, endpoint);

  // Run with spinner
  const s = spinner();
  s.start(`Sending ${requestCount} requests...`);

  const result = await executeAnalyticsGenerator(
    requestCount,
    (completed, total) => {
      s.message(`Progress: ${completed}/${total}...`);
    },
  );

  s.stop("Requests complete!");

  // Display results
  if (result.error) {
    log.error(result.error);
  } else {
    console.log();
    printDivider();
    log.info("Results");

    printStats(result.stats);
    if (result.latencyComparison) {
      printLatencyComparisonFromResult(result.latencyComparison);
    }
    printErrorSummary(result.stats);

    console.log();
    printFinalResult(result.stats);
  }

  // Pause to allow user to review results
  console.log();
  const choice = await select({
    message: `${requestCount} requests sent in ${result.duration.toFixed(2)} seconds`,
    options: [{ value: "return", label: "Return to Demo Tools Menu" }],
  });

  if (isCancel(choice)) {
    // Still return result even if cancelled
  }

  return result;
}
