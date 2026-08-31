'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Radio, Play, Pause, Activity, Zap, Cpu, AlertTriangle } from 'lucide-react';
import { StreamingMetrics } from '@/types/telemetry';

export function StreamingSim() {
  const [isStreaming, setIsStreaming] = useState(true);
  const [metrics, setMetrics] = useState<StreamingMetrics>({
    eventsPerSecond: 520,
    totalEventsProcessed: 1452000,
    queueSize: 14,
    processingLatencyMs: 12,
    droppedEvents: 0,
    errorCount: 3,
    activeWorkers: 8,
    bufferUsagePercent: 18.5,
  });

  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        eventsPerSecond: Math.floor(480 + Math.random() * 80),
        totalEventsProcessed: prev.totalEventsProcessed + Math.floor(480 + Math.random() * 80),
        queueSize: Math.floor(Math.random() * 25),
        processingLatencyMs: Math.floor(10 + Math.random() * 8),
        bufferUsagePercent: parseFloat((15 + Math.random() * 10).toFixed(1)),
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [isStreaming]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Radio className="w-6 h-6 text-sky-400" />
            Real-Time Streaming Simulator
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Simulated live telemetry event stream with worker queue metrics, latency tracking, and buffer usage
          </p>
        </div>

        <Button
          variant={isStreaming ? 'danger' : 'primary'}
          icon={isStreaming ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          onClick={() => setIsStreaming(!isStreaming)}
        >
          {isStreaming ? 'Pause Stream' : 'Resume Stream'}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-slate-400">Events / Second</p>
          <p className="text-3xl font-bold text-sky-400 font-mono mt-1">{metrics.eventsPerSecond}/s</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-400">Total Streamed</p>
          <p className="text-2xl font-bold text-slate-100 font-mono mt-1">{metrics.totalEventsProcessed.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-400">Processing Latency</p>
          <p className="text-2xl font-bold text-emerald-400 font-mono mt-1">{metrics.processingLatencyMs} ms</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-400">Queue & Workers</p>
          <p className="text-2xl font-bold text-indigo-400 font-mono mt-1">{metrics.activeWorkers} Workers</p>
        </Card>
      </div>
    </div>
  );
}
