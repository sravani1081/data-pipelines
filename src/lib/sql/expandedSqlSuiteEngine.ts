// Expanded SQL Suite Engine

import { executeParsedSQL } from './queryParserEngine';
import { QueryExecutionResult } from '@/types/sql';

export function runQuerySuite(sql: string, tables: { name: string; records: Record<string, any>[] }[]): QueryExecutionResult {
  return executeParsedSQL(sql, tables);
}
