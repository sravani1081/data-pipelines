'use client';

import React from 'react';
import { Card, CardHeader } from '@/components/common/Card';
import { LineChart, BarChart } from '@/components/common/Chart';
import { Badge } from '@/components/common/Badge';
import { Activity, Clock, CheckCircle2, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

export function MonitoringView() {
  const throughputData = [
    { label: '00:00', value: 450 },
    { label: '04:00', value: 380 },
    { label: '08:00', value: 620 },
    { label: '12:00', value: 890 },
    { label: '16:00', value: 1050 },
    { label: '20:00', value: 1200 },
    { label: '24:00', value: 780 },
  ];

  const latencyData = [
    { label: '00:00', value: 12 },
    { label: '04:00', value: 10 },
    { label: '08:00', value: 15 },
    { label: '12:00', value: 22 },
    { label: '16:00', value: 28 },
    { label: '20:00', value: 32 },
    { label: '24:00', value: 18 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Activity className="w-6 h-6 text-indigo-400" />
            Pipeline Observability & Monitoring
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time pipeline health, P95 processing latency, throughput metrics, and SLA compliance
          </p>
        </div>

        <Badge variant="success" size="md" dot>
          All Systems Nominal
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Pipeline Throughput (Events/sec)" subtitle="Real-time ingestion rate across game servers" />
          <LineChart data={throughputData} height={200} color="#6366f1" fill showPoints />
        </Card>

        <Card>
          <CardHeader title="P95 Processing Latency (ms)" subtitle="End-to-end task execution latency" />
          <BarChart data={latencyData} height={200} color="#10b981" />
        </Card>
      </div>
    </div>
  );
}
