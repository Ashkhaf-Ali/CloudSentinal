import React from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  Sliders, 
  FileText, 
  Settings as SettingsIcon, 
  Sparkles, 
  ShieldAlert,
  Cloud
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openAiAdvisor: () => void;
  activeAnomaliesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  setCurrentTab, 
  openAiAdvisor,
  activeAnomaliesCount 
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'costs', label: 'Cost Explorer', icon: BarChart3 },
    { id: 'forecasts', label: 'Forecasts', icon: TrendingUp },
    { id: 'anomalies', label: 'Anomalies', icon: AlertTriangle, badge: activeAnomaliesCount },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
    { id: 'simulator', label: 'What-if Simulator', icon: Sliders },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <aside className="w-64 bg-black border-r border-[#262626] flex flex-col shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#262626] flex items-center justify-between bg-black">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md text-black">
            <ShieldAlert className="w-5 h-5 font-bold" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-white">
              CloudSentinel
            </h1>
            <p className="text-[11px] text-zinc-400 font-semibold">Cloud Cost Intelligence</p>
          </div>
        </div>
      </div>

      {/* AI Advisor Prompt Trigger Banner */}
      <div className="p-3.5 m-3 bg-[#0a0a0a] border border-[#262626] rounded-xl shadow-md">
        <div className="flex items-center gap-1.5 mb-1 text-white font-bold text-xs tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>Gemini 3.1 Pro AI</span>
        </div>
        <p className="text-[11px] text-zinc-400 mb-2.5">
          Advanced reasoning & architectural cost reduction.
        </p>
        <button
          onClick={openAiAdvisor}
          className="w-full py-2.5 px-3 bg-white hover:bg-zinc-200 text-black font-bold text-xs rounded-lg transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Open FinOps AI Advisor</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
          Main Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-[#121212] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-zinc-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-white text-black tabular-nums">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Workspace Footer Info */}
      <div className="p-4 border-t border-[#262626] bg-[#050505]">
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
          <span className="flex items-center gap-1.5">
            <Cloud className="w-3.5 h-3.5 text-white" />
            Demo Workspace
          </span>
          <span className="px-1.5 py-0.5 rounded bg-white text-black text-[10px] font-bold">
            Active
          </span>
        </div>
        <div className="text-[11px] text-zinc-500">
          Currency: <strong className="text-white">INR (₹)</strong>
        </div>
      </div>
    </aside>
  );
};
