'use client';

import React from 'react';
import { Card, CardHeader } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Database, Play, Code, BarChart2 } from 'lucide-react';

export function AnalyticsWorkspaceView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Database className="w-6 h-6 text-sky-400" />
            Game Studio Analytics Workspace
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Perform interactive data exploration, custom SQL queries, and cohort analytics on game telemetry
          </p>
        </div>

        <Button variant="primary" icon={<Play className="w-4 h-4" />}>
          Execute Query
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 p-4 space-y-3">
          <CardHeader title="Saved Queries" subtitle="Team SQL queries & cohort segmentations" />
          <div className="space-y-2 text-xs">
            {['Player Churn Cohort 7D', 'Top Spenders (VIP Gold)', 'Server Latency Spikes', 'Matchmaking Queue Times'].map((q, idx) => (
              <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 font-semibold flex items-center justify-between cursor-pointer hover:bg-slate-800/60">
                <span>{q}</span>
                <Badge variant="indigo" size="sm">SQL</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2 space-y-4">
          <CardHeader title="Query Result Grid" subtitle="Interactive table view with field profiling" />
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-emerald-400">
            <p>// Result Set: 100 rows returned in 12ms</p>
            <p>SELECT player_id, COUNT(*) as sessions FROM game_sessions GROUP BY player_id LIMIT 5;</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
