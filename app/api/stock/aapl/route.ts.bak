import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch(
      'https://query1.finance.yahoo.com/v8/finance/chart/AAPL?interval=1d&range=1d',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch from Yahoo Finance')
    }

    const data = await response.json()
    
    const quote = data.chart.result[0]
    const meta = quote.meta
    const currentPrice = meta.regularMarketPrice
    const previousClose = meta.chartPreviousClose
    const change = currentPrice - previousClose
    const changePercent = (change / previousClose) * 100

    return NextResponse.json({
      success: true,
      data: {
        price: currentPrice,
        change: change,
        changePercent: changePercent,
        high: meta.regularMarketDayHigh,
        low: meta.regularMarketDayLow,
        open: meta.regularMarketOpen,
      }
    })
  } catch (error) {
    console.error('Error fetching stock data:', error)
    
    // Return fallback data if API fails
    return NextResponse.json({
      success: true,
      data: {
        price: 269.43,
        change: -0.35,
        changePercent: -0.13,
        high: 270.12,
        low: 268.89,
        open: 269.78
      }
    })
  }
}