// Expanded Game Telemetry Event Engine - Part 4: AI Events, Crashes & Experiments

import { BaseGameEvent } from '@/types/telemetry';
import { generateId } from '@/lib/utils/helpers';

export interface AIBehaviorTelemetryEvent extends BaseGameEvent {
  event_name: 'ai_npc_decision';
  npc_bot_id: string;
  npc_archetype: 'Sniper' | 'Heavy' | 'Medic' | 'Boss_Dragon';
  behavior_tree_node: 'Seek_Cover' | 'Attack_Target' | 'Flank_Player' | 'Heal_Ally';
  target_player_id: string;
  threat_level: number;
  confidence_score: number;
}

export function generateAIBotEventBatch(count: number): AIBehaviorTelemetryEvent[] {
  const events: AIBehaviorTelemetryEvent[] = [];
  const archetypes = ['Sniper', 'Heavy', 'Medic', 'Boss_Dragon'] as const;
  const nodes = ['Seek_Cover', 'Attack_Target', 'Flank_Player', 'Heal_Ally'] as const;

  for (let i = 0; i < count; i++) {
    events.push({
      event_id: generateId('evt_ai'),
      event_name: 'ai_npc_decision',
      timestamp: new Date(Date.now() - i * 1200).toISOString(),
      player_id: `ply_${1000 + (i % 200)}`,
      session_id: `ses_${8000 + Math.floor(i / 5)}`,
      game_id: 'cyber_nexus_v1',
      platform: 'PC',
      region: 'EU-Central',
      app_version: 'v2.4.1',
      npc_bot_id: `bot_npc_${100 + (i % 20)}`,
      npc_archetype: archetypes[i % archetypes.length],
      behavior_tree_node: nodes[i % nodes.length],
      target_player_id: `ply_${1000 + (i % 200)}`,
      threat_level: Math.floor(Math.random() * 10) + 1,
      confidence_score: parseFloat((0.75 + Math.random() * 0.24).toFixed(2)),
    });
  }

  return events;
}

export interface ClientCrashTelemetryEvent extends BaseGameEvent {
  event_name: 'client_crash_report';
  exception_type: string;
  stack_trace_snippet: string;
  memory_allocated_mb: number;
  vram_allocated_mb: number;
  gpu_driver_version: string;
  uptime_seconds: number;
}

export function generateCrashReportBatch(count: number): ClientCrashTelemetryEvent[] {
  const events: ClientCrashTelemetryEvent[] = [];
  const exceptions = ['ERR_NULL_POINTER_DEREFERENCE', 'ERR_OUT_OF_VRAM', 'ERR_DEVICE_REMOVED', 'ERR_AUDIO_THREAD_HANG'];

  for (let i = 0; i < count; i++) {
    events.push({
      event_id: generateId('evt_crash'),
      event_name: 'client_crash_report',
      timestamp: new Date(Date.now() - i * 60000).toISOString(),
      player_id: `ply_${1000 + (i % 200)}`,
      session_id: `ses_${8000 + Math.floor(i / 5)}`,
      game_id: 'cyber_nexus_v1',
      platform: 'PC',
      region: 'NA-East',
      app_version: 'v2.4.1',
      exception_type: exceptions[i % exceptions.length],
      stack_trace_snippet: `RenderPipeline.cpp:line ${120 + i} inside DrawIndexedInstanced()`,
      memory_allocated_mb: 6144,
      vram_allocated_mb: 7920,
      gpu_driver_version: '551.23',
      uptime_seconds: Math.floor(Math.random() * 7200) + 300,
    });
  }

  return events;
}
