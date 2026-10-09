import React, { useState } from 'react';
import { FileText, Download, Calendar, ShieldAlert, CheckCircle2, BarChart3, Database } from 'lucide-react';
import { CostRecord, Anomaly, Recommendation } from '../types';

interface ReportsProps {
  costRecords: CostRecord[];
  anomalies: Anomaly[];
  recommendations: Recommendation[];
}

export const Reports: React.FC<ReportsProps> = ({ costRecords, anomalies, recommendations }) => {
  const [reportType, setReportType] = useState<'monthly' | 'forecasts' | 'anomalies' | 'recommendations'>('monthly');

  const handleExportCSV = (typeOverride?: string) => {
    const targetType = typeOverride || reportType;
    let csvHeader = "";
    let csvRows: string[] = [];

    if (targetType === 'monthly') {
      csvHeader = "Date,Provider,Project,Service,Resource Name,Cost (INR)";
      csvRows = costRecords.map(r => `${r.date},${r.provider},${r.project},${r.service},"${r.resourceName}",${r.costINR}`);
    } else if (targetType === 'anomalies') {
      csvHeader = "ID,Title,Severity,Status,Project,Service,Actual Cost,Delta,Likely Cause";
      csvRows = anomalies.map(a => `${a.id},"${a.title}",${a.severity},${a.status},${a.project},${a.service},${a.actualCostINR},${a.deltaINR},"${a.likelyCause}"`);
    } else if (targetType === 'recommendations') {
      csvHeader = "ID,Title,Category,Project,Estimated Monthly Saving,Effort,Risk,Status";
      csvRows = recommendations.map(r => `${r.id},"${r.title}",${r.category},${r.project},${r.estimatedMonthlySavingINR},${r.effort},${r.risk},${r.status}`);
    } else {
      csvHeader = "ReportType,GeneratedAt,Status,Summary";
      csvRows = [`ForecastReport,2026-10-08,Active,"Projected spend ₹12,640 against budget ₹10,000"`];
    }

    const csvContent = "data:text/csv;charset=utf-8," + [csvHeader, ...csvRows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `cloudsentinel_${targetType}_structured_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">FinOps Report Center</h1>
          <p className="text-sm text-slate-400 mt-1">
            Generate and download structured CSV reports for cost records, anomaly logs, and optimization insights.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleExportCSV()}
            className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV ({reportType.toUpperCase()})</span>
          </button>
        </div>
      </div>

      {/* Report Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { id: 'monthly', label: 'Monthly Cost Summary', icon: BarChart3 },
          { id: 'forecasts', label: 'Forecast & Budget Risk', icon: Calendar },
          { id: 'anomalies', label: 'Anomaly Audit Report', icon: ShieldAlert },
          { id: 'recommendations', label: 'Optimization Opportunities', icon: FileText },
        ].map((r) => {
          const Icon = r.icon;
          const isActive = reportType === r.id;
          return (
            <button
              key={r.id}
              onClick={() => setReportType(r.id as any)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                isActive 
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-white shadow-lg' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 mb-2 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <div className="text-xs font-bold">{r.label}</div>
            </button>
          );
        })}
      </div>

      {/* Report Preview & Direct Download Actions */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="font-bold text-base text-white capitalize">{reportType} Report Preview</h2>
            <p className="text-xs text-slate-400">Generated on October 8, 2026 • Simulated Demo Data</p>
          </div>
          <button
            onClick={() => handleExportCSV()}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV File</span>
          </button>
        </div>

        {reportType === 'monthly' && (
          <div className="space-y-4 text-xs text-slate-300">
            <p>This report summarizes all cloud resource expenditures across AWS, Azure, and GCP for the current month.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Total Ledger Records</span>
                <strong className="text-white text-base mt-1 block">{costRecords.length} entries</strong>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Total Spend</span>
                <strong className="text-cyan-400 text-base mt-1 block">₹{costRecords.reduce((a,b)=>a+b.costINR,0).toLocaleString('en-IN')}</strong>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Primary Driver</span>
                <strong className="text-white text-base mt-1 block">Compute (54%)</strong>
              </div>
            </div>
            <div className="pt-2">
              <button
                onClick={() => handleExportCSV('monthly')}
                className="px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs border border-cyan-500/30 flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Cost Records Structured CSV</span>
              </button>
            </div>
          </div>
        )}

        {reportType === 'anomalies' && (
          <div className="space-y-4 text-xs text-slate-300">
            <p>Audit report of all flagged cost spikes and deviations during the period.</p>
            <div className="divide-y divide-slate-800 text-xs">
              {anomalies.map(a => (
                <div key={a.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">{a.title}</span>
                    <span className="text-slate-400 ml-2">({a.severity})</span>
                  </div>
                  <span className="text-red-400 font-bold">+₹{a.deltaINR}/day</span>
                </div>
              ))}
            </div>
            <div className="pt-2">
              <button
                onClick={() => handleExportCSV('anomalies')}
                className="px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs border border-cyan-500/30 flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Anomaly Logs Structured CSV</span>
              </button>
            </div>
          </div>
        )}

        {reportType === 'recommendations' && (
          <div className="space-y-4 text-xs text-slate-300">
            <p>Actionable savings report categorized by effort and projected monthly impact.</p>
            <div className="divide-y divide-slate-800 text-xs">
              {recommendations.map(r => (
                <div key={r.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">{r.title}</span>
                    <span className="text-slate-400 ml-2">[{r.category}]</span>
                  </div>
                  <span className="text-emerald-400 font-bold">Save ₹{r.estimatedMonthlySavingINR.toLocaleString('en-IN')}/mo</span>
                </div>
              ))}
            </div>
            <div className="pt-2">
              <button
                onClick={() => handleExportCSV('recommendations')}
                className="px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs border border-cyan-500/30 flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Recommendations CSV</span>
              </button>
            </div>
          </div>
        )}

        {reportType === 'forecasts' && (
          <div className="space-y-4 text-xs text-slate-300">
            <p>Comprehensive budget risk and probabilistic month-end forecasting summary.</p>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Monthly Budget:</span>
                <strong className="text-white">₹10,000</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Projected Bill:</span>
                <strong className="text-cyan-400">₹12,640</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Projected Overrun:</span>
                <strong className="text-red-400">₹2,640 (High Risk)</strong>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
