// Production Gameplay Telemetry Ingestion & Stream Processing Engine

import { BaseGameEvent } from '@/types/telemetry';
import { generateId } from '@/lib/utils/helpers';

export interface TelemetryStreamRecord {
  streamId: string;
  partitionKey: string;
  sequenceNumber: number;
  data: BaseGameEvent;
  receivedAt: string;
}

export function generateTelemetryStreamBatch(count: number): TelemetryStreamRecord[] {
  const records: TelemetryStreamRecord[] = [];

  for (let i = 0; i < count; i++) {
    records.push({
      streamId: 'strm_gameplay_telemetry_01',
      partitionKey: `part_${i % 16}`,
      sequenceNumber: 100000 + i,
      data: {
        event_id: generateId('evt_strm'),
        event_name: 'match_started',
        timestamp: new Date(Date.now() - i * 500).toISOString(),
        player_id: `ply_${1000 + (i % 100)}`,
        session_id: `ses_${8000 + Math.floor(i / 10)}`,
        game_id: 'cyber_nexus_v1',
        platform: 'PC',
        region: 'NA-East',
        app_version: 'v2.4.1',
      },
      receivedAt: new Date().toISOString(),
    });
  }

  return records;
}
