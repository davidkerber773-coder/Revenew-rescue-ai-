const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function buildAnalysis(data) {
  const monthlyRevenue = Number(data.monthlyRevenue) || 0;
  const recurringRevenue = Number(data.recurringRevenue) || 0;
  const churnRate = Number(data.churnRate) || 0;
  const conversionRate = Number(data.conversionRate) || 0;
  const avgOrderValue = Number(data.avgOrderValue) || 0;
  const activeCustomers = Number(data.activeCustomers) || 0;

  const atRiskRevenue = recurringRevenue * (churnRate / 100);
  const potentialLift = Math.max(0, (conversionRate * 0.8) * avgOrderValue * 30);
  const totalOpportunity = Math.max(0, atRiskRevenue + potentialLift);
  const score = Math.min(100, Math.round((churnRate * 1.4 + (100 - conversionRate) * 0.7 + (monthlyRevenue > 0 ? (atRiskRevenue / monthlyRevenue) * 100 : 0))));

  const recommendations = [
    churnRate > 4 ? 'Launch a churn-prevention campaign for recently inactive customers.' : 'Keep retention messaging active with win-back offers.',
    conversionRate < 3 ? 'Improve checkout flow and bundle pricing to raise conversion.' : 'Double down on your strongest sales channels and upsell moments.',
    avgOrderValue < 150 ? 'Increase average order value with bundles, subscriptions, and cross-sells.' : 'Focus on retention and customer lifetime value optimization.'
  ];

  return {
    summary: {
      monthlyRevenue,
      recurringRevenue,
      churnRate,
      conversionRate,
      avgOrderValue,
      activeCustomers,
      totalOpportunity: Math.round(totalOpportunity)
    },
    score,
    opportunityLabel: score >= 75 ? 'High urgency' : score >= 45 ? 'Moderate opportunity' : 'Healthy but improvable',
    recommendations
  };
}

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Revenue Rescue AI',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/analyze', (req, res) => {
  const payload = req.body || {};
  const analysis = buildAnalysis(payload);

  res.json({
    status: 'ok',
    analysis
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Revenue Rescue AI running at http://localhost:${PORT}`);
});

