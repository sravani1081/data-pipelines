// Expanded Game Telemetry Event Engine - Part 1: Combat, Movement, Inventory & Matchmaking

import { BaseGameEvent } from '@/types/telemetry';
import { generateId } from '@/lib/utils/helpers';

export interface CombatTelemetryEvent extends BaseGameEvent {
  event_name: 'combat_action';
  attacker_id: string;
  victim_id: string;
  weapon_id: string;
  weapon_category: 'Assault Rifle' | 'Sniper' | 'Shotgun' | 'Energy Blade' | 'Plasma Cannon';
  damage_amount: number;
  is_headshot: boolean;
  is_critical_hit: boolean;
  distance_meters: number;
  hitbox_zone: 'head' | 'torso' | 'left_arm' | 'right_arm' | 'left_leg' | 'right_leg';
  attacker_position: { x: number; y: number; z: number };
  victim_position: { x: number; y: number; z: number };
  ammo_remaining: number;
}

export function generateCombatEventBatch(count: number): CombatTelemetryEvent[] {
  const events: CombatTelemetryEvent[] = [];
  const weapons = ['Assault Rifle', 'Sniper', 'Shotgun', 'Energy Blade', 'Plasma Cannon'] as const;
  const hitboxes = ['head', 'torso', 'left_arm', 'right_arm', 'left_leg', 'right_leg'] as const;

  for (let i = 0; i < count; i++) {
    events.push({
      event_id: generateId('evt_cbt'),
      event_name: 'combat_action',
      timestamp: new Date(Date.now() - i * 1500).toISOString(),
      player_id: `ply_${1000 + (i % 200)}`,
      session_id: `ses_${8000 + Math.floor(i / 5)}`,
      game_id: 'cyber_nexus_v1',
      platform: i % 2 === 0 ? 'PC' : 'PlayStation',
      region: 'NA-East',
      app_version: 'v2.4.1',
      attacker_id: `ply_${1000 + (i % 200)}`,
      victim_id: `ply_${2000 + (i % 150)}`,
      weapon_id: `wpn_${10 + (i % 12)}`,
      weapon_category: weapons[i % weapons.length],
      damage_amount: Math.floor(Math.random() * 120) + 10,
      is_headshot: i % 7 === 0,
      is_critical_hit: i % 4 === 0,
      distance_meters: parseFloat((Math.random() * 80 + 5).toFixed(1)),
      hitbox_zone: hitboxes[i % hitboxes.length],
      attacker_position: { x: parseFloat((i * 12.5).toFixed(1)), y: 45.0, z: parseFloat((i * 8.2).toFixed(1)) },
      victim_position: { x: parseFloat((i * 12.5 + 15).toFixed(1)), y: 45.0, z: parseFloat((i * 8.2 + 20).toFixed(1)) },
      ammo_remaining: Math.floor(Math.random() * 30),
    });
  }

  return events;
}

export interface PlayerMovementTelemetryEvent extends BaseGameEvent {
  event_name: 'player_movement_sample';
  position: { x: number; y: number; z: number };
  velocity: { vx: number; vy: number; vz: number };
  current_speed_mps: number;
  movement_state: 'walking' | 'running' | 'sliding' | 'jumping' | 'airborne';
  zone_id: string;
  stamina_percent: number;
}

export function generateMovementEventBatch(count: number): PlayerMovementTelemetryEvent[] {
  const events: PlayerMovementTelemetryEvent[] = [];
  const states = ['walking', 'running', 'sliding', 'jumping', 'airborne'] as const;
  const zones = ['zone_downtown', 'zone_industrial', 'zone_harbor', 'zone_wasteland'];

  for (let i = 0; i < count; i++) {
    events.push({
      event_id: generateId('evt_mvt'),
      event_name: 'player_movement_sample',
      timestamp: new Date(Date.now() - i * 1000).toISOString(),
      player_id: `ply_${1000 + (i % 200)}`,
      session_id: `ses_${8000 + Math.floor(i / 5)}`,
      game_id: 'cyber_nexus_v1',
      platform: 'PC',
      region: 'EU-Central',
      app_version: 'v2.4.1',
      position: { x: parseFloat((i * 2.5).toFixed(1)), y: 10.0, z: parseFloat((i * 3.1).toFixed(1)) },
      velocity: { vx: 4.5, vy: 0.0, vz: 3.2 },
      current_speed_mps: parseFloat((5.5 + Math.random() * 3.5).toFixed(1)),
      movement_state: states[i % states.length],
      zone_id: zones[i % zones.length],
      stamina_percent: Math.floor(Math.random() * 60) + 40,
    });
  }

  return events;
}

export function processCombatTelemetryBatch(events: CombatTelemetryEvent[]): {
  totalCombatEvents: number;
  totalDamageDealt: number;
  headshotAccuracyPercent: number;
  criticalHitCount: number;
  avgDistanceMeters: number;
} {
  if (events.length === 0) {
    return {
      totalCombatEvents: 0,
      totalDamageDealt: 0,
      headshotAccuracyPercent: 0,
      criticalHitCount: 0,
      avgDistanceMeters: 0,
    };
  }

  const totalDamage = events.reduce((acc, e) => acc + e.damage_amount, 0);
  const headshots = events.filter(e => e.is_headshot).length;
  const criticals = events.filter(e => e.is_critical_hit).length;
  const avgDist = events.reduce((acc, e) => acc + e.distance_meters, 0) / events.length;

  return {
    totalCombatEvents: events.length,
    totalDamageDealt: totalDamage,
    headshotAccuracyPercent: parseFloat(((headshots / events.length) * 100).toFixed(1)),
    criticalHitCount: criticals,
    avgDistanceMeters: parseFloat(avgDist.toFixed(1)),
  };
}
