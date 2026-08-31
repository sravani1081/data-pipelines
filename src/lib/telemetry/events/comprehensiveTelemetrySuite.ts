// Comprehensive Telemetry Domain Event Suite

import { BaseGameEvent } from '@/types/telemetry';
import { generateId } from '@/lib/utils/helpers';

export interface ExtendedGameEventPayload extends BaseGameEvent {
  payload_json: string;
  metadata_tags: string[];
  checksum: string;
  is_processed: boolean;
}

export function generateComprehensiveTelemetrySuite(count: number): ExtendedGameEventPayload[] {
  const events: ExtendedGameEventPayload[] = [];
  const eventTypes = [
    'session_started',
    'session_ended',
    'match_started',
    'match_completed',
    'player_death',
    'item_acquired',
    'item_used',
    'purchase',
    'quest_started',
    'quest_completed',
    'level_up',
    'currency_change',
    'server_connected',
    'server_disconnected',
    'combat_action',
    'player_movement_sample',
  ] as const;

  for (let i = 0; i < count; i++) {
    const evtName = eventTypes[i % eventTypes.length];
    const timestamp = new Date(Date.now() - i * 1200).toISOString();
    const playerId = `ply_${1000 + (i % 300)}`;

    events.push({
      event_id: generateId('evt_suite'),
      event_name: evtName,
      timestamp,
      player_id: playerId,
      session_id: `ses_${8000 + Math.floor(i / 10)}`,
      game_id: 'cyber_nexus_v1',
      platform: i % 2 === 0 ? 'PC' : 'PlayStation',
      region: i % 3 === 0 ? 'NA-East' : 'EU-Central',
      app_version: 'v2.4.1',
      payload_json: JSON.stringify({ index: i, event: evtName, player: playerId }),
      metadata_tags: ['Telemetry', 'Gold', 'PROD'],
      checksum: `chk_${i * 9999}`,
      is_processed: true,
    });
  }

  return events;
}

export function processComprehensiveTelemetryBatch(events: ExtendedGameEventPayload[]) {
  const totalCount = events.length;
  const uniquePlayers = new Set(events.map(e => e.player_id)).size;
  const uniqueSessions = new Set(events.map(e => e.session_id)).size;

  const eventCountsByName: Record<string, number> = {};
  events.forEach(e => {
    eventCountsByName[e.event_name] = (eventCountsByName[e.event_name] || 0) + 1;
  });

  return {
    totalCount,
    uniquePlayers,
    uniqueSessions,
    eventCountsByName,
    processedAt: new Date().toISOString(),
  };
}
