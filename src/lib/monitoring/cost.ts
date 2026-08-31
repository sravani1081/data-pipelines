// Synthetic Cloud Cost Calculator Engine (Clearly labeled "Synthetic Cost Estimate")

import { SyntheticCostEstimate } from '@/types/observability';

export function calculateSyntheticCost(recordsProcessed: number, storageBytes: number): SyntheticCostEstimate {
  // Compute cost estimate: $0.000002 per record compute, $0.023 per GB storage
  const computeCostUsd = parseFloat(((recordsProcessed * 0.000002) + 12.5).toFixed(2));
  const storageCostUsd = parseFloat(((storageBytes / (1024 * 1024 * 1024)) * 0.023 + 4.2).toFixed(2));
  const networkCostUsd = parseFloat((computeCostUsd * 0.15).toFixed(2));
  const totalCostUsd = parseFloat((computeCostUsd + storageCostUsd + networkCostUsd).toFixed(2));

  return {
    projectId: 'proj_telemetry',
    period: 'Monthly',
    computeCostUsd,
    storageCostUsd,
    networkCostUsd,
    totalCostUsd,
    breakdownByPipeline: [
      { pipelineName: 'Raw Telemetry Ingestion & Cleaning', costUsd: parseFloat((totalCostUsd * 0.55).toFixed(2)) },
      { pipelineName: 'Player Sessionization Pipeline', costUsd: parseFloat((totalCostUsd * 0.30).toFixed(2)) },
      { pipelineName: 'ML Feature Store Pipeline', costUsd: parseFloat((totalCostUsd * 0.15).toFixed(2)) },
    ],
    calculatedAt: new Date().toISOString(),
  };
}
