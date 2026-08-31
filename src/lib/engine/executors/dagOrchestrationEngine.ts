// DAG Pipeline Orchestration Engine

import { PipelineNode, PipelineEdge } from '@/types/pipeline';
import { buildExecutionPlan } from '../planner';
import { executePipelineNodeHandler } from './extendedExecutorsCatalog';

export interface DAGOrchestrationResult {
  isValid: boolean;
  executedNodeCount: number;
  totalRecordsProcessed: number;
  stepLogs: string[];
  executionTimeMs: number;
}

export function orchestrateDAGPipeline(
  nodes: PipelineNode[],
  edges: PipelineEdge[],
  initialDataset: Record<string, any>[]
): DAGOrchestrationResult {
  const startTime = performance.now();
  const plan = buildExecutionPlan(nodes, edges);

  if (!plan.isValid) {
    return {
      isValid: false,
      executedNodeCount: 0,
      totalRecordsProcessed: 0,
      stepLogs: plan.errors,
      executionTimeMs: Math.round(performance.now() - startTime),
    };
  }

  const stepLogs: string[] = [];
  let currentRecords = [...initialDataset];

  plan.executionOrder.forEach((node, idx) => {
    stepLogs.push(`[Step ${idx + 1}/${plan.executionOrder.length}] Executing node "${node.label}" (${node.type})`);
    currentRecords = executePipelineNodeHandler(node, currentRecords);
    stepLogs.push(`[Step ${idx + 1}] Completed node "${node.label}". Output records: ${currentRecords.length}`);
  });

  return {
    isValid: true,
    executedNodeCount: plan.executionOrder.length,
    totalRecordsProcessed: currentRecords.length,
    stepLogs,
    executionTimeMs: Math.round(performance.now() - startTime),
  };
}
