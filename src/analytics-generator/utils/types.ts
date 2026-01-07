/**
 * Type definitions for analytics generator
 */

/**
 * Cache status from x-cache header
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
 * Query types available for batch requests
 */
export const QUERY_TYPES = [
  "users",
  "posts", 
  "comments",
  "userById",
  "postById",
  "commentById",
] as const;

/**
 * Mutation types available for batch requests
 */
export const MUTATION_TYPES = [
  "updateUser",
  "createPost",
  "deletePost",
  "createComment",
] as const;

export type QueryType = typeof QUERY_TYPES[number];
export type MutationType = typeof MUTATION_TYPES[number];
