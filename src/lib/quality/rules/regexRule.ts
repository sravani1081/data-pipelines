// Regex Pattern Validation Rule Module

import { ValidationRule, QualityCheckResult } from '@/types/quality';

export function evaluateRegexRule(rule: ValidationRule, records: Record<string, any>[]): QualityCheckResult {
  const pattern = rule.params.pattern ? new RegExp(rule.params.pattern) : /.*/;
  let failedCount = 0;

  records.forEach(r => {
    const val = String(r[rule.field] ?? '');
    if (!pattern.test(val)) {
      failedCount++;
    }
  });

  const total = records.length;
  const failurePercentage = total > 0 ? parseFloat(((failedCount / total) * 100).toFixed(1)) : 0;
  const passed = failedCount === 0;

  return {
    ruleId: rule.id,
    ruleName: rule.name || `Regex Pattern Check: ${rule.field}`,
    field: rule.field,
    passed,
    totalRecordsEvaluated: total,
    failedRecordCount: failedCount,
    failurePercentage,
    message: passed
      ? `All ${total} records matched pattern "${rule.params.pattern}" for field "${rule.field}"`
      : `Found ${failedCount} records violating regex pattern for field "${rule.field}"`,
    evaluatedAt: new Date().toISOString(),
  };
}
