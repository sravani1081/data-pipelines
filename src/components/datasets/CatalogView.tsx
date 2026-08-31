'use client';

import React, { useState } from 'react';
import { Card, CardHeader } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { useApp } from '@/context/AppContext';
import { useNavigation } from '@/context/NavigationContext';
import { Layers, Search, Eye, Filter, Sparkles, Database } from 'lucide-react';
import { formatBytes, formatRelativeTime } from '@/lib/utils/formatters';

export function CatalogView() {
  const { datasets, activeProject } = useApp();
  const { navigateToDatasetExplorer } = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');

  const filtered = datasets.filter(d => {
    const matchesProj = !activeProject || d.projectId === activeProject.id;
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDomain = selectedDomain === 'All' || d.domain === selectedDomain;
    return matchesProj && matchesSearch && matchesDomain;
  });

  const domains = ['All', 'Telemetry', 'Players', 'Economy', 'Gameplay', 'AI', 'ML', 'LiveOps'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-6 h-6 text-emerald-400" />
            Dataset Catalog
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Searchable data lake & curated datasets registry with domain tags, data quality scores, and size stats
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <Card className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search datasets or tags..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto custom-scrollbar">
          <span className="text-xs text-slate-400 mr-2">Domain:</span>
          {domains.map(dom => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-3 py-1 text-xs rounded-lg transition-colors cursor-pointer ${
                selectedDomain === dom
                  ? 'bg-indigo-600 text-white font-medium'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>
      </Card>

      {/* Dataset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(dataset => (
          <Card key={dataset.id} hoverable className="flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-400" />
                    {dataset.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{dataset.description}</p>
                </div>
                <Badge variant={dataset.status === 'Healthy' ? 'success' : 'warning'} size="sm">
                  {dataset.status}
                </Badge>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-950/60 text-indigo-300 border border-indigo-800/60 font-semibold">
                  {dataset.domain}
                </span>
                {dataset.tags.map((t, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/60">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <div className="space-y-1">
                <p className="font-mono text-slate-200 font-semibold">{dataset.recordCount.toLocaleString()} records</p>
                <p className="text-[10px] text-slate-500">{formatBytes(dataset.sizeBytes)} • {dataset.columnCount} columns</p>
              </div>

              <Button
                variant="outline"
                size="sm"
                icon={<Eye className="w-3.5 h-3.5" />}
                onClick={() => navigateToDatasetExplorer(dataset.id)}
              >
                Explore
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
