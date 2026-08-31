// Production Expression Evaluator for Field Transformations

export function evaluateExpressionOnRow(row: Record<string, any>, expression: string): any {
  if (!expression) return null;

  const trimmed = expression.trim();

  // Field reference check
  if (row.hasOwnProperty(trimmed)) {
    return row[trimmed];
  }

  // String concatenation expression: CONCAT(colA, colB)
  const concatMatch = trimmed.match(/^CONCAT\(([^,]+),\s*([^)]+)\)$/i);
  if (concatMatch) {
    const field1 = concatMatch[1].trim();
    const field2 = concatMatch[2].trim();
    const val1 = row[field1] ?? field1.replace(/['"]/g, '');
    const val2 = row[field2] ?? field2.replace(/['"]/g, '');
    return `${val1}${val2}`;
  }

  // Math addition: colA + colB
  if (trimmed.includes('+')) {
    const parts = trimmed.split('+').map(p => p.trim());
    return parts.reduce((acc, p) => {
      const num = Number(row[p] ?? p);
      return acc + (isNaN(num) ? 0 : num);
    }, 0);
  }

  // Math multiplication: colA * colB
  if (trimmed.includes('*')) {
    const parts = trimmed.split('*').map(p => p.trim());
    return parts.reduce((acc, p) => {
      const num = Number(row[p] ?? p);
      return acc * (isNaN(num) ? 1 : num);
    }, 1);
  }

  return trimmed.replace(/['"]/g, '');
}
