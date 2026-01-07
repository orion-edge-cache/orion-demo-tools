/**
 * Cache tests module exports
 */

// Core (programmatic API)
export { executeCacheTests } from "./core.js";

// CLI (terminal UI)
export { runCacheTestsCLI } from "./cli.js";

// Legacy export for backward compatibility
export { runCacheTests } from "./run.js";

// Suites and utilities
export * from "./suites/index.js";
export * from "./utils/index.js";
