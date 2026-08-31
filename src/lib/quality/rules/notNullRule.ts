// Not Null Data Quality Validation Rule Module

import { ValidationRule, QualityCheckResult } from '@/types/quality';

export function evaluateNotNullRule(rule: ValidationRule, records: Record<string, any>[]): QualityCheckResult {
  let failedCount = 0;

  records.forEach(r => {
    const val = r[rule.field];
    if (val === null || val === undefined || val === '') {
      failedCount++;
    }
  });

  const total = records.length;
  const failurePercentage = total > 0 ? parseFloat(((failedCount / total) * 100).toFixed(1)) : 0;
  const passed = failedCount === 0;

  return {
    ruleId: rule.id,
    ruleName: rule.name || `Not Null Check: ${rule.field}`,
    field: rule.field,
    passed,
    totalRecordsEvaluated: total,
    failedRecordCount: failedCount,
    failurePercentage,
    message: passed
      ? `All ${total} records contain valid non-null values for field "${rule.field}"`
      : `Found ${failedCount} null or empty records for required field "${rule.field}" (${failurePercentage}%)`,
    evaluatedAt: new Date().toISOString(),
  };
}
