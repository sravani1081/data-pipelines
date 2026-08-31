'use client';

import React from 'react';
import { PipelineNode } from '@/types/pipeline';
import { Button } from '@/components/common/Button';
import { useApp } from '@/context/AppContext';
import { X, Trash2, Settings2 } from 'lucide-react';

export interface ConfigPanelProps {
  node: PipelineNode | null;
  onUpdateNode: (updatedNode: PipelineNode) => void;
  onDeleteNode: (nodeId: string) => void;
  onClose: () => void;
}

export function ConfigPanel({ node, onUpdateNode, onDeleteNode, onClose }: ConfigPanelProps) {
  const { datasets, dataSources, schemas } = useApp();

  if (!node) return null;

  const handleConfigChange = (key: string, value: any) => {
    onUpdateNode({
      ...node,
      config: {
        ...node.config,
        [key]: value,
      },
    });
  };

  const handleLabelChange = (label: string) => {
    onUpdateNode({ ...node, label });
  };

  return (
    <div className="w-80 bg-slate-900 border-l border-slate-800 p-5 flex flex-col h-full shrink-0 z-20 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-indigo-400" />
          Configure {node.type}
        </h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4 py-4 flex-1">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Node Title</label>
          <input
            type="text"
            value={node.label}
            onChange={e => handleLabelChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Dynamic Controls based on Node Type */}
        {node.type === 'Source' && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Select Input Dataset</label>
            <select
              value={node.config.datasetId ?? ''}
              onChange={e => handleConfigChange('datasetId', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {datasets.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.recordCount.toLocaleString()} rows)
                </option>
              ))}
            </select>
          </div>
        )}

        {node.type === 'Filter' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Field to Filter</label>
              <input
                type="text"
                value={node.config.field ?? ''}
                onChange={e => handleConfigChange('field', e.target.value)}
                placeholder="e.g. player_id, score, level"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Operator</label>
              <select
                value={node.config.operator ?? 'notNull'}
                onChange={e => handleConfigChange('operator', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="notNull">IS NOT NULL</option>
                <option value="==">EQUALS (==)</option>
                <option value="!=">NOT EQUALS (!=)</option>
                <option value=">">GREATER THAN (&gt;)</option>
                <option value="<">LESS THAN (&lt;)</option>
                <option value="contains">CONTAINS</option>
              </select>
            </div>
            {node.config.operator !== 'notNull' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Value</label>
                <input
                  type="text"
                  value={node.config.value ?? ''}
                  onChange={e => handleConfigChange('value', e.target.value)}
                  placeholder="Value to compare against"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}
          </div>
        )}

        {node.type === 'Transform' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Source Field</label>
              <input
                type="text"
                value={node.config.field ?? ''}
                onChange={e => handleConfigChange('field', e.target.value)}
                placeholder="Field name"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Transformation Type</label>
              <select
                value={node.config.expressionType ?? 'uppercase'}
                onChange={e => handleConfigChange('expressionType', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="uppercase">UPPERCASE</option>
                <option value="lowercase">LOWERCASE</option>
                <option value="math">Math Expression (* 60)</option>
                <option value="concat">Concat Prefix/Suffix</option>
                <option value="dateFormat">ISO Datetime Format</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Output Field Alias</label>
              <input
                type="text"
                value={node.config.targetField ?? ''}
                onChange={e => handleConfigChange('targetField', e.target.value)}
                placeholder="New field name"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}

        {node.type === 'Output' && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Output Dataset Name</label>
            <input
              type="text"
              value={node.config.outputName ?? 'Curated_Game_Data'}
              onChange={e => handleConfigChange('outputName', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-800">
        <Button variant="danger" size="sm" className="w-full" icon={<Trash2 className="w-3.5 h-3.5" />} onClick={() => onDeleteNode(node.id)}>
          Delete Node
        </Button>
      </div>
    </div>
  );
}
