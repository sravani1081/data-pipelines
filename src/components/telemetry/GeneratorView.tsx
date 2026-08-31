'use client';

import React, { useState } from 'react';
import { Card, CardHeader } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useApp } from '@/context/AppContext';
import { generateGameEvents } from '@/lib/telemetry/generator';
import { Gamepad2, Play, RefreshCw, Layers, CheckCircle2, Download } from 'lucide-react';
import { exportToJSON } from '@/lib/utils/helpers';

export function GeneratorView() {
  const { activeProject, saveDataset } = useApp();
  const [playerCount, setPlayerCount] = useState(500);
  const [recordCount, setRecordCount] = useState(100);
  const [includeErrors, setIncludeErrors] = useState(false);
  const [generatedEvents, setGeneratedEvents] = useState<Record<string, any>[]>([]);

  const handleGenerate = () => {
    const events = generateGameEvents({
      playerCount,
      eventsPerSecond: 100,
      gameId: 'cyber_nexus_v1',
      region: 'NA-East',
      platforms: ['PC', 'PlayStation', 'Xbox'],
      includeErrors,
      errorRate: 0.05,
    }, recordCount);

    setGeneratedEvents(events);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-indigo-400" />
            Synthetic Game Telemetry Generator
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate realistic game events for 16 payload types (deaths, purchases, matches, sessions, quests, servers)
          </p>
        </div>

        <div className="flex items-center gap-3">
          {generatedEvents.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-3.5 h-3.5" />}
              onClick={() => exportToJSON('synthetic_game_events.json', generatedEvents)}
            >
              Export JSON
            </Button>
          )}
          <Button variant="primary" icon={<Play className="w-4 h-4" />} onClick={handleGenerate}>
            Generate Payload
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <Card className="lg:col-span-1 space-y-4">
          <CardHeader title="Generator Configuration" subtitle="Configure population size and error injection" />

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Simulated Active Players</label>
            <input
              type="number"
              value={playerCount}
              onChange={e => setPlayerCount(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Event Batch Size</label>
            <input
              type="number"
              value={recordCount}
              onChange={e => setRecordCount(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="errors-check"
              checked={includeErrors}
              onChange={e => setIncludeErrors(e.target.checked)}
              className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="errors-check" className="text-xs text-slate-300">
              Inject 5% Synthetic Schema Errors
            </label>
          </div>
        </Card>

        {/* Generated Events Table */}
        <Card className="lg:col-span-2 space-y-4">
          <CardHeader
            title="Generated Events Preview"
            subtitle={generatedEvents.length > 0 ? `Showing ${generatedEvents.length} events` : 'Click "Generate Payload" to run generator'}
          />

          {generatedEvents.length > 0 ? (
            <div className="overflow-x-auto max-h-[400px]">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px] sticky top-0">
                  <tr>
                    <th className="py-2.5 px-3">Event Name</th>
                    <th className="py-2.5 px-3">Player ID</th>
                    <th className="py-2.5 px-3">Platform</th>
                    <th className="py-2.5 px-3">Region</th>
                    <th className="py-2.5 px-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                  {generatedEvents.map((evt, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 font-semibold text-indigo-400">{evt.event_name}</td>
                      <td className="py-2 px-3 text-slate-200">{evt.player_id ?? <span className="text-rose-400">null</span>}</td>
                      <td className="py-2 px-3 text-slate-400">{evt.platform}</td>
                      <td className="py-2 px-3 text-slate-400">{evt.region}</td>
                      <td className="py-2 px-3 text-slate-500">{evt.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-500 text-xs">No events generated yet</div>
          )}
        </Card>
      </div>
    </div>
  );
}
