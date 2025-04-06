from flask import Blueprint, request
from api.model import User, Report
from api.utils import *
user_bp = Blueprint('user_routes', __name__, url_prefix='/users')

@user_bp.route('/', methods=['POST'])
@user_bp.route('', methods=['POST'])
def create_user():
    data = request.get_json()
    if missing := missing_fields(['name', 'email', 'provider'], data):
        return missing

    provider = data['provider']

    if provider == "credentials":
        if missing := missing_fields(['password'], data):
            return missing
        try:
            if User.objects(email=data['email'], provider="credentials").first():
                return jsonify({"error": "Email already in use"}), 409

            user = User(name=data['name'], email=data['email'])
            user.set_password(data['password'])
            user.save()
            return success("User created", 201)
        except Exception as e:
            return jsonify({"error": "Bad request: " + str(e)}), 400
    else:
        if User.objects(email=data['email'], provider=provider).first():
            return success("User found", 200)
        user = User(name=data['name'], email=data['email'], provider=provider)
        user.save()
        return success("User created", 201)


@user_bp.route('/', methods=['GET'])
@user_bp.route('', methods=['GET'])
def get_users():
    users = User.objects()
    if not users:
        return jsonify({}), 200
    return jsonify(users.to_json()), 200

@user_bp.route('/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.objects(id=user_id).first()

    if not_found := element_not_found(user, "User not found"):
        return not_found

    # Delete reports related to user
    Report.objects(user_id=user_id).delete()

    user.delete()
    return success("User deleted", 200)

@user_bp.route('/<user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.objects(id=user_id).first()

    if not_found := element_not_found(user, "User not found"):
        return not_found

    data = request.get_json()

    if 'name' in data:
        user.name = data['name']
    if 'email' in data:
        if User.objects(email=data['email']).first():
            return jsonify({"error": "Email already in use"}), 409
        user.email = data['email']
    if 'password' in data:
        user.set_password(data['password'])

    user.save()
    return success("User updated", 200)

@user_bp.route('/email/<user_email>', methods=['GET'])
def get_user_by_email(user_email):
    user = User.objects(email=user_email).first()
    if not user:
        return success("User not found", 200)
    return success("User found", 200)
