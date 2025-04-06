import jwt
import requests
from flask import jsonify

from api.model import User
import os


def verify_google(access_token: str) -> bool:
    resp = requests.post(
        f"https://www.googleapis.com/oauth2/v1/tokeninfo?access_token={access_token}"
    )
    data = resp.json()
    return "email" in data

def verify_github(access_token: str) -> bool:
    headers = {"Authorization": f"Bearer {access_token}"}
    resp = requests.get("https://api.github.com/user", headers=headers)
    data = resp.json()
    return "login" in data

def verify_credentials(access_token: str) -> bool:
    user = User.objects(access_token__access_token=access_token).first()
    if not user:
        return False
    return True

def verify_access_token(provider: str, access_token: str) -> bool:
    if provider == "google":
        return verify_google(access_token)
    elif provider == "github":
        return verify_github(access_token)
    elif provider == "credentials":
        return verify_credentials(access_token)
    else:
        return False
#Verify captchaJWT

def verify_captchaJWT(captcha_jwt: str, captcha_recibed: str):
    try:
        decoded = jwt.decode(captcha_jwt, os.environ["JWT_SECRET"], algorithms=["HS256"])
        if not isinstance(decoded, dict):
            raise ValueError("Invalid token")
        return decoded.get("captcha") == captcha_recibed
    except jwt.ExpiredSignatureError:
        return "Token expired"
    except jwt.InvalidTokenError:
        return "Invalid token"

def verify_session(data, request):
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

    return None


def verify_captcha(captcha_token: str) -> bool:
    recaptcha_secret = os.getenv("RECAPTCHA_SECRET")
    resp = requests.get(f"https://www.google.com/recaptcha/api/siteverify?secret={recaptcha_secret}&response={captcha_token}")
    data = resp.json()
    return data["success"]