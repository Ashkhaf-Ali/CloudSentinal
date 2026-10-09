import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  Cloud, 
  RotateCcw, 
  CheckCircle2, 
  Save, 
  Lock
} from 'lucide-react';
import { AppSettings, CloudProvider } from '../types';

interface SettingsProps {
  settings: AppSettings;
  updateSettings: (newSettings: AppSettings) => void;
  resetDemoData: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, updateSettings, resetDemoData }) => {
  const [formState, setFormState] = useState<AppSettings>(settings);
  const [saveToast, setSaveToast] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState<CloudProvider | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formState);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Workspace Settings</h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure budget limits, alert triggers, detection thresholds, and provider connections.
          </p>
        </div>
        {saveToast && (
          <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Workspace & Budget Section */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h2 className="font-bold text-base text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <span>Workspace & Budget Configuration</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Workspace Name</label>
              <input
                type="text"
                value={formState.workspaceName}
                onChange={(e) => setFormState({ ...formState, workspaceName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Monthly Budget (INR ₹)</label>
              <input
                type="number"
                value={formState.monthlyBudgetINR}
                onChange={(e) => setFormState({ ...formState, monthlyBudgetINR: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Alert Thresholds */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h2 className="font-bold text-base text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            <span>Alert & Notification Triggers</span>
          </h2>

          <div className="space-y-3">
            {[
              { key: 'alertForecast80', label: 'Alert when forecast reaches 80% of budget' },
              { key: 'alertForecast100', label: 'Alert when forecast exceeds 100% of budget (Overrun)' },
              { key: 'alertDailySpike', label: 'Alert when daily spend exceeds baseline by threshold' },
              { key: 'alertCriticalAnomaly', label: 'Alert immediately on Critical severity anomaly detection' },
            ].map((item) => (
              <label key={item.key} className="flex items-center gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(formState as any)[item.key]}
                  onChange={(e) => setFormState({ ...formState, [item.key]: e.target.checked })}
                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                />
                <span className="text-xs text-slate-200 font-medium">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Cloud Provider Connections */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h2 className="font-bold text-base text-white flex items-center gap-2">
            <Cloud className="w-5 h-5 text-cyan-400" />
            <span>Cloud Provider Connectors</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'AWS', connected: formState.connectedAWS, desc: 'Cost Explorer & CloudWatch telemetry' },
              { name: 'Azure', connected: formState.connectedAzure, desc: 'Cost Management & Advisor integration' },
              { name: 'GCP', connected: formState.connectedGCP, desc: 'Billing export & Monitoring metrics' },
            ].map((provider) => (
              <div key={provider.name} className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-sm">{provider.name} Cloud</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      provider.connected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {provider.connected ? 'Connected' : 'Demo Mode'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{provider.desc}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowConnectModal(provider.name as any)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs border border-slate-700 transition-all cursor-pointer"
                >
                  {provider.connected ? 'Manage Connection' : 'Connect Provider'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <button
            type="button"
            onClick={resetDemoData}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-red-400 font-bold text-xs border border-slate-700 flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo State</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>

      </form>

      {/* Connect Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base">Connect {showConnectModal} Account</h3>
              <button onClick={() => setShowConnectModal(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Real integration with {showConnectModal} requires secure read-only IAM credentials and a backend data collector service. For security, CloudSentinel prototype operates in simulated demo mode without storing secret keys in browser storage.
            </p>
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-xs text-cyan-300 flex items-center gap-2">
              <Lock className="w-4 h-4 shrink-0" />
              <span>Zero-trust architecture: Cloud secrets are never stored client-side.</span>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowConnectModal(null)}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
