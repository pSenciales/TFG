import os
from flask import Flask, request, jsonify
import bcrypt
from datetime import datetime, timezone
from flask_cors import CORS
from db import connectDB
from model import User, Token
from routes import (user_bp, log_bp, report_bp, blacklist_bp)

connectDB()
app = Flask(__name__)

CORS(app)

app.register_blueprint(user_bp)
app.register_blueprint(report_bp)
app.register_blueprint(log_bp)
app.register_blueprint(blacklist_bp)


JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
@app.route('/login', methods=['POST'])
def login():
    data = request.json

    if not data or not "email" in data or not "password" in data:
        return jsonify({"error": "Missing credentials"}), 400

    user = User.objects(email=data["email"]).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    if not user.check_password(data["password"]):
        return jsonify({"error": "Wrong password"}), 401

    timestamp = datetime.now(timezone.utc).isoformat()

    random_bytes = os.urandom(16).hex()

    raw_token = f"{timestamp}-{random_bytes}"

    token_bytes = raw_token.encode('utf-8')

    salt = bcrypt.gensalt()
    access_token = bcrypt.hashpw(token_bytes, salt).decode('utf-8')
    user.access_token = Token(access_token=access_token)
    user.save()

    return jsonify({
        "id": str(user.id),
        "name": user.name,
        "email": user.email,
        "access_token": access_token,
    }), 200

if __name__ == "__main__":
    app.run()
