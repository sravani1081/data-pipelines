// Session Ended Telemetry Event Generator Module

import { BaseGameEvent } from '@/types/telemetry';
import { generateId } from '@/lib/utils/helpers';

export interface SessionEndedEvent extends BaseGameEvent {
  event_name: 'session_ended';
  duration_seconds: number;
  quit_reason: 'user_exit' | 'crash' | 'disconnect' | 'idle_timeout';
  matches_played: number;
  total_spend_usd: number;
  peak_memory_mb: number;
}

export function generateSessionEndedEvent(index: number): SessionEndedEvent {
  const quitReasons = ['user_exit', 'user_exit', 'user_exit', 'disconnect', 'crash'] as const;

  return {
    event_id: generateId('evt_ses_end'),
    event_name: 'session_ended',
    timestamp: new Date(Date.now() - index * 55000).toISOString(),
    player_id: `ply_${1000 + (index % 500)}`,
    session_id: `ses_${8000 + index}`,
    game_id: 'cyber_nexus_v1',
    platform: 'PC',
    region: 'NA-East',
    app_version: 'v2.4.1',
    duration_seconds: Math.floor(Math.random() * 3600) + 300,
    quit_reason: quitReasons[index % quitReasons.length],
    matches_played: Math.floor(Math.random() * 8) + 1,
    total_spend_usd: parseFloat((Math.random() * 25).toFixed(2)),
    peak_memory_mb: Math.floor(Math.random() * 2000) + 4000,
  };
}
