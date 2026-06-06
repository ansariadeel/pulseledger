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

function calcRMultiple(netPL, entryPrice, stopPrice, quantity) {
    if (!stopPrice || stopPrice <= 0) return "N/A";

    const riskPerUnit = Math.abs(entryPrice - stopPrice);
    const totalRisk = riskPerUnit * quantity

    if (totalRisk <= 0) return "N/A";

    return (netPL / totalRisk).toFixed(2);
}