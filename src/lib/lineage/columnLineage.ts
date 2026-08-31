// Field-Level Column Lineage Tracer

export interface ColumnTrace {
  sourceColumn: string;
  sourceDataset: string;
  transformations: { nodeName: string; expression: string }[];
  targetColumn: string;
  targetDataset: string;
}

export const DEMO_COLUMN_TRACES: ColumnTrace[] = [
  {
    sourceColumn: 'duration_seconds',
    sourceDataset: 'Raw Game Events',
    transformations: [
      { nodeName: 'Parse Payload', expression: 'JSON.parse(payload)' },
      { nodeName: 'Math Transform', expression: 'duration_seconds / 60' },
    ],
    targetColumn: 'session_duration_minutes',
    targetDataset: 'Player Sessions Aggregates',
  },
  {
    sourceColumn: 'session_duration_minutes',
    sourceDataset: 'Player Sessions Aggregates',
    transformations: [
      { nodeName: 'Feature Scaling', expression: 'min_max_scale(duration, 0, 120)' },
    ],
    targetColumn: 'engagement_score',
    targetDataset: 'Player Features Store',
  },
  {
    sourceColumn: 'amount',
    sourceDataset: 'IAP Purchase Stream',
    transformations: [
      { nodeName: 'Currency Cast', expression: 'cast(amount as float)' },
      { nodeName: 'Aggregate Sum', expression: 'SUM(amount) GROUP BY player_id' },
    ],
    targetColumn: 'spend_usd_30d',
    targetDataset: 'Player Features Store',
  },
];
