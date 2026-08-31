'use client';

import React, { useState } from 'react';
import { Card, CardHeader } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Tabs } from '@/components/common/Tabs';
import { useApp } from '@/context/AppContext';
import { buildDatasetLineageGraph } from '@/lib/lineage/graph';
import { ColumnLineage } from './ColumnLineage';
import { GitBranch, Layers, Database, Workflow, ArrowRight } from 'lucide-react';

export function LineageGraph() {
  const { datasets, pipelines } = useApp();
  const [activeTab, setActiveTab] = useState<'dataset' | 'column'>('dataset');

  const graphData = buildDatasetLineageGraph(datasets, pipelines);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <GitBranch className="w-6 h-6 text-indigo-400" />
            Data Lineage Explorer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            End-to-end dependency tracking from raw game stream events to downstream analytics datasets and ML features
          </p>
        </div>

        <Tabs
          tabs={[
            { id: 'dataset', label: 'Dataset Lineage', icon: <Layers className="w-4 h-4" /> },
            { id: 'column', label: 'Column Lineage', icon: <GitBranch className="w-4 h-4" /> },
          ]}
          activeTab={activeTab}
          onChange={tab => setActiveTab(tab as any)}
        />
      </div>

      {activeTab === 'dataset' ? (
        <Card className="space-y-4">
          <CardHeader title="Dataset Dependency DAG Graph" subtitle="Visual pipeline flow and dataset transformation lineage" />

          <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto custom-scrollbar">
            <div className="flex items-center gap-6 min-w-[900px] py-8 justify-between relative">
              {graphData.nodes.map((node, idx) => (
                <React.Fragment key={node.id}>
                  <div
                    className={`w-44 p-3 rounded-xl border text-center transition-all shadow-lg ${
                      node.type === 'Source'
                        ? 'bg-sky-950/60 border-sky-800/80 text-sky-200'
                        : node.type === 'Pipeline'
                        ? 'bg-indigo-950/60 border-indigo-800/80 text-indigo-200'
                        : 'bg-emerald-950/60 border-emerald-800/80 text-emerald-200'
                    }`}
                  >
                    <Badge
                      variant={
                        node.type === 'Source'
                          ? 'info'
                          : node.type === 'Pipeline'
                          ? 'indigo'
                          : 'success'
                      }
                      size="sm"
                      className="mb-1"
                    >
                      {node.type}
                    </Badge>
                    <h4 className="text-xs font-bold truncate">{node.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">{node.domain}</p>
                  </div>

                  {idx < graphData.nodes.length - 1 && (
                    <div className="flex items-center text-slate-600">
                      <ArrowRight className="w-5 h-5 text-indigo-400 animate-pulse" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </Card>
      ) : (
        <ColumnLineage />
      )}
    </div>
  );
}
