from flask import Blueprint, jsonify
import json
from database import get_db_connection

websiteproject_bp = Blueprint("websiteproject", __name__)

@websiteproject_bp.route("/api/websiteproject", methods=["GET"])
def get_websiteproject():
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("SELECT config_json FROM websiteproject_config LIMIT 1")
    row = cursor.fetchone()
    cursor.close()
    db.close()
    if row:
        try:
            return jsonify(json.loads(row[0]))
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "No data"}), 404
