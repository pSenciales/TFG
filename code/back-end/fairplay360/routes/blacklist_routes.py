
from flask import Blueprint, request, jsonify
from model import Blacklist

blacklist_bp = Blueprint('blacklist_routes', __name__, url_prefix='/blacklist')


@blacklist_bp.route('/', methods=['GET'])
@blacklist_bp.route('', methods=['GET'])
def get_reports():
    blacklist = Blacklist.objects().to_json()
    return jsonify(blacklist), 200


@blacklist_bp.route('/', methods=['POST'])
@blacklist_bp.route('', methods=['POST'])
def create_blacklist():
    data = request.get_json()

    if not "email" in data:
        return jsonify({"error": "Missing required field"}), 400

    blacklist = Blacklist(
        email=data["email"],
    )
    blacklist.save()

    return jsonify({"message": "Blacklist created successfully"}), 201


@blacklist_bp.route('/<email>', methods=['DELETE'])
def delete_blacklist(email):
    blacklist = Blacklist.objects(email=email).first()

    if not blacklist:
        return jsonify({"error": "Blacklist not found"}), 404

    blacklist.delete()
    return jsonify({"message": "Blacklist deleted successfully"}), 200

@blacklist_bp.route('/<email>', methods=['GET'])
def get_one(email):
    blacklist = Blacklist.objects(email=email).first()

    if not blacklist:
        return jsonify({"error": "Blacklist not found"}), 404

    return jsonify(blacklist), 200

