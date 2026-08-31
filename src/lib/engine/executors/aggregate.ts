// Aggregate Node Executor (Count, Sum, Avg, Min, Max, P95)

import { PipelineNode } from '../../../types/pipeline';

export function executeAggregateNode(node: PipelineNode, records: Record<string, any>[]): Record<string, any>[] {
  const { groupBy = [], metrics = [] } = node.config;
  if (records.length === 0) return [];

  const groups = new Map<string, Record<string, any>[]>();

  records.forEach(row => {
    const key = groupBy.map(g => String(row[g] ?? '')).join('::');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(row);
  });

  const results: Record<string, any>[] = [];

  groups.forEach((groupRecords, groupKey) => {
    const outRow: Record<string, any> = {};

    // Restore group keys
    if (groupBy.length > 0 && groupRecords.length > 0) {
      groupBy.forEach(g => {
        outRow[g] = groupRecords[0][g];
      });
    }

    // Compute metrics
    metrics.forEach(m => {
      const alias = m.alias || `${m.func}_${m.field}`;
      const vals = groupRecords.map(r => Number(r[m.field])).filter(v => !isNaN(v));

      switch (m.func) {
        case 'count':
          outRow[alias] = groupRecords.length;
          break;
        case 'sum':
          outRow[alias] = vals.reduce((acc, v) => acc + v, 0);
          break;
        case 'avg':
          outRow[alias] = vals.length > 0 ? vals.reduce((acc, v) => acc + v, 0) / vals.length : 0;
          break;
        case 'min':
          outRow[alias] = vals.length > 0 ? Math.min(...vals) : 0;
          break;
        case 'max':
          outRow[alias] = vals.length > 0 ? Math.max(...vals) : 0;
          break;
        case 'p95':
          if (vals.length > 0) {
            const sorted = [...vals].sort((a, b) => a - b);
            const idx = Math.floor(sorted.length * 0.95);
            outRow[alias] = sorted[idx] ?? sorted[sorted.length - 1];
          } else {
            outRow[alias] = 0;
          }
          break;
      }
    });

    results.push(outRow);
  });

  return results;
}
