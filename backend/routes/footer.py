from flask import Blueprint, jsonify
from database import get_db_connection
import json

footer_bp = Blueprint('footer', __name__)

@footer_bp.route('/api/footer', methods=['GET'])
def get_footer():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT config_json FROM footer_config LIMIT 1")
    row = cursor.fetchone()
    cursor.close()
    conn.close()

    if not row:
        return jsonify({"error": "No footer config found"}), 404

    try:
        payload = json.loads(row[0])
    except Exception as e:
        return jsonify({"error": "Invalid footer JSON", "details": str(e)}), 500

    return jsonify(payload)
