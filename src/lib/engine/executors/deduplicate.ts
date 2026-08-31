// Deduplicate Node Executor

import { PipelineNode } from '@/types/pipeline';

export function executeDeduplicateNode(node: PipelineNode, records: Record<string, any>[]): Record<string, any>[] {
  const { dedupKeys = [], keep = 'first' } = node.config;
  if (dedupKeys.length === 0) return records;

  const seen = new Set<string>();
  const results: Record<string, any>[] = [];

  const processRecords = keep === 'last' ? [...records].reverse() : records;

  processRecords.forEach(row => {
    const key = dedupKeys.map(k => String(row[k] ?? '')).join('::');
    if (!seen.has(key)) {
      seen.add(key);
      results.push(row);
    }
  });

  return keep === 'last' ? results.reverse() : results;
}
