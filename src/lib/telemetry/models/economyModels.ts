// In-Game Economy & Currency Balance Tracking Models

import { BaseGameEvent } from '@/types/telemetry';
import { generateId } from '@/lib/utils/helpers';

export type CurrencyType = 'GOLD' | 'GEMS' | 'CYBER_TOKENS' | 'BATTLE_PASS_XP';

export interface CurrencyLedgerEntry {
  entryId: string;
  currency: CurrencyType;
  changeAmount: number;
  balanceBefore: number;
  balanceAfter: number;
  transactionReason: 'QUEST_REWARD' | 'STORE_PURCHASE' | 'ITEM_CRAFTING' | 'LOOTBOX_DROP' | 'TRADE';
}

export interface DetailedEconomyEvent extends BaseGameEvent {
  event_name: 'currency_change';
  ledger: CurrencyLedgerEntry;
  storeSku?: string;
  realMoneyCostUsd?: number;
  promotionCode?: string;
}

export function createDetailedEconomyEvent(index: number): DetailedEconomyEvent {
  const currencies: CurrencyType[] = ['GOLD', 'GEMS', 'CYBER_TOKENS', 'BATTLE_PASS_XP'];
  const reasons = ['QUEST_REWARD', 'STORE_PURCHASE', 'ITEM_CRAFTING', 'LOOTBOX_DROP', 'TRADE'] as const;

  const curr = currencies[index % currencies.length];
  const isSpend = index % 2 === 0;
  const changeAmount = isSpend ? -150 : 500;
  const balanceBefore = 2500 + index * 50;

  return {
    event_id: generateId('evt_econ_det'),
    event_name: 'currency_change',
    timestamp: new Date(Date.now() - index * 2000).toISOString(),
    player_id: `ply_${1000 + (index % 100)}`,
    session_id: `ses_${8000 + Math.floor(index / 10)}`,
    game_id: 'cyber_nexus_v1',
    platform: 'PC',
    region: 'EU-Central',
    app_version: 'v2.4.1',
    ledger: {
      entryId: generateId('ldg'),
      currency: curr,
      changeAmount,
      balanceBefore,
      balanceAfter: balanceBefore + changeAmount,
      transactionReason: reasons[index % reasons.length],
    },
    storeSku: isSpend ? `sku_item_${index % 10}` : undefined,
    realMoneyCostUsd: isSpend && curr === 'GEMS' ? 9.99 : undefined,
  };
}

export function summarizeEconomyLedger(events: DetailedEconomyEvent[]) {
  const totalEarned = events.filter(e => e.ledger.changeAmount > 0).reduce((acc, e) => acc + e.ledger.changeAmount, 0);
  const totalSpent = events.filter(e => e.ledger.changeAmount < 0).reduce((acc, e) => acc + Math.abs(e.ledger.changeAmount), 0);
  const totalRealMoneyUsd = events.reduce((acc, e) => acc + (e.realMoneyCostUsd || 0), 0);

  return {
    totalEvents: events.length,
    totalEarned,
    totalSpent,
    netBalanceDelta: totalEarned - totalSpent,
    totalRealMoneyUsd: parseFloat(totalRealMoneyUsd.toFixed(2)),
  };
}
