// Safe Local SQL Engine Unit Tests

import test from 'node:test';
import assert from 'node:assert';
import { executeSQLQuery } from '../src/lib/sql/executor';

test('SQL Engine - SELECT WHERE and LIMIT', () => {
  const datasets = [
    {
      name: 'players',
      records: [
        { id: 1, name: 'Alice', level: 25 },
        { id: 2, name: 'Bob', level: 10 },
        { id: 3, name: 'Charlie', level: 40 },
      ],
    },
  ];

  const result = executeSQLQuery('SELECT name FROM players WHERE level > 20 LIMIT 1', datasets);
  assert.strictEqual(result.rowCount, 1);
  assert.strictEqual(result.rows[0].name, 'Alice');
});

test('SQL Engine - GROUP BY Aggregation', () => {
  const datasets = [
    {
      name: 'matches',
      records: [
        { mode: 'BR', kills: 5 },
        { mode: 'BR', kills: 10 },
        { mode: 'Raid', kills: 2 },
      ],
    },
  ];

  const result = executeSQLQuery('SELECT mode, COUNT(*) FROM matches GROUP BY mode', datasets);
  assert.strictEqual(result.rowCount, 2);
  const brGroup = result.rows.find(r => r.mode === 'BR');
  assert.ok(brGroup);
  assert.strictEqual(brGroup['COUNT(*)'], 2);
});
