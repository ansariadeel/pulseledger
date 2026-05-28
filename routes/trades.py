import uuid
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from database.db import connection

trades_bp = Blueprint("trades", __name__, url_prefix="/trades")
