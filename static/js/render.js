// ===============================
// PULSELEDGER - RENDER.JS
// All DOM rendering — no business logic
// ===============================

function renderTrades() {
  const tradeTableBody = document.getElementById("tradeTableBody");

  if (trades.length === 0) {
    tradeTableBody.innerHTML = `
      <tr>
        <td colspan="11">No trades recorded</td>
      </tr>
    `;
    return;
  }

  tradeTableBody.innerHTML = trades
    .map((trade) => `
      <tr>
        <td>${trade.date}</td>
        <td>${trade.symbol}</td>
        <td>${trade.side}</td>
        <td>${trade.strategy}</td>
        <td>${trade.quantity}</td>
        <td>$${trade.entryPrice}</td>
        <td>$${trade.exitPrice}</td>
        <td class="${trade.netPL >= 0 ? "positive" : "negative"}">
          $${trade.netPL.toFixed(2)}
        </td>
        <td>${trade.rMultiple}</td>
        <td>${trade.notes || "-"}</td>
        <td>
          <button onclick="editTrade('${trade.id}')">Edit</button>
          <button onclick="deleteTrade('${trade.id}')">Delete</button>
        </td>
      </tr>
    `)
    .join("");
}

function renderMetrics() {
  const metricGrid = document.getElementById("metricGrid");

  const totalTrades = trades.length;

  const totalPL = trades.reduce((sum, trade) => sum + trade.netPL, 0);

  const winningTrades = trades.filter((trade) => trade.netPL > 0);
  const losingTrades  = trades.filter((trade) => trade.netPL < 0);

  const winRate =
    totalTrades > 0
      ? ((winningTrades.length / totalTrades) * 100).toFixed(1)
      : 0;

  metricGrid.innerHTML = `
    <div class="metric-card">
      <span class="metric-title">Total Trades</span>
      <span class="metric-value">${totalTrades}</span>
    </div>

    <div class="metric-card">
      <span class="metric-title">Net P/L</span>
      <span class="metric-value">$${totalPL.toFixed(2)}</span>
    </div>

    <div class="metric-card">
      <span class="metric-title">Win Rate</span>
      <span class="metric-value">${winRate}%</span>
    </div>

    <div class="metric-card">
      <span class="metric-title">Winners</span>
      <span class="metric-value">${winningTrades.length}</span>
    </div>

    <div class="metric-card">
      <span class="metric-title">Losers</span>
      <span class="metric-value">${losingTrades.length}</span>
    </div>
  `;
}

function updateJournalStatus() {
  const journalStatus = document.getElementById("jornalStatus");

  journalStatus.textContent =
    trades.length === 0
      ? "No trades recorded"
      : `${trades.length} trades logged`
}

function refreshUI() {
  renderTrades();
  renderMetrics();
  updateJournalStatus();
}