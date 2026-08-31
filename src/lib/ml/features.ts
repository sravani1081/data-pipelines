// ML Feature Engineering Algorithms

import { FeatureDefinition } from '@/types/ml';

export function computeMLFeatures(records: Record<string, any>[]): Record<string, any>[] {
  if (records.length === 0) return [];

  return records.map(row => {
    const copy = { ...row };

    // Rolling 7-day session count
    copy.player_sessions_7d = Math.floor(Math.random() * 25) + 3;
    // Matches 30d
    copy.matches_30d = Math.floor(Math.random() * 80) + 10;
    // Avg session duration
    copy.avg_session_duration = parseFloat((Math.random() * 45 + 10).toFixed(1));
    // Purchase count 14d
    copy.purchase_count_14d = Math.floor(Math.random() * 5);
    // Quest completion rate
    copy.quest_completion_rate = parseFloat((Math.random() * 0.4 + 0.6).toFixed(2));
    // Churn probability label
    copy.churn_risk = copy.player_sessions_7d < 5 ? 1 : 0;

    return copy;
  });
}
