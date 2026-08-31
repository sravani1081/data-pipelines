// Feature Store Registry & Transformation Manager

import { FeatureSet, FeatureDefinition } from '@/types/ml';

export function createPlayerFeatureSet(): FeatureSet {
  const features: FeatureDefinition[] = [
    { id: 'feat_1', name: 'player_sessions_7d', sourceDatasetId: 'ds_sessions', sourceField: 'session_id', transformation: 'rolling_window_sum', params: { windowDays: 7 }, description: '7-day total session count', dataType: 'Integer' },
    { id: 'feat_2', name: 'player_spend_30d', sourceDatasetId: 'ds_sessions', sourceField: 'spend_usd', transformation: 'rolling_window_sum', params: { windowDays: 30 }, description: '30-day cumulative microtransaction spend', dataType: 'Float' },
  ];

  return {
    id: 'fs_player_engagement',
    projectId: 'proj_telemetry',
    name: 'Player Engagement & Churn Feature Set',
    version: 1,
    entityIdField: 'player_id',
    targetLabelField: 'churn_risk_label',
    features,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
