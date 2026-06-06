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

function buildTradeObject(fields, existingId) {
    const { side, quantity, entryPrice, exitPrice, fees, stopPrice } = fields;

    const { grossPL, netPL, returnPercent } = calcPL(
        side, entryPrice, exitPrice, quantity, fees
    );

    const rMultiple = calcRMultiple(netPL, entryPrice, stopPrice, quantity);

    return {
        id: existingId || crypto.randomUUID(),
        date: fields.date,
        symbol: fields.symbol,
        market: fields.market,
        side,
        strategy: fields.strategy,
        quantity,
        entryPrice,
        exitPrice,
        stopPrice,
        fees,
        notes: fields.notes,
        grossPL,
        netPL,
        returnPercent,
        rMultiple
    };
}