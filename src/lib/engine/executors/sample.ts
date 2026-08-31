// Sample & Split Node Executors

import { PipelineNode } from '@/types/pipeline';

export function executeSampleNode(node: PipelineNode, records: Record<string, any>[]): Record<string, any>[] {
  const { sampleMethod = 'random', sampleSize = 100 } = node.config;
  if (records.length <= sampleSize) return records;

  if (sampleMethod === 'percentage') {
    const ratio = Math.min(Math.max(sampleSize / 100, 0), 1);
    const count = Math.floor(records.length * ratio);
    return records.slice(0, count);
  }

  // Random sampling
  const shuffled = [...records].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, sampleSize);
}

export function executeSplitNode(node: PipelineNode, records: Record<string, any>[]): Record<string, any>[] {
  const { trainRatio = 0.7, valRatio = 0.15, testRatio = 0.15 } = node.config;

  const total = records.length;
  const trainCount = Math.floor(total * trainRatio);
  const valCount = Math.floor(total * valRatio);

  return records.map((row, idx) => {
    let split = 'train';
    if (idx >= trainCount && idx < trainCount + valCount) {
      split = 'validation';
    } else if (idx >= trainCount + valCount) {
      split = 'test';
    }
    return { ...row, dataset_split: split };
  });
}
