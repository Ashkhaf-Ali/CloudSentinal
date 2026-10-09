import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  BarChart3, 
  Download, 
  ChevronRight, 
  X, 
  Server, 
  Layers, 
  Database,
  ArrowUpDown
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { CostRecord, CloudProvider, ServiceType, ProjectName } from '../types';

interface CostExplorerProps {
  costRecords: CostRecord[];
}

export const CostExplorer: React.FC<CostExplorerProps> = ({ costRecords }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<string>('All');
  const [selectedService, setSelectedService] = useState<string>('All');
  const [groupBy, setGroupBy] = useState<'service' | 'project' | 'date'>('service');
  const [selectedResource, setSelectedResource] = useState<CostRecord | null>(null);

  // Filter records
  const filteredRecords = useMemo(() => {
    return costRecords.filter(r => {
      const matchesSearch = r.resourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            r.resourceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            r.project.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProvider = selectedProvider === 'All' || r.provider === selectedProvider;
      const matchesProject = selectedProject === 'All' || r.project === selectedProject;
      const matchesService = selectedService === 'All' || r.service === selectedService;
      return matchesSearch && matchesProvider && matchesProject && matchesService;
    });
  }, [costRecords, searchQuery, selectedProvider, selectedProject, selectedService]);

  // Aggregate for chart
  const chartAggregate = useMemo(() => {
    const map: Record<string, number> = {};
    filteredRecords.forEach(r => {
      const key = groupBy === 'service' ? r.service : groupBy === 'project' ? r.project : r.date;
      map[key] = (map[key] || 0) + r.costINR;
    });
    return Object.keys(map).map(k => ({ name: k, cost: map[k] }));
  }, [filteredRecords, groupBy]);

  const totalFilteredCost = filteredRecords.reduce((acc, r) => acc + r.costINR, 0);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Cost Explorer</h1>
          <p className="text-sm text-slate-400 mt-1">
            Granular multi-dimensional cost analysis across cloud services, projects, and resources.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-400">Filtered Total Spend</div>
            <div className="text-xl font-bold text-cyan-400">₹{totalFilteredCost.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search resources, IDs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
          />
        </div>

        {/* Provider Filter */}
        <select
          value={selectedProvider}
          onChange={(e) => setSelectedProvider(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
        >
          <option value="All">All Providers</option>
          <option value="AWS">AWS</option>
          <option value="Azure">Azure</option>
          <option value="GCP">GCP</option>
          <option value="Demo">Demo</option>
        </select>

        {/* Project Filter */}
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
        >
          <option value="All">All Projects</option>
          <option value="Project Alpha">Project Alpha</option>
          <option value="Project Beta">Project Beta</option>
          <option value="Internal Tools">Internal Tools</option>
        </select>

        {/* Service Filter */}
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
        >
          <option value="All">All Services</option>
          <option value="Compute">Compute</option>
          <option value="Storage">Storage</option>
          <option value="Database">Database</option>
          <option value="Data Transfer">Data Transfer</option>
          <option value="Other">Other</option>
        </select>

        {/* Group By */}
        <select
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value as any)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-cyan-400 font-semibold focus:outline-none focus:border-cyan-500 cursor-pointer"
        >
          <option value="service">Group by: Service</option>
          <option value="project">Group by: Project</option>
          <option value="date">Group by: Date</option>
        </select>

      </div>

      {/* Breakdown Chart */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-base text-white capitalize">Cost Breakdown by {groupBy}</h2>
          <span className="text-xs text-slate-400">{filteredRecords.length} records matched</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartAggregate} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} angle={-25} textAnchor="end" />
              <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `₹${v}`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Cost']}
              />
              <Bar dataKey="cost" fill="#06b6d4" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cost Detail Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-base text-white">Resource Cost Ledger</h2>
            <p className="text-xs text-slate-400">Click any resource row to inspect detailed telemetry</p>
          </div>
          <button
            onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8," + 
                ["Date,Provider,Project,Service,Resource Name,Cost (INR)"].concat(
                  filteredRecords.map(r => `${r.date},${r.provider},${r.project},${r.service},"${r.resourceName}",${r.costINR}`)
                ).join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "cloudsentinel_cost_ledger.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-700 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto max-h-[450px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-950/80 sticky top-0 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Provider</th>
                <th className="p-4">Project</th>
                <th className="p-4">Service</th>
                <th className="p-4">Resource Name</th>
                <th className="p-4">Usage</th>
                <th className="p-4 text-right">Cost (INR)</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
              {filteredRecords.slice(0, 50).map((r) => (
                <tr 
                  key={r.id} 
                  onClick={() => setSelectedResource(r)}
                  className="hover:bg-slate-800/50 transition-all cursor-pointer group"
                >
                  <td className="p-4 font-medium text-slate-400">{r.date}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold text-[10px]">
                      {r.provider}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-white">{r.project}</td>
                  <td className="p-4">
                    <span className="text-cyan-400 font-semibold">{r.service}</span>
                  </td>
                  <td className="p-4 font-mono text-slate-200">{r.resourceName}</td>
                  <td className="p-4 text-slate-400">{r.usageAmount} {r.usageMetric}</td>
                  <td className="p-4 text-right font-bold text-white">₹{r.costINR.toLocaleString('en-IN')}</td>
                  <td className="p-4 text-center">
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-all inline" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resource Detail Drawer Modal */}
      {selectedResource && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-end p-0">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-lg h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{selectedResource.resourceName}</h3>
                  <p className="text-xs font-mono text-slate-400">{selectedResource.resourceId}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedResource(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Cloud Provider</div>
                  <div className="text-sm font-semibold text-white mt-1">{selectedResource.provider}</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Assigned Project</div>
                  <div className="text-sm font-semibold text-cyan-400 mt-1">{selectedResource.project}</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Service Category</div>
                  <div className="text-sm font-semibold text-white mt-1">{selectedResource.service}</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Recorded Date</div>
                  <div className="text-sm font-semibold text-white mt-1">{selectedResource.date}</div>
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Financial & Usage Telemetry</h4>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Daily Cost:</span>
                  <strong className="text-white">₹{selectedResource.costINR.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Estimated Monthly Rate:</span>
                  <strong className="text-cyan-400">₹{(selectedResource.costINR * 30).toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Usage Quantity:</span>
                  <strong className="text-white">{selectedResource.usageAmount} {selectedResource.usageMetric}</strong>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300">
                <strong>Simulated Resource Note:</strong> This resource metadata is part of the CloudSentinel deterministic demo dataset and can be optimized via recommendations.
              </div>

            </div>

            <div className="p-6 border-t border-slate-800 bg-slate-950 flex justify-end">
              <button
                onClick={() => setSelectedResource(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
              >
                Close Drawer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
