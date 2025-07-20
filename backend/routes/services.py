from flask import Blueprint, jsonify
from database import get_db_connection
import json

services_bp = Blueprint('services', __name__)

@services_bp.route('/api/services', methods=['GET'])
def get_services_data():
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("SELECT config_json FROM services_config LIMIT 1")
    row = cursor.fetchone()
    cursor.close()
    db.close()

    if not row:
        return jsonify({"error": "No config found"}), 404

    try:
        config_dict = json.loads(row[0])
    except Exception as e:
        return jsonify({"error": "Failed to parse config", "details": str(e)}), 500

    return jsonify(config_dict)
