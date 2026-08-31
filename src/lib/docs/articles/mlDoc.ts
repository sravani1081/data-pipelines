// ML Feature Store Technical Guide Documentation

export const ML_FEATURE_GUIDE = `
# ML Feature Engineering & Dataset Builder Guide

Construct machine learning feature stores directly from game telemetry.

## Feature Transformations

- **Rolling Aggregations**: 7d session counts, 30d match activity, 14d spend summaries.
- **Categorical Encoders**: One-hot encoding for platform, region, and store categories.
- **Scalers**: MinMax scaling (0-1) and Z-score standardization.
- **Churn Prediction Labels**: Binary classification labels based on player engagement drops.
- **Train/Val/Test Splitting**: Random, Stratified, or Time-based dataset partitioning.
`;
