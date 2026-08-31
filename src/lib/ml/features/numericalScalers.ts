// Numerical Scaling & Standardization Algorithms Module

export function minMaxScaleField(
  records: Record<string, any>[],
  field: string,
  targetField = `${field}_scaled`
): Record<string, any>[] {
  const vals = records.map(r => Number(r[field])).filter(v => !isNaN(v));
  if (vals.length === 0) return records;

  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;

  return records.map(row => {
    const v = Number(row[field]);
    const scaled = !isNaN(v) ? (v - min) / range : 0;
    return {
      ...row,
      [targetField]: parseFloat(scaled.toFixed(4)),
    };
  });
}

export function zScoreStandardizeField(
  records: Record<string, any>[],
  field: string,
  targetField = `${field}_zscore`
): Record<string, any>[] {
  const vals = records.map(r => Number(r[field])).filter(v => !isNaN(v));
  if (vals.length === 0) return records;

  const avg = vals.reduce((acc, v) => acc + v, 0) / vals.length;
  const variance = vals.reduce((acc, v) => acc + Math.pow(v - avg, 2), 0) / vals.length;
  const stdDev = Math.sqrt(variance) || 1;

  return records.map(row => {
    const v = Number(row[field]);
    const zscore = !isNaN(v) ? (v - avg) / stdDev : 0;
    return {
      ...row,
      [targetField]: parseFloat(zscore.toFixed(4)),
    };
  });
}
