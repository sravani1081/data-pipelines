'use client';

import React, { useState } from 'react';
import { Card, CardHeader } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { useApp } from '@/context/AppContext';
import { computeMLFeatures } from '@/lib/ml/features';
import { BrainCircuit, Play, Layers, Download, CheckCircle2 } from 'lucide-react';
import { exportToCSV } from '@/lib/utils/helpers';

export function FeatureWorkspace() {
  const { datasets } = useApp();
  const [featureRecords, setFeatureRecords] = useState<Record<string, any>[]>([]);

  const handleComputeFeatures = () => {
    const raw = datasets[0]?.records || [];
    const computed = computeMLFeatures(raw);
    setFeatureRecords(computed);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-purple-400" />
            ML Feature Store & Feature Engineering
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Engineered player features: 7-day session counts, 30-day matches, purchase frequency, rolling averages & churn risk labels
          </p>
        </div>

        <div className="flex items-center gap-3">
          {featureRecords.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-3.5 h-3.5" />}
              onClick={() => exportToCSV('ml_feature_store.csv', featureRecords)}
            >
              Export Feature Store CSV
            </Button>
          )}
          <Button variant="primary" icon={<Play className="w-4 h-4" />} onClick={handleComputeFeatures}>
            Compute Feature Set
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader
          title="Feature Store Table"
          subtitle={featureRecords.length > 0 ? `Showing ${featureRecords.length} player feature vectors` : 'Click "Compute Feature Set" to compute features'}
        />

        {featureRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Player ID</th>
                  <th className="py-2.5 px-3">Sessions (7d)</th>
                  <th className="py-2.5 px-3">Matches (30d)</th>
                  <th className="py-2.5 px-3">Avg Session Duration</th>
                  <th className="py-2.5 px-3">Purchases (14d)</th>
                  <th className="py-2.5 px-3">Quest Rate</th>
                  <th className="py-2.5 px-3">Churn Risk Label</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                {featureRecords.slice(0, 15).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-semibold text-slate-100">{row.player_id}</td>
                    <td className="py-2.5 px-3 text-sky-400">{row.player_sessions_7d}</td>
                    <td className="py-2.5 px-3 text-indigo-400">{row.matches_30d}</td>
                    <td className="py-2.5 px-3 text-slate-300">{row.avg_session_duration} mins</td>
                    <td className="py-2.5 px-3 text-emerald-400">{row.purchase_count_14d}</td>
                    <td className="py-2.5 px-3 text-purple-400">{row.quest_completion_rate}</td>
                    <td className="py-2.5 px-3">
                      <Badge variant={row.churn_risk === 1 ? 'danger' : 'success'} size="sm">
                        {row.churn_risk === 1 ? 'HIGH CHURN RISK' : 'ACTIVE PLAYER'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-slate-500 text-xs">No ML features computed yet</div>
        )}
      </Card>
    </div>
  );
}
