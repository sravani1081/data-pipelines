// Observability, Monitoring, Logs, Alerts, Tasks & Audit Types

export type AlertSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface AlertRule {
  id: string;
  name: string;
  projectId: string;
  targetType: 'pipeline' | 'dataset' | 'contract' | 'system';
  targetId: string;
  condition:
    | 'failure'
    | 'duration_exceeded'
    | 'freshness_exceeded'
    | 'quality_below_threshold'
    | 'records_dropped_exceeded'
    | 'schema_changed'
    | 'contract_violated';
  thresholdValue?: number;
  severity: AlertSeverity;
  enabled: boolean;
  notifyChannels: ('email' | 'slack' | 'webhook' | 'pager') [];
  createdAt: string;
}

export interface SystemAlert {
  id: string;
  ruleId: string;
  ruleName: string;
  projectId: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  targetName: string;
  triggeredAt: string;
  status: 'active' | 'acknowledged' | 'resolved';
  resolvedAt?: string;
}

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface PipelineLogEntry {
  id: string;
  timestamp: string;
  pipelineId: string;
  pipelineName: string;
  runId: string;
  nodeId?: string;
  nodeName?: string;
  level: LogLevel;
  message: string;
  recordsProcessed?: number;
  durationMs?: number;
  metadata?: Record<string, any>;
}

export interface SyntheticCostEstimate {
  projectId: string;
  period: 'Daily' | 'Monthly' | 'Yearly';
  computeCostUsd: number;
  storageCostUsd: number;
  networkCostUsd: number;
  totalCostUsd: number;
  breakdownByPipeline: { pipelineName: string; costUsd: number }[];
  calculatedAt: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assigneeId: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: TaskStatus;
  pipelineId?: string;
  datasetId?: string;
  dueDate: string;
  subtasks: { id: string; title: string; completed: boolean }[];
  createdAt: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action:
    | 'Pipeline created'
    | 'Pipeline published'
    | 'Pipeline executed'
    | 'Dataset imported'
    | 'Schema modified'
    | 'Validation rule added'
    | 'Alert changed'
    | 'Dataset exported'
    | 'Backup restored';
  resourceType: 'pipeline' | 'dataset' | 'schema' | 'alert' | 'project';
  resourceId: string;
  details: string;
  previousState?: string;
  newState?: string;
}
