import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import axios from "axios";
import verifySession, {verifyCaptchaToken} from "@/app/api/middleware";
import { authOptions } from "@/lib/auth";
import { getToken } from "next-auth/jwt"
import { JWT as JWTType } from 'next-auth/jwt';

export async function POST(req: NextRequest) {
    try {
        const {url, method, body} = await req.json();
        const session = await getServerSession(authOptions);
        const token = await getToken({req})
        
        const verification = await verifySession(session, { ...token, exp: (token as JWTType)?.exp ?? 0 } as JWTType & { exp: number });
        if (!verification) {
            return NextResponse.redirect("/login");
        }
        
        const headers = { Authorization: `Bearer ${token?.accessToken}`, "Content-Type": "application/json"}
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
