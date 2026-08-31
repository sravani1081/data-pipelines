// Master Node Executors Index

import { PipelineNode } from '@/types/pipeline';
import { executeFilterNode } from './filter';
import { executeTransformNode } from './transform';
import { executeJoinNode } from './join';
import { executeAggregateNode } from './aggregate';
import { executeDeduplicateNode } from './deduplicate';
import { executeSortNode } from './sort';
import { executeWindowNode } from './window';
import { executeEnrichNode } from './enrich';
import { executeSampleNode, executeSplitNode } from './sample';

export type NodeExecutorFunc = (
  node: PipelineNode,
  records: Record<string, any>[],
  secondaryRecords?: Record<string, any>[]
) => Record<string, any>[];

export function executeNode(
  node: PipelineNode,
  inputRecords: Record<string, any>[],
  secondaryRecords?: Record<string, any>[]
): Record<string, any>[] {
  switch (node.type) {
    case 'Source':
    case 'Ingest':
    case 'Parse':
    case 'Output':
    case 'Quality Check':
    case 'Validate':
      return inputRecords;
    case 'Filter':
      return executeFilterNode(node, inputRecords);
    case 'Transform':
      return executeTransformNode(node, inputRecords);
    case 'Join':
      return executeJoinNode(node, inputRecords, secondaryRecords);
    case 'Aggregate':
      return executeAggregateNode(node, inputRecords);
    case 'Deduplicate':
      return executeDeduplicateNode(node, inputRecords);
    case 'Sort':
      return executeSortNode(node, inputRecords);
    case 'Window':
      return executeWindowNode(node, inputRecords);
    case 'Enrich':
      return executeEnrichNode(node, inputRecords);
    case 'Sample':
      return executeSampleNode(node, inputRecords);
    case 'Split':
    case 'Feature Engineer':
      return executeSplitNode(node, inputRecords);
    default:
      return inputRecords;
  }
}
