# Revenue Rescue AI

A lightweight AI-inspired revenue recovery dashboard for small businesses. It helps estimate missed revenue, identifies likely churn/conversion issues, and suggests recovery actions.

## Features
- Dashboard UI for entering basic business metrics
- Revenue leakage analysis
- Churn / conversion risk scoring
- Actionable recommendation engine
- REST API for analysis

## Quick start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the app:
   ```bash
   npm start
   ```
3. Open:
   ```text
   http://localhost:3000
   ```

## Environment variables

Create a `.env` file based on `.env.example` if needed:

```bash
PORT=3000
OPENAI_API_KEY=your_key_here
```

## API

### Health check
```bash
curl http://localhost:3000/api/health
```

### Analyze revenue opportunity
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

## Notes
This project is intentionally lightweight and runs without any external API key by default. If you add an OpenAI key later, you can extend the analysis logic with model-powered recommendations.
