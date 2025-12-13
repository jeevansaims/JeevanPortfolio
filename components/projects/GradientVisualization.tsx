'use client';

import React, { useMemo } from 'react';
import { useProject } from '@/lib/projects/context';
import { Navigation, ArrowRight } from 'lucide-react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';

interface GradientVisualizationProps {
  /** ID of the code exercise that must be completed to show this */
  requiredBlockId: string;
  /** Title for the visualization */
  title?: string;
  /** Gradient vector components */
  gradX: number;
  gradY: number;
  /** Center point */
  centerX?: number;
  centerY?: number;
  /** Show directional derivative info */
  showDirectional?: boolean;
  /** Direction vectors to show (list of [dx, dy] pairs) */
  directions?: [number, number][];
}

export function GradientVisualization({
  requiredBlockId,
  title = 'Gradient Vector Visualization',
  gradX,
  gradY,
  centerX = 100,
  centerY = 100,
  showDirectional = false,
  directions = [],
}: GradientVisualizationProps) {
  const { isBlockCompleted } = useProject();
  const isUnlocked = isBlockCompleted(requiredBlockId);

  const gradientMagnitude = Math.sqrt(gradX * gradX + gradY * gradY);
  const gradientAngle = Math.atan2(gradY, gradX) * (180 / Math.PI);

  // Compute directional derivatives
  const directionalData = useMemo(() => {
    return directions.map(([dx, dy]) => {
      const magnitude = Math.sqrt(dx * dx + dy * dy);
      const unitX = dx / magnitude;
      const unitY = dy / magnitude;
      const derivative = gradX * unitX + gradY * unitY;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      return {
        direction: `(${dx.toFixed(1)}, ${dy.toFixed(1)})`,
        unitDir: `(${unitX.toFixed(2)}, ${unitY.toFixed(2)})`,
        derivative: derivative.toFixed(2),
        angle: angle.toFixed(0),
        dx,
        dy,
        unitX,
        unitY,
      };
    });
  }, [directions, gradX, gradY]);

  // Generate arrow data for visualization
  const arrowData = useMemo(() => {
    const scale = 0.3; // Scale factor for display
    const arrows = [];

    // Gradient arrow (green)
    const gradScale = scale / gradientMagnitude;
    arrows.push({
      type: 'gradient',
      x1: 0,
      y1: 0,
      x2: gradX * gradScale * 100,
      y2: gradY * gradScale * 100,
      color: '#22c55e',
      label: '∇V',
    });

    // Direction arrows (various colors)
    const colors = ['#60a5fa', '#c084fc', '#f97316', '#ec4899'];
    directionalData.forEach((dir, i) => {
      arrows.push({
        type: 'direction',
        x1: 0,
        y1: 0,
        x2: dir.unitX * 40,
        y2: dir.unitY * 40,
        color: colors[i % colors.length],
        label: `u${i + 1}`,
      });
    });

    return arrows;
  }, [gradX, gradY, gradientMagnitude, directionalData]);

  if (!isUnlocked) {
    return null;
  }

  return (
    <div className="my-8 bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-xl p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Navigation className="w-5 h-5 text-green-400" />
        <span className="text-sm font-semibold text-green-400 uppercase tracking-wide">
          {title}
        </span>
      </div>

      <p className="text-zinc-300 mb-6">
        The gradient vector points in the direction of <strong>steepest increase</strong>.
        At point (S₁*, S₂*) = ({centerX}, {centerY}), your portfolio value increases
        fastest in the direction of ∇V.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Gradient info */}
        <div className="space-y-4">
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-green-500/20">
            <h4 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              Gradient Vector
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">∇V =</span>
                <span className="text-white font-mono">({gradX.toFixed(1)}, {gradY.toFixed(1)})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Magnitude ||∇V|| =</span>
                <span className="text-green-400 font-mono">{gradientMagnitude.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Direction (angle) =</span>
                <span className="text-white font-mono">{gradientAngle.toFixed(1)}°</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <h4 className="text-white font-semibold mb-2">Interpretation</h4>
            <p className="text-sm text-zinc-400">
              The partial derivative ∂V/∂S₁ = {gradX.toFixed(1)} means a $1 increase
              in Asset 1's price increases portfolio value by ${gradX.toFixed(1)}.
            </p>
            <p className="text-sm text-zinc-400 mt-2">
              Similarly, ∂V/∂S₂ = {gradY.toFixed(1)} means Asset 2 contributes
              ${gradY.toFixed(1)} per $1 price increase.
            </p>
          </div>
        </div>

        {/* Vector diagram */}
        <div className="bg-zinc-900/50 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-4 text-center">Vector Diagram</h4>
          <div className="relative w-full h-64 flex items-center justify-center">
            <svg viewBox="-80 -80 160 160" className="w-full h-full max-w-xs">
              {/* Grid circles */}
              <circle cx="0" cy="0" r="60" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
              <circle cx="0" cy="0" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
              <circle cx="0" cy="0" r="20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />

              {/* Axes */}
              <line x1="-70" y1="0" x2="70" y2="0" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
              <line x1="0" y1="-70" x2="0" y2="70" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />

              {/* Arrow markers */}
              <defs>
                <marker id="arrowGreen" markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto">
                  <path d="M0,0 L0,4 L4,2 z" fill="#22c55e" />
                </marker>
              </defs>

              {/* Direction vectors (dashed, behind gradient) */}
              {directionalData.map((dir, i) => {
                const colors = ['#60a5fa', '#c084fc', '#f97316', '#ec4899'];
                return (
                  <g key={i}>
                    <line
                      x1="0"
                      y1="0"
                      x2={dir.unitX * 45}
                      y2={-dir.unitY * 45}
                      stroke={colors[i % colors.length]}
                      strokeWidth="1.5"
                      strokeDasharray="3 2"
                      opacity="0.7"
                    />
                    <text
                      x={dir.unitX * 55}
                      y={-dir.unitY * 55}
                      fill={colors[i % colors.length]}
                      fontSize="7"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      u{i + 1}
                    </text>
                  </g>
                );
              })}

              {/* Gradient vector (solid, on top) */}
              <line
                x1="0"
                y1="0"
                x2={(gradX / gradientMagnitude) * 50}
                y2={-(gradY / gradientMagnitude) * 50}
                stroke="#22c55e"
                strokeWidth="2"
                markerEnd="url(#arrowGreen)"
              />
              <text
                x={(gradX / gradientMagnitude) * 62}
                y={-(gradY / gradientMagnitude) * 62}
                fill="#22c55e"
                fontSize="8"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                ∇V
              </text>

              {/* Origin point */}
              <circle cx="0" cy="0" r="2" fill="white" />

              {/* Axis labels */}
              <text x="72" y="4" fill="rgba(255,255,255,0.5)" fontSize="7">S₁</text>
              <text x="4" y="-72" fill="rgba(255,255,255,0.5)" fontSize="7">S₂</text>
            </svg>
          </div>
          <p className="text-xs text-zinc-500 text-center mt-2">
            Green = gradient (steepest ascent). Dashed = test directions.
          </p>
        </div>
      </div>

      {/* Directional derivatives table */}
      {showDirectional && directionalData.length > 0 && (
        <div className="mt-6 bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
          <h4 className="text-white font-semibold mb-4">Directional Derivatives</h4>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div className="text-zinc-400 font-semibold">Direction u</div>
              <div className="text-zinc-400 font-semibold">Unit Vector</div>
              <div className="text-zinc-400 font-semibold">Angle</div>
              <div className="text-zinc-400 font-semibold">D_u V</div>
              {directionalData.map((dir, i) => (
                <React.Fragment key={i}>
                  <div className="text-white font-mono">{dir.direction}</div>
                  <div className="text-zinc-300 font-mono">{dir.unitDir}</div>
                  <div className="text-zinc-300">{dir.angle}°</div>
                  <div className={`font-mono font-semibold ${
                    parseFloat(dir.derivative) > 0 ? 'text-green-400' :
                    parseFloat(dir.derivative) < 0 ? 'text-red-400' : 'text-zinc-400'
                  }`}>
                    {dir.derivative}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
          <p className="text-xs text-zinc-500 mt-4">
            D_u V = ∇V · u gives the rate of change in direction u.
            Maximum when u aligns with ∇V, zero when perpendicular.
          </p>
        </div>
      )}
    </div>
  );
}
