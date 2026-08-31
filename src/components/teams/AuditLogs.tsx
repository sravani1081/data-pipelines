'use client';

import React from 'react';
import { Card, CardHeader } from '@/components/common/Card';
import { useApp } from '@/context/AppContext';
import { History, Shield, FileText } from 'lucide-react';
import { formatDateTime } from '@/lib/utils/formatters';

export function AuditLogs() {
  const { auditLogs } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <History className="w-6 h-6 text-purple-400" />
            Security & Change Audit Trail
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable log of pipeline creations, schema edits, dataset exports, and administrative actions
          </p>
        </div>
      </div>

      <Card>
        <CardHeader title="System Audit Log Events" subtitle={`Showing ${auditLogs.length} audit entries`} />

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Resource Type</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 text-slate-500">{formatDateTime(log.timestamp)}</td>
                  <td className="py-3 px-4 text-slate-200 font-semibold">{log.userName}</td>
                  <td className="py-3 px-4 text-indigo-400 font-bold">{log.action}</td>
                  <td className="py-3 px-4 text-slate-400 uppercase text-[10px]">{log.resourceType}</td>
                  <td className="py-3 px-4 text-slate-300 font-sans">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
