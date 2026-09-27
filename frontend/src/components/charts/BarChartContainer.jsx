import React from 'react';
import { ChartContainer } from './ChartContainer';

/**
 * Clean SVG/CSS Bar Chart visual container for material consumption and resource allocation metrics
 */
export const BarChartContainer = ({
  title = 'Material Consumption Comparison',
  subtitle = 'Actual vs Budgeted daily material utilization',
  data = [
    { label: 'Mon', actual: 65, target: 80 },
    { label: 'Tue', actual: 85, target: 80 },
    { label: 'Wed', actual: 92, target: 80 },
    { label: 'Thu', actual: 78, target: 80 },
    { label: 'Fri', actual: 110, target: 85 },
    { label: 'Sat', actual: 45, target: 50 },
    { label: 'Sun', actual: 20, target: 30 },
  ],
}) => {
  const maxVal = Math.max(...data.map(d => Math.max(d.actual, d.target)), 100);

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      legend={
        <>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500" />
            <span>Actual Usage</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-200" />
            <span>Target Allocation</span>
          </div>
        </>
      }
    >
      <div className="flex items-end justify-between h-full w-full gap-2 px-2 pb-2 border-b border-slate-200">
        {data.map((item, idx) => {
          const actualHeight = `${(item.actual / maxVal) * 100}%`;
          const targetHeight = `${(item.target / maxVal) * 100}%`;

          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
              <div className="w-full flex items-end justify-center gap-1 h-full">
                {/* Actual bar */}
                <div
                  className="w-full max-w-[20px] bg-amber-500 hover:bg-amber-600 rounded-t transition-all relative"
                  style={{ height: actualHeight }}
                >
                  <span className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow pointer-events-none z-10 font-mono">
                    {item.actual}
                  </span>
                </div>
                {/* Target bar */}
                <div
                  className="w-full max-w-[20px] bg-slate-200 hover:bg-slate-300 rounded-t transition-all"
                  style={{ height: targetHeight }}
                />
              </div>
              <span className="text-[11px] font-medium text-slate-500 mt-1">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </ChartContainer>
  );
};
