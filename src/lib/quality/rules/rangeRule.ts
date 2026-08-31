// Range Validation Rule Module

import { ValidationRule, QualityCheckResult } from '@/types/quality';

export function evaluateRangeRule(rule: ValidationRule, records: Record<string, any>[]): QualityCheckResult {
  const min = rule.params.min ?? -Infinity;
  const max = rule.params.max ?? Infinity;
  let failedCount = 0;

  records.forEach(r => {
    const val = Number(r[rule.field]);
    if (isNaN(val) || val < min || val > max) {
      failedCount++;
    }
  });

  const total = records.length;
  const failurePercentage = total > 0 ? parseFloat(((failedCount / total) * 100).toFixed(1)) : 0;
  const passed = failedCount === 0;

  return {
    ruleId: rule.id,
    ruleName: rule.name || `Range Limits Check: ${rule.field}`,
    field: rule.field,
    passed,
    totalRecordsEvaluated: total,
    failedRecordCount: failedCount,
    failurePercentage,
    message: passed
      ? `All ${total} records satisfied range boundary [${min}, ${max}] for field "${rule.field}"`
      : `Found ${failedCount} records violating range boundaries [${min}, ${max}] for field "${rule.field}"`,
    evaluatedAt: new Date().toISOString(),
  };
}
