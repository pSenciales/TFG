import { Session } from 'next-auth';
import { JWT as JWTType } from 'next-auth/jwt';
import axios from 'axios';

async function verifyGoogle(accessToken: string) {
    try {
        const { data } = await axios.post(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`);
        return data.email ? "success" : "error";
    } catch (error) {
        if(error instanceof axios.AxiosError) {
            console.log(`\n\nERROR:\n ${JSON.stringify(error.response?.data)}\n\n`);
        }
        console.error("Error verifying Google access token:", error);
        return "error";
    }
}

async function verifyGithub(accessToken: string) {
    try {
        const { data } = await axios.get(`https://api.github.com/user`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return data.login ? "success" : "error";
    } catch (error) {
        console.error("Error verifying Github access token:", error);
        return "error";
    }
}

async function verifyCredentials(accessToken: string) {
    const headers = {
        Authorization: `Bearer ${accessToken}`,
        "X-Provider": "credentials",
    }
    try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/verify`, { headers: headers });
        return data.success === "success" ? "success" : "error";

    } catch (error) {
        console.error("Error verifying credentials access token:", error);
        return "error";
    }
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


export default async function verifySession(session: Session | null, token: (JWTType & { exp: number }) | null) {
    console.log("ENTRA A VERIFICAR\n\n");

    console.log(`\n\nTOKEN: ${JSON.stringify(token)}\n\n`);
    if (!session || !token || (token.accessTokenExpires as number) < Date.now()) {
        console.error("Session expired or invalid token");
        return { verification: false, error: "Session expired or invalid token" };
    }
    const verification = await verifyAcessToken(session.provider, token.accessToken as string);
    if (verification !== "success") {
        console.error("Invalid access token");
        return { verification: false, error: "Invalid access token" };
    }
    return { verification: true, error: "" };
}

export async function verifyCaptchaToken(captchaToken: string) {
    const response = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${captchaToken}`
    );
    return { verification: response.data.success, error: response.data.success ? "" : "Captcha verification failed" };

}