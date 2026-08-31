// Production Observability, Log Analytics & Alert Engine Suite

import { PipelineRun } from '@/types/pipeline';
import { Dataset } from '@/types';
import { computeSystemMetrics } from './observabilityEngine';

export function getPlatformObservabilityStatus(runs: PipelineRun[], datasets: Dataset[]) {
  const metrics = computeSystemMetrics(runs, datasets, []);
  return {
    metrics,
    systemStatus: metrics.successRatePercent >= 95 ? 'HEALTHY' : 'DEGRADED',
    generatedAt: new Date().toISOString(),
  };
}
