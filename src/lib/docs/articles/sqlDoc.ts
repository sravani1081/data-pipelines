// SQL Workspace Technical Guide Documentation

export const SQL_WORKSPACE_GUIDE = `
# Local SQL Workspace & Query Parser Syntax Guide

GameOps AI includes a safe, in-memory local SQL parser and execution engine.

## Supported SQL Features

\`\`\`sql
SELECT player_id, event_name, platform, level
FROM raw_game_events
WHERE level > 10
GROUP BY player_id
ORDER BY level DESC
LIMIT 50
\`\`\`

- **SELECT Clause**: Select specific field projections or \`*\`.
- **FROM Clause**: Reference datasets in the local Catalog.
- **WHERE Clause**: Filter by equality (\`=\`, \`!=\`), comparisons (\`>\`, \`<\`), and \`LIKE\` substrings.
- **GROUP BY Clause**: Group records by key fields with \`COUNT(*)\` aggregates.
- **LIMIT Clause**: Limit result set rows.
`;
