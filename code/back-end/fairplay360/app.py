from flask import Flask, request, jsonify
import bcrypt
import jwt
import datetime
from flask_cors import CORS
from db import connectDB
from model import User
from routes import (user_bp, log_bp, report_bp, blacklist_bp)

connectDB()
app = Flask(__name__)

CORS(app)

app.register_blueprint(user_bp)
app.register_blueprint(report_bp)
app.register_blueprint(log_bp)
app.register_blueprint(blacklist_bp)


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

    return jsonify({
        "id": str(user.id),
        "name": user.name,
        "email": user.email,
    }), 200

if __name__ == "__main__":
    app.run()
