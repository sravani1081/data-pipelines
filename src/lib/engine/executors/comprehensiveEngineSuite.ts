// Production Comprehensive Pipeline Engine Suite

import { PipelineNode } from '@/types/pipeline';

export interface ExecutionMetrics {
  nodeId: string;
  nodeType: string;
  recordsInput: number;
  recordsOutput: number;
  durationMs: number;
  status: 'SUCCESS' | 'FAILED' | 'SKIPPED';
}

export function runEngineNode(node: PipelineNode, input: Record<string, any>[]): { output: Record<string, any>[]; metrics: ExecutionMetrics } {
  const start = performance.now();
  let output = [...input];

  if (node.type === 'Filter') {
    const field = node.config.field || 'player_id';
    output = input.filter(r => r[field] !== null && r[field] !== undefined);
  } else if (node.type === 'Sample') {
    const rate = (node.config as any).sampleRate || 0.5;
    const limit = Math.floor(input.length * rate);
    output = input.slice(0, limit);
  }

  const durationMs = Math.round(performance.now() - start);

  return {
    output,
    metrics: {
      nodeId: node.id,
      nodeType: node.type,
      recordsInput: input.length,
      recordsOutput: output.length,
      durationMs,
      status: 'SUCCESS',
    },
  };
}
