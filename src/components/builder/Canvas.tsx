'use client';

import React, { useState } from 'react';
import { Pipeline, PipelineNode, PipelineEdge, NodeType } from '@/types/pipeline';
import { NodePalette } from './NodePalette';
import { ConfigPanel } from './ConfigPanel';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useApp } from '@/context/AppContext';
import { runPipelineEngine } from '@/lib/engine/runner';
import { Play, Save, CheckCircle2, AlertTriangle, Workflow, Plus, Trash2, Layers } from 'lucide-react';
import { generateId } from '@/lib/utils/helpers';

export function Canvas() {
  const { pipelines, activeProject, datasets, updatePipeline, addPipelineRun, saveDataset } = useApp();

  const currentPipeline = pipelines.find(p => p.projectId === activeProject?.id) || pipelines[0];

  const [nodes, setNodes] = useState<PipelineNode[]>(currentPipeline?.nodes || []);
  const [edges, setEdges] = useState<PipelineEdge[]>(currentPipeline?.edges || []);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [connectingSourceId, setConnectingSourceId] = useState<string | null>(null);
  const [executionMessage, setExecutionMessage] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleAddNode = (type: NodeType) => {
    const newNode: PipelineNode = {
      id: generateId('node'),
      type,
      label: `${type} Node`,
      position: { x: 250 + Math.random() * 100, y: 150 + Math.random() * 100 },
      config: type === 'Source' ? { datasetId: datasets[0]?.id } : {},
    };
    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
  };

  const handleUpdateNode = (updated: PipelineNode) => {
    setNodes(prev => prev.map(n => (n.id === updated.id ? updated : n)));
  };

  const handleDeleteNode = (id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    setEdges(prev => prev.filter(e => e.sourceNodeId !== id && e.targetNodeId !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
  };

  const handleNodeClick = (id: string) => {
    if (connectingSourceId) {
      if (connectingSourceId !== id) {
        // Create Edge connection
        const newEdge: PipelineEdge = {
          id: generateId('edge'),
          sourceNodeId: connectingSourceId,
          targetNodeId: id,
        };
        setEdges(prev => [...prev, newEdge]);
      }
      setConnectingSourceId(null);
    } else {
      setSelectedNodeId(id);
    }
  };

  const handleRunPipeline = async () => {
    if (!currentPipeline) return;
    setIsExecuting(true);
    setExecutionMessage('Planner optimizing DAG & initializing workers...');

    try {
      const activePipeObj: Pipeline = {
        ...currentPipeline,
        nodes,
        edges,
      };

      const result = await runPipelineEngine(activePipeObj, datasets);

      await addPipelineRun(result.run);

      if (result.run.status === 'Succeeded') {
        setExecutionMessage(
          `Run #${result.run.id.slice(-6)} Succeeded! Processed ${result.run.recordsProcessed} records in ${result.run.durationMs}ms.`
        );
      } else {
        setExecutionMessage(`Pipeline Execution Failed: ${result.run.errorSummary}`);
      }
    } catch (err: any) {
      setExecutionMessage(`Execution Error: ${err.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSavePipeline = async () => {
    if (!currentPipeline) return;
    await updatePipeline({
      ...currentPipeline,
      nodes,
      edges,
      updatedAt: new Date().toISOString(),
    });
    setExecutionMessage('Pipeline configuration saved to storage!');
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || null;

  return (
    <div className="flex h-[calc(100vh-6rem)] -m-6 overflow-hidden bg-slate-950">
      {/* Node Palette */}
      <NodePalette onAddNode={handleAddNode} />

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Canvas Toolbar */}
        <div className="h-14 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <Workflow className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-sm font-bold text-slate-100">{currentPipeline?.name || 'Interactive DAG Builder'}</h2>
              <p className="text-[10px] text-slate-400 font-mono">
                {nodes.length} Nodes • {edges.length} Edges • Version v{currentPipeline?.version || 1}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {connectingSourceId && (
              <span className="text-xs text-amber-400 font-medium animate-pulse">
                Click target node to connect edge...
              </span>
            )}
            <Button variant="outline" size="sm" icon={<Save className="w-3.5 h-3.5" />} onClick={handleSavePipeline}>
              Save Draft
            </Button>
            <Button variant="primary" size="sm" icon={<Play className="w-3.5 h-3.5" />} disabled={isExecuting} onClick={handleRunPipeline}>
              {isExecuting ? 'Running...' : 'Execute Pipeline'}
            </Button>
          </div>
        </div>

        {/* Execution Message Banner */}
        {executionMessage && (
          <div className="px-6 py-2 bg-indigo-950/80 border-b border-indigo-800/60 text-xs text-indigo-200 flex items-center justify-between">
            <span className="font-mono">{executionMessage}</span>
            <button onClick={() => setExecutionMessage(null)} className="text-indigo-400 hover:text-white">
              Dismiss
            </button>
          </div>
        )}

        {/* SVG Canvas Grid */}
        <div className="flex-1 relative overflow-auto bg-slate-950 custom-scrollbar select-none" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {edges.map(edge => {
              const srcNode = nodes.find(n => n.id === edge.sourceNodeId);
              const tgtNode = nodes.find(n => n.id === edge.targetNodeId);
              if (!srcNode || !tgtNode) return null;

              const x1 = srcNode.position.x + 100;
              const y1 = srcNode.position.y + 35;
              const x2 = tgtNode.position.x;
              const y2 = tgtNode.position.y + 35;
              const dx = (x2 - x1) / 2;

              const pathD = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

              return (
                <g key={edge.id}>
                  <path d={pathD} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeDasharray="6 3" className="animate-pulse" />
                  <circle cx={x2} cy={y2} r="4" fill="#6366f1" />
                </g>
              );
            })}
          </svg>

          {/* Render Nodes */}
          {nodes.map(node => {
            const isSelected = selectedNodeId === node.id;
            const isConnecting = connectingSourceId === node.id;

            return (
              <div
                key={node.id}
                onClick={() => handleNodeClick(node.id)}
                style={{ left: `${node.position.x}px`, top: `${node.position.y}px` }}
                className={`absolute w-52 p-3 rounded-xl bg-slate-900 border transition-all cursor-pointer z-10 shadow-xl ${
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-500/30'
                    : isConnecting
                    ? 'border-amber-500 ring-2 ring-amber-500/30'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Badge variant="indigo" size="sm">
                    {node.type}
                  </Badge>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setConnectingSourceId(node.id);
                    }}
                    title="Connect edge"
                    className="p-1 text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    <Workflow className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h4 className="text-xs font-bold text-slate-100 mt-2 truncate">{node.label}</h4>
                <p className="text-[10px] text-slate-400 font-mono mt-1">ID: {node.id.slice(-6)}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Node Config Drawer */}
      <ConfigPanel
        node={selectedNode}
        onUpdateNode={handleUpdateNode}
        onDeleteNode={handleDeleteNode}
        onClose={() => setSelectedNodeId(null)}
      />
    </div>
  );
}
