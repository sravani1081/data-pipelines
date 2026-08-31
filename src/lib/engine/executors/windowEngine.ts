// Window Functions & Time-Window Operations Engine

import { PipelineNode } from '@/types/pipeline';

export type WindowFunctionType =
  | 'row_number'
  | 'rank'
  | 'dense_rank'
  | 'lead'
  | 'lag'
  | 'window_sum'
  | 'window_avg'
  | 'window_min'
  | 'window_max';

export interface WindowSpec {
  partitionBy: string[];
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
  func: WindowFunctionType;
  targetField: string;
  valueField?: string;
  offset?: number;
}

export function executeWindowEngine(
  node: PipelineNode,
  records: Record<string, any>[],
  specs?: WindowSpec[]
): Record<string, any>[] {
  if (records.length === 0) return [];

  const activeSpecs: WindowSpec[] = specs || [
    {
      partitionBy: ['player_id'],
      orderByField: 'timestamp',
      orderDirection: 'asc',
      func: 'row_number',
      targetField: 'row_num',
    },
  ];

  let currentRecords = [...records];

  activeSpecs.forEach(spec => {
    const partitions = new Map<string, Record<string, any>[]>();

    currentRecords.forEach(r => {
      const key = spec.partitionBy.map(p => String(r[p] ?? '')).join(':::');
      if (!partitions.has(key)) partitions.set(key, []);
      partitions.get(key)!.push(r);
    });

    const updatedRecords: Record<string, any>[] = [];

    partitions.forEach((partRows, pKey) => {
      // Sort partition if orderByField is specified
      if (spec.orderByField) {
        partRows.sort((a, b) => {
          const valA = a[spec.orderByField!];
          const valB = b[spec.orderByField!];
          const dir = spec.orderDirection === 'desc' ? -1 : 1;
          if (valA === valB) return 0;
          if (valA === null || valA === undefined) return 1;
          if (valB === null || valB === undefined) return -1;
          return String(valA).localeCompare(String(valB)) * dir;
        });
      }

      // Compute Window Function
      partRows.forEach((r, idx) => {
        const copy = { ...r };

        switch (spec.func) {
          case 'row_number':
            copy[spec.targetField] = idx + 1;
            break;

          case 'rank': {
            if (idx === 0) {
              copy[spec.targetField] = 1;
            } else {
              const prev = partRows[idx - 1];
              const currVal = spec.orderByField ? r[spec.orderByField] : null;
              const prevVal = spec.orderByField ? prev[spec.orderByField] : null;
              copy[spec.targetField] = currVal === prevVal ? partRows[idx - 1][spec.targetField] : idx + 1;
            }
            break;
          }

          case 'dense_rank': {
            if (idx === 0) {
              copy[spec.targetField] = 1;
            } else {
              const prev = partRows[idx - 1];
              const currVal = spec.orderByField ? r[spec.orderByField] : null;
              const prevVal = spec.orderByField ? prev[spec.orderByField] : null;
              copy[spec.targetField] = currVal === prevVal ? partRows[idx - 1][spec.targetField] : partRows[idx - 1][spec.targetField] + 1;
            }
            break;
          }

          case 'lag': {
            const offset = spec.offset || 1;
            const targetIdx = idx - offset;
            copy[spec.targetField] = targetIdx >= 0 && spec.valueField ? partRows[targetIdx][spec.valueField] : null;
            break;
          }

          case 'lead': {
            const offset = spec.offset || 1;
            const targetIdx = idx + offset;
            copy[spec.targetField] = targetIdx < partRows.length && spec.valueField ? partRows[targetIdx][spec.valueField] : null;
            break;
          }

          case 'window_sum': {
            const nums = partRows.map(pr => Number(pr[spec.valueField || ''])).filter(v => !isNaN(v));
            copy[spec.targetField] = nums.reduce((acc, v) => acc + v, 0);
            break;
          }

          case 'window_avg': {
            const nums = partRows.map(pr => Number(pr[spec.valueField || ''])).filter(v => !isNaN(v));
            const avg = nums.length > 0 ? nums.reduce((acc, v) => acc + v, 0) / nums.length : 0;
            copy[spec.targetField] = parseFloat(avg.toFixed(4));
            break;
          }

          default:
            copy[spec.targetField] = idx + 1;
            break;
        }

        updatedRecords.push(copy);
      });
    });

    currentRecords = updatedRecords;
  });

  return currentRecords;
}
