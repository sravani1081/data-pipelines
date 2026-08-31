// Comprehensive Production ML Feature Store & Dataset Builder

import { buildMLFeatureStore } from './featureStoreEngine';

export function generateMLFeaturePipeline(records: Record<string, any>[]) {
  const { featureStore, config } = buildMLFeatureStore(records);
  return {
    featureStore,
    config,
    processedAt: new Date().toISOString(),
  };
}
