import { Session } from 'next-auth';
import { JWT as JWTType } from 'next-auth/jwt';
import axios from 'axios';

async function verifyGoogle(accessToken: string) {
    const { data } = await axios.post(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`);
    return data.email ? "success" : "error";
}

async function verifyGithub(accessToken: string) {
    const { data } = await axios.get(`https://api.github.com/user`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return data.login ? "success" : "error";
}

async function verifyCredentials(accessToken: string) {
    const headers = {
        Authorization: `Bearer ${accessToken}`,
        "X-Provider": "credentials"
    }

    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/verify`, { headers: headers });
    return data.success === "success" ? "success" : "error";
}


async function verifyAcessToken(provider: string, accessToken: string) {

    switch (provider) {
        case "google":
            return await verifyGoogle(accessToken);
        case "github":
            return await verifyGithub(accessToken);
        case "credentials":
            return await verifyCredentials(accessToken);
        default:
            return "error";
    }
}


export default async function verifySession(session: Session | null, token: JWTType | null) {
    if (!session || !token || Date.parse(session.expires) < Date.now()) {
        console.error("Invalid session");
        return false;
    }

    const verification = await verifyAcessToken(session.provider, token.accessToken as string);
    if (verification !== "success") {
        console.error("Invalid access token");
        return false;
    }

    return true;
}

export async function verifyCaptchaToken(captchaToken: string) {
    const response = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${captchaToken}`
    );
    return response.data.success;
    
}