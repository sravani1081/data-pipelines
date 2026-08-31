// Data Quality, Schema Evolution & Contracts Technical Guide Documentation

export const DATA_QUALITY_GUIDE = `
# Data Quality Engine & Schema Evolution Guide

GameOps AI enforces strict data quality guarantees across game telemetry feeds.

## Core Quality Pillars

1. **Completeness**: Calculates missing/null percentage across required schema fields.
2. **Uniqueness**: Identifies duplicate records by key fields or full row hashes.
3. **Freshness SLA**: Measures time delta between telemetry event timestamp and ingestion time.
4. **Validity**: Verifies data types, numeric ranges, and regex pattern compliance.

## Schema Registry & Evolution

- **Version Diffs**: Detects added fields, removed fields, and type mutators between schema versions.
- **Compatibility Ratings**:
  - \`Compatible\`: Backward-compatible non-breaking additions (e.g. optional fields).
  - \`Warning\`: Required fields added with defaults.
  - \`Breaking\`: Field deletions or incompatible data type changes.

## Data Contracts & Dead Letter Store

- **Data Contracts**: Define producer-consumer SLAs with mandatory freshness and quality score thresholds.
- **Rejected Records Store**: Holds records failing validation for inspection and manual re-drive.
`;
