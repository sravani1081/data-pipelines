// Enterprise Platform Documentation Knowledge Base Hub

export const INGESTION_ARCHITECTURE_DOC = `
# Data Ingestion Architecture & Streaming Infrastructure

GameOps AI supports real-time, low-latency ingestion of game telemetry streams and batch uploads.

## Supported Ingestion Modes

1. **Streaming Simulation**: Real-time event streaming buffer with configurable throughput (100 - 10,000 events/sec).
2. **Batch Upload**: CSV, JSON, and NDJSON file ingestion with automatic delimiter detection and schema inference.
3. **Synthetic Event Generator**: Generates realistic game telemetry for 16 payload types (combat, economy, matches, sessions, server metrics, AI behavior, crashes).

## Ingestion Pipeline SLAs

- **Freshness SLA**: Guarantees telemetry processing within 300 seconds of emission.
- **Dead Letter Queue (DLQ)**: Holds corrupted or schema-violating events for inspection and re-drive.
`;

export const PIPELINE_ENGINE_DOC = `
# DAG Pipeline Execution Engine & Topological Planner

The execution engine compiles node DAG graphs into topologically sorted execution plans.

## Key Features

- **Kahn's Algorithm**: Guarantees valid execution ordering and detects cycle loops.
- **Step Caching**: Reuses step outputs on Cache Hits when node configs and input data hashes match.
- **Node Executors**: Implements 17 node types for filtering, mapping, join hash matching, aggregations, sampling, windowing, and feature scaling.
`;

export const DATA_QUALITY_DOC = `
# Data Quality Profiling & SLA Contract Rules

Ensure 99.9% data reliability across game studio data pipelines.

## Rule Checkers

1. **Not Null Check**: Enforces non-empty values on primary keys.
2. **Range Check**: Min/Max numerical boundary limits.
3. **Regex Pattern Check**: Validates UUIDs, timestamps, and emails.
4. **Uniqueness Check**: Detects duplicate records.
5. **Freshness SLA**: Verifies event emission latency.
`;

export const SQL_PARSER_DOC = `
# Local Safe SQL Parser & Visual Query Generator

In-memory safe SQL query engine supporting:

\`\`\`sql
SELECT player_id, COUNT(*) as match_count, AVG(kills) as avg_kills
FROM matches_catalog
WHERE kills > 5
GROUP BY player_id
ORDER BY match_count DESC
LIMIT 100
\`\`\`
`;

export const ML_FEATURE_STORE_DOC = `
# Machine Learning Feature Store & Dataset Sampler

Construct player churn prediction and LTV feature stores from telemetry.

- **Rolling Windows**: 7d/30d rolling aggregations.
- **Encoders**: One-hot categorical encodings for platforms and regions.
- **Scalers**: MinMax (0-1) and Z-score standardization.
- **Dataset Partitioning**: 70% Train, 15% Validation, 15% Test splits.
`;
