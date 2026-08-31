// Feature Engineering & ML Dataset Types

export type FeatureTransformationType =
  | 'one_hot_encoding'
  | 'label_encoding'
  | 'min_max_scaling'
  | 'z_score_standardization'
  | 'rolling_window_avg'
  | 'rolling_window_sum'
  | 'lag_feature'
  | 'ratio';

export interface FeatureDefinition {
  id: string;
  name: string;
  sourceDatasetId: string;
  sourceField: string;
  transformation: FeatureTransformationType;
  params: Record<string, any>;
  description: string;
  dataType: 'Float' | 'Integer' | 'Array';
}

export interface FeatureSet {
  id: string;
  name: string;
  projectId: string;
  version: number;
  features: FeatureDefinition[];
  targetLabelField?: string;
  entityIdField: string; // e.g. player_id
  createdAt: string;
  updatedAt: string;
}

export type SplitMethod = 'random' | 'stratified' | 'time_based';

export interface MLDatasetConfig {
  id: string;
  name: string;
  featureSetId: string;
  targetLabelField: string;
  splitMethod: SplitMethod;
  trainRatio: number; // e.g. 0.7
  valRatio: number;   // e.g. 0.15
  testRatio: number;  // e.g. 0.15
  timeField?: string;
  recordCount: number;
  trainCount: number;
  valCount: number;
  testCount: number;
  createdAt: string;
}
