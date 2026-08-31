// Data Export, Local Backup and Restore Logic

import { clearDatabase, getAllEntities, saveEntities } from './indexedDb';
import {
  INITIAL_PROJECTS,
  INITIAL_DATA_SOURCES,
  INITIAL_SCHEMAS,
  INITIAL_DATASETS,
  INITIAL_PIPELINES,
  INITIAL_PIPELINE_RUNS,
  INITIAL_ALERTS,
  INITIAL_LOGS,
  INITIAL_TASKS,
  INITIAL_AUDIT_LOGS,
  INITIAL_USERS,
  INITIAL_TEAMS,
} from './seedData';
import { exportToJSON } from '../utils/helpers';

export interface FullBackupPayload {
  version: string;
  timestamp: string;
  projects: any[];
  dataSources: any[];
  schemas: any[];
  datasets: any[];
  pipelines: any[];
  pipelineRuns: any[];
  alerts: any[];
  logs: any[];
  tasks: any[];
  auditLogs: any[];
  users: any[];
  teams: any[];
}

export async function createFullBackup(): Promise<FullBackupPayload> {
  const [projects, dataSources, schemas, datasets, pipelines, pipelineRuns, alerts, logs, tasks, auditLogs] = await Promise.all([
    getAllEntities('projects'),
    getAllEntities('dataSources'),
    getAllEntities('schemas'),
    getAllEntities('datasets'),
    getAllEntities('pipelines'),
    getAllEntities('pipelineRuns'),
    getAllEntities('alerts'),
    getAllEntities('logs'),
    getAllEntities('tasks'),
    getAllEntities('auditLogs'),
  ]);

  return {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    projects: projects.length > 0 ? projects : INITIAL_PROJECTS,
    dataSources: dataSources.length > 0 ? dataSources : INITIAL_DATA_SOURCES,
    schemas: schemas.length > 0 ? schemas : INITIAL_SCHEMAS,
    datasets: datasets.length > 0 ? datasets : INITIAL_DATASETS,
    pipelines: pipelines.length > 0 ? pipelines : INITIAL_PIPELINES,
    pipelineRuns: pipelineRuns.length > 0 ? pipelineRuns : INITIAL_PIPELINE_RUNS,
    alerts: alerts.length > 0 ? alerts : INITIAL_ALERTS,
    logs: logs.length > 0 ? logs : INITIAL_LOGS,
    tasks: tasks.length > 0 ? tasks : INITIAL_TASKS,
    auditLogs: auditLogs.length > 0 ? auditLogs : INITIAL_AUDIT_LOGS,
    users: INITIAL_USERS,
    teams: INITIAL_TEAMS,
  };
}

export async function downloadBackupFile(): Promise<void> {
  const backup = await createFullBackup();
  const dateStr = new Date().toISOString().split('T')[0];
  exportToJSON(`GameOps_Backup_${dateStr}.json`, backup);
}

export async function restoreBackupData(backupData: FullBackupPayload): Promise<void> {
  await clearDatabase();
  if (backupData.projects?.length) await saveEntities('projects', backupData.projects);
  if (backupData.dataSources?.length) await saveEntities('dataSources', backupData.dataSources);
  if (backupData.schemas?.length) await saveEntities('schemas', backupData.schemas);
  if (backupData.datasets?.length) await saveEntities('datasets', backupData.datasets);
  if (backupData.pipelines?.length) await saveEntities('pipelines', backupData.pipelines);
  if (backupData.pipelineRuns?.length) await saveEntities('pipelineRuns', backupData.pipelineRuns);
  if (backupData.alerts?.length) await saveEntities('alerts', backupData.alerts);
  if (backupData.logs?.length) await saveEntities('logs', backupData.logs);
  if (backupData.tasks?.length) await saveEntities('tasks', backupData.tasks);
  if (backupData.auditLogs?.length) await saveEntities('auditLogs', backupData.auditLogs);
}

export async function resetToDefaultSeed(): Promise<void> {
  await clearDatabase();
  await saveEntities('projects', INITIAL_PROJECTS);
  await saveEntities('dataSources', INITIAL_DATA_SOURCES);
  await saveEntities('schemas', INITIAL_SCHEMAS);
  await saveEntities('datasets', INITIAL_DATASETS);
  await saveEntities('pipelines', INITIAL_PIPELINES);
  await saveEntities('pipelineRuns', INITIAL_PIPELINE_RUNS);
  await saveEntities('alerts', INITIAL_ALERTS);
  await saveEntities('logs', INITIAL_LOGS);
  await saveEntities('tasks', INITIAL_TASKS);
  await saveEntities('auditLogs', INITIAL_AUDIT_LOGS);
}
