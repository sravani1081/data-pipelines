// Expanded Game Telemetry Event Engine - Part 3: Quest Progression & Achievements

import { BaseGameEvent } from '@/types/telemetry';
import { generateId } from '@/lib/utils/helpers';

export interface AchievementUnlockedEvent extends BaseGameEvent {
  event_name: 'achievement_unlocked';
  achievement_id: string;
  achievement_title: string;
  trophy_tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  gamerscore_points: number;
  global_unlock_percentage: number;
}

export function generateAchievementEventBatch(count: number): AchievementUnlockedEvent[] {
  const events: AchievementUnlockedEvent[] = [];
  const achievements = [
    { id: 'ach_first_blood', title: 'First Blood', tier: 'Bronze', pts: 10, pct: 88.5 },
    { id: 'ach_cyber_legend', title: 'Cyber Legend', tier: 'Platinum', pts: 100, pct: 2.1 },
    { id: 'ach_master_craft', title: 'Master Craftsman', tier: 'Gold', pts: 50, pct: 12.4 },
    { id: 'ach_speed_runner', title: 'Need for Speed', tier: 'Silver', pts: 25, pct: 34.0 },
  ] as const;

  for (let i = 0; i < count; i++) {
    const ach = achievements[i % achievements.length];
    events.push({
      event_id: generateId('evt_ach'),
      event_name: 'achievement_unlocked',
      timestamp: new Date(Date.now() - i * 3000).toISOString(),
      player_id: `ply_${1000 + (i % 200)}`,
      session_id: `ses_${8000 + Math.floor(i / 5)}`,
      game_id: 'cyber_nexus_v1',
      platform: 'Xbox',
      region: 'NA-East',
      app_version: 'v2.4.1',
      achievement_id: ach.id,
      achievement_title: ach.title,
      trophy_tier: ach.tier,
      gamerscore_points: ach.pts,
      global_unlock_percentage: ach.pct,
    });
  }

  return events;
}
