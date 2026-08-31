// Dataset Lineage Graph Builder

import { Dataset } from '@/types';
import { Pipeline } from '@/types/pipeline';

export interface LineageNode {
  id: string;
  name: string;
  type: 'Source' | 'Pipeline' | 'Dataset' | 'MLFeature';
  domain?: string;
}

export interface LineageEdge {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
}

export interface LineageGraphData {
  nodes: LineageNode[];
  edges: LineageEdge[];
}

export function buildDatasetLineageGraph(datasets: Dataset[], pipelines: Pipeline[]): LineageGraphData {
  const nodes: LineageNode[] = [];
  const edges: LineageEdge[] = [];

  // Add default pipeline lineage structure:
  // Game Events -> Raw Telemetry -> Clean Telemetry -> Player Sessions -> ML Feature Set -> Churn Prediction
  nodes.push({ id: 'src_game_stream', name: 'Live Game Event Stream', type: 'Source', domain: 'Telemetry' });
  nodes.push({ id: 'pipe_ingest', name: 'Raw Telemetry Ingestion', type: 'Pipeline', domain: 'Telemetry' });
  nodes.push({ id: 'ds_raw_telemetry', name: 'Raw Game Events', type: 'Dataset', domain: 'Telemetry' });
  nodes.push({ id: 'pipe_clean', name: 'Cleaning & Geo Enrichment', type: 'Pipeline', domain: 'Telemetry' });
  nodes.push({ id: 'ds_clean_telemetry', name: 'Curated Telemetry', type: 'Dataset', domain: 'Telemetry' });
  nodes.push({ id: 'pipe_sessions', name: 'Sessionization Pipeline', type: 'Pipeline', domain: 'Gameplay' });
  nodes.push({ id: 'ds_player_sessions', name: 'Player Sessions Aggregates', type: 'Dataset', domain: 'Gameplay' });
  nodes.push({ id: 'pipe_ml', name: 'Feature Engineering Engine', type: 'Pipeline', domain: 'ML' });
  nodes.push({ id: 'ds_ml_features', name: 'Player Features Store', type: 'Dataset', domain: 'ML' });

  // Connect edges
  edges.push({ id: 'e1', sourceId: 'src_game_stream', targetId: 'pipe_ingest', label: 'Raw Stream' });
  edges.push({ id: 'e2', sourceId: 'pipe_ingest', targetId: 'ds_raw_telemetry', label: 'Write Raw' });
  edges.push({ id: 'e3', sourceId: 'ds_raw_telemetry', targetId: 'pipe_clean', label: 'Read Raw' });
  edges.push({ id: 'e4', sourceId: 'pipe_clean', targetId: 'ds_clean_telemetry', label: 'Write Curated' });
  edges.push({ id: 'e5', sourceId: 'ds_clean_telemetry', targetId: 'pipe_sessions', label: 'Aggregate' });
  edges.push({ id: 'e6', sourceId: 'pipe_sessions', targetId: 'ds_player_sessions', label: 'Write Sessions' });
  edges.push({ id: 'e7', sourceId: 'ds_player_sessions', targetId: 'pipe_ml', label: 'Feature Extraction' });
  edges.push({ id: 'e8', sourceId: 'pipe_ml', targetId: 'ds_ml_features', label: 'Write ML Features' });

  return { nodes, edges };
}
