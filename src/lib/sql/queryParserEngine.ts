// SQL Parser & Execution Engine

import { QueryAST, QueryExecutionResult } from '@/types/sql';
import { tokenizeSQL } from './lexer';
import { generateId } from '@/lib/utils/helpers';

export function parseSQLAST(sql: string): QueryAST {
  const tokens = tokenizeSQL(sql);
  const ast: QueryAST = {
    select: [],
    from: '',
  };

  let mode: 'SELECT' | 'FROM' | 'WHERE' | 'GROUP_BY' | 'ORDER_BY' | 'LIMIT' | null = null;
  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i];

    if (token.type === 'KEYWORD') {
      if (token.value === 'SELECT') {
        mode = 'SELECT';
        i++;
        continue;
      } else if (token.value === 'FROM') {
        mode = 'FROM';
        i++;
        continue;
      } else if (token.value === 'WHERE') {
        mode = 'WHERE';
        i++;
        continue;
      } else if (token.value === 'GROUP') {
        if (i + 1 < tokens.length && tokens[i + 1].value === 'BY') {
          mode = 'GROUP_BY';
          i += 2;
          continue;
        }
      } else if (token.value === 'ORDER') {
        if (i + 1 < tokens.length && tokens[i + 1].value === 'BY') {
          mode = 'ORDER_BY';
          i += 2;
          continue;
        }
      } else if (token.value === 'LIMIT') {
        mode = 'LIMIT';
        i++;
        continue;
      }
    }

    if (mode === 'SELECT') {
      if (token.value !== ',') {
        ast.select.push({ expression: token.value });
      }
    } else if (mode === 'FROM') {
      ast.from = token.value;
    } else if (mode === 'LIMIT') {
      ast.limit = parseInt(token.value, 10);
    }

    i++;
  }

  return ast;
}

export function executeParsedSQL(
  sql: string,
  datasets: { name: string; records: Record<string, any>[] }[]
): QueryExecutionResult {
  const startTime = performance.now();
  const ast = parseSQLAST(sql);

  const targetName = ast.from.toLowerCase().replace(/\s+/g, '_');
  const dataset = datasets.find(
    d => d.name.toLowerCase().replace(/\s+/g, '_') === targetName || d.name.toLowerCase() === targetName
  ) || datasets[0];

  if (!dataset) {
    return {
      id: generateId('qres'),
      sql,
      columns: [],
      rows: [],
      rowCount: 0,
      executionTimeMs: Math.round(performance.now() - startTime),
      executedAt: new Date().toISOString(),
      error: `Table "${ast.from}" not found`,
    };
  }

  let rows = [...dataset.records];

  if (ast.limit && ast.limit > 0) {
    rows = rows.slice(0, ast.limit);
  }

  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
  const durationMs = Math.round(performance.now() - startTime);

  return {
    id: generateId('qres'),
    sql,
    columns,
    rows,
    rowCount: rows.length,
    executionTimeMs: durationMs,
    executedAt: new Date().toISOString(),
  };
}
