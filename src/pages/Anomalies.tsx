import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  X, 
  ArrowRight, 
  ShieldAlert,
  SlidersHorizontal
} from 'lucide-react';
import { Anomaly, Severity, AnomalyStatus } from '../types';

interface AnomaliesProps {
  anomalies: Anomaly[];
  updateAnomalyStatus: (id: string, status: AnomalyStatus, note?: string) => void;
}

export const Anomalies: React.FC<AnomaliesProps> = ({ anomalies, updateAnomalyStatus }) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAnomaly, setActiveAnomaly] = useState<Anomaly | null>(null);
  const [noteInput, setNoteInput] = useState('');

  const filteredAnomalies = anomalies.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = selectedSeverity === 'All' || a.severity === selectedSeverity;
    const matchesStatus = selectedStatus === 'All' || a.status === selectedStatus;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const handleStatusChange = (newStatus: AnomalyStatus) => {
    if (!activeAnomaly) return;
    updateAnomalyStatus(activeAnomaly.id, newStatus, noteInput || activeAnomaly.investigationNote);
    setActiveAnomaly({ ...activeAnomaly, status: newStatus, investigationNote: noteInput || activeAnomaly.investigationNote });
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Cost Anomalies & Deviations</h1>
          <p className="text-sm text-slate-400 mt-1">
            Unusual spending deviations detected against historical baseline models.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold">
            {anomalies.filter(a => a.status === 'New' || a.status === 'Investigating').length} Active Anomalies
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search anomalies by title, project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
          />
        </div>

        <select
          value={selectedSeverity}
          onChange={(e) => setSelectedSeverity(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
        >
          <option value="All">All Severities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
        >
          <option value="All">All Statuses</option>
          <option value="New">New</option>
          <option value="Investigating">Investigating</option>
          <option value="Resolved">Resolved</option>
          <option value="Dismissed">Dismissed</option>
        </select>

      </div>

      {/* Anomaly Cards List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredAnomalies.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 p-12 text-center rounded-2xl text-slate-400">
            No anomalies matched your filter criteria.
          </div>
        ) : (
          filteredAnomalies.map((a) => (
            <div 
              key={a.id}
              onClick={() => {
                setActiveAnomaly(a);
                setNoteInput(a.investigationNote || '');
              }}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl shadow-xl transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6 group"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl shrink-0 mt-0.5 ${
                  a.severity === 'Critical' || a.severity === 'High' 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      a.severity === 'Critical' || a.severity === 'High' 
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {a.severity}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      a.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      a.status === 'Investigating' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {a.status}
                    </span>
                    <span className="text-xs text-slate-400">• Detected {a.firstDetectedAt}</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-all">{a.title}</h3>
                  <p className="text-xs text-slate-300 mt-1">{a.likelyCause}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-800 justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Cost Deviation</div>
                  <div className="text-sm font-bold text-red-400 mt-0.5">+₹{a.deltaINR}/day (+{a.percentChange}%)</div>
                </div>
                <button className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-all">
                  <span>Investigate</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Anomaly Investigation Drawer Modal */}
      {activeAnomaly && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-end p-0">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-xl h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Anomaly Investigation</h3>
                  <p className="text-xs text-slate-400">{activeAnomaly.id} • {activeAnomaly.project}</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveAnomaly(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              
              <div>
                <h2 className="text-lg font-bold text-white mb-2">{activeAnomaly.title}</h2>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30">
                    {activeAnomaly.severity} Severity
                  </span>
                  <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
                    Confidence: {activeAnomaly.confidence}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Baseline Daily Cost</div>
                  <div className="text-base font-bold text-white mt-1">₹{activeAnomaly.baselineCostINR}</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Actual Daily Cost</div>
                  <div className="text-base font-bold text-red-400 mt-1">₹{activeAnomaly.actualCostINR}</div>
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Root-Cause Analysis</h4>
                <p className="text-xs text-slate-200 leading-relaxed">{activeAnomaly.likelyCause}</p>
                <div className="text-xs text-cyan-400 font-semibold pt-2 border-t border-slate-800">
                  Estimated Monthly Impact: ₹{activeAnomaly.estimatedImpactINR.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Investigation Notes & Triage Status</label>
                <textarea
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Add triage notes, engineering ticket ID, or root-cause findings..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 h-24"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Update Incident Status</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleStatusChange('Investigating')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      activeAnomaly.status === 'Investigating' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    Investigating
                  </button>
                  <button
                    onClick={() => handleStatusChange('Resolved')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      activeAnomaly.status === 'Resolved' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    Mark Resolved
                  </button>
                  <button
                    onClick={() => handleStatusChange('Dismissed')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      activeAnomaly.status === 'Dismissed' ? 'bg-slate-700 text-white border-slate-600' : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    Dismiss
                  </button>
                </div>
              </div>

            </div>

            <div className="p-6 border-t border-slate-800 bg-slate-950 flex justify-end">
              <button
                onClick={() => setActiveAnomaly(null)}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer"
              >
                Save & Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
