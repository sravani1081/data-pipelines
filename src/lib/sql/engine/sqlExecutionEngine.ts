// Comprehensive SQL Execution Engine Handler

import { executeParsedSQL } from '../queryParserEngine';
import { QueryExecutionResult } from '@/types/sql';

export function runSqlQuery(
  query: string,
  availableDatasets: { name: string; records: Record<string, any>[] }[]
): QueryExecutionResult {
  if (!query || query.trim() === '') {
    return {
      id: 'qres_empty',
      sql: query,
      columns: [],
      rows: [],
      rowCount: 0,
      executionTimeMs: 0,
      executedAt: new Date().toISOString(),
      error: 'Query string is empty',
    };
  }

  return executeParsedSQL(query, availableDatasets);
}
