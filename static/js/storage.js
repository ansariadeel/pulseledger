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