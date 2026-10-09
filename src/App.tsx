import React, { useState, useEffect } from 'react';
import { 
  generateDemoCostRecords, 
  initialAnomalies, 
  initialRecommendations, 
  initialScenarios, 
  initialActivities, 
  initialSettings, 
  calculateSummaryMetrics 
} from './data/mockData';
import { 
  CloudProvider, 
  Anomaly, 
  Recommendation, 
  Scenario, 
  Activity, 
  AppSettings, 
  AnomalyStatus, 
  RecommendationStatus 
} from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AiAdvisorModal } from './components/AiAdvisorModal';
import { Overview } from './pages/Overview';
import { CostExplorer } from './pages/CostExplorer';
import { Forecasts } from './pages/Forecasts';
import { Anomalies } from './pages/Anomalies';
import { Recommendations } from './pages/Recommendations';
import { WhatIfSimulator } from './pages/WhatIfSimulator';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Zap, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [currentProvider, setCurrentProvider] = useState<CloudProvider>('Demo');
  const [dateRange, setDateRange] = useState<string>('current-month');
  
  // Persistent state via localStorage or initial defaults
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('cloudsentinel_settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });

  const [costRecords] = useState(() => generateDemoCostRecords());

  const [anomalies, setAnomalies] = useState<Anomaly[]>(() => {
    const saved = localStorage.getItem('cloudsentinel_anomalies');
    return saved ? JSON.parse(saved) : initialAnomalies;
  });

  const [recommendations, setRecommendations] = useState<Recommendation[]>(() => {
    const saved = localStorage.getItem('cloudsentinel_recs');
    return saved ? JSON.parse(saved) : initialRecommendations;
  });

  const [scenarios, setScenarios] = useState<Scenario[]>(() => {
    const saved = localStorage.getItem('cloudsentinel_scenarios');
    return saved ? JSON.parse(saved) : initialScenarios;
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('cloudsentinel_activities');
    return saved ? JSON.parse(saved) : initialActivities;
  });

  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; time: string; type: string }>>([
    { id: 'notif-1', title: 'Compute cost spike in Project Alpha', time: '10 mins ago', type: 'danger' },
    { id: 'notif-2', title: 'Forecasted budget overrun of ₹2,640', time: '1 hour ago', type: 'warning' },
  ]);

  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);
  const [preloadedSimulatorRec, setPreloadedSimulatorRec] = useState<Recommendation | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('cloudsentinel_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('cloudsentinel_anomalies', JSON.stringify(anomalies));
  }, [anomalies]);

  useEffect(() => {
    localStorage.setItem('cloudsentinel_recs', JSON.stringify(recommendations));
  }, [recommendations]);

  useEffect(() => {
    localStorage.setItem('cloudsentinel_scenarios', JSON.stringify(scenarios));
  }, [scenarios]);

  useEffect(() => {
    localStorage.setItem('cloudsentinel_activities', JSON.stringify(activities));
  }, [activities]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const metrics = calculateSummaryMetrics(costRecords, settings.monthlyBudgetINR);

  // Simulate Cost Spike Action
  const handleSimulateCostSpike = () => {
    const newAnom: Anomaly = {
      id: `anom-${Date.now()}`,
      title: 'Sudden high-throughput compute spike',
      severity: 'Critical',
      status: 'New',
      firstDetectedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      provider: 'AWS',
      project: 'Project Alpha',
      service: 'Compute',
      resourceId: `i-spike-${Math.floor(Math.random() * 90000 + 10000)}`,
      baselineCostINR: 650,
      actualCostINR: 1950,
      deltaINR: 1300,
      percentChange: 200,
      likelyCause: 'Unscheduled burst batch processing job triggered without concurrency limit.',
      confidence: 'High (98%)',
      estimatedImpactINR: 15600,
      investigationNote: 'Triggered via CloudSentinel simulation action.',
    };

    setAnomalies([newAnom, ...anomalies]);

    const newAct: Activity = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      title: 'Cost spike simulated',
      description: 'Critical compute cost spike injected (+₹1,300/day deviation).',
      type: 'danger',
    };
    setActivities([newAct, ...activities]);

    setNotifications([
      { id: `notif-${Date.now()}`, title: 'Critical compute cost spike simulated', time: 'Just now', type: 'danger' },
      ...notifications,
    ]);

    showToast('Simulated a critical cloud cost spike! Forecast and risk updated.');
  };

  const updateAnomalyStatus = (id: string, status: AnomalyStatus, note?: string) => {
    setAnomalies(anomalies.map(a => a.id === id ? { ...a, status, investigationNote: note } : a));
    showToast(`Anomaly ${id} status updated to ${status}.`);
  };

  const updateRecommendationStatus = (id: string, status: RecommendationStatus) => {
    setRecommendations(recommendations.map(r => r.id === id ? { ...r, status } : r));
    showToast(`Recommendation status updated to ${status}.`);
  };

  const saveScenario = (scen: Scenario) => {
    setScenarios([scen, ...scenarios]);
    showToast(`Scenario "${scen.name}" saved successfully.`);
  };

  const resetDemoData = () => {
    localStorage.clear();
    setSettings(initialSettings);
    setAnomalies(initialAnomalies);
    setRecommendations(initialRecommendations);
    setScenarios(initialScenarios);
    setActivities(initialActivities);
    showToast('Demo state and storage reset to defaults.');
  };

  const activeAnomaliesCount = anomalies.filter(a => a.status === 'New' || a.status === 'Investigating').length;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openAiAdvisor={() => setIsAiAdvisorOpen(true)}
        activeAnomaliesCount={activeAnomaliesCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          currentProvider={currentProvider}
          setCurrentProvider={setCurrentProvider}
          dateRange={dateRange}
          setDateRange={setDateRange}
          simulateCostSpike={handleSimulateCostSpike}
          notifications={notifications}
          openAiAdvisor={() => setIsAiAdvisorOpen(true)}
          percentUsed={metrics.percentUsed}
          mtdSpend={metrics.mtdSpend}
          monthlyBudget={metrics.monthlyBudget}
        />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {currentTab === 'overview' && (
            <Overview
              metrics={metrics}
              costRecords={costRecords}
              anomalies={anomalies}
              recommendations={recommendations}
              activities={activities}
              setCurrentTab={setCurrentTab}
              simulateCostSpike={handleSimulateCostSpike}
            />
          )}

          {currentTab === 'costs' && (
            <CostExplorer costRecords={costRecords} />
          )}

          {currentTab === 'forecasts' && (
            <Forecasts metrics={metrics} costRecords={costRecords} />
          )}

          {currentTab === 'anomalies' && (
            <Anomalies anomalies={anomalies} updateAnomalyStatus={updateAnomalyStatus} />
          )}

          {currentTab === 'recommendations' && (
            <Recommendations
              recommendations={recommendations}
              updateRecommendationStatus={updateRecommendationStatus}
              goToSimulator={(rec) => {
                setPreloadedSimulatorRec(rec);
                setCurrentTab('simulator');
              }}
            />
          )}

          {currentTab === 'simulator' && (
            <WhatIfSimulator
              currentProjectedCost={metrics.projectedMonthEnd}
              monthlyBudget={settings.monthlyBudgetINR}
              preloadedRec={preloadedSimulatorRec}
              saveScenario={saveScenario}
            />
          )}

          {currentTab === 'reports' && (
            <Reports
              costRecords={costRecords}
              anomalies={anomalies}
              recommendations={recommendations}
            />
          )}

          {currentTab === 'settings' && (
            <Settings
              settings={settings}
              updateSettings={setSettings}
              resetDemoData={resetDemoData}
            />
          )}
        </main>
      </div>

      {/* AI Advisor Modal */}
      <AiAdvisorModal
        isOpen={isAiAdvisorOpen}
        onClose={() => setIsAiAdvisorOpen(false)}
        contextData={{
          metrics,
          anomalies: anomalies.filter(a => a.status === 'New' || a.status === 'Investigating'),
          recommendations: recommendations.filter(r => r.status !== 'Dismissed'),
          settings,
        }}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-cyan-500/40 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

    </div>
  );
};
