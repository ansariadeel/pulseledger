import pymysql
from config import Config

def get_connection():
    """
    Opens and returns a new PyMySQL connection.
    Use as a context manager so it auto-closes:

        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(...)
            conn.commit()
    """
    return pymysql.connect(
        host=Config.DB_HOST,
        port=Config.DB_PORT,
        user=Config.DB_USER,
        password=Config.DB_PASSWORD,
        database=Config.DB_NAME,
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor, # rows as dicts
        autocommit=False
    )