// Match Domain Models & Enterprise Preset Data

export interface MatchPreset {
  match_id: string;
  mode: string;
  map: string;
  winner_team: string;
  duration_seconds: number;
  total_players: number;
  timestamp: string;
}

export const PRESET_MATCHES: MatchPreset[] = [
  { match_id: 'match_501', mode: 'Battle Royale', map: 'Neon City', winner_team: 'Alpha Squad', duration_seconds: 1240, total_players: 100, timestamp: '2026-08-31T18:30:00Z' },
  { match_id: 'match_502', mode: '5v5 Ranked', map: 'Desert Bunker', winner_team: 'Bravo Team', duration_seconds: 780, total_players: 10, timestamp: '2026-08-31T19:15:00Z' },
  { match_id: 'match_503', mode: 'Co-Op Raid', map: 'Orbital Station', winner_team: 'Raid Party', duration_seconds: 1800, total_players: 4, timestamp: '2026-08-31T20:00:00Z' },
];
