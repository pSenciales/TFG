from flask import Blueprint, request, jsonify
from model import User, Report
from routes.utils import *

user_bp = Blueprint('user_routes', __name__, url_prefix='/users')

@user_bp.route('/', methods=['GET'])
@user_bp.route('', methods=['GET'])
def get_users():
    users = User.objects().to_json()
    return jsonify(users), 200

@user_bp.route('/', methods=['POST'])
@user_bp.route('', methods=['POST'])
def create_user():
    data = request.get_json()

    if missing := missing_fields(['name', 'email', 'password'], data):
        return missing

    if User.objects(email=data['email']).first():
        return jsonify({"error": "Email already in use"}), 409

    user = User(
        name=data['name'],
        email=data['email']
    )
    user.set_password(data['password'])
    user.save()

    return success("User created", 201)

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
