"use client"

import { useState, useEffect } from "react"

export function InteractiveProblemCard() {
  const [strikePrice, setStrikePrice] = useState(100)
  const [volatility, setVolatility] = useState(0.30)
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [draggingStrike, setDraggingStrike] = useState(false)
  const [draggingVol, setDraggingVol] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const currentPrice = 100
  const timeToExpiry = 0.5
  const riskFreeRate = 0.05

  // Black-Scholes
  const normCDF = (x: number) => {
    const t = 1 / (1 + 0.2316419 * Math.abs(x))
    const d = 0.3989423 * Math.exp(-x * x / 2)
    const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
    return x > 0 ? 1 - p : p
  }

  const d1 = (Math.log(currentPrice / strikePrice) + (riskFreeRate + volatility * volatility / 2) * timeToExpiry) / 
             (volatility * Math.sqrt(timeToExpiry))
  const d2 = d1 - volatility * Math.sqrt(timeToExpiry)
  const callPrice = currentPrice * normCDF(d1) - strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * normCDF(d2)
  const intrinsicValue = Math.max(currentPrice - strikePrice, 0)
  const timeValue = Math.max(0, callPrice - intrinsicValue)

  // Generate curves
  const curves = []
  for (let price = 50; price <= 150; price += 0.5) {
    const intrinsic = Math.max(price - strikePrice, 0)
    const tempD1 = (Math.log(price / strikePrice) + (riskFreeRate + volatility * volatility / 2) * timeToExpiry) / 
                   (volatility * Math.sqrt(timeToExpiry))
    const tempD2 = tempD1 - volatility * Math.sqrt(timeToExpiry)
    const optionValue = price * normCDF(tempD1) - strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * normCDF(tempD2)
    curves.push({ price, intrinsic, optionValue })
  }

  const isTimeValueLow = timeValue < 2.5
  const isDeepITM = strikePrice <= 85 && strikePrice < currentPrice
  const isLowVol = volatility <= 0.18
  const isCorrect = isTimeValueLow && isDeepITM && isLowVol

  // Trigger confetti when solution is checked and correct
  useEffect(() => {
    if (showSolution && isCorrect) {
      setShowConfetti(true)
      // Remove confetti after animation completes
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showSolution, isCorrect])

  return (
    <div className="group relative">
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500/10 to-phthalo-500/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
      
      <div className="relative h-full p-8 rounded-3xl bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 overflow-hidden">
        {/* Confetti container - only shows when correct */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl z-50">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10px',
                  backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 5)],
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${2 + Math.random()}s`,
                }}
              />
            ))}
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold">Interactive Lessons</h3>
          </div>

          <p className="text-zinc-400 leading-relaxed">
            Master concepts through interactive visualizations that respond in real-time to your inputs
          </p>

          <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700/50 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-medium text-phthalo-400 mb-1">OPTIONS PRICING #89</div>
                <div className="font-medium">Black-Scholes Time Value</div>
              </div>
              <div className="px-3 py-1 rounded-full bg-yellow-500/20 text-orange-400 text-xs font-medium">
                Medium
              </div>
            </div>

            <p className="text-sm text-zinc-400">
              A stock trades at $100. You hold a call option expiring in 6 months. Configure strike price and volatility to minimize the time value premium (the green shaded area between the curves).
            </p>

            <div className="bg-zinc-900/80 rounded-lg p-4 border border-zinc-700/30">
              <div className="relative h-48">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="tvGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgb(38, 128, 74)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="rgb(38, 128, 74)" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>

                  <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.3" className="text-zinc-700/20" strokeDasharray="2 2" />
                  <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.3" className="text-zinc-700/20" strokeDasharray="2 2" />
                  <line x1="0" y1="100" x2="100" y2="100" stroke="currentColor" strokeWidth="0.5" className="text-zinc-700/40" />

                  <path
                    fill="url(#tvGrad)"
                    d={
                      curves.map((p, i) => {
                        const x = ((p.price - 50) / 100) * 100
                        const yOpt = 100 - ((Math.min(p.optionValue, 50) / 50) * 90)
                        return `${i === 0 ? 'M' : 'L'} ${x},${yOpt}`
                      }).join(' ') +
                      ' ' +
                      curves.slice().reverse().map((p) => {
                        const x = ((p.price - 50) / 100) * 100
                        const yInt = 100 - ((Math.min(p.intrinsic, 50) / 50) * 90)
                        return `L ${x},${yInt}`
                      }).join(' ') +
                      ' Z'
                    }
                  />

                  <path
                    fill="none"
                    stroke="rgb(120, 120, 120)"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                    d={curves.map((p, i) => {
                      const x = ((p.price - 50) / 100) * 100
                      const y = 100 - ((Math.min(p.intrinsic, 50) / 50) * 90)
                      return `${i === 0 ? 'M' : 'L'} ${x},${y}`
                    }).join(' ')}
                  />

                  <path
                    fill="none"
                    stroke="rgb(38, 128, 74)"
                    strokeWidth="1.2"
                    d={curves.map((p, i) => {
                      const x = ((p.price - 50) / 100) * 100
                      const y = 100 - ((Math.min(p.optionValue, 50) / 50) * 90)
                      return `${i === 0 ? 'M' : 'L'} ${x},${y}`
                    }).join(' ')}
                  />

                  <line x1="50" y1="0" x2="50" y2="100" stroke="rgb(59, 130, 246)" strokeWidth="0.8" />
                  <line 
                    x1={((strikePrice - 50) / 100) * 100} 
                    y1="0" 
                    x2={((strikePrice - 50) / 100) * 100} 
                    y2="100" 
                    stroke="rgb(168, 85, 247)" 
                    strokeWidth="0.8"
                    strokeDasharray="3 3"
                  />
                </svg>

                <div className="absolute top-2 left-2 text-xs space-y-1">
                  <div className="bg-zinc-800/90 rounded px-2 py-1">
                    <span className="text-phthalo-400">Value: ${callPrice.toFixed(2)}</span>
                  </div>
                  <div className="bg-zinc-800/90 rounded px-2 py-1">
                    <span className="text-orange-400">Time: ${timeValue.toFixed(2)}</span>
                  </div>
                </div>

                <div className="absolute top-2 right-2 text-xs space-y-1">
                  <div className={`rounded px-2 py-1 font-medium ${isTimeValueLow ? 'bg-green-500/20 text-green-400' : 'bg-zinc-800/90 text-orange-400'}`}>
                    Time: &lt;$2.50
                  </div>
                  <div className={`rounded px-2 py-1 font-medium ${isDeepITM ? 'bg-green-500/20 text-green-400' : 'bg-zinc-800/90 text-orange-400'}`}>
                    Strike: ≤$85
                  </div>
                  <div className={`rounded px-2 py-1 font-medium ${isLowVol ? 'bg-green-500/20 text-green-400' : 'bg-zinc-800/90 text-orange-400'}`}>
                    Vol: ≤18%
                  </div>
                </div>

                <div className="absolute bottom-2 left-2 text-xs space-y-0.5">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-phthalo-500"></div>
                    <span className="text-zinc-400">Option</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-zinc-500 border-t border-dashed"></div>
                    <span className="text-zinc-400">Intrinsic</span>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 text-xs text-zinc-500">$50</div>
                <div className="absolute bottom-0 right-0 text-xs text-zinc-500">$150</div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs">
                  <span className="text-blue-400">$100</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400">Strike Price (K)</span>
                  <span className={`font-medium ${isDeepITM ? 'text-green-400' : 'text-purple-400'}`}>
                    ${strikePrice}
                  </span>
                </div>
                <div className="relative h-10">
                  <input
                    type="range"
                    min="70"
                    max="130"
                    step="1"
                    value={strikePrice}
                    onChange={(e) => {
                      setStrikePrice(parseInt(e.target.value))
                      setShowSolution(false)
                    }}
                    onMouseDown={() => setDraggingStrike(true)}
                    onMouseUp={() => setDraggingStrike(false)}
                    onTouchStart={() => setDraggingStrike(true)}
                    onTouchEnd={() => setDraggingStrike(false)}
                    className="absolute bottom-0 w-full h-2 bg-zinc-900 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
                  />
                  {draggingStrike && (
                    <div 
                      className="absolute top-0 bg-purple-500 text-white px-3 py-1 rounded-lg text-sm font-bold pointer-events-none whitespace-nowrap"
                      style={{ 
                        left: `calc(${((strikePrice - 70) / (130 - 70)) * 100}%)`,
                        transform: 'translateX(-50%)'
                      }}
                    >
                      ${strikePrice}
                    </div>
                  )}
                </div>
                <div className="flex justify-between text-xs text-zinc-600">
                  <span>$70</span>
                  <span>$100</span>
                  <span>$130</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400">Volatility (σ)</span>
                  <span className={`font-medium ${isLowVol ? 'text-green-400' : 'text-blue-400'}`}>
                    {(volatility * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="relative h-10">
                  <input
                    type="range"
                    min="0.10"
                    max="0.50"
                    step="0.01"
                    value={volatility}
                    onChange={(e) => {
                      setVolatility(parseFloat(e.target.value))
                      setShowSolution(false)
                    }}
                    onMouseDown={() => setDraggingVol(true)}
                    onMouseUp={() => setDraggingVol(false)}
                    onTouchStart={() => setDraggingVol(true)}
                    onTouchEnd={() => setDraggingVol(false)}
                    className="absolute bottom-0 w-full h-2 bg-zinc-900 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                  />
                  {draggingVol && (
                    <div 
                      className="absolute top-0 bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-bold pointer-events-none whitespace-nowrap"
                      style={{ 
                        left: `calc(${((volatility - 0.10) / (0.50 - 0.10)) * 100}%)`,
                        transform: 'translateX(-50%)'
                      }}
                    >
                      {(volatility * 100).toFixed(0)}%
                    </div>
                  )}
                </div>
                <div className="flex justify-between text-xs text-zinc-600">
                  <span>10%</span>
                  <span>30%</span>
                  <span>50%</span>
                </div>
              </div>
            </div>

            {showHint && (
              <div className="bg-phthalo-500/10 border border-phthalo-500/30 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <div className="text-phthalo-400 mt-0.5">💡</div>
                  <div className="text-sm text-phthalo-300">
                    <strong>Hint:</strong> Keep strike at $100, move vol from 10% to 50% - watch green area grow! Then solve: strike $80-85 + vol 10-18%.
                  </div>
                </div>
              </div>
            )}

            {showSolution && (
              <div className={`border rounded-lg p-4 ${isCorrect ? 'bg-green-500/10 border-green-500/30' : 'bg-orange-500/10 border-orange-500/30'}`}>
                <div className="flex items-start gap-2">
                  <div className={isCorrect ? 'text-green-400' : 'text-orange-400'}>
                    {isCorrect ? '✅' : '📊'}
                  </div>
                  <div className="text-sm flex-1">
                    {isCorrect ? (
                      <div className="text-green-300">
                        <strong>Perfect!</strong> Minimized time value with deep ITM + low vol. Try: $100 strike + 50% vol to see massive time value!
                      </div>
                    ) : (
                      <div className="text-orange-300">
                        <strong>Time:</strong> ${timeValue.toFixed(2)}. 
                        {strikePrice >= currentPrice && ' OTM! Must be ITM (strike < $100).'}
                        {strikePrice < currentPrice && !isDeepITM && ' Push strike to $85 or below.'}
                        {isDeepITM && !isLowVol && ' Good! Now lower vol to 18% or below.'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button 
                onClick={() => setShowSolution(true)}
                className="flex-1 px-4 py-2 rounded-lg bg-phthalo-600 hover:bg-phthalo-700 text-white text-sm font-medium transition-colors"
              >
                Check Solution
              </button>
              <button 
                onClick={() => setShowHint(!showHint)}
                className="px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-medium transition-colors"
              >
                {showHint ? 'Hide' : 'Show'} Hint
              </button>
            </div>
          </div>
        </div>

        {/* Add confetti animation styles */}
        <style jsx>{`
          @keyframes confetti {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }
          .animate-confetti {
            animation: confetti 2s ease-out forwards;
          }
        `}</style>
      </div>
    </div>
  )
}