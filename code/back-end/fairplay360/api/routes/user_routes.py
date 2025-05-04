from flask import Blueprint, request
from api.model import User, Report, Blacklist
from api.utils import *
import os
import jwt


JWT_SECRET_KEY = os.environ["JWT_SECRET"]

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

@user_bp.route('/reset-password', methods=['PUT'])
def reset_password():

    data = request.get_json()
    if missing := missing_fields(['password', 'jwt'], data):
        return missing

    jwt_recibed = data.get('jwt', '')
    email = ""
    try:
        decoded = jwt.decode(jwt_recibed, JWT_SECRET_KEY, algorithms=["HS256"])
        if not isinstance(decoded, dict):
            raise ValueError("Invalid token")
        email = decoded.get("email")
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": f"Invalid token"}), 400

    user = User.objects(email=email, provider="credentials").first()

    if not user:
        return jsonify({"error": "User not found"}), 404
    new_password = data.get('password', '')
    user.set_password(new_password)
    user.save()

    return success("User updated", 200)


@user_bp.route('/email/<user_email>', methods=['GET'])
def get_user_by_email(user_email):
    user = User.objects(email=user_email, provider='credentials').first()
    blacklisted = Blacklist.objects(email=user_email).first()
    if blacklisted:
        return success("User banned", 200)
    if not user:
        return success("User not found", 200)
    return success("User found", 200)
