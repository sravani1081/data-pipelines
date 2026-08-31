// Complete Catalog of 17 Pipeline Node Executors

import { PipelineNode } from '@/types/pipeline';
import { executeFilterNode } from './filter';
import { executeTransformNode } from './transform';
import { executeJoinNode } from './join';
import { executeAggregateNode } from './aggregate';
import { executeDeduplicateNode } from './deduplicate';
import { executeSortNode } from './sort';
import { executeWindowNode } from './window';
import { executeEnrichNode } from './enrich';
import { executeSampleNode } from './sample';
import { executeExtendedJoin } from './joinExecutorExtended';
import { executeExtendedTransform } from './transformExpressions';
import { executeExtendedAggregation } from './aggregateEngine';
import { executeWindowEngine } from './windowEngine';

export function executePipelineNodeHandler(
  node: PipelineNode,
  inputRecords: Record<string, any>[],
  rightInputRecords: Record<string, any>[] = []
): Record<string, any>[] {
  switch (node.type) {
    case 'Source':
    case 'Ingest':
      return inputRecords;

    case 'Parse':
      return inputRecords.map(r => {
        if (typeof r === 'string') {
          try {
            return JSON.parse(r);
          } catch {
            return { raw: r };
          }
        }
        return r;
      });

    case 'Filter':
      return executeFilterNode(node, inputRecords);

    case 'Validate':
    case 'Quality Check':
      return inputRecords.filter(r => r !== null && r !== undefined);

    case 'Transform':
      return executeExtendedTransform(node, inputRecords);

    case 'Join':
      return executeExtendedJoin(node, inputRecords, rightInputRecords);

    case 'Aggregate':
      return executeExtendedAggregation(node, inputRecords);

    case 'Deduplicate':
      return executeDeduplicateNode(node, inputRecords);

    case 'Sort':
      return executeSortNode(node, inputRecords);

    case 'Window':
      return executeWindowEngine(node, inputRecords);

    case 'Enrich':
      return executeEnrichNode(node, inputRecords);

    case 'Sample':
      return executeSampleNode(node, inputRecords);

    case 'Split': {
      const ratio = node.config.trainRatio || 0.8;
      const limit = Math.floor(inputRecords.length * ratio);
      return inputRecords.slice(0, limit);
    }

    case 'Feature Engineer':
      return inputRecords.map((r, idx) => ({
        ...r,
        feature_scaled_level: ((r.level || 1) / 100).toFixed(2),
        feature_rolling_avg: (r.kills || 0) * 1.5,
      }));

    case 'Output':
      return inputRecords;

    default:
      return inputRecords;
  }
}
