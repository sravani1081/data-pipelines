// Pipeline Engine Unit Tests

import test from 'node:test';
import assert from 'node:assert';
import { buildExecutionPlan } from '../src/lib/engine/planner';
import { executeFilterNode } from '../src/lib/engine/executors/filter';
import { executeAggregateNode } from '../src/lib/engine/executors/aggregate';
import { PipelineNode, PipelineEdge } from '../src/types/pipeline';

test('Pipeline Engine - Topological DAG Planner', () => {
  const nodes: PipelineNode[] = [
    { id: 'n1', type: 'Source', label: 'Source', position: { x: 0, y: 0 }, config: {} },
    { id: 'n2', type: 'Filter', label: 'Filter', position: { x: 0, y: 0 }, config: {} },
    { id: 'n3', type: 'Output', label: 'Output', position: { x: 0, y: 0 }, config: {} },
  ];

  const edges: PipelineEdge[] = [
    { id: 'e1', sourceNodeId: 'n1', targetNodeId: 'n2' },
    { id: 'e2', sourceNodeId: 'n2', targetNodeId: 'n3' },
  ];

  const plan = buildExecutionPlan(nodes, edges);
  assert.strictEqual(plan.isValid, true);
  assert.strictEqual(plan.executionOrder.length, 3);
  assert.strictEqual(plan.executionOrder[0].id, 'n1');
  assert.strictEqual(plan.executionOrder[2].id, 'n3');
});

test('Pipeline Engine - Filter Node Executor', () => {
  const node: PipelineNode = {
    id: 'n_filter',
    type: 'Filter',
    label: 'Filter Score',
    position: { x: 0, y: 0 },
    config: { field: 'score', operator: '>', value: 50 },
  };

  const records = [
    { player: 'A', score: 100 },
    { player: 'B', score: 20 },
    { player: 'C', score: 75 },
  ];

  const filtered = executeFilterNode(node, records);
  assert.strictEqual(filtered.length, 2);
  assert.strictEqual(filtered[0].player, 'A');
  assert.strictEqual(filtered[1].player, 'C');
});

test('Pipeline Engine - Aggregate Node Executor', () => {
  const node: PipelineNode = {
    id: 'n_agg',
    type: 'Aggregate',
    label: 'Aggregate Kills',
    position: { x: 0, y: 0 },
    config: {
      groupBy: ['team'],
      metrics: [{ field: 'kills', func: 'sum', alias: 'total_kills' }],
    },
  };

  const records = [
    { team: 'Alpha', kills: 5 },
    { team: 'Alpha', kills: 10 },
    { team: 'Beta', kills: 8 },
  ];

  const agg = executeAggregateNode(node, records);
  assert.strictEqual(agg.length, 2);
  const alpha = agg.find(r => r.team === 'Alpha');
  assert.strictEqual(alpha?.total_kills, 15);
});
