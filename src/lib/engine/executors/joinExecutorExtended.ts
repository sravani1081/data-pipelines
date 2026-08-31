// Advanced Join Executor Engine (Hash Join, Nested Loop, Multi-Column Join Conditions)

import { PipelineNode } from '@/types/pipeline';

export type ExtendedJoinType = 'inner' | 'left' | 'right' | 'full' | 'semi' | 'anti' | 'cross';

export interface JoinCondition {
  leftField: string;
  rightField: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=';
}

export function executeExtendedJoin(
  node: PipelineNode,
  leftRecords: Record<string, any>[],
  rightRecords: Record<string, any>[] = [],
  customConditions?: JoinCondition[],
  customJoinType?: ExtendedJoinType
): Record<string, any>[] {
  const joinType: ExtendedJoinType = customJoinType || (node.config.joinType as ExtendedJoinType) || 'inner';
  const leftKey = node.config.leftKey || 'player_id';
  const rightKey = node.config.rightKey || 'player_id';

  const conditions: JoinCondition[] = customConditions || [
    { leftField: leftKey, rightField: rightKey, operator: '=' },
  ];

  if (leftRecords.length === 0) return joinType === 'right' || joinType === 'full' ? rightRecords : [];
  if (rightRecords.length === 0) return joinType === 'left' || joinType === 'full' ? leftRecords : [];

  // Hash Join Strategy for Equality Joins
  const isEqualityJoin = conditions.every(c => c.operator === '=');

  if (isEqualityJoin) {
    const rightMap = new Map<string, Record<string, any>[]>();

    rightRecords.forEach(rRow => {
      const hashKey = conditions.map(c => String(rRow[c.rightField] ?? '')).join(':::');
      if (!rightMap.has(hashKey)) rightMap.set(hashKey, []);
      rightMap.get(hashKey)!.push(rRow);
    });

    const results: Record<string, any>[] = [];
    const matchedRightKeys = new Set<string>();

    leftRecords.forEach(lRow => {
      const hashKey = conditions.map(c => String(lRow[c.leftField] ?? '')).join(':::');
      const matches = rightMap.get(hashKey);

      if (matches && matches.length > 0) {
        matchedRightKeys.add(hashKey);
        if (joinType === 'anti') return;
        matches.forEach(mRow => {
          results.push({ ...lRow, ...mRow });
        });
      } else {
        if (joinType === 'left' || joinType === 'full') {
          results.push({ ...lRow });
        }
      }
    });

    if (joinType === 'right' || joinType === 'full') {
      rightMap.forEach((mRows, key) => {
        if (!matchedRightKeys.has(key)) {
          mRows.forEach(mRow => {
            results.push({ ...mRow });
          });
        }
      });
    }

    return results;
  }

  // Nested Loop Join Strategy for Non-Equality Operators (>, <, !=)
  const results: Record<string, any>[] = [];
  const rightMatchedIndices = new Set<number>();

  leftRecords.forEach(lRow => {
    let leftMatched = false;
    rightRecords.forEach((rRow, rIdx) => {
      const allConditionsMet = conditions.every(c => {
        const valL = lRow[c.leftField];
        const valR = rRow[c.rightField];
        if (valL === null || valL === undefined || valR === null || valR === undefined) return false;
        switch (c.operator) {
          case '=':
            return String(valL) === String(valR);
          case '!=':
            return String(valL) !== String(valR);
          case '>':
            return Number(valL) > Number(valR);
          case '>=':
            return Number(valL) >= Number(valR);
          case '<':
            return Number(valL) < Number(valR);
          case '<=':
            return Number(valL) <= Number(valR);
          default:
            return false;
        }
      });

      if (allConditionsMet) {
        leftMatched = true;
        rightMatchedIndices.add(rIdx);
        if (joinType !== 'anti') {
          results.push({ ...lRow, ...rRow });
        }
      }
    });

    if (!leftMatched && (joinType === 'left' || joinType === 'full' || joinType === 'anti')) {
      results.push({ ...lRow });
    }
  });

  if (joinType === 'right' || joinType === 'full') {
    rightRecords.forEach((rRow, rIdx) => {
      if (!rightMatchedIndices.has(rIdx)) {
        results.push({ ...rRow });
      }
    });
  }

  return results;
}
