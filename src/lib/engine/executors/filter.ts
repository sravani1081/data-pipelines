// Filter Node Executor

import { PipelineNode } from '../../../types/pipeline';

export function executeFilterNode(node: PipelineNode, records: Record<string, any>[]): Record<string, any>[] {
  const { field, operator, value } = node.config;
  if (!field || !operator) return records;

  return records.filter(row => {
    const val = row[field];
    switch (operator) {
      case '==':
        return String(val) === String(value);
      case '!=':
        return String(val) !== String(value);
      case '>':
        return Number(val) > Number(value);
      case '>=':
        return Number(val) >= Number(value);
      case '<':
        return Number(val) < Number(value);
      case '<=':
        return Number(val) <= Number(value);
      case 'contains':
        return String(val ?? '').toLowerCase().includes(String(value ?? '').toLowerCase());
      case 'notNull':
        return val !== null && val !== undefined && val !== '';
      default:
        return true;
    }
  });
}
