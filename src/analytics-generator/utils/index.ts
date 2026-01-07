/**
 * Utility exports for analytics generator
 */

// Types
export type {
  CacheStatus,
  RequestResult,
  BatchStats,
  QueryType,
  MutationType,
} from "./types.js";

export { QUERY_TYPES, MUTATION_TYPES } from "./types.js";

// GraphQL client
export { sendRequest } from "./graphql-client.js";

// Queries
export { getQuery, getMutation } from "./queries.js";

// Stats
export { calculateStats, calculateAverageLatency } from "./stats.js";

// Output
export {
  printDivider,
  printConfig,
  printStats,
  printLatencyComparison,
  printErrorSummary,
  printFinalResult,
} from "./output.js";
