from flask import Blueprint, jsonify
from database import get_db_connection
import base64

loader_bp = Blueprint('loader', __name__)

@loader_bp.route("/api/loader", methods=["GET"])
def get_loader():
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("SELECT type, content FROM loader_config ORDER BY id DESC LIMIT 1")
    row = cursor.fetchone()
    if not row:
        return jsonify({"error": "Loader not found"}), 404

    loader_type, blob = row
    base64_data = base64.b64encode(blob).decode("utf-8")

    return jsonify({
        "type": loader_type,
        "data": base64_data
    })
