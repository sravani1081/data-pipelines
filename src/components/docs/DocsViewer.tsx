'use client';

import React, { useState } from 'react';
import { Card, CardHeader } from '@/components/common/Card';
import { BookOpen, Search, Code, Workflow, ShieldCheck, Database, Terminal } from 'lucide-react';

export function DocsViewer() {
  const [selectedArticle, setSelectedArticle] = useState('getting-started');

  const articles = [
    { id: 'getting-started', title: 'Getting Started with GameOps AI', category: 'Foundation' },
    { id: 'projects', title: 'Managing Projects & Environments', category: 'Foundation' },
    { id: 'data-sources', title: 'Data Source Registry & Connectors', category: 'Ingestion' },
    { id: 'telemetry-generator', title: 'Synthetic Game Telemetry Generator', category: 'Game Data' },
    { id: 'pipeline-builder', title: 'Visual DAG Pipeline Builder', category: 'Orchestration' },
    { id: 'execution-engine', title: 'Local Topological Execution Engine', category: 'Orchestration' },
    { id: 'schema-registry', title: 'Schema Registry & Evolution Diffs', category: 'Data Quality' },
    { id: 'data-quality', title: 'Data Quality Profiling & Scoring', category: 'Data Quality' },
    { id: 'data-contracts', title: 'Data Contracts & SLA Violations', category: 'Data Quality' },
    { id: 'data-lineage', title: 'Dataset & Column Lineage Graph', category: 'Lineage' },
    { id: 'sql-workspace', title: 'Local SQL Workspace & Query Builder', category: 'Analytics' },
    { id: 'feature-engineering', title: 'ML Feature Store & Training Datasets', category: 'AI & ML' },
    { id: 'streaming-sim', title: 'Real-time Streaming Simulation', category: 'Observability' },
    { id: 'observability', title: 'Pipeline Monitoring & Alert Rules', category: 'Observability' },
    { id: 'cost-calculator', title: 'Synthetic Cost Calculator', category: 'Observability' },
    { id: 'teams-roles', title: 'Team Management & Role Control', category: 'Governance' },
    { id: 'audit-logs', title: 'Security & Change Audit Trail', category: 'Governance' },
    { id: 'backup-restore', title: 'Local Backup & JSON Export', category: 'Governance' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-rose-400" />
            Platform Documentation & API Guides
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete technical reference for GameOps AI Data Pipelines architecture, nodes, schemas, and query syntax
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation List */}
        <Card className="lg:col-span-1 p-3 space-y-1">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase px-3 mb-2">GUIDE ARTICLES</h4>
          {articles.map(art => (
            <button
              key={art.id}
              onClick={() => setSelectedArticle(art.id)}
              className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                selectedArticle === art.id ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {art.title}
            </button>
          ))}
        </Card>

        {/* Article Reader */}
        <Card className="lg:col-span-3 space-y-4">
          <CardHeader
            title={articles.find(a => a.id === selectedArticle)?.title || 'Documentation Guide'}
            subtitle={`Category: ${articles.find(a => a.id === selectedArticle)?.category}`}
          />

          <div className="prose prose-invert max-w-none text-xs text-slate-300 space-y-4 leading-relaxed font-sans">
            <p className="text-sm font-semibold text-slate-200">
              Overview of {articles.find(a => a.id === selectedArticle)?.title} in GameOps AI Data Pipelines.
            </p>
            <p>
              GameOps AI provides a zero-secret, local-first platform for game telemetry ingestion, ETL/ELT pipeline orchestration, schema contract enforcement, and ML dataset construction.
            </p>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-emerald-400 space-y-1">
              <p className="text-slate-500">// Example Local Pipeline Execution snippet</p>
              <p>const plan = buildExecutionPlan(pipeline.nodes, pipeline.edges);</p>
              <p>const result = await runPipelineEngine(pipeline, datasets);</p>
              <p>console.log("Run Result:", result.run.status, result.run.recordsProcessed);</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
