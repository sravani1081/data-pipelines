'use client';

import React from 'react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { useApp } from '@/context/AppContext';
import { GitMerge, CheckCircle2, AlertOctagon, Activity, Database, ShieldCheck, Zap, Clock } from 'lucide-react';
import { formatCompactNumber, formatDurationMs } from '@/lib/utils/formatters';

export function MetricCards() {
  const { pipelines, pipelineRuns, datasets, alerts } = useApp();

  const activePipelines = pipelines.filter(p => p.status === 'Published').length;
  const totalRuns = pipelineRuns.length;
  const successfulRuns = pipelineRuns.filter(r => r.status === 'Succeeded').length;
  const failedRuns = pipelineRuns.filter(r => r.status === 'Failed').length;
  const successRate = totalRuns > 0 ? ((successfulRuns / totalRuns) * 100).toFixed(1) : '100.0';

  const totalRecords = datasets.reduce((acc, d) => acc + d.recordCount, 0);
  const avgQualityScore =
    datasets.length > 0
      ? (datasets.reduce((acc, d) => acc + d.qualityScore, 0) / datasets.length).toFixed(1)
      : '98.5';

  const avgFreshnessScore =
    datasets.length > 0
      ? (datasets.reduce((acc, d) => acc + d.freshnessScore, 0) / datasets.length).toFixed(1)
      : '97.2';

  const activeAlerts = alerts.filter(a => a.status === 'active').length;

  const cards = [
    {
      title: 'Active Pipelines',
      value: activePipelines,
      sub: `${pipelines.length} Total Configured`,
      badge: 'Operational',
      badgeVariant: 'success' as const,
      icon: <GitMerge className="w-5 h-5 text-indigo-400" />,
    },
    {
      title: 'Success Rate',
      value: `${successRate}%`,
      sub: `${successfulRuns} Passed / ${failedRuns} Failed`,
      badge: parseFloat(successRate) >= 95 ? 'Healthy' : 'Attention Needed',
      badgeVariant: parseFloat(successRate) >= 95 ? ('success' as const) : ('warning' as const),
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    },
    {
      title: 'Records Ingested',
      value: formatCompactNumber(totalRecords),
      sub: 'Across active game sources',
      badge: '500/s Rate',
      badgeVariant: 'indigo' as const,
      icon: <Database className="w-5 h-5 text-sky-400" />,
    },
    {
      title: 'Data Quality Score',
      value: `${avgQualityScore}%`,
      sub: 'Completeness & Validity',
      badge: 'High Precision',
      badgeVariant: 'purple' as const,
      icon: <ShieldCheck className="w-5 h-5 text-purple-400" />,
    },
    {
      title: 'Freshness Score',
      value: `${avgFreshnessScore}%`,
      sub: 'SLA Latency Compliance',
      badge: 'Fresh',
      badgeVariant: 'info' as const,
      icon: <Clock className="w-5 h-5 text-cyan-400" />,
    },
    {
      title: 'Active Incidents',
      value: activeAlerts,
      sub: 'Schema Drift & Delays',
      badge: activeAlerts === 0 ? 'All Systems Nominal' : 'Requires Action',
      badgeVariant: activeAlerts === 0 ? ('neutral' as const) : ('danger' as const),
      icon: <AlertOctagon className="w-5 h-5 text-rose-400" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, idx) => (
        <Card key={idx} hoverable className="p-4 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60">{card.icon}</div>
            <Badge variant={card.badgeVariant} size="sm">
              {card.badge}
            </Badge>
          </div>
          <div className="mt-4">
            <h4 className="text-xs font-medium text-slate-400">{card.title}</h4>
            <p className="text-2xl font-bold text-slate-100 tracking-tight mt-1">{card.value}</p>
            <p className="text-[11px] text-slate-500 mt-1">{card.sub}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
