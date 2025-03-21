import axios from 'axios';

async function verifyGoogle(accessToken: string){
    const {data} = await axios.post(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`);
    return data.email ? "success" : "error";
} 

async function verifyGithub(accessToken: string){
    const {data} = await axios.get(`https://api.github.com/user`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return data.login ? "success" : "error";
}

async function verifyCredentials(accessToken: string){
    const headers = {
        Authorization: `Bearer ${accessToken}`,
        "X-Provider": "credentials"
    }

    const {data} = await axios.get(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/verify`, {headers: headers});
    return data.message === "success" ? "success" : "error";
}



export default async function verifyAcessToken(provider: string, accessToken: string){

    switch(provider){
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