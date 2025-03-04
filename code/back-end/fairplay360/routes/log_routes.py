
from flask import Blueprint, request, jsonify
from model import Log, User

log_bp = Blueprint('log_routes', __name__, url_prefix='/logs')


@log_bp.route('/', methods=['GET'])
@log_bp.route('', methods=['GET'])
def get_logs():
    logs = Log.objects().to_json()
    return jsonify(logs), 200


@log_bp.route('/', methods=['POST'])
@log_bp.route('', methods=['POST'])
def create_log():
    data = request.get_json()

    if not all(key in data for key in ['action', 'user_id']):
        return jsonify({"error": "Missing required fields"}), 400

    log = Log(
        action=data.get['action'] ,
        user_id=data['user_id']
    )
    log.save()

    return jsonify({"message":"Log created successfully"}), 201


@log_bp.route('/<log_id>', methods=['DELETE'])
def delete_log(log_id):
    log = Log.objects(id=log_id).first()

    if not log:
        return jsonify({"error": "Report not found"}), 404

    log.delete()
    return jsonify({"message": "Report deleted successfully"}), 200

@log_bp.route('/user/<user_id>', methods=['GET'])
def get_user_logs(user_id):
    user = User.objects(id=user_id).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    logs = Log.objects(user_id=user.id)
    return jsonify(logs), 200

