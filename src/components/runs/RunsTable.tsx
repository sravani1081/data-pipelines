'use client';

import React, { useState } from 'react';
import { Card, CardHeader } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { useApp } from '@/context/AppContext';
import { useNavigation } from '@/context/NavigationContext';
import { RunDetails } from './RunDetails';
import { PlaySquare, Eye, RefreshCw, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { formatDurationMs, formatRelativeTime } from '@/lib/utils/formatters';

export function RunsTable() {
  const { pipelineRuns, activeProject } = useApp();
  const { selectedRunId, setSelectedRunId } = useNavigation();

  const projectRuns = pipelineRuns.filter(r => !activeProject || r.projectId === activeProject.id);

  const selectedRunObj = pipelineRuns.find(r => r.id === selectedRunId);

  if (selectedRunObj) {
    return <RunDetails run={selectedRunObj} onBack={() => setSelectedRunId(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <PlaySquare className="w-6 h-6 text-indigo-400" />
            Pipeline Runs History
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time execution log of batch and streaming pipeline runs with per-task duration breakdowns
          </p>
        </div>
      </div>

      <Card>
        <CardHeader title="All Execution Runs" subtitle={`Showing ${projectRuns.length} total runs`} />

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Run ID</th>
                <th className="py-3 px-4">Pipeline</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Records</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Triggered By</th>
                <th className="py-3 px-4">Cache</th>
                <th className="py-3 px-4">Started</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {projectRuns.map(run => (
                <tr key={run.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-indigo-400">#{run.id.slice(-8)}</td>
                  <td className="py-3 px-4 font-semibold text-slate-100">{run.pipelineName}</td>
                  <td className="py-3 px-4">
                    <Badge variant={run.status === 'Succeeded' ? 'success' : run.status === 'Failed' ? 'danger' : 'warning'} size="sm">
                      {run.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-200">{run.recordsProcessed.toLocaleString()}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{formatDurationMs(run.durationMs)}</td>
                  <td className="py-3 px-4 text-slate-400">{run.triggeredBy}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{run.cacheHit ? 'Hit ⚡' : 'Miss'}</td>
                  <td className="py-3 px-4 text-slate-400">{formatRelativeTime(run.startedAt)}</td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Eye className="w-3.5 h-3.5" />}
                      onClick={() => setSelectedRunId(run.id)}
                    >
                      View Tasks
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
