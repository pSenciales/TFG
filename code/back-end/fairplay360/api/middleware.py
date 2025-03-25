import requests

from api.model import User


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