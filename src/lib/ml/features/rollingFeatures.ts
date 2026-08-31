// Rolling Window Feature Aggregation Module

export function computeRollingAverages(
  records: Record<string, any>[],
  valueField: string,
  windowSize = 7,
  targetField = 'rolling_avg'
): Record<string, any>[] {
  return records.map((row, idx) => {
    const startIdx = Math.max(0, idx - windowSize + 1);
    const windowRows = records.slice(startIdx, idx + 1);
    const nums = windowRows.map(r => Number(r[valueField])).filter(v => !isNaN(v));

    const avg = nums.length > 0 ? nums.reduce((acc, v) => acc + v, 0) / nums.length : 0;
    return {
      ...row,
      [targetField]: parseFloat(avg.toFixed(2)),
    };
  });
}
