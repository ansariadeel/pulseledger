// ===============================
// PULSELEDGER - STORAGE.JS
// Talks to Flask API instead of localStorage
// ===============================

let trades = [] // in-memory, loaded from API on init

// ─────────────────────── FETCH ALL TRADES ──────────────────────────
async function loadTrades() {
    try {
        const res = await fetch("/trades", { credentials: "include" });

        if (res.status === 401) {
            window.location.href = "/login";
            return;
        }

        trades = await res.json();
    } catch (err) {
        console.error("Failed to load trades:", err);
        trades = [];
    }
}

// ─────────────────────── SAVE ONE TRADE ────────────────────────────
async function saveTrade(trade) {
    const isEdit = trades.some((t) => t.id === trade.id);
    const url = isEdit ? `/trades/${trade.id}` : "/trades";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(trade)
    })

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save trade");
    }

    // Keep local array in sync
    if (isEdit) {
        const index = trades.findIndex((t) => t.id === trade.id);
        trades[index] = trade;
    } else {
        trades.push(trade);
    }
}

// ─────────────────────── DELETE ONE TRADE ──────────────────────────
async function deleteTrade(id) {
    const res = await fetch(`/trades/${id}`, {
        method: "DELETE",
        credentials: "include"
    });

    if (!res.ok) {
        const res = await res.json();
        throw new Error(err.error || "Failed to delete trade");
    }
    
    trades = trades.filter((t) => t.id !== id);
}

// ─────────────────────── LOGOUT HELPER ─────────────────────────────
async function logoutUser() {
    await fetch("/auth/logut", { method: "POST", credentials: "include"});
    window.location.href = "/login"
}