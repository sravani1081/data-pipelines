// Production 16-Payload Telemetry Generator Engine

import { generateSessionStartedEvent } from './events/sessionStarted';
import { generateSessionEndedEvent } from './events/sessionEnded';
import { generateMatchStartedEvent, generateMatchCompletedEvent } from './events/matchEvents';
import { generatePurchaseEvent } from './events/economyEvents';
import { generateQuestCompletedEvent } from './events/questEvents';
import { generateServerMetricsEvent } from './events/serverMetrics';
import { generateId } from '@/lib/utils/helpers';

export type GameTelemetryKind =
  | 'player_events'
  | 'gameplay_telemetry'
  | 'match_data'
  | 'session_data'
  | 'economy_data'
  | 'game_events'
  | 'npc_interactions'
  | 'quest_activity'
  | 'purchases'
  | 'inventory'
  | 'progression'
  | 'server_metrics'
  | 'performance_data'
  | 'error_logs'
  | 'ai_events'
  | 'experiment_data';

export interface TelemetryGeneratorOptions {
  kind: GameTelemetryKind;
  count: number;
  gameId?: string;
  region?: string;
  includeNulls?: boolean;
}

export function generateTelemetryBatch(options: TelemetryGeneratorOptions): Record<string, any>[] {
  const { kind, count, gameId = 'cyber_nexus_v1', region = 'NA-East', includeNulls = false } = options;
  const records: Record<string, any>[] = [];

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(Date.now() - (count - i) * 3000).toISOString();
    const playerId = `ply_${1000 + (i % 300)}`;
    const sessionId = `ses_${8000 + Math.floor(i / 4)}`;

    let record: Record<string, any> = {
      event_id: generateId('evt_gen'),
      telemetry_kind: kind,
      timestamp,
      player_id: includeNulls && i % 20 === 0 ? null : playerId,
      session_id: sessionId,
      game_id: gameId,
      region,
      platform: i % 2 === 0 ? 'PC' : 'PlayStation',
      app_version: 'v2.4.1',
    };

    switch (kind) {
      case 'player_events':
        record = { ...record, event_name: 'player_level_up', old_level: 14, new_level: 15, xp_gained: 2500 };
        break;

      case 'gameplay_telemetry':
        record = { ...record, event_name: 'ability_used', ability_id: 'ability_dash', cooldown_remaining_ms: 0, mana_cost: 25 };
        break;

      case 'match_data':
        record = { ...record, ...generateMatchCompletedEvent(i) };
        break;

      case 'session_data':
        record = { ...record, ...generateSessionStartedEvent(i) };
        break;

      case 'economy_data':
      case 'purchases':
        record = { ...record, ...generatePurchaseEvent(i) };
        break;

      case 'quest_activity':
        record = { ...record, ...generateQuestCompletedEvent(i) };
        break;

      case 'server_metrics':
      case 'performance_data':
        record = { ...record, ...generateServerMetricsEvent(i) };
        break;

      case 'npc_interactions':
        record = { ...record, event_name: 'npc_dialogue_choice', npc_id: 'npc_merchant_01', choice_id: 'choice_buy_potion', reputation_tier: 'Friendly' };
        break;

      case 'inventory':
        record = { ...record, event_name: 'item_equipped', item_slot: 'Weapon_Main', item_id: 'wpn_laser_sword', durability_percent: 95 };
        break;

      case 'progression':
        record = { ...record, event_name: 'skill_tree_unlocked', skill_id: 'skill_double_jump', tier: 3, skill_points_remaining: 4 };
        break;

      case 'error_logs':
        record = { ...record, event_name: 'client_exception', error_code: 'ERR_GPU_OUT_OF_MEMORY', stack_trace: 'RenderPipeline.cpp:142 NullPointerReference', severity: 'ERROR' };
        break;

      case 'ai_events':
        record = { ...record, event_name: 'bot_decision_made', bot_id: 'bot_npc_88', target_player_id: playerId, behavior_tree_state: 'Attack_Melee', confidence_score: 0.94 };
        break;

      case 'experiment_data':
        record = { ...record, event_name: 'experiment_assigned', experiment_id: 'exp_matchmaking_v4', variant: 'Variant_B_Skill_Focused', conversion_flag: true };
        break;

      default:
        record = { ...record, event_name: 'generic_game_event', payload_value: i * 10 };
        break;
    }

    records.push(record);
  }

  return records;
}
