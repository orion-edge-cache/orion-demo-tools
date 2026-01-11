/**
 * Output formatting utilities for analytics generator
 */

import { log } from "@clack/prompts";
import type { BatchStats, RequestResult } from "./types.js";
import { printDivider } from "../../shared/index.js";

// Re-export printDivider for backwards compatibility
export { printDivider };

/**
 * Print batch configuration
 */
export function printConfig(totalRequests: number, endpoint: string): void {
  console.log(`\n  Endpoint: ${endpoint}`);
  console.log(`  Total: ${totalRequests} (70% queries, 30% mutations)\n`);
}

/**
 * Print request distribution and cache performance
 */
export function printStats(stats: BatchStats): void {
  console.log("\n  Request Distribution");
  console.log(`    Total:     ${stats.total}`);
  console.log(`    Queries:   ${stats.queries}`);
  console.log(`    Mutations: ${stats.mutations}`);

  console.log("\n  Cache Performance");
  console.log(`    Hits:      ${stats.cacheHits}`);
  console.log(`    Misses:    ${stats.cacheMisses}`);
  const hitRate = stats.total > 0 ? (stats.cacheHits / stats.total) * 100 : 0;
  console.log(`    Hit Rate:  ${hitRate.toFixed(1)}%`);

  console.log("\n  Latency (ms)");
  console.log(`    Average:   ${stats.avgLatency.toFixed(2)}`);
  console.log(`    Min:       ${stats.minLatency}`);
  console.log(`    Max:       ${stats.maxLatency}`);
  console.log(`    P50:       ${stats.p50}`);
  console.log(`    P95:       ${stats.p95}`);
  console.log(`    P99:       ${stats.p99}`);
}

/**
 * Print latency comparison between cache hits and misses
 */
export function printLatencyComparison(results: RequestResult[]): void {
  const hits = results.filter((r) => r.cacheStatus === "HIT");
  const misses = results.filter((r) => r.cacheStatus === "MISS");

  if (hits.length > 0 && misses.length > 0) {
    const avgHit = hits.reduce((a, r) => a + r.duration, 0) / hits.length;
    const avgMiss = misses.reduce((a, r) => a + r.duration, 0) / misses.length;

    console.log("\n  Latency Comparison");
    console.log(`    Avg HIT:   ${avgHit.toFixed(2)}ms`);
    console.log(`    Avg MISS:  ${avgMiss.toFixed(2)}ms`);
    console.log(`    Speedup:   ${(avgMiss / avgHit).toFixed(1)}x faster`);
  }
}

/**
 * Print error summary
 */
export function printErrorSummary(stats: BatchStats): void {
  console.log("\n  Errors");
  console.log(`    Total:     ${stats.errors}`);
  const errorRate = stats.total > 0 ? (stats.errors / stats.total) * 100 : 0;
  console.log(`    Rate:      ${errorRate.toFixed(2)}%`);
}

/**
 * Print final result
 */
export function printFinalResult(stats: BatchStats): void {
  printDivider();
  if (stats.errors === 0) {
    log.success("Batch requests complete!");
  } else {
    log.warning(`${stats.errors} errors detected`);
  }
}
