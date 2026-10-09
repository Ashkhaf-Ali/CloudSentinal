import React, { useState } from 'react';
import { 
  Bell, 
  Calendar, 
  Cloud, 
  Zap, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  X,
  ChevronDown
} from 'lucide-react';
import { CloudProvider } from '../types';

interface HeaderProps {
  currentProvider: CloudProvider;
  setCurrentProvider: (p: CloudProvider) => void;
  dateRange: string;
  setDateRange: (d: string) => void;
  simulateCostSpike: () => void;
  notifications: Array<{ id: string; title: string; time: string; type: string }>;
  openAiAdvisor: () => void;
  percentUsed: number;
  mtdSpend: number;
  monthlyBudget: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentProvider,
  setCurrentProvider,
  dateRange,
  setDateRange,
  simulateCostSpike,
  notifications,
  openAiAdvisor,
  percentUsed,
  mtdSpend,
  monthlyBudget,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [providerDropdown, setProviderDropdown] = useState(false);

  const providers: CloudProvider[] = ['AWS', 'Azure', 'GCP', 'Demo'];

  return (
    <header className="h-16 bg-black border-b border-[#262626] px-6 flex items-center justify-between shrink-0 z-20">
      {/* Left: Provider / Workspace Selector */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setProviderDropdown(!providerDropdown)}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#0a0a0a] hover:bg-[#121212] text-white text-xs font-semibold border border-[#262626] transition-all cursor-pointer shadow-sm"
          >
            <Cloud className="w-4 h-4 text-white" />
            <span>Workspace: <strong className="text-white">{currentProvider === 'Demo' ? 'Demo Cloud Account' : `${currentProvider} Production`}</strong></span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          {providerDropdown && (
            <div className="absolute top-full mt-1.5 left-0 w-48 bg-black border border-[#262626] rounded-xl shadow-2xl py-1 z-30">
              <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Select Provider
              </div>
              {providers.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setCurrentProvider(p);
                    setProviderDropdown(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between hover:bg-[#121212] cursor-pointer ${
                    currentProvider === p ? 'text-black bg-white font-bold' : 'text-zinc-300'
                  }`}
                >
                  <span>{p === 'Demo' ? 'Demo Cloud Account' : `${p} Cloud`}</span>
                  {currentProvider === p && <CheckCircle2 className="w-3.5 h-3.5 text-black" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Demo Indicator */}
        <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121212] border border-[#262626] text-zinc-300 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          Simulated Demo Data Mode
        </span>
      </div>

      {/* Right: Budget Progress Bar, Date filter, Simulate Cost Spike, AI Advisor, Notifications */}
      <div className="flex items-center gap-3">
        
        {/* Real-Time Budget Utilization Progress Bar Component */}
        <div className="hidden xl:flex items-center gap-3 px-3.5 py-1.5 bg-[#0a0a0a] border border-[#262626] rounded-xl text-xs">
          <div className="flex flex-col">
            <div className="flex items-center justify-between text-[11px] mb-1 gap-4">
              <span className="text-zinc-400 font-medium">Budget:</span>
              <span className={`font-bold tabular-nums ${percentUsed >= 80 ? 'text-amber-400' : 'text-white'}`}>
                {percentUsed}% (₹{mtdSpend.toLocaleString('en-IN')})
              </span>
            </div>
            <div className="w-32 bg-zinc-800 h-1.5 rounded-full overflow-hidden flex items-center">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${percentUsed >= 80 ? 'bg-amber-400 animate-pulse' : 'bg-white'}`}
                style={{ width: `${Math.min(100, percentUsed)}%` }}
              />
            </div>
          </div>
          {percentUsed >= 80 && (
            <div className="flex items-center gap-1 text-amber-400 text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
              <AlertTriangle className="w-3 h-3" />
              <span>&gt;80% Warning</span>
            </div>
          )}
        </div>

        {/* Date Selector */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#0a0a0a] border border-[#262626] rounded-xl text-xs text-zinc-300 shadow-sm">
          <Calendar className="w-3.5 h-3.5 text-white" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-transparent text-white focus:outline-none cursor-pointer font-medium"
          >
            <option value="current-month" className="bg-black">Current Month (Oct 2026)</option>
            <option value="last-30" className="bg-black">Last 30 Days</option>
            <option value="last-7" className="bg-black">Last 7 Days</option>
          </select>
        </div>

        {/* Simulate Cost Spike Button */}
        <button
          onClick={simulateCostSpike}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
          title="Simulate sudden cloud resource cost spike"
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Simulate Cost Spike</span>
        </button>

        {/* AI Advisor Shortcut */}
        <button
          onClick={openAiAdvisor}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-zinc-200 text-black font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">AI FinOps Advisor</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-[#0a0a0a] hover:bg-[#121212] border border-[#262626] text-white transition-all cursor-pointer shadow-sm"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center tabular-nums">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-black border border-[#262626] rounded-2xl shadow-2xl py-2 z-30">
              <div className="px-4 py-2 border-b border-[#262626] flex items-center justify-between">
                <span className="font-bold text-xs text-white uppercase tracking-wider">Alerts & Notifications</span>
                <button onClick={() => setShowNotifications(false)} className="text-zinc-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-[#262626]">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-zinc-500">No active alerts.</div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="p-3 hover:bg-[#121212] transition-all">
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-semibold text-white">{n.title}</div>
                          <div className="text-[10px] text-zinc-400 mt-0.5">{n.time}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
