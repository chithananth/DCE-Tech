import json
from flask import Blueprint, jsonify
from database import get_db_connection

carousel_bp = Blueprint('carousel', __name__)

@carousel_bp.route('/api/carousel', methods=['GET'])
def get_carousel_data():
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("SELECT config_json FROM carousel_config LIMIT 1")
    row = cursor.fetchone()
    if row:
        config_data = json.loads(row[0])  # <-- parse the string as JSON
        return jsonify(config_data)
    else:
        return jsonify({"error": "No config found"}), 404
