'use client';

import React from 'react';

export interface DataPoint {
  label: string;
  value: number;
}

export interface LineChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  fill?: boolean;
  showPoints?: boolean;
}

export function LineChart({ data, height = 180, color = '#6366f1', fill = true, showPoints = false }: LineChartProps) {
  if (!data || data.length === 0) return <div className="h-32 flex items-center justify-center text-slate-500 text-xs">No chart data</div>;

  const maxVal = Math.max(...data.map(d => d.value), 1);
  const minVal = Math.min(...data.map(d => d.value), 0);
  const range = maxVal - minVal || 1;

  const width = 600;
  const padding = 20;
  const graphWidth = width - padding * 2;
  const graphHeight = height - padding * 2;

  const points = data.map((d, idx) => {
    const x = padding + (idx / Math.max(data.length - 1, 1)) * graphWidth;
    const y = height - padding - ((d.value - minVal) / range) * graphHeight;
    return { x, y, value: d.value, label: d.label };
  });

  const pathD = points.reduce((acc, point, idx) => {
    return idx === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-[220px]">
        {/* Background Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = height - padding - ratio * graphHeight;
          return (
            <line
              key={i}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="#334155"
              strokeDasharray="3 3"
              strokeWidth="0.8"
            />
          );
        })}

        {/* Gradient Fill */}
        {fill && (
          <defs>
            <linearGradient id={`grad_${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>
        )}

        {fill && <path d={areaD} fill={`url(#grad_${color.replace('#', '')})`} />}
        <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {showPoints &&
          points.map((pt, i) => (
            <g key={i} className="group">
              <circle cx={pt.x} cy={pt.y} r="4" fill={color} className="transition-transform group-hover:scale-150 cursor-pointer" />
              <title>{`${pt.label}: ${pt.value}`}</title>
            </g>
          ))}
      </svg>
    </div>
  );
}

export function BarChart({ data, height = 180, color = '#10b981' }: { data: DataPoint[]; height?: number; color?: string }) {
  if (!data || data.length === 0) return <div className="h-32 flex items-center justify-center text-slate-500 text-xs">No chart data</div>;

  const maxVal = Math.max(...data.map(d => d.value), 1);
  const width = 600;
  const padding = 20;
  const barWidth = (width - padding * 2) / data.length - 8;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-[220px]">
        {data.map((d, idx) => {
          const barHeight = (d.value / maxVal) * (height - padding * 2);
          const x = padding + idx * (barWidth + 8);
          const y = height - padding - barHeight;

          return (
            <g key={idx} className="group">
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx="4"
                fill={color}
                opacity="0.85"
                className="hover:opacity-100 transition-opacity cursor-pointer"
              />
              <text x={x + barWidth / 2} y={height - 4} textAnchor="middle" fill="#94a3b8" fontSize="10">
                {d.label}
              </text>
              <title>{`${d.label}: ${d.value}`}</title>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
