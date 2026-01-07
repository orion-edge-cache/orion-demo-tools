# Orion Tools

Cache testing and analytics generation tools for Orion.

## Overview

This package provides two main tools:

1. **Cache Tests** - Verify that the cache infrastructure is working correctly
2. **Analytics Generator** - Generate batch requests to populate analytics in the console dashboard

## Prerequisites

- Node.js 18+
- Orion infrastructure deployed (terraform state at `~/.config/orion/terraform.tfstate`)

## Installation

```bash
cd orion-tools
npm install
```

## Usage

### Cache Tests

Run the cache test suite to verify infrastructure is working:

```bash
npm run cache-test
```

This runs 13 tests across 5 suites:
- **Connectivity** - VCL reachability, origin connection
- **Cache Mechanics** - MISS→HIT transitions, variable sensitivity, headers, concurrency
- **Surrogate Keys** - Entity extraction for users, posts, nested queries
- **Invalidation** - Mutation cache bypass, purge keys
- **Edge Cases** - Invalid queries, non-existent IDs

### Analytics Generator

Generate batch requests to populate console analytics:

```bash
npm run analytics
```

You'll be prompted for the number of requests (default: 1000). The tool sends:
- 70% queries (cycling through users, posts, comments)
- 30% mutations (updates, creates, deletes)

After completion, you'll see statistics including:
- Request distribution
- Cache hit/miss rates
- Latency metrics (avg, min, max, p50, p95, p99)
- Error summary

## Project Structure

```
orion-tools/
├── src/
│   ├── cache-tests/           # Cache verification tests
│   │   ├── suites/            # Test suites
│   │   └── utils/             # Test utilities
│   ├── analytics-generator/   # Batch request generator
│   │   └── utils/             # Generator utilities
│   └── shared/                # Shared utilities
│       └── terraform.ts       # State file reader
├── package.json
├── tsconfig.json
└── README.md
```

## Configuration

The tools read the VCL endpoint from the Terraform state file located at:
```
~/.config/orion/terraform.tfstate
```

This file is created when you deploy Orion infrastructure using the CLI.
