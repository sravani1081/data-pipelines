'use client';

import React from 'react';
import { Card, CardHeader } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { ShieldCheck, AlertOctagon, CheckCircle2, Clock, FileText } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils/formatters';

export function ContractsView() {
  const mockContracts = [
    {
      id: 'ctr_101',
      name: 'Game Telemetry Producer Contract',
      datasetName: 'Curated Telemetry Events',
      producerTeam: 'Data Platform Core',
      consumerTeams: ['LiveOps Analytics', 'AI & ML Infrastructure'],
      schemaVersion: 2,
      slaMinFreshnessMinutes: 15,
      slaMinQualityScore: 98.0,
      status: 'Active' as const,
      violationsCount: 0,
      lastEvaluatedAt: new Date().toISOString(),
    },
    {
      id: 'ctr_102',
      name: 'IAP Purchase Monetization SLA',
      datasetName: 'IAP Purchase Stream',
      producerTeam: 'LiveOps Analytics',
      consumerTeams: ['Finance Ops', 'Executive Analytics'],
      schemaVersion: 1,
      slaMinFreshnessMinutes: 5,
      slaMinQualityScore: 99.5,
      status: 'Violated' as const,
      violationsCount: 2,
      lastEvaluatedAt: new Date().toISOString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
            Data Contracts & SLAs
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Enforceable producer-consumer data contracts with strict SLA freshness and quality guarantees
          </p>
        </div>

        <Button variant="primary" icon={<ShieldCheck className="w-4 h-4" />}>
          New Data Contract
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockContracts.map(contract => (
          <Card key={contract.id} hoverable className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  {contract.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">Target: {contract.datasetName}</p>
              </div>
              <Badge variant={contract.status === 'Active' ? 'success' : 'danger'} size="sm">
                {contract.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 block">Producer Team</span>
                <span className="font-semibold text-slate-200">{contract.producerTeam}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Freshness SLA</span>
                <span className="font-mono text-emerald-400">&lt; {contract.slaMinFreshnessMinutes} mins</span>
              </div>
              <div>
                <span className="text-slate-500 block">Quality Threshold</span>
                <span className="font-mono text-indigo-400">&gt;= {contract.slaMinQualityScore}%</span>
              </div>
              <div>
                <span className="text-slate-500 block">Schema Version</span>
                <span className="font-mono text-slate-300">v{contract.schemaVersion}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span>{contract.violationsCount} SLA Violations</span>
              <span className="text-[11px] text-slate-500">Evaluated {formatRelativeTime(contract.lastEvaluatedAt)}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
