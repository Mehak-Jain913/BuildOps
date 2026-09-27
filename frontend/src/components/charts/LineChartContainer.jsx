import React from 'react';
import { ChartContainer } from './ChartContainer';

/**
 * Clean SVG Line Chart visual container for labour attendance & productivity trends
 */
export const LineChartContainer = ({
  title = 'Labour Turnout & Productivity Trend',
  subtitle = 'Daily site attendance rate across active trades',
  data = [
    { label: 'Wk 1', value: 82 },
    { label: 'Wk 2', value: 88 },
    { label: 'Wk 3', value: 76 },
    { label: 'Wk 4', value: 94 },
    { label: 'Wk 5', value: 91 },
    { label: 'Wk 6', value: 97 },
  ],
}) => {
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 300 + 20;
    const y = 140 - (d.value / 100) * 110;
    return `${x},${y}`;
  }).join(' ');

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      legend={
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1 bg-slate-900 rounded" />
          <span>Attendance Rate (%)</span>
        </div>
      }
    >
      <div className="relative w-full h-full flex flex-col justify-end">
        <svg viewBox="0 0 340 160" className="w-full h-full overflow-visible">
          {/* Grid lines */}
          <line x1="20" y1="30" x2="320" y2="30" stroke="#e2e8f0" strokeDasharray="3 3" />
          <line x1="20" y1="85" x2="320" y2="85" stroke="#e2e8f0" strokeDasharray="3 3" />
          <line x1="20" y1="140" x2="320" y2="140" stroke="#cbd5e1" />

          {/* Area fill */}
          <polygon
            points={`20,140 ${points} 320,140`}
            fill="rgba(15, 23, 42, 0.05)"
          />

          {/* Polyline */}
          <polyline
            fill="none"
            stroke="#0f172a"
            strokeWidth="2.5"
            points={points}
          />

          {/* Data Points */}
          {data.map((d, i) => {
            const x = (i / (data.length - 1)) * 300 + 20;
            const y = 140 - (d.value / 100) * 110;
            return (
              <g key={i} className="group cursor-pointer">
                <circle cx={x} cy={y} r="4" fill="#d97706" stroke="#ffffff" strokeWidth="2" />
                <text
                  x={x}
                  y={y - 10}
                  textAnchor="middle"
                  className="text-[10px] font-bold fill-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {d.value}%
                </text>
                <text
                  x={x}
                  y="156"
                  textAnchor="middle"
                  className="text-[10px] fill-slate-500 font-medium"
                >
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </ChartContainer>
  );
};
