'use client';

import { useMemo } from 'react';
import { useProject } from '@/lib/projects/context';
import { Layers } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell,
} from 'recharts';

interface SurfaceVisualizationProps {
  /** ID of the code exercise that must be completed to show this */
  requiredBlockId: string;
  /** Title for the visualization */
  title?: string;
  /** Description text */
  description?: string;
  /** Type of visualization */
  type: 'contour' | 'heatmap' | 'cross-section';
  /** Parameters for portfolio function V = w1*S1 + w2*S2 + phi(S1, S2) */
  w1?: number;
  w2?: number;
  /** Center point for analysis */
  s1Center?: number;
  s2Center?: number;
  /** Range to display */
  range?: number;
}

// Portfolio value function: V = w1*S1 + w2*S2 + k*sin(S1/10)*cos(S2/10)
function portfolioValue(s1: number, s2: number, w1: number, w2: number, k: number = 50): number {
  return w1 * s1 + w2 * s2 + k * Math.sin(s1 / 20) * Math.cos(s2 / 20);
}

export function SurfaceVisualization({
  requiredBlockId,
  title = 'Portfolio Surface Visualization',
  description,
  type,
  w1 = 100,
  w2 = 80,
  s1Center = 100,
  s2Center = 100,
  range = 40,
}: SurfaceVisualizationProps) {
  const { isBlockCompleted } = useProject();
  const isUnlocked = isBlockCompleted(requiredBlockId);

  // Generate contour data
  const contourData = useMemo(() => {
    if (type !== 'contour') return [];

    const levels = [9500, 10000, 10500, 11000, 11500, 12000];
    const contours: { level: number; points: { x: number; y: number }[] }[] = [];

    levels.forEach((level) => {
      const points: { x: number; y: number }[] = [];
      const numPoints = 50;

      // Find points where V ≈ level
      for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * 2 * Math.PI;
        // Approximate contour by searching along radial lines
        for (let r = 5; r <= range; r += 2) {
          const s1 = s1Center + r * Math.cos(angle);
          const s2 = s2Center + r * Math.sin(angle);
          const v = portfolioValue(s1, s2, w1, w2);
          if (Math.abs(v - level) < 150) {
            points.push({ x: s1, y: s2 });
            break;
          }
        }
      }
      if (points.length > 3) {
        contours.push({ level, points });
      }
    });

    return contours;
  }, [type, w1, w2, s1Center, s2Center, range]);

  // Generate heatmap data
  const heatmapData = useMemo(() => {
    if (type !== 'heatmap') return [];

    const points: { s1: number; s2: number; value: number; color: string }[] = [];
    const gridSize = 20;
    const step = (range * 2) / gridSize;

    const minVal = portfolioValue(s1Center - range, s2Center - range, w1, w2);
    const maxVal = portfolioValue(s1Center + range, s2Center + range, w1, w2);

    for (let i = 0; i <= gridSize; i++) {
      for (let j = 0; j <= gridSize; j++) {
        const s1 = s1Center - range + i * step;
        const s2 = s2Center - range + j * step;
        const value = portfolioValue(s1, s2, w1, w2);
        const normalized = (value - minVal) / (maxVal - minVal);
        points.push({
          s1,
          s2,
          value,
          color: `hsl(${120 + normalized * 120}, 70%, ${30 + normalized * 40}%)`,
        });
      }
    }

    return points;
  }, [type, w1, w2, s1Center, s2Center, range]);

  // Generate cross-section data
  const crossSectionData = useMemo(() => {
    if (type !== 'cross-section') return { s1Fixed: [], s2Fixed: [] };

    const s1Fixed: { s2: number; value: number }[] = [];
    const s2Fixed: { s1: number; value: number }[] = [];

    for (let i = -range; i <= range; i += 2) {
      s1Fixed.push({
        s2: s2Center + i,
        value: portfolioValue(s1Center, s2Center + i, w1, w2),
      });
      s2Fixed.push({
        s1: s1Center + i,
        value: portfolioValue(s1Center + i, s2Center, w1, w2),
      });
    }

    return { s1Fixed, s2Fixed };
  }, [type, w1, w2, s1Center, s2Center, range]);

  if (!isUnlocked) {
    return null;
  }

  return (
    <div className="my-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-5 h-5 text-blue-400" />
        <span className="text-sm font-semibold text-blue-400 uppercase tracking-wide">
          {title}
        </span>
      </div>

      {description && <p className="text-zinc-300 mb-6">{description}</p>}

      {/* Heatmap visualization */}
      {type === 'heatmap' && (
        <div className="bg-zinc-900/50 rounded-lg p-4">
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                type="number"
                dataKey="s1"
                domain={[s1Center - range, s1Center + range]}
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                label={{
                  value: 'Asset 1 Price (S₁)',
                  position: 'bottom',
                  offset: 20,
                  fill: 'rgba(255,255,255,0.7)',
                  fontSize: 12,
                }}
              />
              <YAxis
                type="number"
                dataKey="s2"
                domain={[s2Center - range, s2Center + range]}
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                label={{
                  value: 'Asset 2 Price (S₂)',
                  angle: -90,
                  position: 'insideLeft',
                  fill: 'rgba(255,255,255,0.7)',
                  fontSize: 12,
                }}
              />
              <ZAxis type="number" dataKey="value" range={[100, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(24, 24, 27, 0.95)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white',
                }}
                formatter={(value: number, name: string) => {
                  if (name === 'value') return [`$${value.toFixed(0)}`, 'Portfolio Value'];
                  return [value.toFixed(1), name];
                }}
              />
              <Scatter data={heatmapData} shape="square">
                {heatmapData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <p className="text-sm text-zinc-400 mt-4 text-center">
            Heatmap of portfolio value V(S₁, S₂). Brighter colors = higher value.
          </p>
        </div>
      )}

      {/* Cross-section visualization */}
      {type === 'cross-section' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-zinc-900/50 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-4">
              Cross-section: S₁ fixed at {s1Center}
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={crossSectionData.s1Fixed} margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="s2"
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }}
                  label={{
                    value: 'S₂',
                    position: 'bottom',
                    offset: 10,
                    fill: 'rgba(255,255,255,0.7)',
                    fontSize: 12,
                  }}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }}
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(24, 24, 27, 0.95)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white',
                  }}
                  formatter={(value: number) => [`$${value.toFixed(0)}`, 'V']}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-xs text-zinc-500 mt-2">
              How V changes as S₂ varies (S₁ held constant)
            </p>
          </div>

          <div className="bg-zinc-900/50 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-4">
              Cross-section: S₂ fixed at {s2Center}
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={crossSectionData.s2Fixed} margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="s1"
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }}
                  label={{
                    value: 'S₁',
                    position: 'bottom',
                    offset: 10,
                    fill: 'rgba(255,255,255,0.7)',
                    fontSize: 12,
                  }}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }}
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(24, 24, 27, 0.95)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white',
                  }}
                  formatter={(value: number) => [`$${value.toFixed(0)}`, 'V']}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#c084fc"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-xs text-zinc-500 mt-2">
              How V changes as S₁ varies (S₂ held constant)
            </p>
          </div>
        </div>
      )}

      {/* Key values */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900/50 rounded-lg p-3 border border-zinc-800">
          <div className="text-xs text-zinc-400 mb-1">Weight w₁</div>
          <div className="text-lg font-bold text-white">{w1}</div>
        </div>
        <div className="bg-zinc-900/50 rounded-lg p-3 border border-zinc-800">
          <div className="text-xs text-zinc-400 mb-1">Weight w₂</div>
          <div className="text-lg font-bold text-white">{w2}</div>
        </div>
        <div className="bg-zinc-900/50 rounded-lg p-3 border border-zinc-800">
          <div className="text-xs text-zinc-400 mb-1">Center S₁*</div>
          <div className="text-lg font-bold text-blue-400">${s1Center}</div>
        </div>
        <div className="bg-zinc-900/50 rounded-lg p-3 border border-zinc-800">
          <div className="text-xs text-zinc-400 mb-1">Center S₂*</div>
          <div className="text-lg font-bold text-purple-400">${s2Center}</div>
        </div>
      </div>
    </div>
  );
}
