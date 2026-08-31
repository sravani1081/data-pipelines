'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { useApp } from '@/context/AppContext';
import { SourceType } from '@/types';

export interface SourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SourceModal({ isOpen, onClose }: SourceModalProps) {
  const { createDataSource, activeProject } = useApp();
  const [name, setName] = useState('');
  const [type, setType] = useState<SourceType>('CSV');
  const [frequency, setFrequency] = useState('Hourly');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !activeProject) return;

    await createDataSource({
      projectId: activeProject.id,
      name,
      type,
      status: 'active',
      recordCount: 0,
      lastIngestionAt: new Date().toISOString(),
      frequency,
      ownerId: 'usr_alex',
      config: { streamRate: 100 },
    });

    setName('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register Data Source" subtitle="Add CSV, JSON, Event Stream, or Synthetic Game Data Generator">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Source Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g., PC Match Logs Stream"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Source Type</label>
            <select
              value={type}
              onChange={e => setType(e.target.value as SourceType)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="CSV">CSV File</option>
              <option value="JSON">JSON Document</option>
              <option value="NDJSON">NDJSON Log</option>
              <option value="Telemetry Stream">Telemetry Stream</option>
              <option value="Synthetic Generator">Synthetic Game Data Generator</option>
              <option value="Game Events">Game Events API</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Ingestion Frequency</label>
            <select
              value={frequency}
              onChange={e => setFrequency(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Real-time (500/s)">Real-time (500/s)</option>
              <option value="Every 5 mins">Every 5 mins</option>
              <option value="Hourly">Hourly</option>
              <option value="Daily">Daily</option>
              <option value="Manual">Manual Trigger</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Register Source
          </Button>
        </div>
      </form>
    </Modal>
  );
}
