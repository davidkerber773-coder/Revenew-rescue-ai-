# Revenue Rescue AI

A modern revenue recovery and retention dashboard for businesses that want to find missed opportunities, reduce churn, and improve conversion.

## Overview
Revenue Rescue AI analyzes key operating metrics to estimate recoverable revenue, identify likely churn risk, and recommend targeted actions to improve conversion and retention.

## Features
- Revenue recovery dashboard
- Churn and conversion scoring
- Opportunity analysis API
- Recommendations engine
- Responsive frontend UI

## Local setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Open the app:
   ```text
   http://localhost:3000
   ```

## API endpoints

### Health check
```bash
curl http://localhost:3000/api/health
```

### Revenue analysis
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "monthlyRevenue": 125000,
    "recurringRevenue": 72000,
    "churnRate": 6,
    "conversionRate": 2.5,
    "avgOrderValue": 180,
    "activeCustomers": 430
  }'
```

## Environment variables
Create a `.env` file if you want to add custom config:

```bash
PORT=3000
```

## Project status
This version is a working MVP: the backend, API, and frontend dashboard are all functional.
