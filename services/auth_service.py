from database.db import get_connection
from models.user import User


def get_user_by_id(user_id):
    """Load a user by primary key — used by Flask-Login's user_loader."""
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT * FROM users WHERE id = %s",
                (user_id,)
            )
            row = cur.fetchone()
    return User.from_db_row(row)


def get_user_by_username(username):
    """Fetch a user row by username."""
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT * FROM users WHERE username = %s",
                (username,)
            )
            row = cur.fetchone()
    return User.from_db_row(row)


def get_user_by_email(email):
    """Fetch a user row by email."""
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT * FROM users WHERE email = %s",
                (email,)
            )
            row = cur.fetchone()
    return User.from_db_row(row)


def create_user(username, email, password_hash):
    """
    Insert a new user and return the new row as a User object.
    Raises ValueError if username or email already exists.
    """
    if get_user_by_username(username):
        raise ValueError("Username already taken.")
    if get_user_by_email(email):
        raise ValueError("Email already registered.")

    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO users (username, email, password_hash)
                VALUES (%s, %s, %s)
                """,
                (username, email, password_hash)
            )
        conn.commit()

    return get_user_by_username(username)
