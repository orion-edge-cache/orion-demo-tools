/**
 * Analytics generator module exports
 */

// Core (programmatic API)
export { executeAnalyticsGenerator } from "./core.js";

// CLI (terminal UI)
export { runAnalyticsGeneratorCLI } from "./cli.js";

// Legacy export for backward compatibility
export { runAnalyticsGenerator } from "./run.js";

// Utilities
export * from "./utils/index.js";
