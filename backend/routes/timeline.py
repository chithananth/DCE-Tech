from flask import Blueprint, jsonify
from database import get_db_connection
import json

timeline_bp = Blueprint('timeline', __name__)

@timeline_bp.route('/api/timeline', methods=['GET'])
def get_timeline_data():
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("SELECT config_json FROM timeline_config LIMIT 1")
    row = cursor.fetchone()
    cursor.close()
    db.close()

    if not row:
        return jsonify({"error": "No config found"}), 404

    try:
        config = json.loads(row[0])
    except Exception as e:
        return jsonify({"error": "Failed to parse JSON", "details": str(e)}), 500

    return jsonify(config)
