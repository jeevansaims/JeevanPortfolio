'use client';

import { useMemo } from 'react';
import { useProject } from '@/lib/projects/context';
import { TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceDot,
  ResponsiveContainer,
} from 'recharts';

interface ProfitVisualizationProps {
  /** ID of the code exercise that must be completed to show this */
  requiredBlockId: string;
  /** Parameters for the profit function */
  alpha: number;
  beta: number;
  c: number;
}

export function ProfitVisualization({
  requiredBlockId,
  alpha,
  beta,
  c,
}: ProfitVisualizationProps) {
  const { isBlockCompleted } = useProject();
  const isUnlocked = isBlockCompleted(requiredBlockId);

  // Calculate profit curve data
  const { data, optimalX, maxProfit } = useMemo(() => {
    const optX = (alpha - c) / (2 * beta);
    const maxP = alpha * optX - beta * optX * optX - c * optX;
    const xMax = optX * 2.5;

    const points = [];
    const numPoints = 100;
    for (let i = 0; i <= numPoints; i++) {
      const x = (i / numPoints) * xMax;
      const profit = alpha * x - beta * x * x - c * x;
      points.push({ x: Math.round(x), profit: parseFloat(profit.toFixed(2)) });
    }

    return { data: points, optimalX: optX, maxProfit: maxP };
  }, [alpha, beta, c]);

  if (!isUnlocked) {
    return null;
  }

  // Calculate profit at 2x optimal for comparison
  const profitAt2x = alpha * (2 * optimalX) - beta * (2 * optimalX) ** 2 - c * (2 * optimalX);

  return (
    <div className="my-8 bg-gradient-to-br from-phthalo-500/10 to-blue-500/10 border border-phthalo-500/30 rounded-xl p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-phthalo-400" />
        <span className="text-sm font-semibold text-phthalo-400 uppercase tracking-wide">
          Profit Curve Visualization
        </span>
      </div>

      <p className="text-zinc-300 mb-6">
        Here's the profit function P(x) = {alpha}x - {beta}x² - {c}x you just analyzed.
        Notice how profit increases initially, reaches a maximum at x* = {optimalX.toFixed(0)},
        then decreases due to market impact.
      </p>

      {/* Recharts Line Chart */}
      <div className="bg-zinc-900/50 rounded-lg p-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="x"
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
              label={{
                value: 'Trade Size (shares)',
                position: 'bottom',
                offset: 0,
                fill: 'rgba(255,255,255,0.7)',
                fontSize: 12,
              }}
            />
            <YAxis
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
              label={{
                value: 'Profit ($)',
                angle: -90,
                position: 'insideLeft',
                fill: 'rgba(255,255,255,0.7)',
                fontSize: 12,
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(24, 24, 27, 0.95)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: 'white',
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Profit']}
              labelFormatter={(label) => `Trade Size: ${label} shares`}
            />

            {/* Zero line */}
            <ReferenceLine y={0} stroke="rgba(255,255,255,0.3)" />

            {/* Vertical line at optimal x */}
            <ReferenceLine
              x={Math.round(optimalX)}
              stroke="#26a269"
              strokeDasharray="6 4"
              label={{
                value: `x* = ${optimalX.toFixed(0)}`,
                position: 'top',
                fill: '#26a269',
                fontSize: 12,
              }}
            />

            {/* Profit curve */}
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#26a269"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#26a269', stroke: 'white', strokeWidth: 2 }}
            />

            {/* Optimal point marker */}
            <ReferenceDot
              x={Math.round(optimalX)}
              y={parseFloat(maxProfit.toFixed(2))}
              r={8}
              fill="#26a269"
              stroke="white"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Key insights */}
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
          <div className="text-sm text-zinc-400 mb-1">Optimal Trade Size</div>
          <div className="text-2xl font-bold text-white">{optimalX.toFixed(0)} shares</div>
        </div>
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
          <div className="text-sm text-zinc-400 mb-1">Maximum Profit</div>
          <div className="text-2xl font-bold text-green-400">${maxProfit.toFixed(2)}</div>
        </div>
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
          <div className="text-sm text-zinc-400 mb-1">Profit at 2x Optimal</div>
          <div className="text-2xl font-bold text-red-400">${profitAt2x.toFixed(2)}</div>
        </div>
      </div>

      <p className="text-sm text-zinc-500 mt-4">
        Notice how trading at 2x the optimal size actually reduces profit significantly due to the
        quadratic market impact term. This is why size discipline matters!
      </p>
    </div>
  );
}
