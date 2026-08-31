// Player Domain Models & Enterprise Preset Data

export interface PlayerPreset {
  player_id: string;
  username: string;
  country: string;
  platform: 'PC' | 'PlayStation' | 'Xbox' | 'iOS' | 'Android' | 'Switch';
  level: number;
  vip_status: boolean;
  total_spend_usd: number;
  created_at: string;
  last_login_at: string;
}

export const PRESET_PLAYERS: PlayerPreset[] = [
  { player_id: 'ply_1001', username: 'ShadowVance', country: 'USA', platform: 'PC', level: 45, vip_status: true, total_spend_usd: 149.99, created_at: '2026-01-10T08:00:00Z', last_login_at: '2026-08-31T20:00:00Z' },
  { player_id: 'ply_1002', username: 'NeonBlade', country: 'Germany', platform: 'PlayStation', level: 32, vip_status: false, total_spend_usd: 29.99, created_at: '2026-02-14T10:30:00Z', last_login_at: '2026-08-31T19:45:00Z' },
  { player_id: 'ply_1003', username: 'CyberRider', country: 'Japan', platform: 'PC', level: 88, vip_status: true, total_spend_usd: 499.00, created_at: '2025-11-01T12:00:00Z', last_login_at: '2026-08-31T20:30:00Z' },
  { player_id: 'ply_1004', username: 'PixelQueen', country: 'UK', platform: 'iOS', level: 14, vip_status: false, total_spend_usd: 0.00, created_at: '2026-06-20T14:15:00Z', last_login_at: '2026-08-30T11:20:00Z' },
  { player_id: 'ply_1005', username: 'ApexTitan', country: 'Canada', platform: 'Xbox', level: 60, vip_status: true, total_spend_usd: 199.50, created_at: '2026-03-05T09:00:00Z', last_login_at: '2026-08-31T18:10:00Z' },
];
