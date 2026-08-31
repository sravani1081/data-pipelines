'use client';

import React from 'react';
import { NodeType } from '@/types/pipeline';
import { Database, Filter, Cpu, GitMerge, Layers, SortAsc, Clock, CheckCircle2, ShieldCheck, Download } from 'lucide-react';

export interface NodePaletteProps {
  onAddNode: (type: NodeType) => void;
}

export function NodePalette({ onAddNode }: NodePaletteProps) {
  const nodeCategories: { category: string; items: { type: NodeType; label: string; desc: string; icon: React.ReactNode }[] }[] = [
    {
      category: 'DATA INPUT & PARSING',
      items: [
        { type: 'Source', label: 'Data Source', desc: 'Read from stream or catalog', icon: <Database className="w-4 h-4 text-sky-400" /> },
        { type: 'Parse', label: 'Parse Payload', desc: 'Parse JSON / NDJSON', icon: <FileCodeIcon className="w-4 h-4 text-amber-400" /> },
      ],
    },
    {
      category: 'TRANSFORMATION',
      items: [
        { type: 'Filter', label: 'Filter Rows', desc: 'Filter by conditions', icon: <Filter className="w-4 h-4 text-indigo-400" /> },
        { type: 'Transform', label: 'Transform Field', desc: 'Modify or calculate field', icon: <Cpu className="w-4 h-4 text-purple-400" /> },
        { type: 'Join', label: 'Join Datasets', desc: 'Inner, Left, Right join', icon: <GitMerge className="w-4 h-4 text-pink-400" /> },
        { type: 'Aggregate', label: 'Aggregate', desc: 'Count, sum, avg, p95', icon: <Layers className="w-4 h-4 text-emerald-400" /> },
        { type: 'Deduplicate', label: 'Deduplicate', desc: 'Remove duplicate rows', icon: <CheckCircle2 className="w-4 h-4 text-teal-400" /> },
        { type: 'Sort', label: 'Sort Records', desc: 'Sort by multiple fields', icon: <SortAsc className="w-4 h-4 text-cyan-400" /> },
        { type: 'Window', label: 'Time Window', desc: 'Tumbling/sliding window', icon: <Clock className="w-4 h-4 text-amber-400" /> },
      ],
    },
    {
      category: 'QUALITY & OUTPUT',
      items: [
        { type: 'Validate', label: 'Schema Validation', desc: 'Validate against schema', icon: <ShieldCheck className="w-4 h-4 text-rose-400" /> },
        { type: 'Enrich', label: 'Enrich Geo', desc: 'Add geo/device metadata', icon: <Cpu className="w-4 h-4 text-violet-400" /> },
        { type: 'Output', label: 'Save Dataset', desc: 'Commit output to catalog', icon: <Download className="w-4 h-4 text-emerald-400" /> },
      ],
    },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 p-4 space-y-6 overflow-y-auto custom-scrollbar shrink-0">
      <h3 className="text-xs font-bold text-slate-400 tracking-wider">NODE PALETTE</h3>
      {nodeCategories.map((cat, idx) => (
        <div key={idx} className="space-y-2">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase">{cat.category}</h4>
          <div className="space-y-1.5">
            {cat.items.map(item => (
              <div
                key={item.type}
                onClick={() => onAddNode(item.type)}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-indigo-500/80 hover:bg-slate-800/60 transition-all cursor-pointer group"
              >
                <div className="p-1.5 rounded-md bg-slate-900 border border-slate-800 group-hover:border-indigo-500/40">
                  {item.icon}
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-slate-200 group-hover:text-white">{item.label}</h5>
                  <p className="text-[10px] text-slate-500 line-clamp-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FileCodeIcon(props: any) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}
