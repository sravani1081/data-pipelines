'use client';

import React, { useState, useEffect } from 'react';
import { useNavigation, ActiveModuleView } from '@/context/NavigationContext';
import { useApp } from '@/context/AppContext';
import { Search, Workflow, Database, Layers, Terminal, Activity, FileCode2, Play, BookOpen, X } from 'lucide-react';

export function CommandPalette() {
  const { isCommandPaletteOpen, setIsCommandPaletteOpen, setActiveView } = useNavigation();
  const { pipelines, datasets, dataSources } = useApp();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const quickActions: { label: string; view: ActiveModuleView; icon: React.ReactNode }[] = [
    { label: 'Create New Pipeline', view: 'pipeline-builder', icon: <Workflow className="w-4 h-4 text-indigo-400" /> },
    { label: 'Ingest Game Data', view: 'ingestion', icon: <Database className="w-4 h-4 text-emerald-400" /> },
    { label: 'Run SQL Query', view: 'sql-workspace', icon: <Terminal className="w-4 h-4 text-amber-400" /> },
    { label: 'View Telemetry Stream', view: 'streaming-simulation', icon: <Activity className="w-4 h-4 text-sky-400" /> },
    { label: 'Inspect Schemas', view: 'schemas', icon: <FileCode2 className="w-4 h-4 text-purple-400" /> },
    { label: 'Open Documentation', view: 'documentation', icon: <BookOpen className="w-4 h-4 text-rose-400" /> },
  ];

  const filteredPipelines = pipelines.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
  const filteredDatasets = datasets.filter(d => d.name.toLowerCase().includes(query.toLowerCase()));

  const handleSelectView = (view: ActiveModuleView) => {
    setActiveView(view);
    setIsCommandPaletteOpen(false);
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
        {/* Search Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-800 bg-slate-900/80">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command or search assets..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
            autoFocus
          />
          <button onClick={() => setIsCommandPaletteOpen(false)} className="text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command Options */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 custom-scrollbar">
          {query === '' ? (
            <div>
              <h4 className="px-3 text-[11px] font-bold text-slate-500 tracking-wider mb-2">QUICK ACTIONS</h4>
              <div className="space-y-1">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectView(action.view)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer"
                  >
                    {action.icon}
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {filteredPipelines.length > 0 && (
                <div className="mb-4">
                  <h4 className="px-3 text-[11px] font-bold text-indigo-400 tracking-wider mb-2">PIPELINES</h4>
                  {filteredPipelines.map(p => (
                    <button
                      key={p.id}
                      onClick={() => handleSelectView('pipelines')}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-lg cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Workflow className="w-4 h-4 text-indigo-400" />
                        {p.name}
                      </span>
                      <span className="text-[10px] text-slate-500">{p.status}</span>
                    </button>
                  ))}
                </div>
              )}

              {filteredDatasets.length > 0 && (
                <div>
                  <h4 className="px-3 text-[11px] font-bold text-emerald-400 tracking-wider mb-2">DATASETS</h4>
                  {filteredDatasets.map(d => (
                    <button
                      key={d.id}
                      onClick={() => handleSelectView('datasets')}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-lg cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-emerald-400" />
                        {d.name}
                      </span>
                      <span className="text-[10px] text-slate-500">{d.recordCount.toLocaleString()} rows</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
