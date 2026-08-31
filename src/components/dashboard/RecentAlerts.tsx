'use client';

import React from 'react';
import { Card, CardHeader } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { useApp } from '@/context/AppContext';
import { useNavigation } from '@/context/NavigationContext';
import { AlertTriangle, CheckCircle, Info, ArrowRight, Activity, Terminal } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils/formatters';

export function RecentAlerts() {
  const { alerts, pipelineRuns, resolveAlert } = useApp();
  const { setActiveView, navigateToRunDetails } = useNavigation();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Active Incidents & Alerts */}
      <Card>
        <CardHeader
          title="Active Alerts & Incidents"
          subtitle="System warnings, contract violations, and schema drift notifications"
          action={
            <Button
              variant="ghost"
              size="sm"
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={() => setActiveView('alerts')}
            >
              View All
            </Button>
          }
        />

        <div className="space-y-3">
          {alerts.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No active alerts</p>
          ) : (
            alerts.slice(0, 4).map(alert => (
              <div
                key={alert.id}
                className="flex items-start justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 gap-3"
              >
                <div className="flex items-start gap-3">
                  {alert.severity === 'critical' || alert.severity === 'error' ? (
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  ) : (
                    <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-semibold text-slate-200">{alert.title}</h4>
                      <Badge
                        variant={
                          alert.severity === 'critical'
                            ? 'danger'
                            : alert.severity === 'warning'
                            ? 'warning'
                            : 'info'
                        }
                        size="sm"
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{alert.message}</p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Target: {alert.targetName} • {formatRelativeTime(alert.triggeredAt)}
                    </p>
                  </div>
                </div>

                {alert.status === 'active' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[11px] py-1 px-2 shrink-0"
                    onClick={() => resolveAlert(alert.id)}
                  >
                    Resolve
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Recent Pipeline Runs */}
      <Card>
        <CardHeader
          title="Recent Pipeline Runs"
          subtitle="Real-time DAG task execution status and duration logs"
          action={
            <Button
              variant="ghost"
              size="sm"
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={() => setActiveView('pipeline-runs')}
            >
              All Runs
            </Button>
          }
        />

        <div className="space-y-3">
          {pipelineRuns.slice(0, 4).map(run => (
            <div
              key={run.id}
              onClick={() => navigateToRunDetails(run.id)}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    run.status === 'Succeeded'
                      ? 'bg-emerald-400'
                      : run.status === 'Failed'
                      ? 'bg-rose-400'
                      : 'bg-amber-400 animate-pulse'
                  }`}
                />
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">{run.pipelineName}</h4>
                  <p className="text-[11px] text-slate-400">
                    Run #{run.id.slice(-6)} • {run.recordsProcessed.toLocaleString()} records • {run.durationMs}ms
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    run.status === 'Succeeded'
                      ? 'success'
                      : run.status === 'Failed'
                      ? 'danger'
                      : 'warning'
                  }
                  size="sm"
                >
                  {run.status}
                </Badge>
                <span className="text-[11px] text-slate-500 font-mono">
                  {formatRelativeTime(run.startedAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
