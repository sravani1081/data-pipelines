// Expanded Production Telemetry Models & Signal Encoders

import { BaseGameEvent } from '@/types/telemetry';
import { generateId } from '@/lib/utils/helpers';

export interface TelemetrySignalRecord extends BaseGameEvent {
  signal_strength_dbm: number;
  latency_jitter_ms: number;
  frame_rate_fps: number;
  vram_usage_mb: number;
  cpu_temperature_c: number;
}

export function generateTelemetrySignalsBatch(count: number): TelemetrySignalRecord[] {
  const records: TelemetrySignalRecord[] = [];

  for (let i = 0; i < count; i++) {
    records.push({
      event_id: generateId('evt_sig'),
      event_name: 'server_connected',
      timestamp: new Date(Date.now() - i * 800).toISOString(),
      player_id: `ply_${1000 + (i % 150)}`,
      session_id: `ses_${8000 + Math.floor(i / 10)}`,
      game_id: 'cyber_nexus_v1',
      platform: 'PC',
      region: 'NA-East',
      app_version: 'v2.4.1',
      signal_strength_dbm: -55 + (i % 20),
      latency_jitter_ms: 2.5 + (i % 5),
      frame_rate_fps: 144 - (i % 15),
      vram_usage_mb: 6144 + (i % 500),
      cpu_temperature_c: 65 + (i % 10),
    });
  }

  return records;
}
