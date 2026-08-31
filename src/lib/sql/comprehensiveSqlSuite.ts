// Production Comprehensive SQL Engine & Query Optimizer Suite

import { QueryExecutionResult } from '@/types/sql';
import { executeParsedSQL } from './queryParserEngine';

export function runOptimizedSqlQuery(
  sql: string,
  datasets: { name: string; records: Record<string, any>[] }[]
): QueryExecutionResult {
  const result = executeParsedSQL(sql, datasets);
  return {
    ...result,
    executedAt: new Date().toISOString(),
  };
}
