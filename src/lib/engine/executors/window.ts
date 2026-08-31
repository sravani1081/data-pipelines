// Window Node Executor (Sliding and Tumbling Time Windows)

import { PipelineNode } from '@/types/pipeline';

export function executeWindowNode(node: PipelineNode, records: Record<string, any>[]): Record<string, any>[] {
  const { windowType = 'tumbling', windowSizeMinutes = 60, timestampField = 'timestamp' } = node.config;
  const windowMs = windowSizeMinutes * 60 * 1000;

  return records.map(row => {
    const rawTs = row[timestampField] || row['created_at'] || new Date().toISOString();
    const timeMs = new Date(rawTs).getTime();

    const windowStart = new Date(Math.floor(timeMs / windowMs) * windowMs).toISOString();
    const windowEnd = new Date(Math.floor(timeMs / windowMs) * windowMs + windowMs).toISOString();

    return {
      ...row,
      window_start: windowStart,
      window_end: windowEnd,
      window_type: windowType,
    };
  });
}
