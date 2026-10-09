export type CloudProvider = 'AWS' | 'Azure' | 'GCP' | 'Demo';

export type ServiceType = 'Compute' | 'Storage' | 'Database' | 'Data Transfer' | 'Other';

export type ProjectName = 'Project Alpha' | 'Project Beta' | 'Internal Tools';

export interface CostRecord {
  id: string;
  date: string; // YYYY-MM-DD
  provider: CloudProvider;
  accountId: string;
  project: ProjectName;
  service: ServiceType;
  resourceId: string;
  resourceName: string;
  usageMetric: string;
  usageAmount: number;
  costINR: number;
}

export interface Budget {
  id: string;
  name: string;
  period: string;
  amountINR: number;
  warningThresholdPercent: number;
  criticalThresholdPercent: number;
  scope: string;
}

export interface ForecastData {
  id: string;
  generatedAt: string;
  periodStart: string;
  periodEnd: string;
  actualToDateINR: number;
  projectedTotalINR: number;
  lowEstimateINR: number;
  highEstimateINR: number;
  method: string;
  qualityLabel: string;
}

export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';
export type AnomalyStatus = 'New' | 'Investigating' | 'Resolved' | 'Dismissed';

export interface Anomaly {
  id: string;
  title: string;
  severity: Severity;
  status: AnomalyStatus;
  firstDetectedAt: string;
  provider: CloudProvider;
  project: ProjectName;
  service: ServiceType;
  resourceId: string;
  baselineCostINR: number;
  actualCostINR: number;
  deltaINR: number;
  percentChange: number;
  likelyCause: string;
  confidence: string;
  estimatedImpactINR: number;
  investigationNote?: string;
}

export type RecommendationStatus = 'Suggested' | 'Simulated' | 'Tracked' | 'Dismissed';
export type EffortLevel = 'Low' | 'Medium' | 'High';

export interface Recommendation {
  id: string;
  title: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  resourceId: string;
  project: ProjectName;
  service: ServiceType;
  reason: string;
  currentMonthlyCostINR: number;
  estimatedPostActionCostINR: number;
  estimatedMonthlySavingINR: number;
  confidence: string;
  effort: EffortLevel;
  risk: EffortLevel;
  status: RecommendationStatus;
  assumptions: string;
}

export interface Scenario {
  id: string;
  name: string;
  scenarioType: string;
  inputParameters: Record<string, any>;
  baselineProjectedCostINR: number;
  simulatedProjectedCostINR: number;
  differenceINR: number;
  assumptions: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'info' | 'warning' | 'success' | 'danger';
}

export interface AppSettings {
  workspaceName: string;
  currency: string;
  monthlyBudgetINR: number;
  defaultDateRange: string;
  alertForecast80: boolean;
  alertForecast100: boolean;
  alertDailySpike: boolean;
  alertCriticalAnomaly: boolean;
  anomalyPercentThreshold: number;
  minAbsoluteIncreaseINR: number;
  connectedAWS: boolean;
  connectedAzure: boolean;
  connectedGCP: boolean;
}
