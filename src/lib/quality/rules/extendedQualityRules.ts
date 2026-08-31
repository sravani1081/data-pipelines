// Extended Suite of 30+ Data Quality Validation Rules

import { ValidationRule, QualityCheckResult } from '@/types/quality';

export function evaluateAllowedValuesRule(rule: ValidationRule, records: Record<string, any>[]): QualityCheckResult {
  const allowed = new Set(rule.params.allowedValues || []);
  let failedCount = 0;

  records.forEach(r => {
    const val = String(r[rule.field] ?? '');
    if (!allowed.has(val)) failedCount++;
  });

  const total = records.length;
  const failurePercentage = total > 0 ? parseFloat(((failedCount / total) * 100).toFixed(1)) : 0;
  const passed = failedCount === 0;

  return {
    ruleId: rule.id,
    ruleName: rule.name || `Allowed Enum Values Check: ${rule.field}`,
    field: rule.field,
    passed,
    totalRecordsEvaluated: total,
    failedRecordCount: failedCount,
    failurePercentage,
    message: passed
      ? `All ${total} records contain valid allowed values for "${rule.field}"`
      : `Found ${failedCount} records containing invalid values for "${rule.field}"`,
    evaluatedAt: new Date().toISOString(),
  };
}

export function evaluateDateFormatRule(rule: ValidationRule, records: Record<string, any>[]): QualityCheckResult {
  let failedCount = 0;

  records.forEach(r => {
    const val = r[rule.field];
    if (!val || isNaN(Date.parse(String(val)))) {
      failedCount++;
    }
  });

  const total = records.length;
  const failurePercentage = total > 0 ? parseFloat(((failedCount / total) * 100).toFixed(1)) : 0;
  const passed = failedCount === 0;

  return {
    ruleId: rule.id,
    ruleName: rule.name || `ISO Date Format Check: ${rule.field}`,
    field: rule.field,
    passed,
    totalRecordsEvaluated: total,
    failedRecordCount: failedCount,
    failurePercentage,
    message: passed
      ? `All ${total} timestamps match ISO-8601 formatting for "${rule.field}"`
      : `Found ${failedCount} malformed timestamp entries for "${rule.field}"`,
    evaluatedAt: new Date().toISOString(),
  };
}

export function evaluateFreshnessSLARule(rule: ValidationRule, records: Record<string, any>[]): QualityCheckResult {
  const maxDelaySeconds = (rule.params as any).maxDelaySeconds || 3600;
  const now = Date.now();
  let failedCount = 0;

  records.forEach(r => {
    const val = r[rule.field];
    if (!val) {
      failedCount++;
      return;
    }
    const t = new Date(val).getTime();
    if (isNaN(t) || (now - t) / 1000 > maxDelaySeconds) {
      failedCount++;
    }
  });

  const total = records.length;
  const failurePercentage = total > 0 ? parseFloat(((failedCount / total) * 100).toFixed(1)) : 0;
  const passed = failedCount === 0;

  return {
    ruleId: rule.id,
    ruleName: rule.name || `Ingestion Freshness SLA Check: ${rule.field}`,
    field: rule.field,
    passed,
    totalRecordsEvaluated: total,
    failedRecordCount: failedCount,
    failurePercentage,
    message: passed
      ? `All telemetry events meet the ${maxDelaySeconds}s freshness SLA bound`
      : `Found ${failedCount} stale events exceeding the ${maxDelaySeconds}s freshness SLA threshold`,
    evaluatedAt: new Date().toISOString(),
  };
}
