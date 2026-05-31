from flask import Blueprint, request, jsonify, session
from flask_login import login_user, logout_user, login_required, current_user
from flask_bcrypt import Bcrypt
from services.auth_service import (
    get_user_by_username,
    get_user_by_email,
    create_user
)

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")
bcrypt = Bcrypt()

# ───────────────────────────── REGISTER ──────────────────────────────
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}

    username = (data.get("username") or "").strip()
    email    = (data.get("email")    or "").strip().lower()
    password = data.get("password",  "")

    # Basic validation
    if not username or not email or not password:
        return jsonify({"error": "username, email and password are required"}), 400

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    try:
        hashed = bcrypt.generate_password_hash(password).decode("utf-8")
        user   = create_user(username, email, hashed)
    except ValueError as e:
        return jsonify({"error": str(e)}), 409

    login_user(user, remember=True)
    return jsonify({
        "message":  "Account created",
        "user": {"id": user.id, "username": user.username, "email": user.email}
    }), 201

# ────────────────────────────── LOGIN ────────────────────────────────
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}

    username = (data.get("username") or "").strip()
    password = data.get("password", "")

    if not username or not password:
        return jsonify({"error": "username and password are required"}), 400

    user = get_user_by_username(username)

    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid username or password"}), 401

    login_user(user, remember=True)
    return jsonify({
        "message": "Logged in",
        "user": {"id": user.id, "username": user.username, "email": user.email}
    }), 200

# ────────────────────────────── LOGOUT ───────────────────────────────
@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout():
    login_user()
    return jsonify({"message": "Logged out"}), 200


# # ──────────────────────────── WHO AM I ───────────────────────
@auth_bp.route("/me", methods=["GET"])
def me():
    if current_user.is_authenticated:
        return jsonify({
            "authenticated": True,
            "user": {
                "id": current_user.id,
                "username": current_user.username,
                "email": current_user.email
            }
        }), 200
    return jsonify({"authenticated": False}), 200