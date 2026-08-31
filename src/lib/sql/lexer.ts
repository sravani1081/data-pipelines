// SQL Tokenizer / Lexer Module

import { SQLToken } from '@/types/sql';

const KEYWORDS = new Set([
  'SELECT',
  'FROM',
  'WHERE',
  'GROUP',
  'BY',
  'ORDER',
  'HAVING',
  'LIMIT',
  'AS',
  'JOIN',
  'INNER',
  'LEFT',
  'RIGHT',
  'ON',
  'AND',
  'OR',
  'NOT',
  'IS',
  'NULL',
  'COUNT',
  'SUM',
  'AVG',
  'MIN',
  'MAX',
]);

export function tokenizeSQL(sql: string): SQLToken[] {
  const tokens: SQLToken[] = [];
  let i = 0;

  while (i < sql.length) {
    const char = sql[i];

    if (/\s/.test(char)) {
      i++;
      continue;
    }

    if (char === ',' || char === '(' || char === ')' || char === '*') {
      tokens.push({ type: 'PUNCTUATION', value: char });
      i++;
      continue;
    }

    if (['=', '>', '<', '!'].includes(char)) {
      let op = char;
      if (i + 1 < sql.length && sql[i + 1] === '=') {
        op += '=';
        i++;
      }
      tokens.push({ type: 'OPERATOR', value: op });
      i++;
      continue;
    }

    if (char === "'" || char === '"') {
      const quote = char;
      let str = '';
      i++;
      while (i < sql.length && sql[i] !== quote) {
        str += sql[i];
        i++;
      }
      i++;
      tokens.push({ type: 'STRING', value: str });
      continue;
    }

    if (/[0-9]/.test(char)) {
      let num = '';
      while (i < sql.length && /[0-9.]/.test(sql[i])) {
        num += sql[i];
        i++;
      }
      tokens.push({ type: 'NUMBER', value: num });
      continue;
    }

    if (/[a-zA-Z_]/.test(char)) {
      let ident = '';
      while (i < sql.length && /[a-zA-Z0-9_]/.test(sql[i])) {
        ident += sql[i];
        i++;
      }
      const upper = ident.toUpperCase();
      if (KEYWORDS.has(upper)) {
        tokens.push({ type: 'KEYWORD', value: upper });
      } else {
        tokens.push({ type: 'IDENTIFIER', value: ident });
      }
      continue;
    }

    i++;
  }

  return tokens;
}
