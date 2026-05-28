from flask_login import UserMixin


class User(UserMixin):
    """
    Lightweight user object for Flask-Login.
    Data is fetched from MySQL; this class just wraps it.
    """

    def __init__(self, id, username, email, password_hash, created_at=None):
        self.id            = id
        self.username      = username
        self.email         = email
        self.password_hash = password_hash
        self.created_at    = created_at

    # Flask-Login calls get_id() to store user in session
    def get_id(self):
        return str(self.id)

    @staticmethod
    def from_db_row(row):
        """Build a User from a PyMySQL DictCursor row."""
        if not row:
            return None
        return User(
            id            = row["id"],
            username      = row["username"],
            email         = row["email"],
            password_hash = row["password_hash"],
            created_at    = row.get("created_at")
        )