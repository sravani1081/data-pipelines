// Session Started Telemetry Event Generator Module

import { BaseGameEvent } from '@/types/telemetry';
import { generateId } from '@/lib/utils/helpers';

export interface SessionStartedEvent extends BaseGameEvent {
  event_name: 'session_started';
  graphics_preset: 'Low' | 'Medium' | 'High' | 'Ultra';
  screen_resolution: string;
  ram_gb: number;
  gpu_name: string;
  ip_address: string;
}

export function generateSessionStartedEvent(index: number): SessionStartedEvent {
  const platforms = ['PC', 'PlayStation', 'Xbox', 'iOS', 'Android'] as const;
  const regions = ['NA-East', 'NA-West', 'EU-Central', 'AP-East'] as const;
  const gpus = ['NVIDIA RTX 4090', 'NVIDIA RTX 3080', 'AMD Radeon RX 7900', 'Apple M3 Max'];

  return {
    event_id: generateId('evt_ses_start'),
    event_name: 'session_started',
    timestamp: new Date(Date.now() - index * 60000).toISOString(),
    player_id: `ply_${1000 + (index % 500)}`,
    session_id: `ses_${8000 + index}`,
    game_id: 'cyber_nexus_v1',
    platform: platforms[index % platforms.length],
    region: regions[index % regions.length],
    app_version: 'v2.4.1',
    graphics_preset: index % 2 === 0 ? 'Ultra' : 'High',
    screen_resolution: '2560x1440',
    ram_gb: 32,
    gpu_name: gpus[index % gpus.length],
    ip_address: `192.168.1.${10 + (index % 200)}`,
  };
}
