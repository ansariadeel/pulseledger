from flask import Blueprint, request, jsonify, session
from flask_login import login_user, logout_user, login_required, current_user
from flask_bcrypt import Bcrypt
from services.auth_service import (
    get_user_by_username,
    get_user_by_email,
    create_user
)