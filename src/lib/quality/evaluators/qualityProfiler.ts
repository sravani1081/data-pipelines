// Deep Data Profiling Engine

export interface FieldProfile {
  fieldName: string;
  dataType: string;
  totalCount: number;
  nullCount: number;
  nullPercentage: number;
  uniqueCount: number;
  min?: number;
  max?: number;
  avg?: number;
}

export function profileDatasetFields(records: Record<string, any>[]): FieldProfile[] {
  if (records.length === 0) return [];

  const fieldNames = Object.keys(records[0]);
  const profiles: FieldProfile[] = [];

  fieldNames.forEach(field => {
    const vals = records.map(r => r[field]);
    const nulls = vals.filter(v => v === null || v === undefined || v === '');
    const nullCount = nulls.length;
    const nullPercentage = parseFloat(((nullCount / records.length) * 100).toFixed(1));
    const uniqueCount = new Set(vals.map(v => String(v ?? ''))).size;

    const nums = vals.map(v => Number(v)).filter(v => !isNaN(v));
    const isNumeric = nums.length > 0 && nums.length === records.length - nullCount;

    profiles.push({
      fieldName: field,
      dataType: isNumeric ? 'Numeric' : 'String',
      totalCount: records.length,
      nullCount,
      nullPercentage,
      uniqueCount,
      min: isNumeric ? Math.min(...nums) : undefined,
      max: isNumeric ? Math.max(...nums) : undefined,
      avg: isNumeric ? parseFloat((nums.reduce((acc, v) => acc + v, 0) / nums.length).toFixed(2)) : undefined,
    });
  });

  return profiles;
}
