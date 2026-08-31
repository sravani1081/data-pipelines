'use client';

import React, { useState } from 'react';
import { Card, CardHeader } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { useApp } from '@/context/AppContext';
import { ProjectModal } from './ProjectModal';
import { FolderKanban, Plus, Database, GitMerge, Layers, Clock, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils/formatters';

export function ProjectList() {
  const { projects, activeProject, setActiveProject } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-indigo-400" />
            Data Engineering Projects
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage domain projects, assigned data pipelines, schemas, and metrics
          </p>
        </div>

        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
          New Project
        </Button>
      </div>

      {/* Grid of Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(proj => {
          const isCurrent = activeProject?.id === proj.id;
          return (
            <Card
              key={proj.id}
              hoverable
              className={`flex flex-col justify-between cursor-pointer border ${
                isCurrent ? 'border-indigo-500/80 shadow-indigo-500/10' : 'border-slate-800'
              }`}
              onClick={() => setActiveProject(proj)}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                      {proj.name}
                      {isCurrent && <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-mono">Active Context</span>}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{proj.description}</p>
                  </div>
                  <Badge variant={proj.environment === 'Production' ? 'success' : 'warning'} size="sm">
                    {proj.environment}
                  </Badge>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {proj.tags.map((t, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1" title="Data Sources">
                    <Database className="w-3.5 h-3.5 text-sky-400" />
                    {proj.dataSourceIds.length}
                  </span>
                  <span className="flex items-center gap-1" title="Pipelines">
                    <GitMerge className="w-3.5 h-3.5 text-indigo-400" />
                    {proj.pipelineIds.length}
                  </span>
                  <span className="flex items-center gap-1" title="Datasets">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                    {proj.datasetIds.length}
                  </span>
                </div>

                <span className="text-[11px] text-slate-500">{formatDate(proj.createdAt)}</span>
              </div>
            </Card>
          );
        })}
      </div>

      <ProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
