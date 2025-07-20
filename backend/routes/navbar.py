from flask import Blueprint, jsonify
from models.navbar_model import fetch_navbar_data

navbar_bp = Blueprint('navbar', __name__)

@navbar_bp.route('/api/navbar', methods=['GET'])
def get_navbar():
    data = fetch_navbar_data()
    return jsonify(data if data else {})
