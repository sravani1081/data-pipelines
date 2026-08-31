// Primary Key Uniqueness Validation Rule Module

import { ValidationRule, QualityCheckResult } from '@/types/quality';

export function evaluateUniquenessRule(rule: ValidationRule, records: Record<string, any>[]): QualityCheckResult {
  const seen = new Set<string>();
  let failedCount = 0;

  records.forEach(r => {
    const val = String(r[rule.field] ?? '');
    if (seen.has(val)) {
      failedCount++;
    } else {
      seen.add(val);
    }
  });

  const total = records.length;
  const failurePercentage = total > 0 ? parseFloat(((failedCount / total) * 100).toFixed(1)) : 0;
  const passed = failedCount === 0;

  return {
    ruleId: rule.id,
    ruleName: rule.name || `Field Uniqueness Check: ${rule.field}`,
    field: rule.field,
    passed,
    totalRecordsEvaluated: total,
    failedRecordCount: failedCount,
    failurePercentage,
    message: passed
      ? `Field "${rule.field}" is 100% unique across all ${total} records`
      : `Detected ${failedCount} duplicate entries for primary key field "${rule.field}"`,
    evaluatedAt: new Date().toISOString(),
  };
}
