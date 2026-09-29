<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Revenue Rescue AI</title>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <div class="container">
      <header class="hero">
        <div>
          <p class="eyebrow">Revenue recovery</p>
          <h1>Revenue Rescue AI</h1>
        </div>
        <div class="status-pill" id="statusPill">System ready</div>
      </header>

      <main class="layout">
        <section class="panel form-panel">
          <h2>Business snapshot</h2>
          <form id="analysisForm">
            <label>
              Monthly revenue
              <input type="number" name="monthlyRevenue" value="125000" step="100" />
            </label>
            <label>
              Recurring revenue
              <input type="number" name="recurringRevenue" value="72000" step="100" />
            </label>
            <label>
              Churn rate (%)
              <input type="number" name="churnRate" value="6" step="0.1" />
            </label>
            <label>
              Conversion rate (%)
              <input type="number" name="conversionRate" value="2.5" step="0.1" />
            </label>
            <label>
              Average order value
              <input type="number" name="avgOrderValue" value="180" step="1" />
            </label>
            <label>
              Active customers
              <input type="number" name="activeCustomers" value="430" step="1" />
            </label>
            <button type="submit">Analyze opportunity</button>
          </form>
        </section>

        <section class="panel results-panel">
          <h2>Opportunity insight</h2>
          <div id="resultBox" class="result-box">
            <p>Run an analysis to see your revenue recovery opportunity.</p>
          </div>
        </section>
      </main>
    </div>

    <script src="/app.js"></script>
  </body>
</html>
