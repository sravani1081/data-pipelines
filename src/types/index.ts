// GameOps AI Data Pipelines - Domain Type Definitions

export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type Environment = 'Development' | 'Staging' | 'Production';

export type UserRole =
  | 'Data Engineer'
  | 'Analytics Engineer'
  | 'ML Engineer'
  | 'Game Analyst'
  | 'Data Scientist'
  | 'SRE'
  | 'Administrator'
  | 'Viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  teamId: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  memberIds: string[];
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  teamId: string;
  environment: Environment;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  dataSourceIds: string[];
  pipelineIds: string[];
  datasetIds: string[];
  metricCount: number;
  alertCount: number;
}

export type SourceType =
  | 'CSV'
  | 'JSON'
  | 'NDJSON'
  | 'Local Database'
  | 'Synthetic Generator'
  | 'Game Events'
  | 'Telemetry Stream'
  | 'Log Files'
  | 'Parquet Simulation'
  | 'API Simulation';

export type SourceStatus = 'active' | 'syncing' | 'paused' | 'error';

export interface DataSource {
  id: string;
  projectId: string;
  name: string;
  type: SourceType;
  status: SourceStatus;
  recordCount: number;
  lastIngestionAt: string;
  frequency: string;
  ownerId: string;
  schemaId?: string;
  config: {
    delimiter?: string;
    hasHeader?: boolean;
    streamRate?: number;
    filePath?: string;
    apiEndpoint?: string;
    sampleData?: Record<string, any>[];
  };
  createdAt: string;
  updatedAt: string;
}

export type DataType =
  | 'String'
  | 'Integer'
  | 'Float'
  | 'Boolean'
  | 'Date'
  | 'Datetime'
  | 'Array'
  | 'Object';

export interface SchemaField {
  name: string;
  type: DataType;
  required: boolean;
  nullable: boolean;
  description?: string;
  defaultValue?: any;
  constraints?: {
    min?: number;
    max?: number;
    pattern?: string;
    allowedValues?: string[];
  };
}

export interface Schema {
  id: string;
  projectId: string;
  name: string;
  version: number;
  fields: SchemaField[];
  createdAt: string;
  updatedAt: string;
  compatibility: 'Compatible' | 'Warning' | 'Breaking';
  changeHistory: {
    version: number;
    changedAt: string;
    changedBy: string;
    changes: string[];
  }[];
}

export type DatasetStatus = 'Healthy' | 'Stale' | 'Warning' | 'Invalid' | 'Archived';

export interface Dataset {
  id: string;
  projectId: string;
  name: string;
  description: string;
  ownerId: string;
  recordCount: number;
  sizeBytes: number;
  columnCount: number;
  schemaId: string;
  qualityScore: number;
  freshnessScore: number;
  status: DatasetStatus;
  domain: 'Telemetry' | 'Players' | 'Economy' | 'Gameplay' | 'AI' | 'ML' | 'LiveOps' | 'Infrastructure';
  tags: string[];
  records: Record<string, any>[];
  createdAt: string;
  updatedAt: string;
  lastRefreshedAt: string;
}
