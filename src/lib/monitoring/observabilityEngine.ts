// Real-Time Observability, Alert Evaluator & Metrics Aggregator Engine

import { SystemAlert, PipelineLogEntry, AlertRule } from '@/types/observability';
import { PipelineRun } from '@/types/pipeline';
import { Dataset } from '@/types';
import { generateId } from '@/lib/utils/helpers';

export interface SystemMetricsOverview {
  activePipelinesCount: number;
  totalRunsProcessed: number;
  successRatePercent: number;
  totalEventsProcessed: number;
  avgQualityScore: number;
  avgFreshnessScore: number;
  activeIncidentsCount: number;
  p95LatencyMs: number;
}

export function computeSystemMetrics(
  pipelineRuns: PipelineRun[],
  datasets: Dataset[],
  alerts: SystemAlert[]
): SystemMetricsOverview {
  const totalRuns = pipelineRuns.length;
  const passedRuns = pipelineRuns.filter(r => r.status === 'Succeeded').length;
  const successRatePercent = totalRuns > 0 ? parseFloat(((passedRuns / totalRuns) * 100).toFixed(1)) : 100.0;

  const totalEventsProcessed = datasets.reduce((acc, d) => acc + d.recordCount, 0);
  const avgQualityScore = datasets.length > 0 ? parseFloat((datasets.reduce((acc, d) => acc + d.qualityScore, 0) / datasets.length).toFixed(1)) : 98.5;
  const avgFreshnessScore = datasets.length > 0 ? parseFloat((datasets.reduce((acc, d) => acc + d.freshnessScore, 0) / datasets.length).toFixed(1)) : 97.2;

  const activeIncidentsCount = alerts.filter(a => a.status === 'active').length;

  const latencies = pipelineRuns.map(r => r.durationMs).sort((a, b) => a - b);
  const p95LatencyMs = latencies.length > 0 ? latencies[Math.floor(latencies.length * 0.95)] || latencies[latencies.length - 1] : 420;

  return {
    activePipelinesCount: 5,
    totalRunsProcessed: totalRuns,
    successRatePercent,
    totalEventsProcessed,
    avgQualityScore,
    avgFreshnessScore,
    activeIncidentsCount,
    p95LatencyMs,
  };
}

export function evaluateAlertRules(
  rules: AlertRule[],
  pipelineRuns: PipelineRun[],
  datasets: Dataset[]
): SystemAlert[] {
  const alerts: SystemAlert[] = [];

  rules.forEach(rule => {
    if (!rule.enabled) return;

    if (rule.condition === 'failure') {
      const failedRun = pipelineRuns.find(r => r.status === 'Failed' && r.pipelineId === rule.targetId);
      if (failedRun) {
        alerts.push({
          id: generateId('alt_rule'),
          ruleId: rule.id,
          ruleName: rule.name,
          projectId: rule.projectId,
          severity: rule.severity,
          title: `Pipeline Execution Failure: ${failedRun.pipelineName}`,
          message: failedRun.errorSummary || `Pipeline run #${failedRun.id.slice(-6)} failed during task execution`,
          targetName: failedRun.pipelineName,
          triggeredAt: new Date().toISOString(),
          status: 'active',
        });
      }
    } else if (rule.condition === 'quality_below_threshold') {
      const threshold = rule.thresholdValue || 95.0;
      const targetDs = datasets.find(d => d.id === rule.targetId);
      if (targetDs && targetDs.qualityScore < threshold) {
        alerts.push({
          id: generateId('alt_rule'),
          ruleId: rule.id,
          ruleName: rule.name,
          projectId: rule.projectId,
          severity: rule.severity,
          title: `Data Quality Dropped Below SLA Threshold`,
          message: `Quality score for dataset "${targetDs.name}" dropped to ${targetDs.qualityScore}% (Threshold: ${threshold}%)`,
          targetName: targetDs.name,
          triggeredAt: new Date().toISOString(),
          status: 'active',
        });
      }
    }
  });

  return alerts;
}
