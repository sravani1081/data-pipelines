// Data Quality, Validation & Data Contracts Types

export type ValidationRuleType =
  | 'not_null'
  | 'unique'
  | 'range'
  | 'regex'
  | 'type_check'
  | 'allowed_values'
  | 'completeness'
  | 'freshness';

export interface ValidationRule {
  id: string;
  name: string;
  datasetId: string;
  field: string;
  type: ValidationRuleType;
  params: {
    min?: number;
    max?: number;
    pattern?: string;
    allowedValues?: string[];
    maxStaleMinutes?: number;
    minCompletenessPercent?: number;
  };
  severity: 'warning' | 'error' | 'critical';
  enabled: boolean;
}

export interface QualityCheckResult {
  ruleId: string;
  ruleName: string;
  field: string;
  passed: boolean;
  totalRecordsEvaluated: number;
  failedRecordCount: number;
  failurePercentage: number;
  message: string;
  evaluatedAt: string;
}

export interface DataQualityReport {
  id: string;
  datasetId: string;
  datasetName: string;
  overallScore: number; // 0 - 100
  completenessScore: number;
  freshnessScore: number;
  validityScore: number;
  uniquenessScore: number;
  consistencyScore: number;
  results: QualityCheckResult[];
  evaluatedAt: string;
}

export interface RejectedRecord {
  id: string;
  datasetId: string;
  pipelineId?: string;
  runId?: string;
  record: Record<string, any>;
  reason: string;
  failedField: string;
  failedRule: string;
  timestamp: string;
  status: 'pending' | 'reprocessed' | 'discarded';
}

export interface DataContract {
  id: string;
  name: string;
  projectId: string;
  datasetId: string;
  producerTeamId: string;
  consumerTeamIds: string[];
  schemaVersion: number;
  slaMinFreshnessMinutes: number;
  slaMinQualityScore: number;
  slaMaxLatencySeconds: number;
  status: 'Active' | 'Violated' | 'Under Review';
  lastEvaluatedAt: string;
  violationsCount: number;
  violationHistory: {
    timestamp: string;
    metric: 'Freshness' | 'QualityScore' | 'SchemaDrift';
    expected: string;
    actual: string;
    resolved: boolean;
  }[];
}
