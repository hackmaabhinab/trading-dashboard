'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData, ColorType } from 'lightweight-charts';
import { 
  Play, Pause, SkipForward, Rewind, Plus,
  Crosshair, TrendingUp, GitCommit, Square, Type, Activity,
  Target, Smile, Ruler, ZoomIn, Magnet, Lock, EyeOff, Trash2,
  CandlestickChart, BarChart2, Layers, Bookmark, X, Minus
} from 'lucide-react';
import { SessionConfig } from '../app/dashboard/backtest/page';

const TF_SECONDS: Record<string, number> = {
  '1m': 60, '3m': 180, '5m': 300, '15m': 900, '30m': 1800,
  '1h': 3600, '4h': 14400, '1d': 86400
};

interface DrawingElement {
  id: string;
  type: 'trendline' | 'box' | 'hline' | 'ruler';
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

const generateMockData = (startDate: string, timeframe: string): CandlestickData[] => {
  const data: CandlestickData[] = [];
  let basePrice = 2500.0;
  let time = new Date(startDate).getTime() / 1000;
  const timeStep = TF_SECONDS[timeframe] || 900; 

  for (let i = 0; i < 5000; i++) {
    const randomChange = (Math.random() - 0.48) * 6;
    const open = basePrice;
    const high = open + Math.abs(randomChange) + Math.random() * 2;
    const low = open - Math.abs(randomChange) - Math.random() * 2;
    const close = open + randomChange;
    basePrice = close;

    data.push({
      time: (time + i * timeStep) as any,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
    });
  }
  return data;
};

export default function BacktestTerminal({ config, onExit }: { config: SessionConfig, onExit: () => void }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  const [activeTimeframe, setActiveTimeframe] = useState(config.timeframe || '15m');
  const [fullData, setFullData] = useState<CandlestickData[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(200); 
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(500);

  const [accountBalance, setAccountBalance] = useState<number>(config.balance);
  const [activeTrade, setActiveTrade] = useState<{ type: 'BUY' | 'SELL'; entryPrice: number } | null>(null);
  
  // Interactive Tools State
  const [activeTool, setActiveTool] = useState<string>('crosshair');
  const [drawings, setDrawings] = useState<DrawingElement[]>([]);
  const [currentDrawing, setCurrentDrawing] = useState<DrawingElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  useEffect(() => {
    setFullData(generateMockData(config.date, activeTimeframe));
    setCurrentIndex(200);
  }, [activeTimeframe, config.date]);

  useEffect(() => {
    if (!chartContainerRef.current || fullData.length === 0) return;

    const chart = createChart(chartContainerRef.current, {
      layout: { background: { type: ColorType.Solid, color: '#000000' }, textColor: '#787b86' },
      grid: { vertLines: { color: '#1e222d', style: 1 }, horzLines: { color: '#1e222d', style: 1 } },
      crosshair: { mode: 0 },
      timeScale: { borderColor: '#2a2e39', timeVisible: true, secondsVisible: false },
      rightPriceScale: { borderColor: '#2a2e39' },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#089981', downColor: '#f23645',
      borderVisible: false, wickUpColor: '#089981', wickDownColor: '#f23645',
    });

    candlestickSeries.setData(fullData.slice(0, currentIndex));
    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ 
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight 
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); chart.remove(); };
  }, [fullData]);

  useEffect(() => {
    if (seriesRef.current && fullData.length > 0) {
      seriesRef.current.setData(fullData.slice(0, currentIndex));
    }
  }, [currentIndex, fullData]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev >= fullData.length ? prev : prev + 1));
      }, speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  // Drawing Handlers
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (activeTool === 'crosshair' || activeTool === 'trash') return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const toolType = activeTool as 'trendline' | 'box' | 'hline' | 'ruler';

    setIsDrawing(true);
    setCurrentDrawing({
      id: Date.now().toString(),
      type: toolType,
      startX: x,
      startY: y,
      endX: x,
      endY: y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDrawing || !currentDrawing) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentDrawing({
      ...currentDrawing,
      endX: x,
      endY: y,
    });
  };

  const handleMouseUp = () => {
    if (isDrawing && currentDrawing) {
      setDrawings((prev) => [...prev, currentDrawing]);
      setCurrentDrawing(null);
      setIsDrawing(false);
    }
  };

  const clearAllDrawings = () => {
    setDrawings([]);
    setActiveTool('crosshair');
  };

  const currentCandle = fullData[currentIndex - 1];
  const previousCandle = fullData[currentIndex - 2];
  const currentPrice = currentCandle ? (currentCandle.close as number) : 0;
  const prevPrice = previousCandle ? (previousCandle.close as number) : currentPrice;
  const priceChange = currentPrice - prevPrice;
  const priceChangePercent = prevPrice ? ((priceChange / prevPrice) * 100).toFixed(2) : '0.00';

  const handleExecute = (type: 'BUY' | 'SELL') => {
    if (activeTrade) {
      let pnl = type === 'BUY' ? (currentPrice - activeTrade.entryPrice) * 100 : (activeTrade.entryPrice - currentPrice) * 100;
      setAccountBalance(prev => prev + pnl);
      setActiveTrade(null);
    } else {
      setActiveTrade({ type, entryPrice: currentPrice });
    }
  };

  const ToolButton = ({ id, icon: Icon, onClick }: { id: string, icon: any, onClick?: () => void }) => (
    <button 
      onClick={onClick ? onClick : () => setActiveTool(id)}
      className={`p-2 rounded transition-colors ${activeTool === id ? 'text-[#2962ff] bg-[#2962ff]/10' : 'text-[#787b86] hover:text-white hover:bg-[#2a2e39]'}`}
    >
      <Icon className="w-4 h-4 stroke-[1.8]" />
    </button>
  );

  return (
    <div className="flex flex-col h-screen w-full bg-black text-[#d1d4dc] overflow-hidden font-sans select-none">
      
      {/* TOP HEADER */}
      <div className="h-10 bg-[#131722] border-b border-[#2a2e39] flex items-center justify-between px-2 shrink-0 text-xs">
        <div className="flex items-center gap-1">
          <button className="flex items-center gap-1 hover:bg-[#2a2e39] px-2 py-1 rounded text-white font-bold">
            <span>{config.asset}</span>
            <Plus className="w-3.5 h-3.5 text-[#787b86]" />
          </button>
          
          <div className="h-4 w-px bg-[#2a2e39] mx-1"></div>

          {['1m', '30m', '1h', '15m'].map(tf => (
            <button 
              key={tf}
              onClick={() => setActiveTimeframe(tf)}
              className={`px-2 py-1 rounded font-medium transition-colors ${activeTimeframe === tf ? 'text-[#2962ff] bg-[#2962ff]/10' : 'text-[#787b86] hover:text-white hover:bg-[#2a2e39]'}`}
            >
              {tf}
            </button>
          ))}

          <div className="h-4 w-px bg-[#2a2e39] mx-1"></div>

          <button className="p-1 hover:bg-[#2a2e39] rounded text-[#787b86] hover:text-white">
            <CandlestickChart className="w-4 h-4" />
          </button>

          <button className="flex items-center gap-1.5 hover:bg-[#2a2e39] px-2 py-1 rounded text-[#787b86] hover:text-white font-medium">
            <BarChart2 className="w-4 h-4" />
            <span>Indicators</span>
          </button>
        </div>

        <button 
          onClick={onExit}
          className="flex items-center gap-1 border border-[#2a2e39] hover:bg-[#2a2e39] text-[#d1d4dc] px-2.5 py-1 rounded font-bold text-[11px] transition-colors"
        >
          <X className="w-3.5 h-3.5" /> EXIT
        </button>
      </div>

      {/* MIDDLE SECTION */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* LEFT TOOLBAR */}
        <div className="w-11 bg-[#131722] border-r border-[#2a2e39] flex flex-col items-center py-2 gap-1 shrink-0 z-20">
          <ToolButton id="crosshair" icon={Crosshair} />
          <ToolButton id="trendline" icon={TrendingUp} />
          <ToolButton id="hline" icon={Minus} />
          <ToolButton id="box" icon={Square} />
          <ToolButton id="ruler" icon={Ruler} />
          
          <div className="h-px w-6 bg-[#2a2e39] my-1"></div>

          <ToolButton id="trash" icon={Trash2} onClick={clearAllDrawings} />
        </div>

        {/* CHART & DRAWING CANVAS */}
        <div className="flex-1 h-full w-full bg-black relative flex flex-col">
          
          {/* Readout Header */}
          <div className="absolute top-2 left-3 z-10 flex items-center gap-2 text-[12px] font-sans pointer-events-none bg-black/50 px-2 py-1 rounded border border-white/5">
            <span className="font-bold text-white">Gold Spot / U.S. Dollar</span>
            <span className="text-[#787b86]">· {activeTimeframe} · OANDA</span>
            <span className="w-2 h-2 rounded-full bg-[#089981] inline-block ml-1"></span>
            
            <div className="flex items-center gap-2 font-mono text-[11px] ml-2">
              <span>O <span className={priceChange >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}>{currentCandle?.open?.toFixed(3) || '0.000'}</span></span>
              <span>H <span className={priceChange >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}>{currentCandle?.high?.toFixed(3) || '0.000'}</span></span>
              <span>L <span className={priceChange >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}>{currentCandle?.low?.toFixed(3) || '0.000'}</span></span>
              <span>C <span className={priceChange >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}>{currentCandle?.close?.toFixed(3) || '0.000'}</span></span>
            </div>
          </div>

          <div ref={chartContainerRef} className="flex-1 h-full w-full"></div>

          {/* INTERACTIVE SVG OVERLAY FOR DRAWINGS */}
          <svg
            className={`absolute inset-0 w-full h-full z-10 ${activeTool !== 'crosshair' ? 'cursor-crosshair' : 'pointer-events-none'}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {[...drawings, currentDrawing].filter(Boolean).map((d) => {
              if (!d) return null;
              
              if (d.type === 'trendline') {
                return (
                  <line
                    key={d.id}
                    x1={d.startX} y1={d.startY}
                    x2={d.endX} y2={d.endY}
                    stroke="#2962ff"
                    strokeWidth="2"
                  />
                );
              }

              if (d.type === 'hline') {
                return (
                  <line
                    key={d.id}
                    x1={0} y1={d.startY}
                    x2="100%" y2={d.startY}
                    stroke="#089981"
                    strokeWidth="1.5"
                    strokeDasharray="4"
                  />
                );
              }

              if (d.type === 'box') {
                const width = Math.abs(d.endX - d.startX);
                const height = Math.abs(d.endY - d.startY);
                const x = Math.min(d.startX, d.endX);
                const y = Math.min(d.startY, d.endY);

                return (
                  <rect
                    key={d.id}
                    x={x} y={y}
                    width={width} height={height}
                    fill="rgba(41, 98, 255, 0.15)"
                    stroke="#2962ff"
                    strokeWidth="1.5"
                  />
                );
              }

              if (d.type === 'ruler') {
                return (
                  <g key={d.id}>
                    <line
                      x1={d.startX} y1={d.startY}
                      x2={d.endX} y2={d.endY}
                      stroke="#f23645"
                      strokeWidth="1.5"
                      strokeDasharray="3"
                    />
                    <rect
                      x={d.endX + 5} y={d.endY - 12}
                      width="70" height="20"
                      fill="#1e222d" stroke="#2a2e39" rx="3"
                    />
                    <text x={d.endX + 10} y={d.endY + 2} fill="#ffffff" fontSize="10" fontFamily="sans-serif">
                      {Math.abs(Math.round(d.endY - d.startY))} Pips
                    </text>
                  </g>
                );
              }

              return null;
            })}
          </svg>

        </div>

        {/* RIGHT STRIP */}
        <div className="w-10 bg-[#131722] border-l border-[#2a2e39] flex flex-col items-center py-2 gap-3 shrink-0 z-20">
          <button className="text-[#787b86] hover:text-white p-1.5"><Layers className="w-4 h-4" /></button>
          <button className="text-[#787b86] hover:text-white p-1.5"><Bookmark className="w-4 h-4" /></button>
        </div>

      </div>

      {/* BOTTOM CONTROLS */}
      <div className="h-14 bg-[#131722] border-t border-[#2a2e39] flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex gap-2 w-1/3">
          <button 
            onClick={() => handleExecute('BUY')}
            className="flex-1 max-w-[110px] bg-[#089981] hover:bg-[#067a67] text-white font-bold py-1.5 rounded text-xs transition-colors"
          >
            Buy
          </button>
          <button 
            onClick={() => handleExecute('SELL')}
            className="flex-1 max-w-[110px] bg-[#f23645] hover:bg-[#d62837] text-white font-bold py-1.5 rounded text-xs transition-colors"
          >
            Sell
          </button>
        </div>

        <div className="flex items-center gap-3 bg-[#1e222d] border border-[#2a2e39] px-4 py-1 rounded-lg">
          <button onClick={() => setCurrentIndex(200)} className="text-[#787b86] hover:text-white"><Rewind className="w-4 h-4" /></button>
          <button onClick={() => setIsPlaying(!isPlaying)} className="text-white hover:text-[#2962ff] mx-1">
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
          </button>
          <button onClick={() => setCurrentIndex(prev => prev + 1)} disabled={isPlaying} className="text-[#787b86] hover:text-white">
            <SkipForward className="w-4 h-4" />
          </button>
          
          <div className="h-3 w-px bg-[#2a2e39] mx-1"></div>
          
          <select 
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="bg-transparent text-[11px] font-bold text-[#d1d4dc] outline-none cursor-pointer"
          >
            <option value={1000} className="bg-[#131722]">1x Speed</option>
            <option value={500} className="bg-[#131722]">2x Speed</option>
            <option value={100} className="bg-[#131722]">5x Speed</option>
          </select>
        </div>

        <div className="w-1/3 flex justify-end">
          <div className="flex items-center gap-2 bg-[#1e222d] border border-[#2a2e39] px-3 py-1 rounded">
            <span className="text-[#787b86] text-[10px] font-bold">BALANCE</span>
            <span className={`font-mono font-bold text-xs ${accountBalance >= config.balance ? 'text-[#089981]' : 'text-[#f23645]'}`}>
              ${accountBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}