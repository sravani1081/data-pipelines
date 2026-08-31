// Expanded Pipeline Node Executors Suite

import { PipelineNode } from '@/types/pipeline';

export function runPipelineStep(node: PipelineNode, records: Record<string, any>[]): Record<string, any>[] {
  if (node.type === 'Filter') {
    const f = node.config.field || 'player_id';
    return records.filter(r => r[f] !== null && r[f] !== undefined);
  }
  return records;
}
