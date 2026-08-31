// Expanded Quality Rules Suite

import { ValidationRule, QualityCheckResult } from '@/types/quality';

export function runValidationCheck(rule: ValidationRule, records: Record<string, any>[]): QualityCheckResult {
  let failed = 0;
  records.forEach(r => {
    if (r[rule.field] === null || r[rule.field] === undefined) failed++;
  });

  const total = records.length;
  const failurePercentage = total > 0 ? parseFloat(((failed / total) * 100).toFixed(1)) : 0;

  return {
    ruleId: rule.id,
    ruleName: rule.name || `Check ${rule.field}`,
    field: rule.field,
    passed: failed === 0,
    totalRecordsEvaluated: total,
    failedRecordCount: failed,
    failurePercentage,
    message: failed === 0 ? 'Passed' : `Failed on ${failed} records`,
    evaluatedAt: new Date().toISOString(),
  };
}
