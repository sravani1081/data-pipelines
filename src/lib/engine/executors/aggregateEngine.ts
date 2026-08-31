// Comprehensive Aggregation Engine (Statistical Functions & Percentiles)

import { PipelineNode } from '@/types/pipeline';

export type AggregationFunction =
  | 'count'
  | 'count_distinct'
  | 'sum'
  | 'avg'
  | 'min'
  | 'max'
  | 'stddev_pop'
  | 'stddev_samp'
  | 'var_pop'
  | 'var_samp'
  | 'percentile_50'
  | 'percentile_90'
  | 'percentile_95'
  | 'percentile_99'
  | 'first_value'
  | 'last_value';

export interface AggregateMetricConfig {
  field: string;
  func: AggregationFunction;
  alias: string;
}

export function executeExtendedAggregation(
  node: PipelineNode,
  records: Record<string, any>[],
  customGroupBy?: string[],
  customMetrics?: AggregateMetricConfig[]
): Record<string, any>[] {
  const groupBy = customGroupBy || node.config.groupBy || [];
  const metrics: AggregateMetricConfig[] = customMetrics || (node.config.metrics as AggregateMetricConfig[]) || [
    { field: 'event_id', func: 'count', alias: 'total_events' },
  ];

  if (records.length === 0) return [];

  const groupMap = new Map<string, Record<string, any>[]>();

  records.forEach(row => {
    const key = groupBy.map(g => String(row[g] ?? '')).join(':::');
    if (!groupMap.has(key)) groupMap.set(key, []);
    groupMap.get(key)!.push(row);
  });

  const results: Record<string, any>[] = [];

  groupMap.forEach((groupRecords, groupKey) => {
    const outRow: Record<string, any> = {};

    // Restore Group Keys
    if (groupBy.length > 0 && groupRecords.length > 0) {
      groupBy.forEach(g => {
        outRow[g] = groupRecords[0][g];
      });
    }

    metrics.forEach(m => {
      const alias = m.alias || `${m.func}_${m.field}`;
      const rawVals = groupRecords.map(r => r[m.field]);
      const nums = rawVals.map(v => Number(v)).filter(v => !isNaN(v));

      switch (m.func) {
        case 'count':
          outRow[alias] = groupRecords.length;
          break;

        case 'count_distinct':
          outRow[alias] = new Set(rawVals.map(v => String(v ?? ''))).size;
          break;

        case 'sum':
          outRow[alias] = nums.reduce((acc, v) => acc + v, 0);
          break;

        case 'avg':
          outRow[alias] = nums.length > 0 ? parseFloat((nums.reduce((acc, v) => acc + v, 0) / nums.length).toFixed(4)) : 0;
          break;

        case 'min':
          outRow[alias] = nums.length > 0 ? Math.min(...nums) : 0;
          break;

        case 'max':
          outRow[alias] = nums.length > 0 ? Math.max(...nums) : 0;
          break;

        case 'var_pop': {
          if (nums.length === 0) {
            outRow[alias] = 0;
            break;
          }
          const mean = nums.reduce((acc, v) => acc + v, 0) / nums.length;
          const variance = nums.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / nums.length;
          outRow[alias] = parseFloat(variance.toFixed(4));
          break;
        }

        case 'var_samp': {
          if (nums.length <= 1) {
            outRow[alias] = 0;
            break;
          }
          const mean = nums.reduce((acc, v) => acc + v, 0) / nums.length;
          const variance = nums.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (nums.length - 1);
          outRow[alias] = parseFloat(variance.toFixed(4));
          break;
        }

        case 'stddev_pop': {
          if (nums.length === 0) {
            outRow[alias] = 0;
            break;
          }
          const mean = nums.reduce((acc, v) => acc + v, 0) / nums.length;
          const variance = nums.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / nums.length;
          outRow[alias] = parseFloat(Math.sqrt(variance).toFixed(4));
          break;
        }

        case 'stddev_samp': {
          if (nums.length <= 1) {
            outRow[alias] = 0;
            break;
          }
          const mean = nums.reduce((acc, v) => acc + v, 0) / nums.length;
          const variance = nums.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (nums.length - 1);
          outRow[alias] = parseFloat(Math.sqrt(variance).toFixed(4));
          break;
        }

        case 'percentile_50':
        case 'percentile_90':
        case 'percentile_95':
        case 'percentile_99': {
          if (nums.length === 0) {
            outRow[alias] = 0;
            break;
          }
          const sorted = [...nums].sort((a, b) => a - b);
          const p = m.func === 'percentile_50' ? 0.5 : m.func === 'percentile_90' ? 0.9 : m.func === 'percentile_95' ? 0.95 : 0.99;
          const idx = Math.floor(sorted.length * p);
          outRow[alias] = sorted[idx] ?? sorted[sorted.length - 1];
          break;
        }

        case 'first_value':
          outRow[alias] = groupRecords.length > 0 ? groupRecords[0][m.field] : null;
          break;

        case 'last_value':
          outRow[alias] = groupRecords.length > 0 ? groupRecords[groupRecords.length - 1][m.field] : null;
          break;

        default:
          outRow[alias] = groupRecords.length;
          break;
      }
    });

    results.push(outRow);
  });

  return results;
}
