// Pipeline Builder & Orchestration Technical Guide Documentation

export const PIPELINE_BUILDER_GUIDE = `
# Visual DAG Pipeline Builder & Orchestration Architecture

The GameOps AI Visual Pipeline Builder allows data engineering teams to construct end-to-end game data processing flows visually or programmatically.

## Node Types Overview

1. **Source Node**: Reads payloads from local game telemetry streams, CSV logs, or dataset catalog entries.
2. **Filter Node**: Evaluates boolean predicate logic (\`==\`, \`!=\`, \`>\`, \`<\`, \`notNull\`, \`contains\`).
3. **Transform Node**: Performs field derivations, string mutators, date formatting, and math expressions.
4. **Join Node**: Joins two datasets using indexed hash join strategy (\`Inner\`, \`Left\`, \`Right\`).
5. **Aggregate Node**: Groups records by key fields and computes \`COUNT\`, \`SUM\`, \`AVG\`, \`MIN\`, \`MAX\`, \`P95\`.
6. **Window Node**: Applies sliding or tumbling time-window bounds to streaming events.
7. **Deduplicate Node**: Removes duplicate records based on primary keys or full-row hashes.
8. **Sort Node**: Sorts dataset rows by one or more field comparators in ascending/descending order.
9. **Enrich Node**: Appends GeoIP lookup metadata, device categories, and user segment tiers.
10. **Quality Check Node**: Evaluates dataset completeness, freshness, validity, and uniqueness.
11. **Output Node**: Commits processed records into the local Dataset Catalog.

## Execution Engine Architecture

- **Topological Planner**: Generates execution dependency graphs using Kahn's algorithm and detects circular graph dependencies.
- **Step Caching**: Hashes node configuration and input data batches to reuse step calculations on Cache Hits.
- **Task Runs Inspector**: Logs start/end timestamps, per-node latency in ms, records in/out counts, and stdout/stderr logs.
`;
