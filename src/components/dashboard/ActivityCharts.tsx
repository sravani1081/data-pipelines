'use client';

import React, { useState } from 'react';
import { Card, CardHeader } from '@/components/common/Card';
import { LineChart, BarChart } from '@/components/common/Chart';
import { Tabs } from '@/components/common/Tabs';

export function ActivityCharts() {
  const [timeRange, setTimeRange] = useState('24h');

  // Synthetic activity dataset
  const recordsData = [
    { label: '00:00', value: 185000 },
    { label: '04:00', value: 120000 },
    { label: '08:00', value: 290000 },
    { label: '12:00', value: 450000 },
    { label: '16:00', value: 680000 },
    { label: '20:00', value: 890000 },
    { label: '24:00', value: 610000 },
  ];

  const durationData = [
    { label: '00:00', value: 420 },
    { label: '04:00', value: 380 },
    { label: '08:00', value: 610 },
    { label: '12:00', value: 850 },
    { label: '16:00', value: 920 },
    { label: '20:00', value: 1100 },
    { label: '24:00', value: 740 },
  ];

  const qualityTrend = [
    { label: 'Mon', value: 98.4 },
    { label: 'Tue', value: 99.1 },
    { label: 'Wed', value: 97.8 },
    { label: 'Thu', value: 99.5 },
    { label: 'Fri', value: 99.8 },
    { label: 'Sat', value: 98.9 },
    { label: 'Sun', value: 99.7 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Chart 1: Volume */}
      <Card>
        <CardHeader
          title="Telemetry Records Processed (Events/sec)"
          subtitle="Real-time ingestion throughput across all game servers"
          action={
            <Tabs
              tabs={[
                { id: '1h', label: '1H' },
                { id: '24h', label: '24H' },
                { id: '7d', label: '7D' },
              ]}
              activeTab={timeRange}
              onChange={setTimeRange}
            />
          }
        />
        <LineChart data={recordsData} height={200} color="#6366f1" fill showPoints />
      </Card>

      {/* Chart 2: Pipeline Execution Duration */}
      <Card>
        <CardHeader
          title="Processing Latency & Duration (ms)"
          subtitle="P95 execution latency from ingestion to dataset commit"
          action={
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800/60">
              Avg: 717 ms
            </span>
          }
        />
        <BarChart data={durationData} height={200} color="#10b981" />
      </Card>
    </div>
  );
}
