// IndexedDB Persistence Layer for GameOps AI Data Pipelines

import { openDB, DBSchema, IDBPDatabase, StoreNames } from 'idb';
import { Project, DataSource, Schema, Dataset } from '@/types';
import { Pipeline, PipelineRun } from '@/types/pipeline';
import { ValidationRule, DataContract, RejectedRecord } from '@/types/quality';
import { SystemAlert, PipelineLogEntry, ProjectTask, AuditEvent } from '@/types/observability';
import { FeatureSet, MLDatasetConfig } from '@/types/ml';

export interface GameOpsDBSchema extends DBSchema {
  projects: { key: string; value: Project };
  dataSources: { key: string; value: DataSource };
  schemas: { key: string; value: Schema };
  datasets: { key: string; value: Dataset };
  pipelines: { key: string; value: Pipeline };
  pipelineRuns: { key: string; value: PipelineRun };
  validationRules: { key: string; value: ValidationRule };
  dataContracts: { key: string; value: DataContract };
  rejectedRecords: { key: string; value: RejectedRecord };
  alerts: { key: string; value: SystemAlert };
  logs: { key: string; value: PipelineLogEntry };
  featureSets: { key: string; value: FeatureSet };
  mlDatasets: { key: string; value: MLDatasetConfig };
  tasks: { key: string; value: ProjectTask };
  auditLogs: { key: string; value: AuditEvent };
}

export type GameOpsStoreName = StoreNames<GameOpsDBSchema>;

const DB_NAME = 'GameOpsDataPipelinesDB';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<GameOpsDBSchema>> | null = null;

function getDB() {
  if (typeof window === 'undefined') return null;
  if (!dbPromise) {
    dbPromise = openDB<GameOpsDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const storeNames: GameOpsStoreName[] = [
          'projects',
          'dataSources',
          'schemas',
          'datasets',
          'pipelines',
          'pipelineRuns',
          'validationRules',
          'dataContracts',
          'rejectedRecords',
          'alerts',
          'logs',
          'featureSets',
          'mlDatasets',
          'tasks',
          'auditLogs',
        ];

        storeNames.forEach(store => {
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store, { keyPath: 'id' });
          }
        });
      },
    });
  }
  return dbPromise;
}

export async function saveEntity<T extends { id: string }>(storeName: GameOpsStoreName, item: T): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.put(storeName, item as any);
}

export async function saveEntities<T extends { id: string }>(storeName: GameOpsStoreName, items: T[]): Promise<void> {
  const db = await getDB();
  if (!db) return;
  const tx = db.transaction(storeName, 'readwrite');
  await Promise.all(items.map(item => tx.store.put(item as any)));
  await tx.done;
}

export async function getAllEntities<T>(storeName: GameOpsStoreName): Promise<T[]> {
  const db = await getDB();
  if (!db) return [];
  return (await db.getAll(storeName)) as T[];
}

export async function getEntityById<T>(storeName: GameOpsStoreName, id: string): Promise<T | undefined> {
  const db = await getDB();
  if (!db) return undefined;
  return (await db.get(storeName, id)) as T | undefined;
}

export async function deleteEntity(storeName: GameOpsStoreName, id: string): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.delete(storeName, id);
}

export async function clearDatabase(): Promise<void> {
  const db = await getDB();
  if (!db) return;
  const storeNames = Array.from(db.objectStoreNames) as GameOpsStoreName[];
  const tx = db.transaction(storeNames, 'readwrite');
  await Promise.all(storeNames.map(store => tx.objectStore(store).clear()));
  await tx.done;
}

