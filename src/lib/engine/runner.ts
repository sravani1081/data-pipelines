// Pipeline Execution Runner Engine

import { Pipeline, PipelineRun, TaskRun } from '@/types/pipeline';
import { Dataset } from '@/types';
import { buildExecutionPlan } from './planner';
import { executeNode } from './executors';
import { computeStepHash, getCachedOutput, setCachedOutput } from './cache';
import { generateId } from '../utils/helpers';

export interface ExecutionResult {
  run: PipelineRun;
  outputRecords: Record<string, any>[];
  outputDataset?: Dataset;
}

export async function runPipelineEngine(
  pipeline: Pipeline,
  inputDatasets: Dataset[],
  runtimeParams: Record<string, any> = {}
): Promise<ExecutionResult> {
  const startTime = performance.now();
  const runId = generateId('run');
  const startedAt = new Date().toISOString();

  // Step 1: Build & Validate DAG execution plan
  const plan = buildExecutionPlan(pipeline.nodes, pipeline.edges);

  if (!plan.isValid) {
    const durationMs = Math.round(performance.now() - startTime);
    const failedRun: PipelineRun = {
      id: runId,
      pipelineId: pipeline.id,
      pipelineName: pipeline.name,
      projectId: pipeline.projectId,
      version: pipeline.version,
      status: 'Failed',
      triggeredBy: 'Manual Run Engine',
      parameters: runtimeParams,
      durationMs,
      recordsProcessed: 0,
      qualityScore: 0,
      cacheHit: false,
      tasks: [],
      startedAt,
      completedAt: new Date().toISOString(),
      errorSummary: plan.errors.join('; '),
    };

    return { run: failedRun, outputRecords: [] };
  }

  // Map node data outputs
  const nodeDataMap = new Map<string, Record<string, any>[]>();
  const taskRuns: TaskRun[] = [];
  let totalProcessed = 0;
  let cacheHitOccurred = false;

  // Step 2: Traverse execution plan in topological order
  for (const node of plan.executionOrder) {
    const taskStartTime = performance.now();
    const taskId = generateId('task');
    const logs: string[] = [];
    logs.push(`Initializing execution for node "${node.label}" [${node.type}]`);

    let inputRecords: Record<string, any>[] = [];
    const parentNodeIds = plan.dependencies[node.id] || [];

    if (node.type === 'Source') {
      // Find dataset associated with source
      const ds = inputDatasets.find(d => d.id === node.config.datasetId) || inputDatasets[0];
      inputRecords = ds ? ds.records : [];
      logs.push(`Loaded ${inputRecords.length} records from source dataset "${ds?.name || 'Default'}"`);
    } else if (parentNodeIds.length > 0) {
      // Primary input comes from first parent
      inputRecords = nodeDataMap.get(parentNodeIds[0]) || [];
      logs.push(`Received ${inputRecords.length} records from parent node`);
    }

    // Check caching
    let outputRecords: Record<string, any>[] | null = null;
    if (pipeline.cacheEnabled) {
      const { inputHash, configHash } = computeStepHash(node, inputRecords);
      outputRecords = getCachedOutput(node.id, inputHash, configHash);
      if (outputRecords) {
        logs.push(`Cache Hit! Loaded ${outputRecords.length} records from step cache.`);
        cacheHitOccurred = true;
      } else {
        outputRecords = executeNode(
          node,
          inputRecords,
          parentNodeIds.length > 1 ? nodeDataMap.get(parentNodeIds[1]) : undefined
        );
        setCachedOutput(node.id, inputHash, configHash, outputRecords);
      }
    } else {
      outputRecords = executeNode(
        node,
        inputRecords,
        parentNodeIds.length > 1 ? nodeDataMap.get(parentNodeIds[1]) : undefined
      );
    }

    nodeDataMap.set(node.id, outputRecords);
    totalProcessed += outputRecords.length;

    const taskDurationMs = Math.round(performance.now() - taskStartTime);
    logs.push(`Node execution finished in ${taskDurationMs}ms. Produced ${outputRecords.length} records.`);

    taskRuns.push({
      id: taskId,
      runId,
      nodeId: node.id,
      nodeLabel: node.label,
      nodeType: node.type,
      status: 'Succeeded',
      recordsIn: inputRecords.length,
      recordsOut: outputRecords.length,
      durationMs: taskDurationMs,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      logs,
    });
  }

  const finalDurationMs = Math.round(performance.now() - startTime);

  // Get output from last node
  const lastNode = plan.executionOrder[plan.executionOrder.length - 1];
  const finalOutputRecords = lastNode ? nodeDataMap.get(lastNode.id) || [] : [];

  const completedRun: PipelineRun = {
    id: runId,
    pipelineId: pipeline.id,
    pipelineName: pipeline.name,
    projectId: pipeline.projectId,
    version: pipeline.version,
    status: 'Succeeded',
    triggeredBy: 'Manual Run Engine',
    parameters: runtimeParams,
    durationMs: finalDurationMs,
    recordsProcessed: finalOutputRecords.length,
    qualityScore: 99.2,
    cacheHit: cacheHitOccurred,
    tasks: taskRuns,
    startedAt,
    completedAt: new Date().toISOString(),
  };

  return {
    run: completedRun,
    outputRecords: finalOutputRecords,
  };
}
