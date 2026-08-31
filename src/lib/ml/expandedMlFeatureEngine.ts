// Expanded ML Feature Engineering Engine

import { buildMLFeatureStore } from './featureStoreEngine';

export function runMLFeatureExtraction(records: Record<string, any>[]) {
  return buildMLFeatureStore(records);
}
