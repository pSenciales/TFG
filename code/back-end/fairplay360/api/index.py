import os

from bs4 import BeautifulSoup
from flask import Flask, request, jsonify
import bcrypt
from datetime import datetime, timezone
from flask_cors import CORS


from api.middleware import verify_access_token
from api.db import connectDB
from api.utils import success, missing_fields, web_scrap, verify_captchaJWT
from .model import User, Token
from .routes import (user_bp, log_bp, report_bp, blacklist_bp)

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

@app.route('/scrape_tweets', methods=['POST'])
def scrape_tweets():
    data = request.json
    if missing := missing_fields(['url'], data):
        return missing

    url = data["url"]
    captcha_token = data.get("captchaToken")
    captcha_jwt = data.get("captchaJWT")
    if captcha_token and captcha_jwt:
        verify = verify_captchaJWT(captcha_jwt, captcha_token)
        if not verify:
            return jsonify({"error": "Invalid captcha"}), 401
    else:
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"error": "Access token missing"}), 401

        try:
            scheme, token = auth_header.split(" ")
            if scheme.lower() != "bearer":
                raise ValueError("Invalid scheme")
        except ValueError:
            return jsonify({"error": "Invalid authorization header format"}), 401

        provider = request.headers.get("X-Provider", "credentials")

        if not verify_access_token(provider, token):
            return jsonify({"error": "Invalid or expired token"}), 401

    html_rendered = web_scrap(url)
    soup = BeautifulSoup(html_rendered, 'html.parser')

    # Buscamos el primer elemento <article>
    article = soup.find('article')
    tweet_text = None
    image_src = None

    if article:
        # Dentro del article, buscamos el primer <div> con el atributo data-testid="tweetText"
        tweet_div = article.find('div', {'data-testid': 'tweetText'})
        if tweet_div:
            # Dentro de ese div, buscamos el <span> que contiene el texto
            tweet_span = tweet_div.find('span')
            if tweet_span:
                tweet_text = tweet_span.get_text(strip=True)
        # Y dentro del mismo article, buscamos el primer <img>
        image_div = article.find('div', {'data-testid': 'tweetPhoto'})
        if image_div:
            image = image_div.find('img')
            if image:
                image_src = image.get('src')
    return jsonify({"tweet": tweet_text, "img":image_src}), 200











@app.route('/verify', methods=['GET'])
def verify():
    return success("success", 200)

@app.before_request
def check_access_token():
    if (request.path == "/login" or (request.path == "/users" and (request.method == "OPTIONS" or request.method == "POST"))
            or request.path == "/users/email" or request.path == "/scrape_tweets"):
        return

    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"error": "Access token missing"}), 401

    try:
        scheme, token = auth_header.split(" ")
        if scheme.lower() != "bearer":
            raise ValueError("Invalid scheme")
    except ValueError:
        return jsonify({"error": "Invalid authorization header format"}), 401

    provider = request.headers.get("X-Provider", "credentials")

    if not verify_access_token(provider, token):
        return jsonify({"error": "Invalid or expired token"}), 401


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response



if __name__ == "__main__":
    app.run()
