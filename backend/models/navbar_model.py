from database import get_db_connection
import json

def fetch_navbar_data():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM nav_config LIMIT 1")
    row = cursor.fetchone()
    cursor.close()
    conn.close()

    if row:
        return {
            "config": {
                **json.loads(row["colors"]),
                **json.loads(row["images"])
            },
            "menu": json.loads(row["menu"])
        }
    return None
