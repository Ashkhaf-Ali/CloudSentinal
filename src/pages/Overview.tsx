import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  ArrowRight, 
  ShieldAlert, 
  DollarSign, 
  Activity as ActivityIcon,
  Lightbulb,
  Zap
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { CostRecord, Anomaly, Recommendation, Activity } from '../types';

interface OverviewProps {
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
  anomalies: Anomaly[];
  recommendations: Recommendation[];
  activities: Activity[];
  setCurrentTab: (tab: string) => void;
  simulateCostSpike: () => void;
}

export const Overview: React.FC<OverviewProps> = ({
  metrics,
  costRecords,
  anomalies,
  recommendations,
  activities,
  setCurrentTab,
  simulateCostSpike,
}) => {
  // Aggregate daily spend for trend chart
  const dailyMap: Record<string, number> = {};
  costRecords.forEach(r => {
    dailyMap[r.date] = (dailyMap[r.date] || 0) + r.costINR;
  });

  const chartData = Object.keys(dailyMap).sort().map(date => {
    const cost = dailyMap[date];
    return {
      date: date.slice(5), // MM-DD
      actual: cost,
      projected: cost * 1.08,
    };
  });

  // Service breakdown aggregation
  const serviceMap: Record<string, number> = {};
  costRecords.forEach(r => {
    serviceMap[r.service] = (serviceMap[r.service] || 0) + r.costINR;
  });

  const serviceColors = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];
  const serviceData = Object.keys(serviceMap).map((srv, idx) => ({
    name: srv,
    cost: serviceMap[srv],
    color: serviceColors[idx % serviceColors.length],
  }));

  const activeWarnings = anomalies.filter(a => a.status === 'New' || a.status === 'Investigating');

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner & Title */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-900/90 border border-slate-800/80 p-7 rounded-3xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 backdrop-blur-md">
        <div>
          <div className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-1">FinOps Intelligence Command</div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Cloud Financial Overview</h1>
          <p className="text-sm text-slate-400 mt-1.5 max-w-xl">
            Real-time spend health, predictive month-end budget forecasting, and autonomous risk mitigation.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={simulateCostSpike}
            className="px-4 py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-red-500/5 group"
          >
            <Zap className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>Simulate Cost Spike</span>
          </button>
          <button
            onClick={() => setCurrentTab('simulator')}
            className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-xl shadow-cyan-500/20 cursor-pointer"
          >
            <span>What-if Simulator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Forecast Alert Strip if over budget */}
      {metrics.projectedOverrun > 0 && (
        <div className="bg-gradient-to-r from-amber-950/40 via-red-950/40 to-slate-900 border border-amber-500/30 p-5 rounded-2xl flex items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-200">Budget Overrun Risk Detected</h3>
              <p className="text-xs text-slate-300 mt-1">
                Current forecast is <strong className="text-white tabular-nums">₹{metrics.projectedMonthEnd.toLocaleString('en-IN')}</strong> against a <strong className="text-white tabular-nums">₹{metrics.monthlyBudget.toLocaleString('en-IN')}</strong> budget. Projected overrun: <strong className="text-red-400 tabular-nums">₹{metrics.projectedOverrun.toLocaleString('en-IN')}</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentTab('forecasts')}
            className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold whitespace-nowrap transition-all cursor-pointer shadow-sm"
          >
            Investigate Forecast
          </button>
        </div>
      )}

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: MTD Spend */}
        <div className="bg-slate-900/90 border border-slate-800/80 p-6 rounded-3xl shadow-xl hover:border-slate-700 transition-all group">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
            <span>Month-to-Date Spend</span>
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight tabular-nums">
            ₹{metrics.mtdSpend.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs font-semibold text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12.4% vs previous period</span>
          </div>
        </div>

        {/* Card 2: Projected Month-End */}
        <div className="bg-slate-900/90 border border-slate-800/80 p-6 rounded-3xl shadow-xl hover:border-slate-700 transition-all group">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
            <span>Projected Month-End Bill</span>
            <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight tabular-nums">
            ₹{metrics.projectedMonthEnd.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-400 mt-3 tabular-nums">
            Range: ₹{metrics.forecastRange.low.toLocaleString('en-IN')} – ₹{metrics.forecastRange.high.toLocaleString('en-IN')}
          </div>
        </div>

        {/* Card 3: Monthly Budget */}
        <div className="bg-slate-900/90 border border-slate-800/80 p-6 rounded-3xl shadow-xl hover:border-slate-700 transition-all group">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
            <span>Monthly Budget</span>
            <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight tabular-nums">
            ₹{metrics.monthlyBudget.toLocaleString('en-IN')}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs font-medium">
            <span className="text-slate-400 tabular-nums">{metrics.percentUsed}% consumed</span>
            <span className="text-cyan-400 tabular-nums">₹{metrics.remainingBudget.toLocaleString('en-IN')} left</span>
          </div>
        </div>

        {/* Card 4: Budget Risk */}
        <div className="bg-slate-900/90 border border-slate-800/80 p-6 rounded-3xl shadow-xl hover:border-slate-700 transition-all group">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
            <span>Budget Risk Status</span>
            <div className={`p-2.5 rounded-2xl border ${
              metrics.riskStatus === 'Critical' || metrics.riskStatus === 'High' 
                ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span className={metrics.riskStatus === 'High' ? 'text-amber-400' : 'text-red-400'}>
              {metrics.riskStatus}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 font-bold border border-slate-700 tabular-nums">
              {metrics.riskScore}/100
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-3">
            {metrics.projectedOverrun > 0 ? `Est. overrun: ₹${metrics.projectedOverrun.toLocaleString('en-IN')}` : 'Within budget bounds'}
          </div>
        </div>

      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cost Trend Chart */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800/80 p-7 rounded-3xl shadow-2xl flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-lg text-white">Daily Spend & Forecast Trend</h2>
              <p className="text-xs text-slate-400 mt-0.5">Actual daily expenditure and model projection curve</p>
            </div>
            <button
              onClick={() => setCurrentTab('costs')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Explorer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '16px', color: '#fff', fontSize: '12px', boxShadow: '0 20px 25px -5px rgb(0 0_0 / 0.5)' }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
                />
                <Area type="monotone" dataKey="actual" name="Actual Cost" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorActual)" />
                <Area type="monotone" dataKey="projected" name="Projected Cost" stroke="#3b82f6" strokeWidth={2.5} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorProjected)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spend by Service */}
        <div className="bg-slate-900/90 border border-slate-800/80 p-7 rounded-3xl shadow-2xl flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-lg text-white">Spend by Service</h2>
            <button
              onClick={() => setCurrentTab('costs')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceData} layout="vertical" margin={{ top: 5, right: 10, left: 15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} opacity={0.6} />
                <XAxis type="number" stroke="#64748b" fontSize={10} tickFormatter={(v) => `₹${v}`} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={80} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '16px', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Cost']}
                />
                <Bar dataKey="cost" radius={[0, 8, 8, 0]}>
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Compute leads expenditure</span>
            <span className="text-cyan-400 font-bold">54% of total</span>
          </div>
        </div>

      </div>

      {/* Active Warnings & Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Active Warnings */}
        <div className="bg-slate-900/90 border border-slate-800/80 p-7 rounded-3xl shadow-2xl">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-lg text-white">Active Cost Warnings</h2>
            </div>
            <button
              onClick={() => setCurrentTab('anomalies')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
            >
              View All ({anomalies.length})
            </button>
          </div>

          <div className="space-y-3.5">
            {activeWarnings.slice(0, 3).map((w) => (
              <div key={w.id} className="p-4.5 bg-slate-950/70 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                    w.severity === 'Critical' || w.severity === 'High' 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {w.severity} Severity
                  </span>
                  <span className="text-xs text-slate-400">{w.firstDetectedAt}</span>
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">{w.title}</h4>
                <p className="text-xs text-slate-300 mb-3 line-clamp-1">{w.likelyCause}</p>
                <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800/80">
                  <span className="text-red-400 font-bold tabular-nums">+₹{w.deltaINR}/day ({w.percentChange}%)</span>
                  <button
                    onClick={() => setCurrentTab('anomalies')}
                    className="text-cyan-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Investigate</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Actions Preview */}
        <div className="bg-slate-900/90 border border-slate-800/80 p-7 rounded-3xl shadow-2xl">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Lightbulb className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-lg text-white">Top Cost Savings Opportunities</h2>
            </div>
            <button
              onClick={() => setCurrentTab('recommendations')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
            >
              View All ({recommendations.length})
            </button>
          </div>

          <div className="space-y-3.5">
            {recommendations.slice(0, 3).map((r) => (
              <div key={r.id} className="p-4.5 bg-slate-950/70 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 tabular-nums">
                      Save ₹{r.estimatedMonthlySavingINR.toLocaleString('en-IN')}/mo
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">{r.category}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white truncate">{r.title}</h4>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{r.reason}</p>
                </div>
                <button
                  onClick={() => setCurrentTab('recommendations')}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold whitespace-nowrap transition-all cursor-pointer shadow-sm"
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Activity Feed */}
      <div className="bg-slate-900/90 border border-slate-800/80 p-7 rounded-3xl shadow-2xl">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <ActivityIcon className="w-4 h-4" />
          </div>
          <h2 className="font-bold text-lg text-white">Recent FinOps Activity Feed</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {activities.slice(0, 4).map((act) => (
            <div key={act.id} className="p-4.5 bg-slate-950/70 border border-slate-800 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{act.timestamp}</span>
                <span className={`w-2 h-2 rounded-full ${
                  act.type === 'danger' ? 'bg-red-400' : act.type === 'warning' ? 'bg-amber-400' : act.type === 'success' ? 'bg-emerald-400' : 'bg-cyan-400'
                }`} />
              </div>
              <h4 className="text-xs font-bold text-white mb-1">{act.title}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">{act.description}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
