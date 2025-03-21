import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import axios from "axios";
import verifyAcessToken  from "@/app/api/middleware";
import { authOptions } from "@/lib/auth";
import { getToken } from "next-auth/jwt"

export async function POST(req: NextRequest) {
    try {
        const {url, method, body, accessTokenTest} = await req.json();
        const session = await getServerSession(authOptions);
        const token = await getToken({req})
        if (!session || !token || Date.parse(session.expires) < Date.now()) {
            return NextResponse.redirect("/login");
        }
        
        const accessToken = token.accessToken as string;
        const provider = token.provider as string;

        const verification = await verifyAcessToken("credentials", accessTokenTest);
        if (!verification) {
            return NextResponse.redirect("/login");
        }
        
        const headers = { Authorization: `Bearer ${accessTokenTest}`, "Content-Type": "application/json"}
        let response;
        switch (method.toLowerCase()){
            case "get": response = await axios.get(url, {headers: headers}); break;
            case "post": response = await axios.post(url, body, {headers: headers}); break;
            case "delete": response = await axios.delete(url, {headers: headers}); break;
            case "put": response = await axios.put(url, body, {headers: headers}); break;
            default: response = new Error("Method not allowed"); break;
        }
        
        if (response instanceof Error) {
            return NextResponse.json({ error: response.message }, { status: 400 });
        } else {
            return NextResponse.json(response.data, { status: 200 });
        }

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
        } else {
            console.error('Unexpected error', error);
        }
        return NextResponse.json({error:error}, {status:500})
    }
}
