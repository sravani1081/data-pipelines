// Expanded Production Telemetry Engines Suite

import { BaseGameEvent } from '@/types/telemetry';
import { generateId } from '@/lib/utils/helpers';

export interface TelemetryBufferItem {
  id: string;
  payload: BaseGameEvent;
  bufferedAt: string;
}

export function generateTelemetryBufferBatch(count: number): TelemetryBufferItem[] {
  const buffer: TelemetryBufferItem[] = [];

  for (let i = 0; i < count; i++) {
    buffer.push({
      id: generateId('buf'),
      payload: {
        event_id: generateId('evt_buf'),
        event_name: 'session_started',
        timestamp: new Date(Date.now() - i * 500).toISOString(),
        player_id: `ply_${1000 + (i % 100)}`,
        session_id: `ses_${8000 + Math.floor(i / 10)}`,
        game_id: 'cyber_nexus_v1',
        platform: 'PC',
        region: 'NA-East',
        app_version: 'v2.4.1',
      },
      bufferedAt: new Date().toISOString(),
    });
  }

  return buffer;
}
