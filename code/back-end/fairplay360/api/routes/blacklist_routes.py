
from flask import Blueprint, request
from api.model import Blacklist
from api.utils import *
from api.utils import success, missing_fields, element_not_found

blacklist_bp = Blueprint('blacklist_routes', __name__, url_prefix='/blacklist')


@blacklist_bp.route('/', methods=['GET'])
@blacklist_bp.route('', methods=['GET'])
def get_reports():
    blacklist = Blacklist.objects()
    if not blacklist:
        return jsonify({}), 200
    return jsonify(blacklist.to_json()), 200


@blacklist_bp.route('/', methods=['POST'])
@blacklist_bp.route('', methods=['POST'])
def create_blacklist():
    data = request.get_json()

    if missing := missing_fields(["email"], data):
        return missing

    blacklist = Blacklist(
        email=data["email"],
    )
    blacklist.save()

    return success("Blacklist created", 201)


@blacklist_bp.route('/<email>', methods=['DELETE'])
def delete_blacklist(email):
    blacklist = Blacklist.objects(email=email).first()

    if not_found := element_not_found(blacklist, "Blacklist not found"):
        return not_found

    blacklist.delete()
    return success("Blacklist deleted", 200)

@blacklist_bp.route('/<email>', methods=['GET'])
def get_one(email):
    blacklist = Blacklist.objects(email=email).first()

    if not_found := element_not_found(blacklist, "Blacklist not found"):
        return not_found

    return jsonify(blacklist), 200

