from flask import Blueprint, jsonify
from database import get_db_connection
import json

project_bp = Blueprint('project', __name__)

@project_bp.route('/api/project', methods=['GET'])
def get_project_data():
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("SELECT config_json FROM project_config LIMIT 1")
    row = cursor.fetchone()
    if row:
        try:
            config = json.loads(row[0])
            return jsonify(config)
        except Exception as e:
            return jsonify({"error": "Failed to parse JSON", "details": str(e)}), 500
    return jsonify({"error": "No config found"}), 404
