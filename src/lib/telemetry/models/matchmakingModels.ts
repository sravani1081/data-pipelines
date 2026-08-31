// Matchmaking Telemetry & MMR Rating Models

import { BaseGameEvent } from '@/types/telemetry';
import { generateId } from '@/lib/utils/helpers';

export interface MatchmakingTelemetryEvent extends BaseGameEvent {
  event_name: 'match_started';
  queueType: 'Casual' | 'Ranked' | 'Tournament';
  startMmr: number;
  expectedWinProbability: number;
  queueWaitDurationSeconds: number;
  matchedServerRegion: string;
  pingMs: number;
}

export function createMatchmakingEvent(index: number): MatchmakingTelemetryEvent {
  const mmr = 1400 + (index % 500);

  return {
    event_id: generateId('evt_mm_det'),
    event_name: 'match_started',
    timestamp: new Date(Date.now() - index * 4000).toISOString(),
    player_id: `ply_${1000 + (index % 100)}`,
    session_id: `ses_${8000 + Math.floor(index / 10)}`,
    game_id: 'cyber_nexus_v1',
    platform: 'PC',
    region: 'NA-East',
    app_version: 'v2.4.1',
    queueType: index % 2 === 0 ? 'Ranked' : 'Casual',
    startMmr: mmr,
    expectedWinProbability: parseFloat((0.45 + (index % 10) * 0.01).toFixed(2)),
    queueWaitDurationSeconds: 12 + (index % 40),
    matchedServerRegion: 'us-east-1',
    pingMs: 24 + (index % 30),
  };
}
