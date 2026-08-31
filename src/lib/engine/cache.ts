// Pipeline Step & Output Cache Manager

import { PipelineNode } from '@/types/pipeline';

interface CacheEntry {
  inputHash: string;
  configHash: string;
  outputRecords: Record<string, any>[];
  cachedAt: string;
}

const memoryCache = new Map<string, CacheEntry>();

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash.toString(36);
}

export function computeStepHash(node: PipelineNode, inputRecords: Record<string, any>[]): { inputHash: string; configHash: string } {
  const inputHash = simpleHash(JSON.stringify(inputRecords.slice(0, 50)));
  const configHash = simpleHash(JSON.stringify(node.config));
  return { inputHash, configHash };
}

export function getCachedOutput(nodeId: string, inputHash: string, configHash: string): Record<string, any>[] | null {
  const entry = memoryCache.get(nodeId);
  if (entry && entry.inputHash === inputHash && entry.configHash === configHash) {
    return entry.outputRecords;
  }
  return null;
}

export function setCachedOutput(nodeId: string, inputHash: string, configHash: string, outputRecords: Record<string, any>[]): void {
  memoryCache.set(nodeId, {
    inputHash,
    configHash,
    outputRecords,
    cachedAt: new Date().toISOString(),
  });
}

export function clearPipelineCache(): void {
  memoryCache.clear();
}
