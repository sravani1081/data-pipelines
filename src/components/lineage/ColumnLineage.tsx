'use client';

import React from 'react';
import { DEMO_COLUMN_TRACES } from '@/lib/lineage/columnLineage';
import { Card, CardHeader } from '@/components/common/Card';
import { ArrowRight, Cpu, GitBranch, Layers } from 'lucide-react';

export function ColumnLineage() {
  return (
    <Card className="space-y-4">
      <CardHeader
        title="Field-Level Column Lineage"
        subtitle="Trace column transformations from raw stream fields to downstream analytics features"
      />

      <div className="space-y-4">
        {DEMO_COLUMN_TRACES.map((trace, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2 py-1 bg-sky-950 text-sky-400 rounded border border-sky-800/60 font-semibold">
                  {trace.sourceDataset}.{trace.sourceColumn}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
                <span className="px-2 py-1 bg-purple-950 text-purple-400 rounded border border-purple-800/60 font-semibold">
                  {trace.targetDataset}.{trace.targetColumn}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono space-y-1.5">
              {trace.transformations.map((step, sIdx) => (
                <div key={sIdx} className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5 text-slate-200">
                    <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                    {step.nodeName}:
                  </span>
                  <span className="text-emerald-400">{step.expression}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
