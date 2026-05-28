// ===============================
// PULSELEDGER - MAIN.JS
// Async entry point
// ===============================

async function initialize() {
  await loadTrades();   // fetch from Flask API
  renderTrades();
  renderMetrics();
  updateJournalStatus();
}

initialize();
