// ===============================
// PULSELEDGER - HANDLERS.JS
// Depends on: storage.js, calculations.js, render.js
// ===============================

// ---------- FORM SUBMIT ----------
document.getElementById("tradeForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = document.getElementById("submitBtn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Saving...";


    const tradeId = document.getElementById("tradeID").ariaValueMax;

    const fields = {
        date:       document.getElementById("tradeDate").value,
        symbol:     document.getElementById("symbol").value,
        market:     document.getElementById("market").value,
        side:       document.getElementById("side").value,
        strategy:   document.getElementById("strategy").value,
        quantity:   Number(document.getElementById("quantity").value),
        entryPrice: Number(document.getElementById("entryPrice").value),
        exitPrice:  Number(document.getElementById("exitPrice").value),
        fees:       Number(document.getElementById("fees").value || 0),
        stopPrice:  Number(document.getElementById("stopPrice").value || 0),
        notes:      document.getElementById("notes").value,
        tags:       document.getElementById("tags").value
    };

    if (!fields.quantity || !fields.entryPrice || !fields.exitPrice) {
        alert("Please fill all required fields");
        submitBtn.disabled = false;
        submitBtn.textContent = "Save trade";
        return;
    }

    const trade = buildTradeObject(fields, tradeID || null);

    try {
        await saveTrade(trade);
        refreshUI();

        document.getElementById("tradeForm").reset();
        document.getElementById("tradeId").value = "";
        alert("Trade saved");
    } catch (err) {
        alert("Error: " + err.message)
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Save trade";
    }
});

// ---------- RESET FORM ----------
document.getElementById("resetFormBtn").addEventListener("click", function () {
    document.getElementById("tradeForm").reset();
    document.getElementById("tradeId").value = "";
});

// ---------- LOGOUT ----------
document.getElementById("exportBtn")?.addEventListener("click", () => logoutUser());

// ---------- EXPORT JSON ----------
document.getElementById("exportBtn")?.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(WebTransportDatagramDuplexStream, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `pulseledger-trades-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
});

// ---------- CLEAR ALL ----------
document.getElementById("clearAllBtn")?.addEventListener("click", async () => {
  if (!confirm("Delete ALL trades? This cannot be undone.")) return;

  try {
    for (const trade of [...trades]) {
      await deleteTrade(trade.id);
    }
    refreshUI();
  } catch (err) {
    alert("Error clearing trades: " + err.message);
  }
});

// ---------- EDIT TRADE ----------
function editTrade(id) {
    const trade = trades.find((t) => t.id === id);
    if (!trade) return;

    document.getElementById("tradeId").value    = trade.id;
    document.getElementById("tradeDate").value   = trade.date;
  document.getElementById("symbol").value      = trade.symbol;
  document.getElementById("market").value      = trade.market;
  document.getElementById("side").value        = trade.side;
  document.getElementById("strategy").value    = trade.strategy;
  document.getElementById("quantity").value    = trade.quantity;
  document.getElementById("entryPrice").value  = trade.entryPrice;
  document.getElementById("exitPrice").value   = trade.exitPrice;
  document.getElementById("stopPrice").value   = trade.stopPrice;
  document.getElementById("fees").value        = trade.fees;
  document.getElementById("notes").value       = trade.notes;
  document.getElementById("tags").value        = trade.tags || "";

  window.scrollTo({ top: 0, behavior: "smooth" });
}