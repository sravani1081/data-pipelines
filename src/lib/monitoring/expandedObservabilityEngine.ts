// Expanded Observability & Monitoring Engine

import { PipelineRun } from '@/types/pipeline';
import { Dataset } from '@/types';
import { computeSystemMetrics } from './observabilityEngine';

export function runObservabilityHealthCheck(runs: PipelineRun[], datasets: Dataset[]) {
  return computeSystemMetrics(runs, datasets, []);
}
