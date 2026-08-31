// Visual SQL Query Builder Generator Module

export interface QueryBuilderConfig {
  tableName: string;
  selectedFields: string[];
  filterField?: string;
  filterOperator?: string;
  filterValue?: string;
  groupByFields?: string[];
  sortField?: string;
  sortDirection?: 'ASC' | 'DESC';
  limit?: number;
}

export function generateSQLFromConfig(config: QueryBuilderConfig): string {
  const fields = config.selectedFields.length > 0 ? config.selectedFields.join(', ') : '*';
  let sql = `SELECT ${fields}\nFROM ${config.tableName}`;

  if (config.filterField && config.filterOperator && config.filterValue) {
    sql += `\nWHERE ${config.filterField} ${config.filterOperator} '${config.filterValue}'`;
  }

  if (config.groupByFields && config.groupByFields.length > 0) {
    sql += `\nGROUP BY ${config.groupByFields.join(', ')}`;
  }

  if (config.sortField) {
    sql += `\nORDER BY ${config.sortField} ${config.sortDirection || 'ASC'}`;
  }

  if (config.limit) {
    sql += `\nLIMIT ${config.limit}`;
  }

  return sql;
}
