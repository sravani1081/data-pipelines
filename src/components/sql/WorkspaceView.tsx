'use client';

import React, { useState } from 'react';
import { Card, CardHeader } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useApp } from '@/context/AppContext';
import { executeSQLQuery } from '@/lib/sql/executor';
import { QueryExecutionResult } from '@/types/sql';
import { Terminal, Play, Save, History, FileSpreadsheet, Download } from 'lucide-react';
import { exportToCSV } from '@/lib/utils/helpers';

export function WorkspaceView() {
  const { datasets } = useApp();
  const [sqlQuery, setSqlQuery] = useState(
    "SELECT player_id, event_name, platform, level\nFROM raw_game_events\nWHERE level > 10\nLIMIT 20"
  );
  const [result, setResult] = useState<QueryExecutionResult | null>(null);

  const handleRunQuery = () => {
    const formattedDatasets = datasets.map(d => ({
      name: d.name.toLowerCase().replace(/\s+/g, '_'),
      records: d.records,
    }));

    const res = executeSQLQuery(sqlQuery, formattedDatasets);
    setResult(res);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Terminal className="w-6 h-6 text-amber-400" />
            Local SQL Query Workspace
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Execute in-memory SQL queries against local dataset catalog (SELECT, WHERE, GROUP BY, LIMIT)
          </p>
        </div>

        <div className="flex items-center gap-3">
          {result && result.rows.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-3.5 h-3.5" />}
              onClick={() => exportToCSV('query_results.csv', result.rows)}
            >
              Export CSV
            </Button>
          )}
          <Button variant="primary" icon={<Play className="w-4 h-4" />} onClick={handleRunQuery}>
            Run Query (Ctrl + Enter)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor */}
        <Card className="lg:col-span-2 space-y-4">
          <CardHeader title="SQL Editor" subtitle="Safe controlled SQL subset parser" />

          <textarea
            rows={8}
            value={sqlQuery}
            onChange={e => setSqlQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 leading-relaxed"
          />

          {/* Preset Queries */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold">Presets:</span>
            <button
              onClick={() =>
                setSqlQuery("SELECT player_id, COUNT(*) FROM raw_game_events GROUP BY player_id LIMIT 10")
              }
              className="text-xs text-indigo-400 hover:underline"
            >
              Group Events by Player
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={() =>
                setSqlQuery("SELECT event_name, region, platform FROM raw_game_events WHERE region = 'NA-East'")
              }
              className="text-xs text-indigo-400 hover:underline"
            >
              Filter NA-East Events
            </button>
          </div>
        </Card>

        {/* Dataset Schema Reference */}
        <Card className="space-y-3">
          <CardHeader title="Available Local Tables" subtitle="Dataset catalog SQL tables" />
          <div className="space-y-2">
            {datasets.map(d => (
              <div
                key={d.id}
                onClick={() =>
                  setSqlQuery(`SELECT * FROM ${d.name.toLowerCase().replace(/\s+/g, '_')} LIMIT 15`)
                }
                className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-amber-500/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between font-mono text-xs font-semibold text-slate-200">
                  <span>{d.name.toLowerCase().replace(/\s+/g, '_')}</span>
                  <span className="text-[10px] text-slate-500">{d.recordCount} rows</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Query Execution Results */}
      {result && (
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Query Results ({result.rowCount} rows in {result.executionTimeMs}ms)
            </h3>
            {result.error && <Badge variant="danger">{result.error}</Badge>}
          </div>

          {result.rows.length > 0 ? (
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px] sticky top-0">
                  <tr>
                    {result.columns.map(col => (
                      <th key={col} className="py-2.5 px-3">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                  {result.rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      {result.columns.map(col => (
                        <td key={col} className="py-2 px-3 truncate max-w-[200px]">
                          {String(row[col] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            !result.error && <p className="text-xs text-slate-500 py-4">Query returned 0 rows</p>
          )}
        </Card>
      )}
    </div>
  );
}
