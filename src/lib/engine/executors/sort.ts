// Sort Node Executor

import { PipelineNode } from '@/types/pipeline';

export function executeSortNode(node: PipelineNode, records: Record<string, any>[]): Record<string, any>[] {
  const { sortFields = [] } = node.config;
  if (sortFields.length === 0) return records;

  return [...records].sort((a, b) => {
    for (const sf of sortFields) {
      const valA = a[sf.field];
      const valB = b[sf.field];
      if (valA === valB) continue;

      const dir = sf.direction === 'desc' ? -1 : 1;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return (valA - valB) * dir;
      }
      return String(valA).localeCompare(String(valB)) * dir;
    }
    return 0;
  });
}
