'use client';

import React from 'react';
import { Card, CardHeader } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Activity, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

export function ObservabilityHubView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Activity className="w-6 h-6 text-indigo-400" />
            Enterprise Pipeline Observability Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor real-time pipeline SLAs, execution latency, throughput rate, and active incidents
          </p>
        </div>

        <Badge variant="success" size="md" dot>
          SLA 99.9% Compliant
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-slate-400">Total Records Ingested</p>
          <p className="text-2xl font-bold text-slate-100 font-mono mt-1">126,500,000</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-400">P95 Latency</p>
          <p className="text-2xl font-bold text-emerald-400 font-mono mt-1">420 ms</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-400">Data Quality Score</p>
          <p className="text-2xl font-bold text-indigo-400 font-mono mt-1">99.4%</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-400">Active Incidents</p>
          <p className="text-2xl font-bold text-amber-400 font-mono mt-1">0</p>
        </Card>
      </div>
    </div>
  );
}
