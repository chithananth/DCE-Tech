from flask import Blueprint, jsonify
from database import get_db_connection
import json

about_bp = Blueprint('about', __name__)

@about_bp.route('/api/about', methods=['GET'])
def get_about():
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("SELECT config_json FROM about_config LIMIT 1")
    row = cursor.fetchone()
    db.close()
    if row:
        return jsonify(json.loads(row[0]))
    return jsonify({"error": "No about data found"}), 404
