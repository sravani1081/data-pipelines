// Topological DAG Planner & Execution Graph Generator

import { PipelineNode, PipelineEdge } from '@/types/pipeline';

export interface ExecutionPlan {
  isValid: boolean;
  errors: string[];
  executionOrder: PipelineNode[];
  dependencies: Record<string, string[]>; // nodeId -> parent nodeIds
}

export function buildExecutionPlan(nodes: PipelineNode[], edges: PipelineEdge[]): ExecutionPlan {
  const errors: string[] = [];

  if (nodes.length === 0) {
    return { isValid: false, errors: ['Pipeline contains no nodes'], executionOrder: [], dependencies: {} };
  }

  // Identify source and output nodes
  const sourceNodes = nodes.filter(n => n.type === 'Source' || edges.every(e => e.targetNodeId !== n.id));
  const outputNodes = nodes.filter(n => n.type === 'Output' || edges.every(e => e.sourceNodeId !== n.id));

  if (sourceNodes.length === 0) {
    errors.push('No root Source node found in pipeline');
  }
  if (outputNodes.length === 0) {
    errors.push('No terminal Output node found in pipeline');
  }

  // Build adjacency list & in-degree map
  const inDegree: Record<string, number> = {};
  const adjList: Record<string, string[]> = {};
  const dependencies: Record<string, string[]> = {};

  nodes.forEach(node => {
    inDegree[node.id] = 0;
    adjList[node.id] = [];
    dependencies[node.id] = [];
  });

  edges.forEach(edge => {
    if (adjList[edge.sourceNodeId] && inDegree[edge.targetNodeId] !== undefined) {
      adjList[edge.sourceNodeId].push(edge.targetNodeId);
      inDegree[edge.targetNodeId]++;
      dependencies[edge.targetNodeId].push(edge.sourceNodeId);
    }
  });

  // Kahn's Algorithm for Topological Sort & Cycle Detection
  const queue: string[] = [];
  Object.keys(inDegree).forEach(nodeId => {
    if (inDegree[nodeId] === 0) {
      queue.push(nodeId);
    }
  });

  const executionOrderIds: string[] = [];

  while (queue.length > 0) {
    const currId = queue.shift()!;
    executionOrderIds.push(currId);

    const neighbors = adjList[currId] || [];
    neighbors.forEach(neighborId => {
      inDegree[neighborId]--;
      if (inDegree[neighborId] === 0) {
        queue.push(neighborId);
      }
    });
  }

  if (executionOrderIds.length !== nodes.length) {
    errors.push('Cyclic dependency detected in pipeline graph');
  }

  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const executionOrder = executionOrderIds.map(id => nodeMap.get(id)!).filter(Boolean);

  return {
    isValid: errors.length === 0,
    errors,
    executionOrder,
    dependencies,
  };
}
