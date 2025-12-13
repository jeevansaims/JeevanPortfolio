'use client';

import { useMemo } from 'react';
import { useProject } from '@/lib/projects/context';
import { Grid3X3, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface HessianVisualizationProps {
  /** ID of the code exercise that must be completed to show this */
  requiredBlockId: string;
  /** Title for the visualization */
  title?: string;
  /** Hessian matrix entries */
  h11: number;
  h12: number;
  h22: number;
}

export function HessianVisualization({
  requiredBlockId,
  title = 'Hessian Matrix Analysis',
  h11,
  h12,
  h22,
}: HessianVisualizationProps) {
  const { isBlockCompleted } = useProject();
  const isUnlocked = isBlockCompleted(requiredBlockId);

  // Compute eigenvalues and eigenvectors
  const { lambda1, lambda2, v1, v2, determinant, trace, classification } = useMemo(() => {
    // For 2x2 symmetric matrix [[h11, h12], [h12, h22]]
    // Eigenvalues: λ = (trace ± sqrt(trace² - 4*det)) / 2
    const tr = h11 + h22;
    const det = h11 * h22 - h12 * h12;
    const discriminant = tr * tr - 4 * det;

    let l1: number, l2: number;
    if (discriminant >= 0) {
      l1 = (tr + Math.sqrt(discriminant)) / 2;
      l2 = (tr - Math.sqrt(discriminant)) / 2;
    } else {
      // Complex eigenvalues (shouldn't happen for symmetric matrix)
      l1 = tr / 2;
      l2 = tr / 2;
    }

    // Eigenvectors for symmetric 2x2
    let vec1: [number, number] = [1, 0];
    let vec2: [number, number] = [0, 1];

    if (Math.abs(h12) > 0.001) {
      vec1 = [l1 - h22, h12];
      const mag1 = Math.sqrt(vec1[0] ** 2 + vec1[1] ** 2);
      vec1 = [vec1[0] / mag1, vec1[1] / mag1];

      vec2 = [l2 - h22, h12];
      const mag2 = Math.sqrt(vec2[0] ** 2 + vec2[1] ** 2);
      vec2 = [vec2[0] / mag2, vec2[1] / mag2];
    } else if (Math.abs(h11 - h22) < 0.001) {
      // Identity-like, any orthogonal basis works
      vec1 = [1, 0];
      vec2 = [0, 1];
    }

    // Classification
    let classif = '';
    if (l1 > 0.001 && l2 > 0.001) {
      classif = 'Positive definite (bowl curving up)';
    } else if (l1 < -0.001 && l2 < -0.001) {
      classif = 'Negative definite (bowl curving down)';
    } else if ((l1 > 0.001 && l2 < -0.001) || (l1 < -0.001 && l2 > 0.001)) {
      classif = 'Indefinite (saddle shape)';
    } else if (Math.abs(l1) < 0.001 || Math.abs(l2) < 0.001) {
      classif = 'Semidefinite (flat in one direction)';
    } else {
      classif = 'Near-zero curvature';
    }

    return {
      lambda1: l1,
      lambda2: l2,
      v1: vec1,
      v2: vec2,
      determinant: det,
      trace: tr,
      classification: classif,
    };
  }, [h11, h12, h22]);

  if (!isUnlocked) {
    return null;
  }

  const getIcon = (value: number) => {
    if (value > 0.001) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (value < -0.001) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-zinc-400" />;
  };

  const getColor = (value: number) => {
    if (value > 0.001) return 'text-green-400';
    if (value < -0.001) return 'text-red-400';
    return 'text-zinc-400';
  };

  return (
    <div className="my-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Grid3X3 className="w-5 h-5 text-purple-400" />
        <span className="text-sm font-semibold text-purple-400 uppercase tracking-wide">
          {title}
        </span>
      </div>

      <p className="text-zinc-300 mb-6">
        The Hessian matrix captures how the surface <strong>curves</strong> in different directions.
        Its eigenvalues tell us the principal curvatures.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Hessian Matrix Display */}
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-purple-500/20">
          <h4 className="text-purple-400 font-semibold mb-4">Hessian Matrix H</h4>

          {/* Matrix visualization */}
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl text-zinc-400">[</span>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="px-4 py-2 bg-zinc-800 rounded">
                  <span className="text-white font-mono">{h11.toFixed(2)}</span>
                  <div className="text-xs text-zinc-500">∂²V/∂S₁²</div>
                </div>
                <div className="px-4 py-2 bg-zinc-800 rounded">
                  <span className="text-white font-mono">{h12.toFixed(2)}</span>
                  <div className="text-xs text-zinc-500">∂²V/∂S₁∂S₂</div>
                </div>
                <div className="px-4 py-2 bg-zinc-800 rounded">
                  <span className="text-white font-mono">{h12.toFixed(2)}</span>
                  <div className="text-xs text-zinc-500">∂²V/∂S₂∂S₁</div>
                </div>
                <div className="px-4 py-2 bg-zinc-800 rounded">
                  <span className="text-white font-mono">{h22.toFixed(2)}</span>
                  <div className="text-xs text-zinc-500">∂²V/∂S₂²</div>
                </div>
              </div>
              <span className="text-2xl text-zinc-400">]</span>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-400">Determinant (det H):</span>
              <span className={`font-mono ${getColor(determinant)}`}>
                {determinant.toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Trace (tr H):</span>
              <span className="text-white font-mono">{trace.toFixed(4)}</span>
            </div>
          </div>
        </div>

        {/* Eigenvalue Analysis */}
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
          <h4 className="text-white font-semibold mb-4">Eigenvalue Decomposition</h4>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded">
              <div>
                <span className="text-zinc-400 text-sm">λ₁ =</span>
                <span className={`ml-2 font-mono font-semibold ${getColor(lambda1)}`}>
                  {lambda1.toFixed(4)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {getIcon(lambda1)}
                <span className="text-xs text-zinc-500">
                  v₁ = ({v1[0].toFixed(2)}, {v1[1].toFixed(2)})
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded">
              <div>
                <span className="text-zinc-400 text-sm">λ₂ =</span>
                <span className={`ml-2 font-mono font-semibold ${getColor(lambda2)}`}>
                  {lambda2.toFixed(4)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {getIcon(lambda2)}
                <span className="text-xs text-zinc-500">
                  v₂ = ({v2[0].toFixed(2)}, {v2[1].toFixed(2)})
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded">
            <div className="text-xs text-purple-400 mb-1">Classification:</div>
            <div className="text-white font-semibold">{classification}</div>
          </div>
        </div>
      </div>

      {/* Geometric interpretation */}
      <div className="mt-6 bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
        <h4 className="text-white font-semibold mb-3">Geometric Interpretation</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-zinc-300">
          <div>
            <p className="mb-2">
              <strong className="text-green-400">Positive eigenvalue (λ {'>'} 0):</strong>{' '}
              Surface curves <em>upward</em> in that direction. Moving that way initially
              decreases V, then increases.
            </p>
            <p>
              <strong className="text-red-400">Negative eigenvalue (λ {'<'} 0):</strong>{' '}
              Surface curves <em>downward</em> in that direction. Moving that way initially
              increases V, then decreases.
            </p>
          </div>
          <div>
            <p className="mb-2">
              <strong className="text-purple-400">Large |λ|:</strong> High curvature,
              the surface bends sharply. Small perturbations have big effects.
            </p>
            <p>
              <strong className="text-zinc-400">Small |λ| ≈ 0:</strong> Nearly flat
              in that direction. The linear approximation stays accurate longer.
            </p>
          </div>
        </div>
      </div>

      {/* Principal directions diagram */}
      <div className="mt-6 flex justify-center">
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
          <h4 className="text-white font-semibold mb-4 text-center">Principal Curvature Directions</h4>
          <svg viewBox="-60 -60 120 120" className="w-48 h-48 mx-auto">
            {/* Grid */}
            <circle cx="0" cy="0" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            <circle cx="0" cy="0" r="20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            <line x1="-50" y1="0" x2="50" y2="0" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
            <line x1="0" y1="-50" x2="0" y2="50" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />

            {/* Eigenvector 1 */}
            <line
              x1={-v1[0] * 40}
              y1={v1[1] * 40}
              x2={v1[0] * 40}
              y2={-v1[1] * 40}
              stroke={lambda1 > 0 ? '#22c55e' : lambda1 < 0 ? '#ef4444' : '#71717a'}
              strokeWidth="2"
            />
            <text
              x={v1[0] * 48}
              y={-v1[1] * 48}
              fill={lambda1 > 0 ? '#22c55e' : lambda1 < 0 ? '#ef4444' : '#71717a'}
              fontSize="8"
              textAnchor="middle"
            >
              v₁
            </text>

            {/* Eigenvector 2 */}
            <line
              x1={-v2[0] * 40}
              y1={v2[1] * 40}
              x2={v2[0] * 40}
              y2={-v2[1] * 40}
              stroke={lambda2 > 0 ? '#22c55e' : lambda2 < 0 ? '#ef4444' : '#71717a'}
              strokeWidth="2"
            />
            <text
              x={v2[0] * 48}
              y={-v2[1] * 48}
              fill={lambda2 > 0 ? '#22c55e' : lambda2 < 0 ? '#ef4444' : '#71717a'}
              fontSize="8"
              textAnchor="middle"
            >
              v₂
            </text>

            {/* Center point */}
            <circle cx="0" cy="0" r="3" fill="white" />

            {/* Axis labels */}
            <text x="52" y="4" fill="rgba(255,255,255,0.5)" fontSize="8">S₁</text>
            <text x="2" y="-52" fill="rgba(255,255,255,0.5)" fontSize="8">S₂</text>
          </svg>
          <p className="text-xs text-zinc-500 text-center mt-2">
            Green = positive curvature. Red = negative curvature.
          </p>
        </div>
      </div>
    </div>
  );
}
