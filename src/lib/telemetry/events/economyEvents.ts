// Economy & Microtransaction Telemetry Event Generator Module

import { BaseGameEvent } from '@/types/telemetry';
import { generateId } from '@/lib/utils/helpers';

export interface EconomyTransactionEvent extends BaseGameEvent {
  event_name: 'purchase' | 'item_acquired' | 'item_used';
  transaction_id: string;
  item_id: string;
  item_name: string;
  currency: 'USD' | 'GEMS' | 'GOLD';
  amount: number;
  balance_after: number;
  store_category: string;
}

export function generatePurchaseEvent(index: number): EconomyTransactionEvent {
  const items = [
    { id: 'skin_cyber_vance', name: 'Cyber Vance Outfit', price: 14.99, cat: 'Skins' },
    { id: 'bp_season_4', name: 'BattlePass Season 4', price: 9.99, cat: 'BattlePass' },
    { id: 'xp_boost_24h', name: '24h XP Booster', price: 2.99, cat: 'Consumables' },
    { id: 'lootbox_legend', name: 'Legendary Loot Chest', price: 4.99, cat: 'LootBox' },
  ];
  const item = items[index % items.length];

  return {
    event_id: generateId('evt_purchase'),
    event_name: 'purchase',
    timestamp: new Date(Date.now() - index * 25000).toISOString(),
    player_id: `ply_${1000 + (index % 500)}`,
    session_id: `ses_${8000 + index}`,
    game_id: 'cyber_nexus_v1',
    platform: 'PC',
    region: 'NA-East',
    app_version: 'v2.4.1',
    transaction_id: generateId('txn'),
    item_id: item.id,
    item_name: item.name,
    currency: 'USD',
    amount: item.price,
    balance_after: Math.floor(Math.random() * 500),
    store_category: item.cat,
  };
}
