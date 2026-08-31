'use client';

import React from 'react';
import { PipelineRun, TaskRun } from '@/types/pipeline';
import { Card, CardHeader } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { PlaySquare, Clock, CheckCircle2, AlertOctagon, Terminal, ArrowLeft } from 'lucide-react';
import { formatDurationMs, formatDateTime } from '@/lib/utils/formatters';

export interface RunDetailsProps {
  run: PipelineRun;
  onBack: () => void;
}

export function RunDetails({ run, onBack }: RunDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" icon={<ArrowLeft className="w-4 h-4" />} onClick={onBack}>
            Back to Runs
          </Button>
          <div>
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <PlaySquare className="w-6 h-6 text-indigo-400" />
              Pipeline Run #{run.id.slice(-8)}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Pipeline: <span className="text-slate-200 font-semibold">{run.pipelineName}</span> • Version v{run.version}
            </p>
          </div>
        </div>

        <Badge variant={run.status === 'Succeeded' ? 'success' : run.status === 'Failed' ? 'danger' : 'warning'} size="md">
          {run.status}
        </Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-slate-400">Duration</p>
          <p className="text-xl font-bold text-slate-100 font-mono mt-1">{formatDurationMs(run.durationMs)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-400">Records Processed</p>
          <p className="text-xl font-bold text-slate-100 font-mono mt-1">{run.recordsProcessed.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-400">Cache Status</p>
          <p className="text-xl font-bold text-slate-100 mt-1">{run.cacheHit ? 'Cache Hit ⚡' : 'Cache Miss'}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-400">Triggered By</p>
          <p className="text-xl font-bold text-slate-100 mt-1 truncate">{run.triggeredBy}</p>
        </Card>
      </div>

      {/* Task Execution DAG Graph List */}
      <Card>
        <CardHeader title="Task Execution Order" subtitle={`Showing ${run.tasks.length} executed DAG task steps`} />

        <div className="space-y-4">
          {run.tasks.map((task, idx) => (
            <div key={task.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 text-xs font-mono font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100">{task.nodeLabel}</h4>
                    <p className="text-xs text-slate-500 font-mono">Type: {task.nodeType}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right text-xs">
                    <p className="text-slate-300 font-mono">{task.recordsIn} in → {task.recordsOut} out</p>
                    <p className="text-slate-500 font-mono">{task.durationMs}ms</p>
                  </div>
                  <Badge variant={task.status === 'Succeeded' ? 'success' : 'danger'} size="sm">
                    {task.status}
                  </Badge>
                </div>
              </div>

              {/* Task Log Lines */}
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 space-y-1">
                {task.logs.map((line, i) => (
                  <p key={i} className="text-slate-400">
                    <span className="text-indigo-400 mr-2">&gt;</span>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
