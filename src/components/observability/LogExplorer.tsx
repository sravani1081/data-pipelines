'use client';

import React, { useState } from 'react';
import { Card, CardHeader } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { useApp } from '@/context/AppContext';
import { FileText, Search, Filter } from 'lucide-react';
import { formatDateTime } from '@/lib/utils/formatters';

export function LogExplorer() {
  const { logs } = useApp();
  const [query, setQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');

  const filteredLogs = logs.filter(log => {
    const matchesQuery = log.message.toLowerCase().includes(query.toLowerCase()) || log.pipelineName.toLowerCase().includes(query.toLowerCase());
    const matchesLevel = levelFilter === 'ALL' || log.level === levelFilter;
    return matchesQuery && matchesLevel;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-sky-400" />
            Pipeline Log Explorer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Structured task execution logs, severity level filtering, and execution trace search
          </p>
        </div>
      </div>

      <Card className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search logs or pipeline..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            {['ALL', 'INFO', 'WARN', 'ERROR', 'DEBUG'].map(lvl => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-3 py-1 text-xs rounded-lg cursor-pointer ${
                  levelFilter === lvl ? 'bg-indigo-600 text-white font-medium' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar font-mono text-xs">
          {filteredLogs.map(log => (
            <div key={log.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start gap-3">
              <span className="text-[10px] text-slate-500 shrink-0">{formatDateTime(log.timestamp)}</span>
              <Badge
                variant={
                  log.level === 'ERROR'
                    ? 'danger'
                    : log.level === 'WARN'
                    ? 'warning'
                    : 'info'
                }
                size="sm"
                className="shrink-0"
              >
                {log.level}
              </Badge>
              <span className="text-indigo-400 shrink-0">[{log.pipelineName}]</span>
              <span className="text-slate-300 flex-1">{log.message}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
