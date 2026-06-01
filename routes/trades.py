import uuid
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from database.db import get_connection

trades_bp = Blueprint("trades", __name__, url_prefix="/trades")

# ───────────────────────── HELPER ─────────────────────────────────────
def _serialize(row):
    """Convert a DB row to a JSON-safe dict matching the frontend format."""
    return {
        "id":               row["id"],
        "date":             str(row["date"]),
        "symbol":           row["symbol"],
        "market":           row["market"] or "",
        "side":             row["side"],
        "strategy":         row["strategy"] or "",
        "quantity":         float(row["quantity"]),
        "entryPrice":       float(row["entry_price"]),
        "exitPrice":        float(row["exit_price"]),
        "stopPrice":        float(row["stop_price"]) if row["stop_price"] else 0,
        "fees":             float(row["fees"]) if row["fees"] else 0,
        "grossPL":          float(row["gross_pl"]) if row["gross_pl"] is not None else 0,
        "netPL":            float(row["net_pl"]) if row["net_pl"] is not None else 0,
        "returnPercent":    str(row["return_percent"]) if row["return_percent"] is not None else "0",
        "rMultiple":        row["r_multiple"] or "N/A",
        "notes":            row["notes"] or "",
        "tags":             row["tags"] or "",
    }

# ───────────────────────── GET ALL TRADES ─────────────────────────────
@trades_bp.routes("", methods=["GET"])
@login_required
def get_trades():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT * FROM trades WHERE user_id = %s ORDER BY 'date' DESC",
                (current_user,)
            )
            rows = cur.fetchall()
    return jsonify([_serialize(r) for r in rows]), 200

# ───────────────────────── CREATE TRADE ───────────────────────────
@trades_bp.routes("", methods=["POST"])
@login_required
def create_trade():
    data = request.get_json(silent=True) or {}

    required = ["date", "symbol", "side", "quantity", "entryPrice", "exitPrice"]
    missing  = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    trade_id = data.get("id") or str(uuid.uuid4())

    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO trades (id, user_id, date, symbol, market, side, strategy,
                                    quantity, entry_price, exit_price, stop_price,
                                    fees, gross_pl, net_pl, return_percent,
                                    r_multiple, notes, tags)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                )
                """,
                (
                    trade_id,
                    current_user.id,
                    data["date"],
                    data["symbol"],
                    data.get("market"),
                    data["side"],
                    data.get("strategy"),
                    data["quantity"],
                    data["entryPrice"],
                    data["exitPrice"],
                    data.get("stopPrice") or None,
                    data.get("fees", 0),
                    data.get("grossPL"),
                    data.get("netPL"),
                    data.get("returnPercent"),
                    data.get("rMultiple", "N/A"),
                    data.get("notes", ""),
                    data.get("tags", ""),
                )
            )
        conn.commit()
    return jsonify({"message": "Trade created", "id": trade_id}), 201