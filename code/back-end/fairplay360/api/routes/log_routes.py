
from flask import Blueprint, request
from api.model import Log, User
from api.routes.utils import *

log_bp = Blueprint('log_routes', __name__, url_prefix='/logs')


@log_bp.route('/', methods=['GET'])
@log_bp.route('', methods=['GET'])
def get_logs():
    logs = Log.objects()
    if not logs:
        return jsonify({}), 200
    return jsonify(logs.to_json()), 200


@log_bp.route('/', methods=['POST'])
@log_bp.route('', methods=['POST'])
def create_log():
    data = request.get_json()

    if missing := missing_fields(["action", "user_id"], data):
        return missing

    log = Log(
        action=data.get['action'] ,
        user_id=data['user_id']
    )

    log.save()

    return success("Log created", 201)


@log_bp.route('/<log_id>', methods=['DELETE'])
def delete_log(log_id):
    log = Log.objects(id=log_id).first()

    if not_found := element_not_found(log, "Log not found"):
        return not_found

    log.delete()
    return success("Log deleted", 200)

@log_bp.route('/user/<user_id>', methods=['GET'])
def get_user_logs(user_id):
    user = User.objects(id=user_id).first()

    if not_found := element_not_found(user, "user not found"):
        return not_found

    logs = Log.objects(user_id=user.id)
    if not logs:
        return jsonify({}), 200
    return jsonify(logs.to_json()), 200

