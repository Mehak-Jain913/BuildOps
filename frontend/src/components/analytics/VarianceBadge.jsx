import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const VarianceBadge = ({ value = 0, suffix = '%', reverseColor = false, size = 'md' }) => {
  const isPositive = value > 0;
  const isNegative = value < 0;
  const isZero = value === 0;

  // Standard: positive is good (green), negative is bad (red)
  // Reverse: positive is bad (red, e.g. over-budget / high cost variance), negative is good (green)
  let isGood = isPositive;
  if (reverseColor) {
    isGood = isNegative;
  }

  let bgClass = 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
  let icon = <TrendingUp className="w-3.5 h-3.5" />;

  if (isZero) {
    bgClass = 'bg-slate-100 text-slate-700 border-slate-200';
    icon = <Minus className="w-3.5 h-3.5" />;
  } else if (!isGood) {
    bgClass = 'bg-red-500/10 text-red-700 border-red-500/20';
    icon = isNegative ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />;
  } else {
    icon = isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />;
  }

  const formattedVal = `${value > 0 ? '+' : ''}${value}${suffix}`;

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold font-mono border rounded-md ${bgClass} ${
        size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
      }`}
    >
      {icon}
      <span>{formattedVal}</span>
    </span>
  );
};
