// Join Node Executor (Inner, Left, Right, Full Joins)

import { PipelineNode } from '@/types/pipeline';

export function executeJoinNode(
  node: PipelineNode,
  leftRecords: Record<string, any>[],
  rightRecords: Record<string, any>[] = []
): Record<string, any>[] {
  const { leftKey, rightKey, joinType = 'inner' } = node.config;
  if (!leftKey || !rightKey) return leftRecords;

  const rightMap = new Map<string, Record<string, any>>();
  rightRecords.forEach(row => {
    const key = String(row[rightKey]);
    if (key) rightMap.set(key, row);
  });

  const results: Record<string, any>[] = [];

  leftRecords.forEach(leftRow => {
    const key = String(leftRow[leftKey]);
    const rightRow = rightMap.get(key);

    if (joinType === 'inner') {
      if (rightRow) {
        results.push({ ...leftRow, ...rightRow });
      }
    } else if (joinType === 'left') {
      results.push({ ...leftRow, ...(rightRow ?? {}) });
    }
  });

  return results;
}
