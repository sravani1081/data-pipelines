'use client';

import React, { useState } from 'react';
import { Card, CardHeader } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { useApp } from '@/context/AppContext';
import { CheckSquare, Plus, Clock, User, Calendar } from 'lucide-react';
import { TaskStatus } from '@/types/observability';

export function TaskBoard() {
  const { tasks } = useApp();
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  const columns: { status: TaskStatus; label: string }[] = [
    { status: 'todo', label: 'To Do' },
    { status: 'in_progress', label: 'In Progress' },
    { status: 'review', label: 'Under Review' },
    { status: 'done', label: 'Completed' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-emerald-400" />
            Data Engineering Task Board
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Kanban board for pipeline migrations, schema audits, SLA fixes, and data quality tasks
          </p>
        </div>

        <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
          New Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {columns.map(col => {
          const colTasks = tasks.filter(t => t.status === col.status);
          return (
            <div key={col.status} className="space-y-3">
              <div className="flex items-center justify-between px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-slate-300">
                <span>{col.label}</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">{colTasks.length}</span>
              </div>

              <div className="space-y-3">
                {colTasks.map(task => (
                  <Card key={task.id} hoverable className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="text-xs font-bold text-slate-100">{task.title}</h4>
                      <Badge variant={task.priority === 'high' ? 'danger' : 'warning'} size="sm">
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{task.description}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-800">
                      <span>Due: {task.dueDate}</span>
                      <span>{task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} Subtasks</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
