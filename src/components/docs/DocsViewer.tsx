'use client';

import React, { useState } from 'react';
import { Card, CardHeader } from '@/components/common/Card';
import { PIPELINE_BUILDER_GUIDE } from '@/lib/docs/articles/pipelineDoc';
import { DATA_QUALITY_GUIDE } from '@/lib/docs/articles/qualityDoc';
import { SQL_WORKSPACE_GUIDE } from '@/lib/docs/articles/sqlDoc';
import { ML_FEATURE_GUIDE } from '@/lib/docs/articles/mlDoc';
import { BookOpen, Search, Code, Workflow, ShieldCheck, Database, Terminal } from 'lucide-react';

export function DocsViewer() {
  const [selectedArticle, setSelectedArticle] = useState('pipeline-builder');

  const articles = [
    { id: 'pipeline-builder', title: 'Visual DAG Pipeline Builder & Orchestration', category: 'Orchestration', content: PIPELINE_BUILDER_GUIDE },
    { id: 'schema-registry', title: 'Schema Registry & Evolution Diffs', category: 'Data Quality', content: DATA_QUALITY_GUIDE },
    { id: 'sql-workspace', title: 'Local SQL Workspace & Query Builder Syntax', category: 'Analytics', content: SQL_WORKSPACE_GUIDE },
    { id: 'feature-engineering', title: 'ML Feature Store & Feature Engineering', category: 'AI & ML', content: ML_FEATURE_GUIDE },
  ];

  const currentArt = articles.find(a => a.id === selectedArticle) || articles[0];

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
            title={currentArt.title}
            subtitle={`Category: ${currentArt.category}`}
          />

          <div className="prose prose-invert max-w-none text-xs text-slate-300 space-y-4 leading-relaxed font-mono whitespace-pre-wrap bg-slate-950 p-4 rounded-xl border border-slate-800">
            {currentArt.content}
          </div>
        </Card>
      </div>
    </div>
  );
}
