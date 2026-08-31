// Enrich Node Executor

import { PipelineNode } from '@/types/pipeline';

export function executeEnrichNode(node: PipelineNode, records: Record<string, any>[]): Record<string, any>[] {
  const { enrichType = 'metadata' } = node.config;

  return records.map(row => {
    const copy = { ...row };
    if (enrichType === 'geo_ip') {
      copy.country = row.country || (row.region === 'NA-East' ? 'USA' : row.region === 'EU-Central' ? 'Germany' : 'Japan');
      copy.continent = row.region?.startsWith('NA') ? 'North America' : row.region?.startsWith('EU') ? 'Europe' : 'Asia';
    } else if (enrichType === 'device_info') {
      copy.device_category = row.platform === 'PC' ? 'Desktop' : row.platform === 'iOS' || row.platform === 'Android' ? 'Mobile' : 'Console';
    } else if (enrichType === 'user_segment') {
      const level = Number(row.level || 1);
      copy.user_segment = level >= 50 ? 'Whale' : level >= 20 ? 'Veteran' : 'Rookie';
    } else {
      copy.enriched_at = new Date().toISOString();
      copy.ingest_pipeline_version = 'v2';
    }
    return copy;
  });
}
