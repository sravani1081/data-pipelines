// Statistical Aggregation Calculator

export function calculateAggregateMetrics(
  rows: Record<string, any>[],
  field: string
): {
  count: number;
  sum: number;
  avg: number;
  min: number;
  max: number;
  p50: number;
  p95: number;
} {
  const count = rows.length;
  if (count === 0) {
    return { count: 0, sum: 0, avg: 0, min: 0, max: 0, p50: 0, p95: 0 };
  }

  const nums = rows.map(r => Number(r[field])).filter(v => !isNaN(v));
  if (nums.length === 0) {
    return { count, sum: 0, avg: 0, min: 0, max: 0, p50: 0, p95: 0 };
  }

  const sum = nums.reduce((acc, v) => acc + v, 0);
  const avg = parseFloat((sum / nums.length).toFixed(4));
  const min = Math.min(...nums);
  const max = Math.max(...nums);

  const sorted = [...nums].sort((a, b) => a - b);
  const p50 = sorted[Math.floor(sorted.length * 0.5)] || 0;
  const p95 = sorted[Math.floor(sorted.length * 0.95)] || sorted[sorted.length - 1] || 0;

  return { count, sum, avg, min, max, p50, p95 };
}
