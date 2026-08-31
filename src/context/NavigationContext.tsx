'use client';

import React, { createContext, useContext, useState } from 'react';

export type ActiveModuleView =
  | 'dashboard'
  | 'projects'
  | 'data-sources'
  | 'ingestion'
  | 'pipelines'
  | 'pipeline-builder'
  | 'pipeline-runs'
  | 'datasets'
  | 'data-explorer'
  | 'transformations'
  | 'data-quality'
  | 'schemas'
  | 'schema-registry'
  | 'data-validation'
  | 'feature-engineering'
  | 'game-events'
  | 'telemetry'
  | 'etl-elt'
  | 'streaming-simulation'
  | 'batch-processing'
  | 'data-lineage'
  | 'data-catalog'
  | 'sql-workspace'
  | 'query-builder'
  | 'analytics'
  | 'data-contracts'
  | 'scheduling'
  | 'monitoring'
  | 'logs'
  | 'alerts'
  | 'cost-simulation'
  | 'ml-datasets'
  | 'exports-backup'
  | 'teams'
  | 'tasks'
  | 'audit-logs'
  | 'documentation'
  | 'settings';

interface NavigationContextType {
  activeView: ActiveModuleView;
  setActiveView: (view: ActiveModuleView) => void;
  selectedPipelineId: string | null;
  setSelectedPipelineId: (id: string | null) => void;
  selectedDatasetId: string | null;
  setSelectedDatasetId: (id: string | null) => void;
  selectedRunId: string | null;
  setSelectedRunId: (id: string | null) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  navigateToPipelineBuilder: (pipelineId?: string) => void;
  navigateToDatasetExplorer: (datasetId?: string) => void;
  navigateToRunDetails: (runId: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [activeView, setActiveView] = useState<ActiveModuleView>('dashboard');
  const [selectedPipelineId, setSelectedPipelineId] = useState<string | null>(null);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(null);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const navigateToPipelineBuilder = (pipelineId?: string) => {
    if (pipelineId) setSelectedPipelineId(pipelineId);
    setActiveView('pipeline-builder');
  };

  const navigateToDatasetExplorer = (datasetId?: string) => {
    if (datasetId) setSelectedDatasetId(datasetId);
    setActiveView('data-explorer');
  };

  const navigateToRunDetails = (runId: string) => {
    setSelectedRunId(runId);
    setActiveView('pipeline-runs');
  };

  return (
    <NavigationContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedPipelineId,
        setSelectedPipelineId,
        selectedDatasetId,
        setSelectedDatasetId,
        selectedRunId,
        setSelectedRunId,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        navigateToPipelineBuilder,
        navigateToDatasetExplorer,
        navigateToRunDetails,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
