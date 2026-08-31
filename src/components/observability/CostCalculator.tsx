'use client';

import React from 'react';
import { Card, CardHeader } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { useApp } from '@/context/AppContext';
import { calculateSyntheticCost } from '@/lib/monitoring/cost';
import { DollarSign, Cpu, Database, Network } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatters';

export function CostCalculator() {
  const { datasets } = useApp();

  const totalRecords = datasets.reduce((acc, d) => acc + d.recordCount, 0);
  const totalStorage = datasets.reduce((acc, d) => acc + d.sizeBytes, 0);

  const costEstimate = calculateSyntheticCost(totalRecords, totalStorage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-400" />
            Pipeline Cost Calculator
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Synthetic pipeline cost estimation based on compute volume, dataset storage, and streaming network bandwidth
          </p>
        </div>

        <Badge variant="info" size="md">
          Synthetic Cost Estimate
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-slate-900 to-emerald-950/40 border-emerald-900/40">
          <p className="text-xs text-slate-400">Total Estimated Monthly Cost</p>
          <p className="text-3xl font-bold text-emerald-400 font-mono mt-1">{formatCurrency(costEstimate.totalCostUsd)}</p>
          <p className="text-[10px] text-slate-500 mt-1">Synthetic Projection</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-400">Compute Cost</p>
          <p className="text-2xl font-bold text-slate-100 font-mono mt-1">{formatCurrency(costEstimate.computeCostUsd)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-400">Storage Cost</p>
          <p className="text-2xl font-bold text-slate-100 font-mono mt-1">{formatCurrency(costEstimate.storageCostUsd)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-400">Network / Bandwidth</p>
          <p className="text-2xl font-bold text-slate-100 font-mono mt-1">{formatCurrency(costEstimate.networkCostUsd)}</p>
        </Card>
      </div>

      <Card>
        <CardHeader title="Cost Breakdown by Pipeline" subtitle="Synthetic cost distribution per active game data pipeline" />

        <div className="space-y-3">
          {costEstimate.breakdownByPipeline.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
              <span className="font-semibold text-slate-200">{item.pipelineName}</span>
              <span className="font-mono text-emerald-400 font-bold">{formatCurrency(item.costUsd)} / mo</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
