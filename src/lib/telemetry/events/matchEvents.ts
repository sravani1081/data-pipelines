// Match Started & Completed Telemetry Event Generator Module

import { BaseGameEvent } from '@/types/telemetry';
import { generateId } from '@/lib/utils/helpers';

export interface MatchStartedEvent extends BaseGameEvent {
  event_name: 'match_started';
  match_id: string;
  mode: string;
  map_id: string;
  queue_duration_seconds: number;
  mmr_rating: number;
}

export interface MatchCompletedEventDetail extends BaseGameEvent {
  event_name: 'match_completed';
  match_id: string;
  mode: string;
  result: 'victory' | 'defeat' | 'draw';
  duration_seconds: number;
  kills: number;
  deaths: number;
  assists: number;
  damage_dealt: number;
  damage_taken: number;
  score: number;
  xp_gained: number;
}

export function generateMatchStartedEvent(index: number): MatchStartedEvent {
  const modes = ['Battle Royale', '5v5 Ranked', 'Deathmatch', 'Co-Op Raid'];
  const maps = ['map_neon_city', 'map_desert_bunker', 'map_orbital_station'];

  return {
    event_id: generateId('evt_match_start'),
    event_name: 'match_started',
    timestamp: new Date(Date.now() - index * 40000).toISOString(),
    player_id: `ply_${1000 + (index % 500)}`,
    session_id: `ses_${8000 + index}`,
    game_id: 'cyber_nexus_v1',
    platform: 'PlayStation',
    region: 'EU-Central',
    app_version: 'v2.4.1',
    match_id: `match_${500 + index}`,
    mode: modes[index % modes.length],
    map_id: maps[index % maps.length],
    queue_duration_seconds: Math.floor(Math.random() * 45) + 5,
    mmr_rating: Math.floor(Math.random() * 1000) + 1500,
  };
}

export function generateMatchCompletedEvent(index: number): MatchCompletedEventDetail {
  const modes = ['Battle Royale', '5v5 Ranked', 'Deathmatch', 'Co-Op Raid'];

  return {
    event_id: generateId('evt_match_comp'),
    event_name: 'match_completed',
    timestamp: new Date(Date.now() - index * 35000).toISOString(),
    player_id: `ply_${1000 + (index % 500)}`,
    session_id: `ses_${8000 + index}`,
    game_id: 'cyber_nexus_v1',
    platform: 'PlayStation',
    region: 'EU-Central',
    app_version: 'v2.4.1',
    match_id: `match_${500 + index}`,
    mode: modes[index % modes.length],
    result: index % 2 === 0 ? 'victory' : 'defeat',
    duration_seconds: Math.floor(Math.random() * 900) + 300,
    kills: Math.floor(Math.random() * 15),
    deaths: Math.floor(Math.random() * 10),
    assists: Math.floor(Math.random() * 12),
    damage_dealt: Math.floor(Math.random() * 8000) + 1000,
    damage_taken: Math.floor(Math.random() * 5000) + 500,
    score: Math.floor(Math.random() * 5000) + 1000,
    xp_gained: Math.floor(Math.random() * 2000) + 500,
  };
}
