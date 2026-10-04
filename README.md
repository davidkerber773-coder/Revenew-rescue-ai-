# Revenue Rescue AI

A simple, working revenue recovery dashboard.

## Run locally

```bash
npm install
cp .env.example .env
npm start
```

Then open:

```text
http://localhost:3000
```

## API

### Health check
```bash
curl http://localhost:3000/api/health
```

### Analyze revenue
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"monthlyRevenue":125000,"recurringRevenue":72000,"churnRate":6,"conversionRate":2.5,"avgOrderValue":180,"activeCustomers":430}'
```

This version is intentionally simple and works immediately.
