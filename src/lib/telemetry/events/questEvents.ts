// Quest & Progression Telemetry Event Generator Module

import { BaseGameEvent } from '@/types/telemetry';
import { generateId } from '@/lib/utils/helpers';

export interface QuestEvent extends BaseGameEvent {
  event_name: 'quest_started' | 'quest_completed';
  quest_id: string;
  quest_name: string;
  quest_category: 'Main Story' | 'Side Quest' | 'Daily Challenge' | 'Raid';
  duration_seconds?: number;
  rewards_gold?: number;
  rewards_xp?: number;
}

export function generateQuestCompletedEvent(index: number): QuestEvent {
  const quests = [
    { id: 'q_dragon_slayer', name: 'Slay the Void Dragon', cat: 'Main Story' },
    { id: 'q_cyber_heist', name: 'Infiltrate NetCorp Vault', cat: 'Side Quest' },
    { id: 'q_daily_bounty', name: 'Eliminate 10 Rogue Bots', cat: 'Daily Challenge' },
  ];
  const q = quests[index % quests.length];

  return {
    event_id: generateId('evt_quest'),
    event_name: 'quest_completed',
    timestamp: new Date(Date.now() - index * 30000).toISOString(),
    player_id: `ply_${1000 + (index % 500)}`,
    session_id: `ses_${8000 + index}`,
    game_id: 'cyber_nexus_v1',
    platform: 'PC',
    region: 'NA-East',
    app_version: 'v2.4.1',
    quest_id: q.id,
    quest_name: q.name,
    quest_category: q.cat as any,
    duration_seconds: Math.floor(Math.random() * 600) + 120,
    rewards_gold: 500,
    rewards_xp: 2500,
  };
}
