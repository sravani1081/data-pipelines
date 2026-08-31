// Extended Transformation & Expression Engine

import { PipelineNode } from '@/types/pipeline';

export type ExpressionKind =
  | 'string_uppercase'
  | 'string_lowercase'
  | 'string_trim'
  | 'string_substring'
  | 'string_replace'
  | 'string_regex_extract'
  | 'string_concat'
  | 'math_add'
  | 'math_subtract'
  | 'math_multiply'
  | 'math_divide'
  | 'math_modulo'
  | 'math_round'
  | 'math_floor'
  | 'math_ceil'
  | 'math_abs'
  | 'date_parse_iso'
  | 'date_format'
  | 'date_diff_seconds'
  | 'date_extract_year'
  | 'date_extract_month'
  | 'date_extract_day'
  | 'json_extract_field'
  | 'type_cast_integer'
  | 'type_cast_float'
  | 'type_cast_boolean'
  | 'type_cast_string'
  | 'conditional_case_when';

export interface TransformExpressionRule {
  sourceField: string;
  targetField: string;
  kind: ExpressionKind;
  params?: {
    operandValue?: any;
    operandField?: string;
    regexPattern?: string;
    substringStart?: number;
    substringLength?: number;
    dateFormatString?: string;
    caseConditions?: { whenValue: any; thenValue: any }[];
    elseValue?: any;
  };
}

export function evaluateTransformExpression(
  row: Record<string, any>,
  rule: TransformExpressionRule
): any {
  const rawVal = row[rule.sourceField];
  const params = rule.params || {};

  switch (rule.kind) {
    // String Transformations
    case 'string_uppercase':
      return String(rawVal ?? '').toUpperCase();

    case 'string_lowercase':
      return String(rawVal ?? '').toLowerCase();

    case 'string_trim':
      return String(rawVal ?? '').trim();

    case 'string_substring': {
      const start = params.substringStart || 0;
      const len = params.substringLength;
      return len !== undefined ? String(rawVal ?? '').substring(start, start + len) : String(rawVal ?? '').substring(start);
    }

    case 'string_replace': {
      const pattern = params.regexPattern || '';
      const rep = String(params.operandValue ?? '');
      return String(rawVal ?? '').replace(new RegExp(pattern, 'g'), rep);
    }

    case 'string_regex_extract': {
      const pattern = params.regexPattern ? new RegExp(params.regexPattern) : null;
      if (!pattern) return null;
      const match = String(rawVal ?? '').match(pattern);
      return match ? match[1] || match[0] : null;
    }

    case 'string_concat': {
      const secondVal = params.operandField ? row[params.operandField] : params.operandValue;
      return `${rawVal ?? ''}${secondVal ?? ''}`;
    }

    // Mathematical Transformations
    case 'math_add': {
      const val2 = params.operandField ? Number(row[params.operandField]) : Number(params.operandValue || 0);
      return (Number(rawVal) || 0) + val2;
    }

    case 'math_subtract': {
      const val2 = params.operandField ? Number(row[params.operandField]) : Number(params.operandValue || 0);
      return (Number(rawVal) || 0) - val2;
    }

    case 'math_multiply': {
      const val2 = params.operandField ? Number(row[params.operandField]) : Number(params.operandValue || 1);
      return (Number(rawVal) || 0) * val2;
    }

    case 'math_divide': {
      const val2 = params.operandField ? Number(row[params.operandField]) : Number(params.operandValue || 1);
      return val2 !== 0 ? (Number(rawVal) || 0) / val2 : 0;
    }

    case 'math_modulo': {
      const val2 = params.operandField ? Number(row[params.operandField]) : Number(params.operandValue || 1);
      return val2 !== 0 ? (Number(rawVal) || 0) % val2 : 0;
    }

    case 'math_round':
      return Math.round(Number(rawVal) || 0);

    case 'math_floor':
      return Math.floor(Number(rawVal) || 0);

    case 'math_ceil':
      return Math.ceil(Number(rawVal) || 0);

    case 'math_abs':
      return Math.abs(Number(rawVal) || 0);

    // Date & Time Transformations
    case 'date_parse_iso': {
      try {
        return new Date(rawVal).toISOString();
      } catch {
        return null;
      }
    }

    case 'date_extract_year': {
      try {
        return new Date(rawVal).getUTCFullYear();
      } catch {
        return null;
      }
    }

    case 'date_extract_month': {
      try {
        return new Date(rawVal).getUTCMonth() + 1;
      } catch {
        return null;
      }
    }

    case 'date_extract_day': {
      try {
        return new Date(rawVal).getUTCDate();
      } catch {
        return null;
      }
    }

    case 'date_diff_seconds': {
      try {
        const d1 = new Date(rawVal).getTime();
        const d2 = params.operandField ? new Date(row[params.operandField]).getTime() : new Date(params.operandValue).getTime();
        return Math.floor(Math.abs(d1 - d2) / 1000);
      } catch {
        return 0;
      }
    }

    // Type Casting
    case 'type_cast_integer': {
      const parsed = parseInt(String(rawVal), 10);
      return isNaN(parsed) ? 0 : parsed;
    }

    case 'type_cast_float': {
      const parsed = parseFloat(String(rawVal));
      return isNaN(parsed) ? 0.0 : parseFloat(parsed.toFixed(4));
    }

    case 'type_cast_boolean':
      return String(rawVal).toLowerCase() === 'true' || rawVal === 1 || rawVal === true;

    case 'type_cast_string':
      return String(rawVal ?? '');

    // Conditional Case / When Logic
    case 'conditional_case_when': {
      const cases = params.caseConditions || [];
      for (const cond of cases) {
        if (String(rawVal) === String(cond.whenValue)) {
          return cond.thenValue;
        }
      }
      return params.elseValue !== undefined ? params.elseValue : rawVal;
    }

    default:
      return rawVal;
  }
}

export function executeExtendedTransform(
  node: PipelineNode,
  records: Record<string, any>[],
  rules?: TransformExpressionRule[]
): Record<string, any>[] {
  const activeRules: TransformExpressionRule[] = rules || [
    {
      sourceField: node.config.field || 'player_id',
      targetField: node.config.targetField || `${node.config.field || 'player_id'}_transformed`,
      kind: (node.config.expressionType as ExpressionKind) || 'string_uppercase',
    },
  ];

  return records.map(row => {
    const copy = { ...row };
    activeRules.forEach(rule => {
      copy[rule.targetField] = evaluateTransformExpression(row, rule);
    });
    return copy;
  });
}
