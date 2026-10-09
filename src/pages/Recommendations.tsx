import React, { useState } from 'react';
import { 
  Lightbulb, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Sliders, 
  ShieldCheck,
  TrendingDown
} from 'lucide-react';
import { Recommendation, RecommendationStatus } from '../types';

interface RecommendationsProps {
  recommendations: Recommendation[];
  updateRecommendationStatus: (id: string, status: RecommendationStatus) => void;
  goToSimulator: (rec: Recommendation) => void;
}

export const Recommendations: React.FC<RecommendationsProps> = ({
  recommendations,
  updateRecommendationStatus,
  goToSimulator,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const filteredRecs = recommendations.filter(r => {
    if (filterCategory === 'All') return true;
    return r.category === filterCategory;
  });

  const totalPotentialSavings = recommendations
    .filter(r => r.status !== 'Dismissed')
    .reduce((acc, r) => acc + r.estimatedMonthlySavingINR, 0);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Cost Optimization Recommendations</h1>
          <p className="text-sm text-slate-400 mt-1">
            Actionable architectural rightsizing and storage tiering proposals to reduce avoidable cloud spend.
          </p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 rounded-2xl flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Potential Monthly Savings</div>
            <div className="text-lg font-bold text-emerald-400">₹{totalPotentialSavings.toLocaleString('en-IN')} / mo</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['All', 'Compute Optimization', 'Storage Tiering', 'Database Rightsizing', 'Network Architecture'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              filterCategory === cat
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRecs.map((r) => (
          <div key={r.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4 relative overflow-hidden">
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                  Save ₹{r.estimatedMonthlySavingINR.toLocaleString('en-IN')}/mo
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  r.status === 'Tracked' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                  r.status === 'Dismissed' ? 'bg-slate-800 text-slate-500' :
                  'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                  {r.status}
                </span>
              </div>

              <h3 className="font-bold text-white text-base mb-1">{r.title}</h3>
              <p className="text-xs text-slate-300 mb-3 leading-relaxed">{r.reason}</p>

              <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800/80 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Effort</span>
                  <strong className={r.effort === 'Low' ? 'text-emerald-400' : 'text-amber-400'}>{r.effort}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Risk</span>
                  <strong className="text-slate-200">{r.risk}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Confidence</span>
                  <strong className="text-cyan-400">{r.confidence}</strong>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                onClick={() => goToSimulator(r)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-bold text-xs border border-cyan-500/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Simulate Impact</span>
              </button>

              {r.status !== 'Tracked' ? (
                <button
                  onClick={() => updateRecommendationStatus(r.id, 'Tracked')}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all cursor-pointer"
                >
                  Track
                </button>
              ) : (
                <button
                  onClick={() => updateRecommendationStatus(r.id, 'Suggested')}
                  className="py-2.5 px-4 rounded-xl bg-emerald-600/20 text-emerald-400 font-bold text-xs border border-emerald-500/30 transition-all cursor-pointer"
                >
                  Tracking
                </button>
              )}

              <button
                onClick={() => updateRecommendationStatus(r.id, 'Dismissed')}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-all cursor-pointer"
                title="Dismiss"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
