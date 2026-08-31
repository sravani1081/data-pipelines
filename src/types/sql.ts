// SQL Workspace & Visual Query Builder Types

export interface SQLToken {
  type: 'KEYWORD' | 'IDENTIFIER' | 'NUMBER' | 'STRING' | 'OPERATOR' | 'PUNCTUATION';
  value: string;
}

export interface QueryAST {
  select: { expression: string; alias?: string }[];
  from: string;
  joins?: { type: 'INNER' | 'LEFT' | 'RIGHT'; table: string; onLeft: string; onRight: string }[];
  where?: { field: string; operator: string; value: any }[];
  groupBy?: string[];
  orderBy?: { field: string; direction: 'ASC' | 'DESC' }[];
  limit?: number;
}

export interface SavedQuery {
  id: string;
  name: string;
  description: string;
  sql: string;
  projectId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastExecutedAt?: string;
  executionCount: number;
}

export interface QueryExecutionResult {
  id: string;
  queryId?: string;
  sql: string;
  columns: string[];
  rows: Record<string, any>[];
  rowCount: number;
  executionTimeMs: number;
  executedAt: string;
  error?: string;
}
