// Synthetic Game Telemetry Event Generator (16 Event Types)

import { GameEventType, TelemetryGeneratorConfig } from '@/types/telemetry';
import { generateId } from '../utils/helpers';

const PLATFORMS = ['PC', 'PlayStation', 'Xbox', 'iOS', 'Android', 'Switch'] as const;
const REGIONS = ['NA-East', 'NA-West', 'EU-Central', 'AP-East', 'SA-East'] as const;
const WEAPONS = ['Plasma Rifle', 'Railgun', 'Energy Blade', 'Sniper Rifle', 'Rocket Launcher', 'Grenade'];
const QUESTS = ['Quest_Dragon_Slayer', 'Quest_Shadow_Vault', 'Quest_Raid_Boss_01', 'Quest_Cyber_Heist'];
const ITEMS = ['Skin_Cyber_Vance', 'Skin_Neon_Blade', 'BattlePass_Season_4', 'XP_Boost_24h', 'LootBox_Legendary'];
const MATCH_MODES = ['Battle Royale', '5v5 Ranked', 'Deathmatch', 'Co-Op Raid'] as const;

export function generateGameEvents(config: TelemetryGeneratorConfig, count = 100): Record<string, any>[] {
  const events: Record<string, any>[] = [];
  const eventTypes: GameEventType[] = [
    'session_started',
    'session_ended',
    'level_started',
    'level_completed',
    'player_death',
    'quest_started',
    'quest_completed',
    'item_acquired',
    'item_used',
    'match_started',
    'match_completed',
    'npc_interaction',
    'purchase',
    'achievement_unlocked',
    'server_connected',
    'server_disconnected',
  ];

  for (let i = 0; i < count; i++) {
    const eventType = eventTypes[i % eventTypes.length];
    const playerId = `ply_${1000 + (i % config.playerCount)}`;
    const sessionId = `ses_${8000 + Math.floor(i / 5)}`;
    const platform = PLATFORMS[i % PLATFORMS.length];
    const region = (config.region as any) || REGIONS[i % REGIONS.length];
    const timestamp = new Date(Date.now() - (count - i) * 2000).toISOString();

    const baseEvent = {
      event_id: generateId('evt'),
      event_name: eventType,
      timestamp,
      player_id: playerId,
      session_id: sessionId,
      game_id: config.gameId || 'cyber_nexus_v1',
      platform,
      region,
      app_version: 'v2.4.1',
    };

    let specificData: Record<string, any> = {};

    switch (eventType) {
      case 'player_death':
        specificData = {
          killer_id: `ply_${2000 + (i % 50)}`,
          killer_type: 'player',
          weapon_used: WEAPONS[i % WEAPONS.length],
          location_x: Math.round(Math.random() * 1000),
          location_y: Math.round(Math.random() * 1000),
          location_z: Math.round(Math.random() * 100),
          level: Math.floor(Math.random() * 50) + 1,
        };
        break;
      case 'purchase':
        specificData = {
          transaction_id: generateId('txn'),
          item_id: ITEMS[i % ITEMS.length],
          item_name: ITEMS[i % ITEMS.length].replace('_', ' '),
          currency: 'USD',
          amount: parseFloat((Math.random() * 20 + 0.99).toFixed(2)),
          store_category: 'Skins',
        };
        break;
      case 'match_completed':
        specificData = {
          match_id: `match_${500 + Math.floor(i / 3)}`,
          mode: MATCH_MODES[i % MATCH_MODES.length],
          result: i % 2 === 0 ? 'victory' : 'defeat',
          duration_seconds: Math.floor(Math.random() * 900) + 300,
          kills: Math.floor(Math.random() * 15),
          deaths: Math.floor(Math.random() * 10),
          assists: Math.floor(Math.random() * 12),
          score: Math.floor(Math.random() * 5000) + 1000,
        };
        break;
      case 'quest_completed':
        specificData = {
          quest_id: QUESTS[i % QUESTS.length],
          quest_name: QUESTS[i % QUESTS.length].replace('_', ' '),
          duration_seconds: Math.floor(Math.random() * 600) + 120,
          rewards_gold: 500,
          rewards_xp: 2500,
        };
        break;
      default:
        specificData = {
          level: Math.floor(Math.random() * 50) + 1,
          ping_ms: Math.floor(Math.random() * 60) + 15,
        };
        break;
    }

    // Inject synthetic error if configured
    if (config.includeErrors && Math.random() < config.errorRate) {
      (baseEvent as any).player_id = null; // simulate null player constraint violation
    }

    events.push({ ...baseEvent, ...specificData });
  }

  return events;
}
