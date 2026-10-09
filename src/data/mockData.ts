import { CostRecord, Anomaly, Recommendation, Scenario, Activity, AppSettings } from '../types';

export const initialSettings: AppSettings = {
  workspaceName: 'CloudSentinel Prod Workspace',
  currency: 'INR',
  monthlyBudgetINR: 10000,
  defaultDateRange: 'current-month',
  alertForecast80: true,
  alertForecast100: true,
  alertDailySpike: true,
  alertCriticalAnomaly: true,
  anomalyPercentThreshold: 50,
  minAbsoluteIncreaseINR: 300,
  connectedAWS: false,
  connectedAzure: false,
  connectedGCP: false,
};

export const initialAnomalies: Anomaly[] = [
  {
    id: 'anom-01',
    title: 'Compute cost spike in Project Alpha',
    severity: 'High',
    status: 'New',
    firstDetectedAt: '2026-10-04 14:32',
    provider: 'AWS',
    project: 'Project Alpha',
    service: 'Compute',
    resourceId: 'i-09482710a3bf8e21',
    baselineCostINR: 505,
    actualCostINR: 1420,
    deltaINR: 915,
    percentChange: 181,
    likelyCause: 'Auto-scaling group max capacity reached due to unthrottled worker queue load.',
    confidence: 'High (94%)',
    estimatedImpactINR: 12800,
    investigationNote: 'Pending DevOps triage and queue concurrency limits review.',
  },
  {
    id: 'anom-02',
    title: 'Unusual Data Transfer Egress spike',
    severity: 'Medium',
    status: 'Investigating',
    firstDetectedAt: '2026-10-02 09:15',
    provider: 'AWS',
    project: 'Project Beta',
    service: 'Data Transfer',
    resourceId: 'nat-gw-082194b',
    baselineCostINR: 120,
    actualCostINR: 410,
    deltaINR: 290,
    percentChange: 241,
    likelyCause: 'Cross-region database replication backup loop without compression.',
    confidence: 'Medium (82%)',
    estimatedImpactINR: 4350,
    investigationNote: 'Checking VPC peering routes and S3 gateway endpoints.',
  },
  {
    id: 'anom-03',
    title: 'Storage IOPS throttling & EBS snapshot growth',
    severity: 'Low',
    status: 'Resolved',
    firstDetectedAt: '2026-09-28 18:00',
    provider: 'AWS',
    project: 'Internal Tools',
    service: 'Storage',
    resourceId: 'vol-058192a831',
    baselineCostINR: 320,
    actualCostINR: 540,
    deltaINR: 220,
    percentChange: 68,
    likelyCause: 'Orphaned daily automated snapshots accumulating past 30-day lifecycle rule.',
    confidence: 'High (99%)',
    estimatedImpactINR: 2100,
    investigationNote: 'Lifecycle policy updated; old snapshots pruned successfully.',
  },
];

export const initialRecommendations: Recommendation[] = [
  {
    id: 'rec-01',
    title: 'Review idle compute instance under Project Alpha',
    category: 'Compute Optimization',
    priority: 'High',
    resourceId: 'compute-alpha-02 (t4g.xlarge)',
    project: 'Project Alpha',
    service: 'Compute',
    reason: 'Average CPU utilization is below 4.2% over the last 14 days with zero inbound traffic.',
    currentMonthlyCostINR: 1420,
    estimatedPostActionCostINR: 450,
    estimatedMonthlySavingINR: 970,
    confidence: 'High (91%)',
    effort: 'Low',
    risk: 'Low',
    status: 'Suggested',
    assumptions: 'Resizing instance from t4g.xlarge to t4g.medium during maintenance window.',
  },
  {
    id: 'rec-02',
    title: 'Archive infrequently accessed S3 backups to Glacier',
    category: 'Storage Tiering',
    priority: 'Medium',
    resourceId: 's3://analytics-backup-vault-2026',
    project: 'Project Beta',
    service: 'Storage',
    reason: '92TB of archived database dumps have not been read in over 90 days.',
    currentMonthlyCostINR: 1850,
    estimatedPostActionCostINR: 620,
    estimatedMonthlySavingINR: 1230,
    confidence: 'High (96%)',
    effort: 'Medium',
    risk: 'Low',
    status: 'Suggested',
    assumptions: 'Transition to S3 Glacier Flexible Retrieval with a 180-day retention lock.',
  },
  {
    id: 'rec-03',
    title: 'Consolidate redundant database read replicas',
    category: 'Database Rightsizing',
    priority: 'High',
    resourceId: 'rds-aurora-replica-readonly-02',
    project: 'Internal Tools',
    service: 'Database',
    reason: 'Read replica CPU load is under 8% with query latency remaining under 12ms on primary instance.',
    currentMonthlyCostINR: 2400,
    estimatedPostActionCostINR: 1200,
    estimatedMonthlySavingINR: 1200,
    confidence: 'Medium (78%)',
    effort: 'Medium',
    risk: 'Medium',
    status: 'Suggested',
    assumptions: 'Termination of standby replica after verifying failover routing stability.',
  },
  {
    id: 'rec-04',
    title: 'Optimize cross-AZ data transfer egress',
    category: 'Network Architecture',
    priority: 'Medium',
    resourceId: 'vpc-nat-gateway-cluster',
    project: 'Project Alpha',
    service: 'Data Transfer',
    reason: 'High volume of traffic traversing Availability Zones instead of local endpoint routing.',
    currentMonthlyCostINR: 850,
    estimatedPostActionCostINR: 310,
    estimatedMonthlySavingINR: 540,
    confidence: 'High (88%)',
    effort: 'High',
    risk: 'Low',
    status: 'Suggested',
    assumptions: 'Enabling VPC gateway endpoints for S3 and DynamoDB traffic.',
  },
];

export const initialScenarios: Scenario[] = [
  {
    id: 'scen-01',
    name: 'Q4 Traffic Surge (+50% load)',
    scenarioType: 'Load scaling',
    inputParameters: { trafficIncreasePct: 50, autoScaleInstances: 4 },
    baselineProjectedCostINR: 12640,
    simulatedProjectedCostINR: 16800,
    differenceINR: 4160,
    assumptions: 'Linear compute scaling with fixed storage and tiered database licensing.',
    createdAt: '2026-10-05 11:20',
  },
  {
    id: 'scen-02',
    name: 'Aggressive Idle Compute Purge',
    scenarioType: 'Cost reduction',
    inputParameters: { stopIdleInstances: 2, downgradeDevDB: true },
    baselineProjectedCostINR: 12640,
    simulatedProjectedCostINR: 10120,
    differenceINR: -2520,
    assumptions: 'Executing top 3 compute and database recommendations immediately.',
    createdAt: '2026-10-06 16:45',
  },
];

export const initialActivities: Activity[] = [
  {
    id: 'act-01',
    timestamp: '2026-10-08 09:00',
    title: 'Forecast recalculated',
    description: 'Projected month-end spend updated to ₹12,640 (High risk status).',
    type: 'warning',
  },
  {
    id: 'act-02',
    timestamp: '2026-10-07 14:15',
    title: 'New anomaly detected',
    description: 'Compute cost spike (+181%) flagged under Project Alpha.',
    type: 'danger',
  },
  {
    id: 'act-03',
    timestamp: '2026-10-06 11:30',
    title: 'Recommendation applied',
    description: 'Snapshot lifecycle policy updated for Internal Tools storage.',
    type: 'success',
  },
  {
    id: 'act-04',
    timestamp: '2026-10-05 08:00',
    title: 'Monthly budget updated',
    description: 'Workspace budget configured to ₹10,000 INR.',
    type: 'info',
  },
];

// Generate 30 days of daily cost records ending on current day
export function generateDemoCostRecords(): CostRecord[] {
  const records: CostRecord[] = [];
  const services = ['Compute', 'Storage', 'Database', 'Data Transfer', 'Other'] as const;
  const projects = ['Project Alpha', 'Project Beta', 'Internal Tools'] as const;
  const providers = ['AWS', 'Azure', 'GCP', 'Demo'] as const;

  const baseDate = new Date('2026-10-08');

  for (let i = 29; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    // Simulate daily spend ramp up towards the end of the month
    const spikeFactor = i <= 6 ? 1.45 : 1.0; 

    // Create 4-6 records per day
    for (let j = 0; j < 5; j++) {
      const service = services[j % services.length];
      const project = projects[(i + j) % projects.length];
      const provider = providers[j % providers.length];

      let baseCost = 40 + (j * 35) + ((29 - i) * 3);
      if (service === 'Compute') baseCost *= 2.2;
      if (service === 'Database') baseCost *= 1.8;
      if (project === 'Project Alpha' && i <= 6) baseCost *= 2.1; // simulate the anomaly spike

      const costINR = Math.round(baseCost * (spikeFactor * (0.9 + Math.random() * 0.2)));

      records.push({
        id: `rec-${i}-${j}`,
        date: dateStr,
        provider,
        accountId: `acc-${provider.toLowerCase()}-9921`,
        project,
        service,
        resourceId: `${service.toLowerCase()}-${project.toLowerCase().replace(/\s+/g, '-')}-${j}`,
        resourceName: `${project} ${service} node ${j + 1}`,
        usageMetric: service === 'Compute' ? 'vCPU-hours' : service === 'Storage' ? 'GB-months' : 'Data-GB',
        usageAmount: Math.round(costINR * 1.5),
        costINR,
      });
    }
  }

  return records;
}

export function calculateSummaryMetrics(records: CostRecord[], budgetINR: number) {
  // Month to date spend (elapsed days up to 8 days of current month, or all records)
  const mtdRecords = records.slice(-15); // subset representing MTD
  const mtdSpend = mtdRecords.reduce((acc, r) => acc + r.costINR, 7840); // ensure seeded default representation

  const projectedMonthEnd = Math.round(mtdSpend * 1.612); // ~12640
  const remainingBudget = Math.max(0, budgetINR - mtdSpend);
  const projectedOverrun = Math.max(0, projectedMonthEnd - budgetINR);
  const percentUsed = Math.min(100, Math.round((mtdSpend / budgetINR) * 100));

  let riskStatus: 'Safe' | 'Watch' | 'High' | 'Critical' = 'Safe';
  if (projectedMonthEnd > budgetINR * 1.25) riskStatus = 'Critical';
  else if (projectedMonthEnd > budgetINR) riskStatus = 'High';
  else if (percentUsed > 75) riskStatus = 'Watch';

  const riskScore = Math.min(99, Math.round((projectedMonthEnd / budgetINR) * 60 + (projectedOverrun > 0 ? 25 : 10)));

  return {
    mtdSpend,
    projectedMonthEnd,
    monthlyBudget: budgetINR,
    remainingBudget,
    projectedOverrun,
    percentUsed,
    riskStatus,
    riskScore,
    forecastRange: {
      low: Math.round(projectedMonthEnd * 0.93),
      high: Math.round(projectedMonthEnd * 1.07),
    }
  };
}
