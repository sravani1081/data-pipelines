// Game Telemetry & Synthetic Generator Types

export type GameEventType =
  | 'session_started'
  | 'session_ended'
  | 'match_started'
  | 'match_completed'
  | 'player_death'
  | 'item_acquired'
  | 'item_used'
  | 'purchase'
  | 'quest_started'
  | 'quest_completed'
  | 'level_up'
  | 'currency_change'
  | 'server_connected'
  | 'server_disconnected'
  | 'combat_action'
  | 'player_movement_sample'
  | 'currency_spent'
  | 'battlepass_xp_gained'
  | 'ai_npc_decision'
  | 'client_crash_report'
  | 'achievement_unlocked'
  | 'npc_interaction'
  | 'level_completed'
  | 'level_started';

export interface BaseGameEvent {
  event_id: string;
  event_name: GameEventType;
  timestamp: string;
  player_id: string;
  session_id: string;
  game_id: string;
  platform: 'PC' | 'PlayStation' | 'Xbox' | 'iOS' | 'Android' | 'Switch';
  region: 'NA-East' | 'NA-West' | 'EU-Central' | 'AP-East' | 'SA-East';
  app_version: string;
}

export interface PlayerDeathEvent extends BaseGameEvent {
  event_name: 'player_death';
  killer_id?: string;
  killer_type: 'environment' | 'boss' | 'player' | 'npc';
  weapon_used: string;
  location_x: number;
  location_y: number;
  location_z: number;
  level: number;
}

export interface PurchaseEvent extends BaseGameEvent {
  event_name: 'purchase';
  item_id: string;
  item_name: string;
  currency: 'USD' | 'GEMS' | 'GOLD';
  amount: number;
  store_category: 'Skins' | 'BattlePass' | 'Consumables' | 'LootBox';
}

export interface MatchCompletedEvent extends BaseGameEvent {
  event_name: 'match_completed';
  match_id: string;
  mode: 'Battle Royale' | '5v5 Ranked' | 'Deathmatch' | 'Co-Op Raid';
  result: 'victory' | 'defeat' | 'draw';
  duration_seconds: number;
  kills: number;
  deaths: number;
  assists: number;
  score: number;
}

export interface QuestCompletedEvent extends BaseGameEvent {
  event_name: 'quest_completed';
  quest_id: string;
  quest_name: string;
  duration_seconds: number;
  rewards_gold: number;
  rewards_xp: number;
}

export interface TelemetryGeneratorConfig {
  playerCount: number;
  eventsPerSecond: number;
  gameId: string;
  region: string;
  platforms: string[];
  includeErrors: boolean;
  errorRate: number; // 0.0 to 1.0
  seed?: number;
}

export interface StreamingMetrics {
  eventsPerSecond: number;
  totalEventsProcessed: number;
  queueSize: number;
  processingLatencyMs: number;
  droppedEvents: number;
  errorCount: number;
  activeWorkers: number;
  bufferUsagePercent: number;
}
