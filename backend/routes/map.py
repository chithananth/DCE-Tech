from flask import Blueprint, jsonify
from database import get_db_connection
import json

map_bp = Blueprint('map_bp', __name__)

@map_bp.route('/api/map', methods=['GET'])
def get_map():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT config_json FROM map_config LIMIT 1")
    row = cursor.fetchone()
    cursor.close()
    conn.close()

    if not row:
        return jsonify({})

    try:
        config = json.loads(row['config_json'])
        return jsonify(config)  # Send full config (colors, content, mapEmbedURL)
    except json.JSONDecodeError:
        return jsonify({})
