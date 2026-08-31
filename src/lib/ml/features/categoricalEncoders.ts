// Categorical One-Hot & Label Encoder Module

export function oneHotEncodeField(
  records: Record<string, any>[],
  field: string
): Record<string, any>[] {
  const categories = Array.from(new Set(records.map(r => String(r[field] ?? '')))).filter(Boolean);

  return records.map(row => {
    const copy = { ...row };
    const currVal = String(row[field] ?? '');
    categories.forEach(cat => {
      copy[`${field}_${cat}`] = currVal === cat ? 1 : 0;
    });
    return copy;
  });
}
