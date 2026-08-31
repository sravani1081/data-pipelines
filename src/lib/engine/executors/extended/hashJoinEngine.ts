// High-Performance Hash Join Execution Engine

export function runHashJoin<T extends Record<string, any>>(
  leftDataset: T[],
  rightDataset: T[],
  leftKey: keyof T,
  rightKey: keyof T,
  joinType: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL' = 'INNER'
): Record<string, any>[] {
  if (leftDataset.length === 0) return joinType === 'RIGHT' || joinType === 'FULL' ? rightDataset : [];
  if (rightDataset.length === 0) return joinType === 'LEFT' || joinType === 'FULL' ? leftDataset : [];

  const rightHashTable = new Map<string, T[]>();

  rightDataset.forEach(row => {
    const k = String(row[rightKey] ?? '');
    if (!rightHashTable.has(k)) rightHashTable.set(k, []);
    rightHashTable.get(k)!.push(row);
  });

  const matchedRightKeys = new Set<string>();
  const output: Record<string, any>[] = [];

  leftDataset.forEach(lRow => {
    const k = String(lRow[leftKey] ?? '');
    const matches = rightHashTable.get(k);

    if (matches && matches.length > 0) {
      matchedRightKeys.add(k);
      matches.forEach(rRow => {
        output.push({ ...lRow, ...rRow });
      });
    } else {
      if (joinType === 'LEFT' || joinType === 'FULL') {
        output.push({ ...lRow });
      }
    }
  });

  if (joinType === 'RIGHT' || joinType === 'FULL') {
    rightHashTable.forEach((rows, k) => {
      if (!matchedRightKeys.has(k)) {
        rows.forEach(rRow => {
          output.push({ ...rRow });
        });
      }
    });
  }

  return output;
}
