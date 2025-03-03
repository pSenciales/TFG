from flask import Blueprint, request, jsonify
from model import User, Report

user_bp = Blueprint('user_routes', __name__, url_prefix='/users')

@user_bp.route('/', methods=['GET'])
def get_users():
    users = User.objects()
    return jsonify(users), 200

@user_bp.route('/', methods=['POST'])
def create_user():
    data = request.get_json()

    if not all(key in data for key in ['name', 'email', 'password']):
        return jsonify({"error": "Missing required fields"}), 400

    if User.objects(email=data['email']).first():
        return jsonify({"error": "Email already in use"}), 409

    user = User(
        name=data['name'],
        email=data['email']
    )
    user.set_password(data['password'])
    user.save()

    return jsonify({"message": "User created successfully", "user": user.to_json()}), 201

@user_bp.route('/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.objects(id=user_id).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Delete reports related to user
    Report.objects(user_id=user_id).delete()

    user.delete()
    return jsonify({"message": "User deleted successfully"}), 200

@user_bp.route('/<user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.objects(id=user_id).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

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
    return jsonify({"message": "User updated successfully"}), 200
