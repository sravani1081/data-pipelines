'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'indigo' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  className,
  dot = false,
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-medium rounded-full border';

  const variants = {
    success: 'bg-emerald-950/60 border-emerald-800/60 text-emerald-400',
    warning: 'bg-amber-950/60 border-amber-800/60 text-amber-400',
    danger: 'bg-rose-950/60 border-rose-800/60 text-rose-400',
    info: 'bg-sky-950/60 border-sky-800/60 text-sky-400',
    neutral: 'bg-slate-800/80 border-slate-700 text-slate-300',
    indigo: 'bg-indigo-950/60 border-indigo-800/60 text-indigo-300',
    purple: 'bg-purple-950/60 border-purple-800/60 text-purple-300',
  };

  const dotColors = {
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    danger: 'bg-rose-400',
    info: 'bg-sky-400',
    neutral: 'bg-slate-400',
    indigo: 'bg-indigo-400',
    purple: 'bg-purple-400',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  return (
    <span className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}>
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0 animate-pulse', dotColors[variant])} />}
      {children}
    </span>
  );
}
