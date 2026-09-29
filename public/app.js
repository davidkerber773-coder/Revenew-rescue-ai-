const form = document.getElementById('analysisForm');
const resultBox = document.getElementById('resultBox');
const statusPill = document.getElementById('statusPill');

async function fetchHealth() {
  try {
    const response = await fetch('/api/health');
    const data = await response.json();
    if (data.status === 'ok') {
      statusPill.textContent = 'System ready';
    }
  } catch (error) {
    statusPill.textContent = 'Offline';
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  statusPill.textContent = 'Analyzing...';

  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    const analysis = data.analysis;

    resultBox.innerHTML = `
      <div class="metrics-grid">
        <div class="metric-card">
          <span class="metric-label">Opportunity score</span>
          <strong>${analysis.score}/100</strong>
        </div>
        <div class="metric-card">
          <span class="metric-label">Priority</span>
          <strong>${analysis.opportunityLabel}</strong>
        </div>
        <div class="metric-card">
          <span class="metric-label">Potential recovery</span>
          <strong>$${analysis.summary.totalOpportunity.toLocaleString()}</strong>
        </div>
      </div>

      <div class="info-card">
        <h4>Quick summary</h4>
        <ul>
          <li>Monthly revenue: $${analysis.summary.monthlyRevenue.toLocaleString()}</li>
          <li>Recurring revenue: $${analysis.summary.recurringRevenue.toLocaleString()}</li>
          <li>Churn rate: ${analysis.summary.churnRate}%</li>
          <li>Conversion rate: ${analysis.summary.conversionRate}%</li>
        </ul>
      </div>

      <div class="info-card">
        <h4>Suggested actions</h4>
        <ul>
          ${analysis.recommendations.map((item) => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    `;

    statusPill.textContent = 'Analysis complete';
  } catch (error) {
    resultBox.innerHTML = '<p>There was an error analyzing the data. Please try again.</p>';
    statusPill.textContent = 'Error';
  }
});

fetchHealth();
