// Expanded Game Telemetry Event Engine - Part 2: Economy Sinks & Microtransactions

import { BaseGameEvent } from '@/types/telemetry';
import { generateId } from '@/lib/utils/helpers';

export interface EconomySinkEvent extends BaseGameEvent {
  event_name: 'currency_spent';
  sink_type: 'crafting' | 'repair' | 'vendor_purchase' | 'reroll_stats' | 'fast_travel';
  currency_type: 'Gold' | 'Gems' | 'CyberTokens';
  amount_spent: number;
  balance_before: number;
  balance_after: number;
  recipient_entity_id: string;
}

export function generateEconomySinkBatch(count: number): EconomySinkEvent[] {
  const events: EconomySinkEvent[] = [];
  const sinks = ['crafting', 'repair', 'vendor_purchase', 'reroll_stats', 'fast_travel'] as const;
  const currencies = ['Gold', 'Gems', 'CyberTokens'] as const;

  for (let i = 0; i < count; i++) {
    const amount = Math.floor(Math.random() * 500) + 50;
    const balanceBefore = 5000 + i * 100;
    events.push({
      event_id: generateId('evt_snk'),
      event_name: 'currency_spent',
      timestamp: new Date(Date.now() - i * 2000).toISOString(),
      player_id: `ply_${1000 + (i % 200)}`,
      session_id: `ses_${8000 + Math.floor(i / 5)}`,
      game_id: 'cyber_nexus_v1',
      platform: 'PC',
      region: 'NA-East',
      app_version: 'v2.4.1',
      sink_type: sinks[i % sinks.length],
      currency_type: currencies[i % currencies.length],
      amount_spent: amount,
      balance_before: balanceBefore,
      balance_after: balanceBefore - amount,
      recipient_entity_id: `vendor_${10 + (i % 5)}`,
    });
  }

  return events;
}

export interface BattlePassProgressEvent extends BaseGameEvent {
  event_name: 'battlepass_xp_gained';
  battlepass_season_id: string;
  xp_amount: number;
  current_tier: number;
  tier_unlocked: boolean;
  reward_claimed?: string;
}

export function generateBattlePassProgressBatch(count: number): BattlePassProgressEvent[] {
  const events: BattlePassProgressEvent[] = [];

  for (let i = 0; i < count; i++) {
    const tier = Math.floor(i / 3) + 1;
    events.push({
      event_id: generateId('evt_bp'),
      event_name: 'battlepass_xp_gained',
      timestamp: new Date(Date.now() - i * 1800).toISOString(),
      player_id: `ply_${1000 + (i % 200)}`,
      session_id: `ses_${8000 + Math.floor(i / 5)}`,
      game_id: 'cyber_nexus_v1',
      platform: 'PlayStation',
      region: 'EU-Central',
      app_version: 'v2.4.1',
      battlepass_season_id: 'bp_season_04',
      xp_amount: 1500,
      current_tier: tier,
      tier_unlocked: i % 3 === 0,
      reward_claimed: i % 3 === 0 ? `reward_skin_tier_${tier}` : undefined,
    });
  }

  return events;
}
