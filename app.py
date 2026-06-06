import os
from flask import Flask, render_template, redirect, url_for
from flask_login import LoginManager, login_required
from flask_bcrypt import Bcrypt
from flask_cors import CORS

from config import Config
from models.user import User
from services.auth_service import get_user_by_id
from routes.auth import auth_bp, bcrypt
from routes.trades import trades_bp

# ───────────────────── APP SETUP ──────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, "template"),
    static_folder=os.path.join(BASE_DIR, "static")
)

app.config.from_object(Config)
app.config["SESSION_COOKIE_SAMESITE"] = "LAX"
app.config["SESSION_COOKIE_SECURE"] = False

# Extensions
CORS(app, supports_credentials=True) # allow JS fetch with cookies
bcrypt.init_app(app)

# ───────────────────── FLASK-LOGIN ────────────────────────────────────
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "auth.login"     # redirect if @login_required fails