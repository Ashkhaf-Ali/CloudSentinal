import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  RotateCcw, 
  Save, 
  TrendingDown, 
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { Scenario, Recommendation } from '../types';

interface WhatIfSimulatorProps {
  currentProjectedCost: number;
  monthlyBudget: number;
  preloadedRec?: Recommendation | null;
  saveScenario: (scen: Scenario) => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  currentProjectedCost,
  monthlyBudget,
  preloadedRec,
  saveScenario,
}) => {
  const [scenarioName, setScenarioName] = useState('Custom Workload Simulation');
  const [adjustmentPct, setAdjustmentPct] = useState<number>(preloadedRec ? -Math.round((preloadedRec.estimatedMonthlySavingINR / currentProjectedCost) * 100) : -15);
  const [extraInstances, setExtraInstances] = useState<number>(0);
  const [storageArchivalPct, setStorageArchivalPct] = useState<number>(0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (preloadedRec) {
      setScenarioName(`Simulation: ${preloadedRec.title}`);
      const savingPct = Math.round((preloadedRec.estimatedMonthlySavingINR / currentProjectedCost) * 100);
      setAdjustmentPct(-savingPct);
    }
  }, [preloadedRec]);

  // Calculate simulated cost
  const pctMultiplier = 1 + (adjustmentPct / 100);
  const instanceCostDelta = extraInstances * 1450;
  const storageSavingDelta = (storageArchivalPct / 100) * 1850;
  
  const simulatedCost = Math.round((currentProjectedCost * pctMultiplier) + instanceCostDelta - storageSavingDelta);
  const difference = simulatedCost - currentProjectedCost;
  const newBudgetPercent = Math.round((simulatedCost / monthlyBudget) * 100);

  const handleSave = () => {
    const newScen: Scenario = {
      id: `scen-${Date.now()}`,
      name: scenarioName,
      scenarioType: 'Interactive simulation',
      inputParameters: { adjustmentPct, extraInstances, storageArchivalPct },
      baselineProjectedCostINR: currentProjectedCost,
      simulatedProjectedCostINR: simulatedCost,
      differenceINR: difference,
      assumptions: 'Custom simulated parameters applied to baseline forecast model.',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    saveScenario(newScen);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-white tracking-tight">What-If Cost Simulator</h1>
        <p className="text-sm text-slate-400 mt-1">
          Model potential cost impact safely before making real cloud architecture changes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Controls Column */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
          
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-cyan-400" />
              <span>Simulation Parameters</span>
            </h2>
            <button
              onClick={() => {
                setAdjustmentPct(0);
                setExtraInstances(0);
                setStorageArchivalPct(0);
                setScenarioName('Reset Simulation');
              }}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Scenario Title</label>
              <input
                type="text"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Slider 1: Workload Scaling */}
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">Compute Workload Scaling Adjustment</span>
                <span className={`font-bold ${adjustmentPct >= 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {adjustmentPct >= 0 ? `+${adjustmentPct}%` : `${adjustmentPct}%`}
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="100"
                value={adjustmentPct}
                onChange={(e) => setAdjustmentPct(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>-50% (Rightsizing cut)</span>
                <span>0% (Baseline)</span>
                <span>+100% (Double traffic)</span>
              </div>
            </div>

            {/* Slider 2: Extra Instances */}
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">Additional / Removed Compute Nodes</span>
                <span className="font-bold text-white">{extraInstances} instances</span>
              </div>
              <input
                type="range"
                min="-5"
                max="10"
                value={extraInstances}
                onChange={(e) => setExtraInstances(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>-5 nodes (Terminated)</span>
                <span>0</span>
                <span>+10 nodes (Scaled up)</span>
              </div>
            </div>

            {/* Slider 3: Storage archival */}
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">S3 Storage Tier Archival to Glacier</span>
                <span className="font-bold text-emerald-400">{storageArchivalPct}% archived</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={storageArchivalPct}
                onChange={(e) => setStorageArchivalPct(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0%</span>
                <span>50%</span>
                <span>100% (Full archive)</span>
              </div>
            </div>

          </div>

        </div>

        {/* Results Column */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between space-y-6">
          
          <div className="space-y-6">
            <h2 className="font-bold text-base text-white">Simulation Impact Summary</h2>

            <div className="space-y-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Baseline Projected Cost</div>
                <div className="text-xl font-bold text-white mt-1">₹{currentProjectedCost.toLocaleString('en-IN')}</div>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Simulated Month-End Cost</div>
                <div className={`text-2xl font-bold mt-1 ${difference <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  ₹{simulatedCost.toLocaleString('en-IN')}
                </div>
                <div className={`text-xs mt-1 font-semibold flex items-center gap-1 ${difference <= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {difference <= 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                  <span>{difference <= 0 ? `-₹${Math.abs(difference).toLocaleString('en-IN')} saving` : `+₹${difference.toLocaleString('en-IN')} additional`}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Budget Consumption</div>
                <div className="text-lg font-bold text-white mt-1">{newBudgetPercent}% of ₹{monthlyBudget.toLocaleString('en-IN')}</div>
                <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${newBudgetPercent > 100 ? 'bg-red-500' : 'bg-cyan-500'}`}
                    style={{ width: `${Math.min(100, newBudgetPercent)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {savedSuccess && (
              <div className="p-3 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl border border-emerald-500/30 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Scenario saved successfully!</span>
              </div>
            )}
            <button
              onClick={handleSave}
              className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Scenario</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
