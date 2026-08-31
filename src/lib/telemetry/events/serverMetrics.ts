// Server Observability Telemetry Event Generator Module

import { BaseGameEvent } from '@/types/telemetry';
import { generateId } from '@/lib/utils/helpers';

export interface ServerMetricsEvent extends BaseGameEvent {
  event_name: 'server_connected' | 'server_disconnected';
  server_id: string;
  cluster_name: string;
  cpu_percent: number;
  memory_percent: number;
  active_ccu: number;
  tick_rate_hz: number;
  packet_loss_percent: number;
}

export function generateServerMetricsEvent(index: number): ServerMetricsEvent {
  return {
    event_id: generateId('evt_server'),
    event_name: 'server_connected',
    timestamp: new Date(Date.now() - index * 10000).toISOString(),
    player_id: `ply_${1000 + (index % 500)}`,
    session_id: `ses_${8000 + index}`,
    game_id: 'cyber_nexus_v1',
    platform: 'PC',
    region: 'NA-East',
    app_version: 'v2.4.1',
    server_id: `srv_us_east_${index % 10}`,
    cluster_name: 'us-east-k8s-cluster',
    cpu_percent: parseFloat((25 + Math.random() * 50).toFixed(1)),
    memory_percent: parseFloat((40 + Math.random() * 35).toFixed(1)),
    active_ccu: Math.floor(Math.random() * 500) + 100,
    tick_rate_hz: 60,
    packet_loss_percent: parseFloat((Math.random() * 0.5).toFixed(2)),
  };
}
