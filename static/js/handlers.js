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