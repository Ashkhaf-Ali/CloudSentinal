# CloudSentinel — Predictive Cloud Cost Intelligence & Early-Warning Platform

CloudSentinel is an intelligent cloud-cost forecasting and anomaly detection platform. It helps engineering and FinOps teams forecast future spend, identify unusual cost spikes, estimate budget-overrun risks, and simulate optimization scenarios.

## Features
- **Overview Dashboard**: Month-to-date spend, projected month-end bill, budget utilization progress bar with 80% threshold warnings.
- **Cost Explorer**: Multi-dimensional filtering by service, project, and cloud provider (AWS, Azure, GCP).
- **Predictive Forecasts**: Probabilistic month-end bill forecasting with budget breach timeline analysis.
- **Anomaly Watcher**: Automated deviation detection comparing live expenditure against baseline metrics.
- **Cost Optimization Engine**: Actionable rightsizing and storage lifecycle recommendations.
- **What-If Simulator**: Interactive scenario modeling before making infrastructure changes.
- **Audit Reports**: Instant structured CSV export for ledger records and anomaly logs.
- **AI FinOps Advisor**: Integrated Gemini 3.1 Pro with High Thinking mode for architectural cost reduction.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` and provide your Gemini API key (optional for AI Advisor):
```bash
cp .env.example .env
```

### 3. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```
