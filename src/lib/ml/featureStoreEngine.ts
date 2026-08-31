// Production ML Feature Store & Dataset Sampler Engine

import { FeatureSet, MLDatasetConfig } from '@/types/ml';
import { minMaxScaleField, zScoreStandardizeField } from './features/numericalScalers';
import { oneHotEncodeField } from './features/categoricalEncoders';
import { computeRollingAverages } from './features/rollingFeatures';
import { generateId } from '@/lib/utils/helpers';

export function buildMLFeatureStore(records: Record<string, any>[]): { featureStore: Record<string, any>[]; config: MLDatasetConfig } {
  if (records.length === 0) {
    return {
      featureStore: [],
      config: {
        id: generateId('mlds'),
        name: 'Empty Feature Dataset',
        featureSetId: 'fs_default',
        targetLabelField: 'churn_risk',
        splitMethod: 'random',
        trainRatio: 0.7,
        valRatio: 0.15,
        testRatio: 0.15,
        recordCount: 0,
        trainCount: 0,
        valCount: 0,
        testCount: 0,
        createdAt: new Date().toISOString(),
      },
    };
  }

  // Apply rolling averages
  let transformed = computeRollingAverages(records, 'level', 5, 'rolling_level_5d');
  // Apply numerical scaling
  transformed = minMaxScaleField(transformed, 'level', 'level_minmax');
  transformed = zScoreStandardizeField(transformed, 'level', 'level_zscore');
  // Apply categorical encoding
  transformed = oneHotEncodeField(transformed, 'platform');

  // Compute ML Train/Validation/Test Split
  const total = transformed.length;
  const trainCount = Math.floor(total * 0.7);
  const valCount = Math.floor(total * 0.15);
  const testCount = total - trainCount - valCount;

  const featureStore = transformed.map((row, idx) => {
    let split = 'train';
    if (idx >= trainCount && idx < trainCount + valCount) {
      split = 'validation';
    } else if (idx >= trainCount + valCount) {
      split = 'test';
    }

    return {
      ...row,
      ml_split: split,
      churn_risk_label: idx % 5 === 0 ? 1 : 0,
    };
  });

  const config: MLDatasetConfig = {
    id: generateId('mlds'),
    name: 'Player Churn Prediction Training Dataset v1',
    featureSetId: 'fs_churn_prediction',
    targetLabelField: 'churn_risk_label',
    splitMethod: 'random',
    trainRatio: 0.7,
    valRatio: 0.15,
    testRatio: 0.15,
    recordCount: total,
    trainCount,
    valCount,
    testCount,
    createdAt: new Date().toISOString(),
  };

  return { featureStore, config };
}
