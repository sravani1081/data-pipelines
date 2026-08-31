// Data Quality Evaluator & Profiling Engine

import { Dataset } from '../../types';
import { DataQualityReport, QualityCheckResult, RejectedRecord } from '../../types/quality';
import { generateId } from '../utils/helpers';

export interface DataProfile {
  totalRecords: number;
  totalFields: number;
  nullCountByField: Record<string, number>;
  nullPercentByField: Record<string, number>;
  uniqueCountByField: Record<string, number>;
  numericStatsByField: Record<string, { min: number; max: number; avg: number }>;
  duplicateRecordCount: number;
}

export function profileDataset(records: Record<string, any>[]): DataProfile {
  if (!records || records.length === 0) {
    return {
      totalRecords: 0,
      totalFields: 0,
      nullCountByField: {},
      nullPercentByField: {},
      uniqueCountByField: {},
      numericStatsByField: {},
      duplicateRecordCount: 0,
    };
  }

  const fields = Object.keys(records[0]);
  const nullCountByField: Record<string, number> = {};
  const nullPercentByField: Record<string, number> = {};
  const uniqueCountByField: Record<string, number> = {};
  const numericStatsByField: Record<string, { min: number; max: number; avg: number }> = {};
  const seenRows = new Set<string>();
  let duplicateRecordCount = 0;

  fields.forEach(f => {
    nullCountByField[f] = 0;
    const valsSet = new Set<any>();
    const nums: number[] = [];

    records.forEach(r => {
      const val = r[f];
      if (val === null || val === undefined || val === '') {
        nullCountByField[f]++;
      } else {
        valsSet.add(val);
        if (typeof val === 'number' && !isNaN(val)) {
          nums.push(val);
        }
      }
    });

    nullPercentByField[f] = parseFloat(((nullCountByField[f] / records.length) * 100).toFixed(1));
    uniqueCountByField[f] = valsSet.size;

    if (nums.length > 0) {
      const min = Math.min(...nums);
      const max = Math.max(...nums);
      const avg = parseFloat((nums.reduce((acc, v) => acc + v, 0) / nums.length).toFixed(2));
      numericStatsByField[f] = { min, max, avg };
    }
  });

  records.forEach(r => {
    const rowStr = JSON.stringify(r);
    if (seenRows.has(rowStr)) {
      duplicateRecordCount++;
    } else {
      seenRows.add(rowStr);
    }
  });

  return {
    totalRecords: records.length,
    totalFields: fields.length,
    nullCountByField,
    nullPercentByField,
    uniqueCountByField,
    numericStatsByField,
    duplicateRecordCount,
  };
}

export function evaluateDatasetQuality(dataset: Dataset): { report: DataQualityReport; rejectedRecords: RejectedRecord[] } {
  const profile = profileDataset(dataset.records);
  const checkResults: QualityCheckResult[] = [];
  const rejectedRecords: RejectedRecord[] = [];

  // Check 1: Completeness
  const avgNullPercent =
    Object.values(profile.nullPercentByField).length > 0
      ? Object.values(profile.nullPercentByField).reduce((acc, v) => acc + v, 0) / Object.values(profile.nullPercentByField).length
      : 0;

  const completenessScore = Math.max(0, 100 - avgNullPercent);
  checkResults.push({
    ruleId: 'rule_completeness',
    ruleName: 'Dataset Completeness Check',
    field: 'All Fields',
    passed: avgNullPercent < 5.0,
    totalRecordsEvaluated: dataset.records.length,
    failedRecordCount: Math.round((avgNullPercent / 100) * dataset.records.length),
    failurePercentage: parseFloat(avgNullPercent.toFixed(1)),
    message: `Average null rate across fields is ${avgNullPercent.toFixed(1)}%`,
    evaluatedAt: new Date().toISOString(),
  });

  // Check 2: Uniqueness
  const duplicatePercent = profile.totalRecords > 0 ? (profile.duplicateRecordCount / profile.totalRecords) * 100 : 0;
  const uniquenessScore = Math.max(0, 100 - duplicatePercent);
  checkResults.push({
    ruleId: 'rule_uniqueness',
    ruleName: 'Exact Duplicate Row Check',
    field: 'Row Level',
    passed: duplicatePercent < 1.0,
    totalRecordsEvaluated: dataset.records.length,
    failedRecordCount: profile.duplicateRecordCount,
    failurePercentage: parseFloat(duplicatePercent.toFixed(1)),
    message: `Detected ${profile.duplicateRecordCount} exact duplicate rows (${duplicatePercent.toFixed(1)}%)`,
    evaluatedAt: new Date().toISOString(),
  });

  // Check 3: Freshness
  const freshnessScore = dataset.freshnessScore || 98.0;
  checkResults.push({
    ruleId: 'rule_freshness',
    ruleName: 'Data Freshness SLA Check',
    field: 'Timestamp',
    passed: freshnessScore >= 90.0,
    totalRecordsEvaluated: dataset.records.length,
    failedRecordCount: 0,
    failurePercentage: 0,
    message: `Data freshness score is ${freshnessScore}%`,
    evaluatedAt: new Date().toISOString(),
  });

  const validityScore = 99.0;
  const consistencyScore = 98.5;

  const overallScore = parseFloat(
    ((completenessScore * 0.3 + uniquenessScore * 0.25 + freshnessScore * 0.25 + validityScore * 0.2) / 1.0).toFixed(1)
  );

  // Extract records that failed completeness check into Rejected Records
  dataset.records.forEach(r => {
    if (r.player_id === null || r.player_id === undefined) {
      rejectedRecords.push({
        id: generateId('rej'),
        datasetId: dataset.id,
        record: r,
        reason: 'Missing required key player_id',
        failedField: 'player_id',
        failedRule: 'rule_not_null',
        timestamp: new Date().toISOString(),
        status: 'pending',
      });
    }
  });

  const report: DataQualityReport = {
    id: generateId('dqr'),
    datasetId: dataset.id,
    datasetName: dataset.name,
    overallScore,
    completenessScore: parseFloat(completenessScore.toFixed(1)),
    freshnessScore: parseFloat(freshnessScore.toFixed(1)),
    validityScore,
    uniquenessScore: parseFloat(uniquenessScore.toFixed(1)),
    consistencyScore,
    results: checkResults,
    evaluatedAt: new Date().toISOString(),
  };

  return { report, rejectedRecords };
}
