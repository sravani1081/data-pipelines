// Transform Node Executor

import { PipelineNode } from '@/types/pipeline';

export function executeTransformNode(node: PipelineNode, records: Record<string, any>[]): Record<string, any>[] {
  const { field, targetField, expressionType, expression } = node.config;
  const targetKey = targetField || field || 'transformed_field';

  return records.map(row => {
    const copy = { ...row };
    const rawVal = field ? row[field] : undefined;

    switch (expressionType) {
      case 'uppercase':
        copy[targetKey] = String(rawVal ?? '').toUpperCase();
        break;
      case 'lowercase':
        copy[targetKey] = String(rawVal ?? '').toLowerCase();
        break;
      case 'math':
        if (!isNaN(Number(rawVal)) && expression) {
          try {
            copy[targetKey] = eval(`${Number(rawVal)} ${expression}`);
          } catch {
            copy[targetKey] = rawVal;
          }
        }
        break;
      case 'concat':
        copy[targetKey] = `${rawVal ?? ''}_${expression ?? ''}`;
        break;
      case 'dateFormat':
        try {
          copy[targetKey] = new Date(rawVal).toISOString();
        } catch {
          copy[targetKey] = rawVal;
        }
        break;
      default:
        copy[targetKey] = rawVal;
        break;
    }

    return copy;
  });
}
