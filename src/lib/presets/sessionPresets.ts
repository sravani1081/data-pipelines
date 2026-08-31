// Session Domain Models & Enterprise Preset Data

export interface SessionPreset {
  session_id: string;
  player_id: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  matches_played: number;
  total_kills: number;
  total_deaths: number;
  spend_usd: number;
}

export const PRESET_SESSIONS: SessionPreset[] = [
  { session_id: 'ses_8001', player_id: 'ply_1001', start_time: '2026-08-31T18:00:00Z', end_time: '2026-08-31T19:30:00Z', duration_minutes: 90, matches_played: 4, total_kills: 28, total_deaths: 12, spend_usd: 14.99 },
  { session_id: 'ses_8002', player_id: 'ply_1002', start_time: '2026-08-31T19:00:00Z', end_time: '2026-08-31T19:45:00Z', duration_minutes: 45, matches_played: 2, total_kills: 8, total_deaths: 9, spend_usd: 0.00 },
  { session_id: 'ses_8003', player_id: 'ply_1003', start_time: '2026-08-31T17:00:00Z', end_time: '2026-08-31T20:30:00Z', duration_minutes: 210, matches_played: 10, total_kills: 95, total_deaths: 30, spend_usd: 49.99 },
];
