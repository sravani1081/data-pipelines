'use client';

import React from 'react';
import { Card, CardHeader } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { useApp } from '@/context/AppContext';
import { evaluateDatasetQuality } from '@/lib/quality/evaluator';
import { CheckCircle2, AlertOctagon, ShieldCheck, RefreshCw, XCircle, ArrowRight } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils/formatters';

export function DataQualityView() {
  const { datasets } = useApp();

  const currentDataset = datasets[0];
  if (!currentDataset) return null;

  const { report, rejectedRecords } = evaluateDatasetQuality(currentDataset);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            Data Quality Engine & Profiling
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated quality checks: completeness, uniqueness, validity, freshness, and dead-letter store
          </p>
        </div>

        <Button variant="primary" icon={<RefreshCw className="w-4 h-4" />}>
          Run Quality Audit
        </Button>
      </div>

      {/* Quality Scorecards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4 bg-gradient-to-br from-slate-900 to-indigo-950/40 border-indigo-900/40">
          <p className="text-xs font-medium text-slate-400">Overall DQ Score</p>
          <p className="text-3xl font-bold text-emerald-400 mt-2 font-mono">{report.overallScore}%</p>
          <p className="text-[10px] text-slate-500 mt-1">Weighted Quality Index</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-slate-400">Completeness</p>
          <p className="text-2xl font-bold text-slate-100 mt-2 font-mono">{report.completenessScore}%</p>
          <p className="text-[10px] text-slate-500 mt-1">Null value rate</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-slate-400">Uniqueness</p>
          <p className="text-2xl font-bold text-slate-100 mt-2 font-mono">{report.uniquenessScore}%</p>
          <p className="text-[10px] text-slate-500 mt-1">Duplicate row rate</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-slate-400">Freshness SLA</p>
          <p className="text-2xl font-bold text-slate-100 mt-2 font-mono">{report.freshnessScore}%</p>
          <p className="text-[10px] text-slate-500 mt-1">Latency SLA score</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-slate-400">Validity & Schema</p>
          <p className="text-2xl font-bold text-slate-100 mt-2 font-mono">{report.validityScore}%</p>
          <p className="text-[10px] text-slate-500 mt-1">Type constraints check</p>
        </Card>
      </div>

      {/* Quality Check Results Table */}
      <Card>
        <CardHeader title="Automated Quality Rule Results" subtitle={`Report generated ${formatRelativeTime(report.evaluatedAt)}`} />

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Rule Name</th>
                <th className="py-2.5 px-3">Target Field</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Records Evaluated</th>
                <th className="py-2.5 px-3">Failures</th>
                <th className="py-2.5 px-3">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
              {report.results.map((res, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-semibold text-slate-100 flex items-center gap-2">
                    {res.passed ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                    {res.ruleName}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">{res.field}</td>
                  <td className="py-2.5 px-3">
                    <Badge variant={res.passed ? 'success' : 'danger'} size="sm">
                      {res.passed ? 'PASSED' : 'FAILED'}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3 text-slate-200">{res.totalRecordsEvaluated.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-rose-400">{res.failedRecordCount}</td>
                  <td className="py-2.5 px-3 text-slate-400 font-sans">{res.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
