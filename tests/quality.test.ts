// Data Quality Unit Tests

import test from 'node:test';
import assert from 'node:assert';
import { profileDataset } from '../src/lib/quality/evaluator';

test('Data Quality Engine - Dataset Profiling', () => {
  const records = [
    { player_id: 'ply_1', score: 100, region: 'NA' },
    { player_id: 'ply_2', score: 200, region: null },
    { player_id: 'ply_1', score: 100, region: 'NA' }, // duplicate
  ];

  const profile = profileDataset(records);
  assert.strictEqual(profile.totalRecords, 3);
  assert.strictEqual(profile.totalFields, 3);
  assert.strictEqual(profile.duplicateRecordCount, 1);
  assert.strictEqual(profile.numericStatsByField.score.avg, 133.33);
});
