// Pipeline Builder & Orchestration Types

export type NodeType =
  | 'Source'
  | 'Ingest'
  | 'Parse'
  | 'Filter'
  | 'Validate'
  | 'Transform'
  | 'Join'
  | 'Aggregate'
  | 'Deduplicate'
  | 'Sort'
  | 'Window'
  | 'Enrich'
  | 'Sample'
  | 'Split'
  | 'Feature Engineer'
  | 'Quality Check'
  | 'Output';

export interface PipelineNode {
  id: string;
  type: NodeType;
  label: string;
  position: { x: number; y: number };
  config: {
    // Filter Node
    field?: string;
    operator?: '==' | '!=' | '>' | '>=' | '<' | '<=' | 'contains' | 'in' | 'notNull';
    value?: any;

    // Transform Node
    targetField?: string;
    expressionType?: 'uppercase' | 'lowercase' | 'math' | 'concat' | 'custom' | 'dateFormat';
    expression?: string;

    // Join Node
    rightDatasetId?: string;
    leftKey?: string;
    rightKey?: string;
    joinType?: 'inner' | 'left' | 'right' | 'full';

    // Aggregate Node
    groupBy?: string[];
    metrics?: { field: string; func: 'count' | 'sum' | 'avg' | 'min' | 'max' | 'p95'; alias: string }[];

    // Deduplicate Node
    dedupKeys?: string[];
    keep?: 'first' | 'last';

    // Sort Node
    sortFields?: { field: string; direction: 'asc' | 'desc' }[];

    // Window Node
    windowType?: 'tumbling' | 'sliding';
    windowSizeMinutes?: number;
    timestampField?: string;

    // Enrich Node
    enrichType?: 'metadata' | 'geo_ip' | 'device_info' | 'user_segment';
    lookupTable?: Record<string, any>;

    // Sample Node
    sampleMethod?: 'random' | 'percentage';
    sampleSize?: number;

    // Split Node
    trainRatio?: number;
    valRatio?: number;
    testRatio?: number;

    // Feature Node
    featureTypes?: ('encoding' | 'scaling' | 'rolling' | 'lag' | 'ratio')[];
    featureParams?: Record<string, any>;

    // Quality Check Node
    schemaId?: string;
    strictMode?: boolean;

    // Source / Output Node
    dataSourceId?: string;
    datasetId?: string;
    outputName?: string;
  };
}

export interface PipelineEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  label?: string;
}

export type PipelineStatus = 'Draft' | 'Published' | 'Archived';
export type ScheduleFrequency = 'Hourly' | 'Daily' | 'Weekly' | 'Manual' | 'Event-Triggered';

export interface PipelineParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date';
  defaultValue: any;
  description: string;
}

export interface Pipeline {
  id: string;
  projectId: string;
  name: string;
  description: string;
  version: number;
  status: PipelineStatus;
  schedule: ScheduleFrequency;
  ownerId: string;
  nodes: PipelineNode[];
  edges: PipelineEdge[];
  parameters: PipelineParameter[];
  retryPolicy: {
    maxRetries: number;
    backoffMs: number;
  };
  cacheEnabled: boolean;
  environment: 'Development' | 'Staging' | 'Production';
  createdAt: string;
  updatedAt: string;
  lastRunAt?: string;
  lastRunStatus?: 'Succeeded' | 'Failed' | 'Running';
}

export type RunStatus = 'Queued' | 'Running' | 'Succeeded' | 'Failed' | 'Cancelled';

export interface TaskRun {
  id: string;
  runId: string;
  nodeId: string;
  nodeLabel: string;
  nodeType: NodeType;
  status: RunStatus;
  recordsIn: number;
  recordsOut: number;
  durationMs: number;
  startedAt: string;
  completedAt?: string;
  error?: string;
  logs: string[];
}

export interface PipelineRun {
  id: string;
  pipelineId: string;
  pipelineName: string;
  projectId: string;
  version: number;
  status: RunStatus;
  triggeredBy: string;
  parameters: Record<string, any>;
  durationMs: number;
  recordsProcessed: number;
  qualityScore: number;
  cacheHit: boolean;
  tasks: TaskRun[];
  startedAt: string;
  completedAt?: string;
  errorSummary?: string;
}
