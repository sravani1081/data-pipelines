// Safe Local In-Memory SQL Query Engine

import { QueryAST, QueryExecutionResult } from '@/types/sql';
import { generateId } from '../utils/helpers';

export function executeSQLQuery(sql: string, datasets: { name: string; records: Record<string, any>[] }[]): QueryExecutionResult {
  const startTime = performance.now();
  const cleanedSql = sql.trim();

  try {
    // Basic AST Parser
    const upperSql = cleanedSql.toUpperCase();
    const fromMatch = upperSql.match(/FROM\s+([A-ZA-Z0-9_]+)/i);

    if (!fromMatch) {
      throw new Error('Missing FROM clause in query');
    }

    const tableName = fromMatch[1];
    const targetDataset = datasets.find(
      d => d.name.toLowerCase().replace(/\s+/g, '_') === tableName.toLowerCase() || d.name.toLowerCase() === tableName.toLowerCase()
    ) || datasets[0];

    if (!targetDataset || !targetDataset.records) {
      throw new Error(`Dataset "${tableName}" not found in local catalog`);
    }

    let records = [...targetDataset.records];

    // Handle WHERE clause
    const whereMatch = cleanedSql.match(/WHERE\s+(.+?)(?:GROUP BY|ORDER BY|LIMIT|$)/i);
    if (whereMatch) {
      const whereCond = whereMatch[1].trim();
      const parts = whereCond.split(/\s+(=|>|<|!=|LIKE)\s+/i);
      if (parts.length >= 3) {
        const field = parts[0].trim();
        const op = parts[1].trim().toUpperCase();
        const val = parts[2].trim().replace(/^['"]|['"]$/g, '');

        records = records.filter(row => {
          const rowVal = row[field];
          if (op === '=') return String(rowVal) === val;
          if (op === '!=') return String(rowVal) !== val;
          if (op === '>') return Number(rowVal) > Number(val);
          if (op === '<') return Number(rowVal) < Number(val);
          if (op === 'LIKE') return String(rowVal ?? '').toLowerCase().includes(val.toLowerCase());
          return true;
        });
      }
    }

    // Handle GROUP BY
    const groupByMatch = cleanedSql.match(/GROUP BY\s+(.+?)(?:ORDER BY|LIMIT|$)/i);
    if (groupByMatch) {
      const groupFields = groupByMatch[1].split(',').map(f => f.trim());
      const groups = new Map<string, Record<string, any>[]>();

      records.forEach(r => {
        const key = groupFields.map(gf => String(r[gf] ?? '')).join('::');
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(r);
      });

      const aggregatedRows: Record<string, any>[] = [];
      groups.forEach((groupRecords, key) => {
        const outRow: Record<string, any> = {};
        groupFields.forEach(gf => {
          outRow[gf] = groupRecords[0][gf];
        });
        outRow['COUNT(*)'] = groupRecords.length;
        aggregatedRows.push(outRow);
      });

      records = aggregatedRows;
    }

    // Handle LIMIT
    const limitMatch = cleanedSql.match(/LIMIT\s+(\d+)/i);
    if (limitMatch) {
      const limit = parseInt(limitMatch[1], 10);
      records = records.slice(0, limit);
    }

    const columns = records.length > 0 ? Object.keys(records[0]) : [];
    const executionTimeMs = Math.round(performance.now() - startTime);

    return {
      id: generateId('qres'),
      sql: cleanedSql,
      columns,
      rows: records,
      rowCount: records.length,
      executionTimeMs,
      executedAt: new Date().toISOString(),
    };
  } catch (err: any) {
    return {
      id: generateId('qres'),
      sql,
      columns: [],
      rows: [],
      rowCount: 0,
      executionTimeMs: Math.round(performance.now() - startTime),
      executedAt: new Date().toISOString(),
      error: err.message,
    };
  }
}
