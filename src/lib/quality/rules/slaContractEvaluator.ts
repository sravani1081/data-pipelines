// Production SLA Contract Evaluator Module

import { DataContract } from '@/types/quality';
import { Dataset } from '@/types';

export function evaluateDataContractSLA(contract: DataContract, dataset: Dataset): {
  isViolated: boolean;
  violations: string[];
} {
  const violations: string[] = [];

  if (dataset.qualityScore < contract.slaMinQualityScore) {
    violations.push(`Quality score (${dataset.qualityScore}%) is below SLA minimum (${contract.slaMinQualityScore}%)`);
  }

  if (dataset.freshnessScore < 90) {
    violations.push(`Dataset freshness score (${dataset.freshnessScore}%) is below 90% threshold`);
  }

  return {
    isViolated: violations.length > 0,
    violations,
  };
}
