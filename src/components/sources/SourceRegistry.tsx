'use client';

import React, { useState } from 'react';
import { Card, CardHeader } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { useApp } from '@/context/AppContext';
import { useNavigation } from '@/context/NavigationContext';
import { SourceModal } from './SourceModal';
import { Database, Plus, RefreshCw, Radio, FileText, CheckCircle2, Clock, Upload } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils/formatters';

export function SourceRegistry() {
  const { dataSources, activeProject } = useApp();
  const { setActiveView } = useNavigation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const projectSources = dataSources.filter(s => !activeProject || s.projectId === activeProject.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Database className="w-6 h-6 text-sky-400" />
            Data Source Registry
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Registered game telemetry feeds, local log files, NDJSON streams, and synthetic data generators
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" icon={<Upload className="w-4 h-4" />} onClick={() => setActiveView('ingestion')}>
            Import File
          </Button>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
            Add Data Source
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader title="Configured Sources" subtitle={`Showing ${projectSources.length} data sources`} />

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Source Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Record Count</th>
                <th className="py-3 px-4">Frequency</th>
                <th className="py-3 px-4">Last Ingested</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {projectSources.map(source => (
                <tr key={source.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-100 flex items-center gap-2">
                    <Database className="w-4 h-4 text-sky-400 shrink-0" />
                    {source.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">{source.type}</td>
                  <td className="py-3 px-4">
                    <Badge variant={source.status === 'active' ? 'success' : 'warning'} size="sm" dot>
                      {source.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-200">{source.recordCount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-slate-400">{source.frequency}</td>
                  <td className="py-3 px-4 text-slate-400">{formatRelativeTime(source.lastIngestionAt)}</td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[11px] py-1 px-2.5"
                      onClick={() => setActiveView('ingestion')}
                    >
                      Ingest Now
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <SourceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
