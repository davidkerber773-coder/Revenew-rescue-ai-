# Revenue Rescue AI

A production-ready SaaS-style revenue recovery dashboard for identifying missed opportunity, churn risk, and conversion bottlenecks.

## What it does
Revenue Rescue AI helps businesses estimate:
- at-risk recurring revenue
- conversion and churn risk
- likely high-value optimization opportunities
- concrete recovery actions to drive retention and revenue uplift

## Features
- Secure Express API
- rate-limited endpoints
- health and readiness checks
- optional OpenAI-powered recommendations
- responsive dashboard interface
- environment-based configuration

## Local development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

3. Start the app:
   ```bash
   npm start
   ```

4. Open the app in a browser:
   ```text
   http://localhost:3000
   ```

## Environment variables

Example configuration in `.env`:

```bash
PORT=3000
NODE_ENV=development
OPENAI_API_KEY=
```

## API endpoints

### Health
```bash
curl http://localhost:3000/api/health
```

### Readiness
```bash
curl http://localhost:3000/api/ready
```

### Analyze opportunity
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

## Deployment notes
- Use a real `NODE_ENV=production` environment in hosting.
- Keep `OPENAI_API_KEY` in a secure secret manager, not in source control.
- Run behind a reverse proxy (Nginx, Vercel, Render, Railway, etc.) for SSL termination and production traffic management.
- Consider adding a persistent database for saved analyses and user accounts if this is expanded beyond the MVP stage.

## Production readiness summary
This version includes:
- HTTP security headers
- request validation and rate limiting
- structured health endpoints
- graceful shutdown
- optional AI augmentation
- safe static asset serving
