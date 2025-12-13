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
  Legend,
} from 'recharts';

interface KellyVisualizationProps {
  requiredBlockId: string;
  mu: number;
  sigma: number;
}

export function KellyVisualization({ requiredBlockId, mu, sigma }: KellyVisualizationProps) {
  const { isBlockCompleted } = useProject();
  const isUnlocked = isBlockCompleted(requiredBlockId);

  const { data, optimalLeverage, maxReturn } = useMemo(() => {
    const optL = mu / (sigma * sigma);
    const maxR = (mu * mu) / (2 * sigma * sigma);
    const maxLeverage = Math.max(optL * 2.5, 5);

    const points = [];
    const numPoints = 100;
    for (let i = 0; i <= numPoints; i++) {
      const leverage = (i / numPoints) * maxLeverage;
      const riskAdjustedReturn = leverage * mu - 0.5 * leverage * leverage * sigma * sigma;
      const expectedReturn = leverage * mu;
      points.push({
        leverage: parseFloat(leverage.toFixed(2)),
        riskAdjusted: parseFloat((riskAdjustedReturn * 100).toFixed(2)),
        expected: parseFloat((expectedReturn * 100).toFixed(2)),
      });
    }

    return { data: points, optimalLeverage: optL, maxReturn: maxR };
  }, [mu, sigma]);

  if (!isUnlocked) {
    return null;
  }

  // Calculate values at different leverage points for comparison
  const returnAt1x = mu * 100;
  const returnAtOptimal = maxReturn * 100;
  const returnAt2xOptimal =
    (2 * optimalLeverage * mu - 0.5 * (2 * optimalLeverage) ** 2 * sigma * sigma) * 100;

  return (
    <div className="my-8 bg-gradient-to-br from-phthalo-500/10 to-blue-500/10 border border-phthalo-500/30 rounded-xl p-6 md:p-8">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-phthalo-400" />
        <span className="text-sm font-semibold text-phthalo-400 uppercase tracking-wide">
          Kelly Criterion Visualization
        </span>
      </div>

      <p className="text-zinc-300 mb-6">
        The chart shows risk-adjusted return R(ℓ) = ℓμ - ½ℓ²σ² with μ = {(mu * 100).toFixed(0)}% and
        σ = {(sigma * 100).toFixed(0)}%. The dashed line shows raw expected return (ignoring risk).
        Notice how risk-adjusted return peaks at ℓ* = {optimalLeverage.toFixed(2)}x, then
        *decreases* even as expected return keeps rising.
      </p>

      <div className="bg-zinc-900/50 rounded-lg p-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="leverage"
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
              label={{
                value: 'Leverage (ℓ)',
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
                value: 'Return (%)',
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
              formatter={(value: number, name: string) => [
                `${value.toFixed(2)}%`,
                name === 'riskAdjusted' ? 'Risk-Adjusted' : 'Expected (Raw)',
              ]}
              labelFormatter={(label) => `Leverage: ${label}x`}
            />
            <Legend
              wrapperStyle={{ color: 'white' }}
              formatter={(value) => (value === 'riskAdjusted' ? 'Risk-Adjusted Return' : 'Expected Return (Raw)')}
            />

            <ReferenceLine y={0} stroke="rgba(255,255,255,0.3)" />

            <ReferenceLine
              x={parseFloat(optimalLeverage.toFixed(2))}
              stroke="#26a269"
              strokeDasharray="6 4"
              label={{
                value: `ℓ* = ${optimalLeverage.toFixed(2)}`,
                position: 'top',
                fill: '#26a269',
                fontSize: 12,
              }}
            />

            {/* Expected return (raw) - dashed */}
            <Line
              type="monotone"
              dataKey="expected"
              stroke="#6b7280"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />

            {/* Risk-adjusted return - solid */}
            <Line
              type="monotone"
              dataKey="riskAdjusted"
              stroke="#26a269"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#26a269', stroke: 'white', strokeWidth: 2 }}
            />

            <ReferenceDot
              x={parseFloat(optimalLeverage.toFixed(2))}
              y={parseFloat((maxReturn * 100).toFixed(2))}
              r={8}
              fill="#26a269"
              stroke="white"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
          <div className="text-sm text-zinc-400 mb-1">At 1x (No Leverage)</div>
          <div className="text-2xl font-bold text-white">{returnAt1x.toFixed(1)}%</div>
        </div>
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
          <div className="text-sm text-zinc-400 mb-1">At Optimal ({optimalLeverage.toFixed(1)}x)</div>
          <div className="text-2xl font-bold text-green-400">{returnAtOptimal.toFixed(1)}%</div>
        </div>
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
          <div className="text-sm text-zinc-400 mb-1">At 2x Optimal ({(2 * optimalLeverage).toFixed(1)}x)</div>
          <div className="text-2xl font-bold text-red-400">{returnAt2xOptimal.toFixed(1)}%</div>
        </div>
      </div>

      <p className="text-sm text-zinc-500 mt-4">
        The Kelly Criterion finds the sweet spot: more leverage than 1x boosts returns, but too much
        leverage actually *hurts* risk-adjusted returns. At 2x the optimal, the risk penalty
        overwhelms the extra expected return.
      </p>
    </div>
  );
}
