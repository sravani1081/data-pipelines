// Game Combat Telemetry Domain Models & Signal Processing

import { BaseGameEvent } from '@/types/telemetry';
import { generateId } from '@/lib/utils/helpers';

export interface CombatHitboxDamage {
  zone: 'head' | 'torso' | 'left_arm' | 'right_arm' | 'left_leg' | 'right_leg';
  multiplier: number;
  baseDamage: number;
  finalDamage: number;
  armorAbsorbed: number;
}

export interface WeaponFireRecord {
  weaponId: string;
  weaponName: string;
  weaponCategory: string;
  fireMode: 'Single' | 'Burst' | 'Automatic';
  roundsFired: number;
  roundsHit: number;
  accuracyPercent: number;
  recoilVector: { pitch: number; yaw: number };
}

export interface DetailedCombatEvent extends BaseGameEvent {
  event_name: 'combat_action';
  attackerId: string;
  victimId: string;
  weapon: WeaponFireRecord;
  hitbox: CombatHitboxDamage;
  distanceMeters: number;
  isFatal: boolean;
  isHeadshot: boolean;
  attackerPosition: { x: number; y: number; z: number };
  victimPosition: { x: number; y: number; z: number };
  gameTick: number;
}

export function createDetailedCombatEvent(index: number): DetailedCombatEvent {
  const isHeadshot = index % 5 === 0;
  const multiplier = isHeadshot ? 2.5 : 1.0;
  const baseDamage = 35;
  const finalDamage = Math.round(baseDamage * multiplier);

  return {
    event_id: generateId('evt_cbt_det'),
    event_name: 'combat_action',
    timestamp: new Date(Date.now() - index * 1000).toISOString(),
    player_id: `ply_${1000 + (index % 100)}`,
    session_id: `ses_${8000 + Math.floor(index / 10)}`,
    game_id: 'cyber_nexus_v1',
    platform: index % 2 === 0 ? 'PC' : 'PlayStation',
    region: 'NA-East',
    app_version: 'v2.4.1',
    attackerId: `ply_${1000 + (index % 100)}`,
    victimId: `ply_${2000 + (index % 100)}`,
    weapon: {
      weaponId: `wpn_${10 + (index % 5)}`,
      weaponName: `Plasma Rifle Mark ${index % 3 + 1}`,
      weaponCategory: 'Assault Rifle',
      fireMode: 'Automatic',
      roundsFired: 30,
      roundsHit: 18,
      accuracyPercent: 60.0,
      recoilVector: { pitch: 1.2, yaw: 0.4 },
    },
    hitbox: {
      zone: isHeadshot ? 'head' : 'torso',
      multiplier,
      baseDamage,
      finalDamage,
      armorAbsorbed: 5,
    },
    distanceMeters: parseFloat((12.5 + (index % 40)).toFixed(1)),
    isFatal: index % 8 === 0,
    isHeadshot,
    attackerPosition: { x: 100.5 + index, y: 15.0, z: 200.2 },
    victimPosition: { x: 120.5 + index, y: 15.0, z: 210.2 },
    gameTick: 12000 + index * 60,
  };
}

export function computeCombatStats(events: DetailedCombatEvent[]) {
  const totalHits = events.length;
  const totalDamage = events.reduce((acc, e) => acc + e.hitbox.finalDamage, 0);
  const headshots = events.filter(e => e.isHeadshot).length;
  const kills = events.filter(e => e.isFatal).length;

  return {
    totalHits,
    totalDamage,
    headshots,
    kills,
    headshotPercentage: totalHits > 0 ? parseFloat(((headshots / totalHits) * 100).toFixed(2)) : 0,
    averageDamagePerHit: totalHits > 0 ? parseFloat((totalDamage / totalHits).toFixed(2)) : 0,
  };
}
