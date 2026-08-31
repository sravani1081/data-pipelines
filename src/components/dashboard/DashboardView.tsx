'use client';

import React from 'react';
import { MetricCards } from './MetricCards';
import { ActivityCharts } from './ActivityCharts';
import { RecentAlerts } from './RecentAlerts';
import { useApp } from '@/context/AppContext';
import { Gamepad2, ShieldCheck, Zap, Activity } from 'lucide-react';

export function DashboardView() {
  const { activeProject } = useApp();

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-purple-950/50 border border-indigo-900/40 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 tracking-wide uppercase">
              Data Studio Platform
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Project: <span className="text-slate-200 font-semibold">{activeProject?.name}</span>
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-2">
            GameOps AI — Data Engineering & Pipelines
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl mt-1">
            Turn game telemetry into reliable data. Orchestrate real-time telemetry streams, build ETL/ELT pipelines, enforce schema contracts, profile data quality, and generate ML datasets.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero-Secret Engine</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
            <Zap className="w-4 h-4 text-indigo-400" />
            <span>Local Simulation Mode</span>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <MetricCards />

      {/* Activity SVG Charts */}
      <ActivityCharts />

      {/* Incident Alerts & Recent Runs */}
      <RecentAlerts />
    </div>
  );
}
