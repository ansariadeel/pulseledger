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