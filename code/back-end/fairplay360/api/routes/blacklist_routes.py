
from flask import Blueprint, request
from api.model import Blacklist
from api.utils import *
from api.utils import success, missing_fields, element_not_found
import json

blacklist_bp = Blueprint('blacklist_routes', __name__, url_prefix='/blacklist')


@blacklist_bp.route('/', methods=['GET'])
@blacklist_bp.route('', methods=['GET'])
def get_blacklist():
    cursor = request.args.get('cursor', default=0, type=int)
    limit = 9
    search_email = request.args.get('searchEmail', default=None)

    query = Blacklist.objects
    if search_email:
        query = query.filter(email__icontains=search_email)

    results = query.skip(cursor).limit(limit)


    users_list = json.loads(results.to_json())

    next_cursor = cursor + len(users_list) if len(users_list) == limit else None

    # 6) Devolvemos JSON
    return jsonify({
        "users": users_list,
        "nextCursor": next_cursor
    }), 200


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

