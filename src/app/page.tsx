'use client';

import React from 'react';
import { Shell } from '@/components/layout/Shell';
import { useNavigation } from '@/context/NavigationContext';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { ProjectList } from '@/components/projects/ProjectList';
import { SourceRegistry } from '@/components/sources/SourceRegistry';
import { IngestionView } from '@/components/sources/IngestionView';
import { CatalogView } from '@/components/datasets/CatalogView';
import { Canvas } from '@/components/builder/Canvas';
import { RunsTable } from '@/components/runs/RunsTable';
import { ExplorerView } from '@/components/datasets/ExplorerView';
import { SchemaView } from '@/components/datasets/SchemaView';
import { DataQualityView } from '@/components/datasets/DataQualityView';
import { ContractsView } from '@/components/datasets/ContractsView';
import { LineageGraph } from '@/components/lineage/LineageGraph';
import { GeneratorView } from '@/components/telemetry/GeneratorView';
import { StreamingSim } from '@/components/telemetry/StreamingSim';
import { WorkspaceView } from '@/components/sql/WorkspaceView';
import { FeatureWorkspace } from '@/components/ml/FeatureWorkspace';

export default function Home() {
  const { activeView } = useNavigation();

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'projects':
        return <ProjectList />;
      case 'data-sources':
        return <SourceRegistry />;
      case 'ingestion':
        return <IngestionView />;
      case 'pipelines':
      case 'pipeline-builder':
        return <Canvas />;
      case 'pipeline-runs':
        return <RunsTable />;
      case 'datasets':
      case 'data-catalog':
        return <CatalogView />;
      case 'data-explorer':
        return <ExplorerView />;
      case 'schemas':
      case 'schema-registry':
        return <SchemaView />;
      case 'data-quality':
      case 'data-validation':
        return <DataQualityView />;
      case 'data-contracts':
        return <ContractsView />;
      case 'data-lineage':
        return <LineageGraph />;
      case 'game-events':
      case 'telemetry':
      case 'etl-elt':
        return <GeneratorView />;
      case 'streaming-simulation':
      case 'batch-processing':
        return <StreamingSim />;
      case 'sql-workspace':
      case 'query-builder':
      case 'analytics':
        return <WorkspaceView />;
      case 'feature-engineering':
      case 'ml-datasets':
        return <FeatureWorkspace />;
      default:
        return (
          <div className="p-8 text-center border border-slate-800 rounded-2xl bg-slate-900/60 max-w-xl mx-auto my-12">
            <h3 className="text-lg font-semibold text-slate-200 capitalize">
              {activeView.replace(/-/g, ' ')} Module
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              This module is managed by the GameOps AI data pipeline orchestration engine. Select another tab or use Cmd+K to navigate.
            </p>
          </div>
        );
    }
  };

  return <Shell>{renderActiveView()}</Shell>;
}
