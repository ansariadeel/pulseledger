// ===============================
// PULSELEDGER - CALCULATIONS.JS
// Pure math — no DOM dependencies
// ===============================

function calcPL(side, entryPrice, exitPrice, quantity, fees) {
  const grossPL =
    side === "long"
      ? (exitPrice - entryPrice) * quantity
      : (entryPrice - exitPrice) * quantity;

  const netPL = grossPL - fees;

  const returnPercent = (
    (netPL / (entryPrice * quantity)) * 100
  ).toFixed(2);

  return { grossPL, netPL, returnPercent };
}