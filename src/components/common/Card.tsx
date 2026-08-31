'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
}

export function Card({ children, hoverable = false, className, ...props }: CardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-slate-900/90 border border-slate-800/90 rounded-xl p-5 shadow-lg shadow-black/20 backdrop-blur-sm transition-all',
          hoverable && 'hover:border-slate-700 hover:shadow-xl hover:shadow-indigo-500/5',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={twMerge('flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800/80', className)}>
      <div>
        <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
