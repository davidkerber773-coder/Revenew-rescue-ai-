const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const OpenAI = require('openai');

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.set('trust proxy', 1);
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '1mb' }));
app.disable('x-powered-by');

app.use('/api', rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many requests. Please slow down.' }
}));

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function buildAnalysis(data = {}) {
  const monthlyRevenue = toNumber(data.monthlyRevenue, 0);
  const recurringRevenue = toNumber(data.recurringRevenue, 0);
  const churnRate = toNumber(data.churnRate, 0);
  const conversionRate = toNumber(data.conversionRate, 0);
  const avgOrderValue = toNumber(data.avgOrderValue, 0);
  const activeCustomers = toNumber(data.activeCustomers, 0);

  const atRiskRevenue = recurringRevenue * (churnRate / 100);
  const conversionBoost = Math.max(0, (conversionRate * 0.8) * avgOrderValue * 30);
  const totalOpportunity = Math.max(0, atRiskRevenue + conversionBoost);

  const score = Math.min(
    100,
    Math.round(
      churnRate * 1.5 +
      (100 - conversionRate) * 0.8 +
      (monthlyRevenue > 0 ? (atRiskRevenue / monthlyRevenue) * 120 : 0)
    )
  );

  const recommendationSet = [
    churnRate > 4
      ? 'Launch a churn-prevention campaign for recently inactive customers.'
      : 'Keep retention messaging active with win-back offers.',
    conversionRate < 3
      ? 'Improve checkout flow and bundle pricing to increase conversion.'
      : 'Double down on your strongest sales channels and upsell moments.',
    avgOrderValue < 150
      ? 'Increase average order value with bundles, subscriptions, and cross-sells.'
      : 'Focus on customer retention and lifetime value optimization.'
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
    opportunityLabel:
      score >= 75 ? 'High urgency' : score >= 45 ? 'Moderate opportunity' : 'Healthy but improvable',
    recommendations: recommendationSet
  };
}

async function getAiRecommendations(payload, baseAnalysis) {
  if (!process.env.OPENAI_API_KEY) {
    return [];
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content: 'You are a revenue recovery strategist. Return only a short JSON array with 3 concise recommendation strings.'
        },
        {
          role: 'user',
          content: JSON.stringify({
            payload,
            summary: baseAnalysis.summary,
            score: baseAnalysis.score,
            opportunityLabel: baseAnalysis.opportunityLabel
          })
        }
      ],
      response_format: { type: 'json_object' }
    });

    const content = completion.choices?.[0]?.message?.content;
    if (!content) return [];

    const parsed = JSON.parse(content);
    const items = Array.isArray(parsed.recommendations) ? parsed.recommendations : [];
    return items.filter((item) => typeof item === 'string').slice(0, 3);
  } catch (error) {
    console.error('AI recommendations unavailable:', error.message);
    return [];
  }
}

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Revenue Rescue AI',
    version: '1.1.0',
    environment: NODE_ENV,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/ready', (req, res) => {
  res.json({
    status: 'ok',
    ready: true,
    dependencies: {
      openaiConfigured: Boolean(process.env.OPENAI_API_KEY)
    }
  });
});

app.post('/api/analyze', async (req, res, next) => {
  try {
    const payload = req.body || {};
    const analysis = buildAnalysis(payload);
    const aiRecommendations = await getAiRecommendations(payload, analysis);

    res.json({
      status: 'ok',
      analysis: {
        ...analysis,
        aiRecommendations: aiRecommendations.length ? aiRecommendations : analysis.recommendations
      },
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      status: 'error',
      message: 'API route not found.'
    });
  }

  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error('Unhandled application error:', err);
  res.status(err.status || 500).json({
    status: 'error',
    message: NODE_ENV === 'production' ? 'Internal server error.' : err.message
  });
});

const server = app.listen(PORT, () => {
  console.log(`Revenue Rescue AI running at http://localhost:${PORT}`);
});

const shutdown = (signal) => {
  console.log(`${signal} received. Shutting down gracefully.`);
  server.close(() => process.exit(0));
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
