'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Project, DataSource, Schema, Dataset, User, Team } from '@/types';
import { Pipeline, PipelineRun } from '@/types/pipeline';
import { ValidationRule, DataContract, RejectedRecord } from '@/types/quality';
import { SystemAlert, PipelineLogEntry, ProjectTask, AuditEvent } from '@/types/observability';
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
} from '@/lib/storage/seedData';
import { saveEntity, getAllEntities, saveEntities } from '@/lib/storage/indexedDb';
import { generateId } from '@/lib/utils/helpers';

interface AppContextType {
  activeProject: Project | null;
  setActiveProject: (project: Project | null) => void;
  projects: Project[];
  dataSources: DataSource[];
  schemas: Schema[];
  datasets: Dataset[];
  pipelines: Pipeline[];
  pipelineRuns: PipelineRun[];
  alerts: SystemAlert[];
  logs: PipelineLogEntry[];
  tasks: ProjectTask[];
  auditLogs: AuditEvent[];
  users: User[];
  teams: Team[];
  isLoaded: boolean;

  // Mutators
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Project>;
  updateProject: (project: Project) => Promise<void>;
  createDataSource: (source: Omit<DataSource, 'id' | 'createdAt' | 'updatedAt'>) => Promise<DataSource>;
  createPipeline: (pipeline: Omit<Pipeline, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Pipeline>;
  updatePipeline: (pipeline: Pipeline) => Promise<void>;
  saveDataset: (dataset: Dataset) => Promise<void>;
  addPipelineRun: (run: PipelineRun) => Promise<void>;
  addAuditLog: (action: AuditEvent['action'], resourceType: AuditEvent['resourceType'], resourceId: string, details: string) => Promise<void>;
  addLogEntry: (level: PipelineLogEntry['level'], message: string, pipelineId: string, pipelineName: string, runId: string) => Promise<void>;
  addAlert: (title: string, message: string, severity: SystemAlert['severity'], targetName: string, projectId: string) => Promise<void>;
  resolveAlert: (alertId: string) => Promise<void>;
  reloadState: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [activeProject, setActiveProject] = useState<Project | null>(INITIAL_PROJECTS[0]);
  const [dataSources, setDataSources] = useState<DataSource[]>(INITIAL_DATA_SOURCES);
  const [schemas, setSchemas] = useState<Schema[]>(INITIAL_SCHEMAS);
  const [datasets, setDatasets] = useState<Dataset[]>(INITIAL_DATASETS);
  const [pipelines, setPipelines] = useState<Pipeline[]>(INITIAL_PIPELINES);
  const [pipelineRuns, setPipelineRuns] = useState<PipelineRun[]>(INITIAL_PIPELINE_RUNS);
  const [alerts, setAlerts] = useState<SystemAlert[]>(INITIAL_ALERTS);
  const [logs, setLogs] = useState<PipelineLogEntry[]>(INITIAL_LOGS);
  const [tasks, setTasks] = useState<ProjectTask[]>(INITIAL_TASKS);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(INITIAL_AUDIT_LOGS);
  const [users] = useState<User[]>(INITIAL_USERS);
  const [teams] = useState<Team[]>(INITIAL_TEAMS);
  const [isLoaded, setIsLoaded] = useState(false);

  const reloadState = useCallback(async () => {
    try {
      const [dbProj, dbSrc, dbSch, dbDs, dbPipe, dbRuns, dbAlt, dbLogs, dbTasks, dbAudit] = await Promise.all([
        getAllEntities<Project>('projects'),
        getAllEntities<DataSource>('dataSources'),
        getAllEntities<Schema>('schemas'),
        getAllEntities<Dataset>('datasets'),
        getAllEntities<Pipeline>('pipelines'),
        getAllEntities<PipelineRun>('pipelineRuns'),
        getAllEntities<SystemAlert>('alerts'),
        getAllEntities<PipelineLogEntry>('logs'),
        getAllEntities<ProjectTask>('tasks'),
        getAllEntities<AuditEvent>('auditLogs'),
      ]);

      if (dbProj.length > 0) {
        setProjects(dbProj);
        setActiveProject(dbProj[0]);
      } else {
        await saveEntities('projects', INITIAL_PROJECTS);
      }

      if (dbSrc.length > 0) setDataSources(dbSrc);
      else await saveEntities('dataSources', INITIAL_DATA_SOURCES);

      if (dbSch.length > 0) setSchemas(dbSch);
      else await saveEntities('schemas', INITIAL_SCHEMAS);

      if (dbDs.length > 0) setDatasets(dbDs);
      else await saveEntities('datasets', INITIAL_DATASETS);

      if (dbPipe.length > 0) setPipelines(dbPipe);
      else await saveEntities('pipelines', INITIAL_PIPELINES);

      if (dbRuns.length > 0) setPipelineRuns(dbRuns);
      else await saveEntities('pipelineRuns', INITIAL_PIPELINE_RUNS);

      if (dbAlt.length > 0) setAlerts(dbAlt);
      else await saveEntities('alerts', INITIAL_ALERTS);

      if (dbLogs.length > 0) setLogs(dbLogs);
      else await saveEntities('logs', INITIAL_LOGS);

      if (dbTasks.length > 0) setTasks(dbTasks);
      else await saveEntities('tasks', INITIAL_TASKS);

      if (dbAudit.length > 0) setAuditLogs(dbAudit);
      else await saveEntities('auditLogs', INITIAL_AUDIT_LOGS);
    } catch (err) {
      console.warn('Using seed fallback due to storage initialization:', err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    reloadState();
  }, [reloadState]);

  const createProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
    const newProj: Project = {
      ...projectData,
      id: generateId('proj'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProjects(prev => [newProj, ...prev]);
    setActiveProject(newProj);
    await saveEntity('projects', newProj);
    await addAuditLog('Pipeline created', 'project', newProj.id, `Created project ${newProj.name}`);
    return newProj;
  };

  const updateProject = async (proj: Project) => {
    const updated = { ...proj, updatedAt: new Date().toISOString() };
    setProjects(prev => prev.map(p => (p.id === proj.id ? updated : p)));
    if (activeProject?.id === proj.id) setActiveProject(updated);
    await saveEntity('projects', updated);
  };

  const createDataSource = async (srcData: Omit<DataSource, 'id' | 'createdAt' | 'updatedAt'>): Promise<DataSource> => {
    const newSrc: DataSource = {
      ...srcData,
      id: generateId('src'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDataSources(prev => [newSrc, ...prev]);
    await saveEntity('dataSources', newSrc);
    return newSrc;
  };

  const createPipeline = async (pipeData: Omit<Pipeline, 'id' | 'createdAt' | 'updatedAt'>): Promise<Pipeline> => {
    const newPipe: Pipeline = {
      ...pipeData,
      id: generateId('pipe'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPipelines(prev => [newPipe, ...prev]);
    await saveEntity('pipelines', newPipe);
    await addAuditLog('Pipeline created', 'pipeline', newPipe.id, `Created pipeline ${newPipe.name}`);
    return newPipe;
  };

  const updatePipeline = async (pipe: Pipeline) => {
    const updated = { ...pipe, updatedAt: new Date().toISOString() };
    setPipelines(prev => prev.map(p => (p.id === pipe.id ? updated : p)));
    await saveEntity('pipelines', updated);
  };

  const saveDataset = async (ds: Dataset) => {
    const updated = { ...ds, updatedAt: new Date().toISOString() };
    setDatasets(prev => {
      const idx = prev.findIndex(item => item.id === ds.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      }
      return [updated, ...prev];
    });
    await saveEntity('datasets', updated);
  };

  const addPipelineRun = async (run: PipelineRun) => {
    setPipelineRuns(prev => [run, ...prev]);
    await saveEntity('pipelineRuns', run);
    await addAuditLog('Pipeline executed', 'pipeline', run.pipelineId, `Executed run ${run.id} with status ${run.status}`);
  };

  const addAuditLog = async (action: AuditEvent['action'], resourceType: AuditEvent['resourceType'], resourceId: string, details: string) => {
    const event: AuditEvent = {
      id: generateId('aud'),
      timestamp: new Date().toISOString(),
      userId: 'usr_alex',
      userName: 'Alex Vance',
      action,
      resourceType,
      resourceId,
      details,
    };
    setAuditLogs(prev => [event, ...prev]);
    await saveEntity('auditLogs', event);
  };

  const addLogEntry = async (level: PipelineLogEntry['level'], message: string, pipelineId: string, pipelineName: string, runId: string) => {
    const entry: PipelineLogEntry = {
      id: generateId('log'),
      timestamp: new Date().toISOString(),
      pipelineId,
      pipelineName,
      runId,
      level,
      message,
    };
    setLogs(prev => [entry, ...prev]);
    await saveEntity('logs', entry);
  };

  const addAlert = async (title: string, message: string, severity: SystemAlert['severity'], targetName: string, projectId: string) => {
    const newAlt: SystemAlert = {
      id: generateId('alt'),
      ruleId: 'rule_gen',
      ruleName: title,
      projectId,
      severity,
      title,
      message,
      targetName,
      triggeredAt: new Date().toISOString(),
      status: 'active',
    };
    setAlerts(prev => [newAlt, ...prev]);
    await saveEntity('alerts', newAlt);
  };

  const resolveAlert = async (alertId: string) => {
    setAlerts(prev => prev.map(a => (a.id === alertId ? { ...a, status: 'resolved', resolvedAt: new Date().toISOString() } : a)));
    const target = alerts.find(a => a.id === alertId);
    if (target) {
      await saveEntity('alerts', { ...target, status: 'resolved', resolvedAt: new Date().toISOString() });
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeProject,
        setActiveProject,
        projects,
        dataSources,
        schemas,
        datasets,
        pipelines,
        pipelineRuns,
        alerts,
        logs,
        tasks,
        auditLogs,
        users,
        teams,
        isLoaded,
        createProject,
        updateProject,
        createDataSource,
        createPipeline,
        updatePipeline,
        saveDataset,
        addPipelineRun,
        addAuditLog,
        addLogEntry,
        addAlert,
        resolveAlert,
        reloadState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
