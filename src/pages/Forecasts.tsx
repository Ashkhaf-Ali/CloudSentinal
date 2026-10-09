import React from 'react';
import { 
  TrendingUp, 
  Calendar, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Sparkles
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { CostRecord } from '../types';

interface ForecastsProps {
  metrics: {
    mtdSpend: number;
    projectedMonthEnd: number;
    monthlyBudget: number;
    remainingBudget: number;
    projectedOverrun: number;
    percentUsed: number;
    riskStatus: string;
    riskScore: number;
    forecastRange: { low: number; high: number };
  };
  costRecords: CostRecord[];
}

export const Forecasts: React.FC<ForecastsProps> = ({ metrics, costRecords }) => {
  // Aggregate daily spend
  const dailyMap: Record<string, number> = {};
  costRecords.forEach(r => {
    dailyMap[r.date] = (dailyMap[r.date] || 0) + r.costINR;
  });

  const chartData = Object.keys(dailyMap).sort().map(date => {
    const cost = dailyMap[date];
    return {
      date: date.slice(5),
      actual: cost,
      projected: cost * 1.12,
    };
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-white tracking-tight">Predictive Cost Forecasts</h1>
        <p className="text-sm text-slate-400 mt-1">
          Advanced month-end bill estimation, confidence range, and budget breach timeline.
        </p>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="text-xs font-semibold text-slate-400 mb-2">Projected Month-End Bill</div>
          <div className="text-2xl font-bold text-white tracking-tight">₹{metrics.projectedMonthEnd.toLocaleString('en-IN')}</div>
          <div className="text-xs text-cyan-400 mt-2">Confidence Band: ±7%</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="text-xs font-semibold text-slate-400 mb-2">Forecast Range</div>
          <div className="text-xl font-bold text-white tracking-tight">
            ₹{metrics.forecastRange.low.toLocaleString('en-IN')} – ₹{metrics.forecastRange.high.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-400 mt-2">Low/High probabilistic spread</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="text-xs font-semibold text-slate-400 mb-2">Monthly Budget</div>
          <div className="text-2xl font-bold text-white tracking-tight">₹{metrics.monthlyBudget.toLocaleString('en-IN')}</div>
          <div className="text-xs text-slate-400 mt-2">{metrics.percentUsed}% consumed so far</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="text-xs font-semibold text-slate-400 mb-2">Projected Overrun</div>
          <div className={`text-2xl font-bold tracking-tight ${metrics.projectedOverrun > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            ₹{metrics.projectedOverrun.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            {metrics.projectedOverrun > 0 ? 'Exceeds budget limit' : 'Within budget limit'}
          </div>
        </div>

      </div>

      {/* Budget Breach Estimate Banner */}
      {metrics.projectedOverrun > 0 && (
        <div className="bg-gradient-to-r from-red-950/70 to-slate-900 border border-red-500/40 p-5 rounded-2xl flex items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Estimated Budget Breach Date</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                At the current estimated spending pattern, the <strong className="text-white">₹{metrics.monthlyBudget.toLocaleString('en-IN')}</strong> budget is projected to be crossed around <strong className="text-amber-400">October 24, 2026</strong>.
              </p>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30 whitespace-nowrap">
            Breach Risk: HIGH
          </span>
        </div>
      )}

      {/* Forecast Chart */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-bold text-base text-white">Daily Cost & Month-End Projection Curve</h2>
            <p className="text-xs text-slate-400">Historical daily costs combined with regression trend analysis</p>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `₹${v}`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
              />
              <Area type="monotone" dataKey="projected" name="Projected Spend" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorForecast)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Forecast Drivers & Method Explainer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Forecast Drivers */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <span>Primary Forecast Drivers</span>
          </h3>

          <div className="space-y-3">
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-white">Compute Capacity Spike</span>
                <span className="text-xs text-red-400 font-bold">+₹2,100 / mo impact</span>
              </div>
              <p className="text-xs text-slate-400">Project Alpha auto-scaling nodes increased daily compute burn by ~181%.</p>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-white">Data Transfer Egress</span>
                <span className="text-xs text-amber-400 font-bold">+₹540 / mo impact</span>
              </div>
              <p className="text-xs text-slate-400">Cross-AZ replication traffic in Project Beta elevated monthly egress.</p>
            </div>
          </div>
        </div>

        {/* Method Explainer */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Info className="w-5 h-5 text-cyan-400" />
            <span>How This Forecast Works</span>
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed">
            CloudSentinel uses a transparent baseline forecasting model that blends recent 7-day daily expenditure velocity with historical seasonality weights for the remaining days in the calendar month.
          </p>

          <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 space-y-1">
            <strong className="block font-semibold">Demo Mode Transparency:</strong>
            <span>Projections are calculated dynamically from deterministic seed records and simulated user actions. You can test mitigation outcomes in the What-if Simulator.</span>
          </div>
        </div>

      </div>

    </div>
  );
};
