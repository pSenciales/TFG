import { NextRequest, NextResponse } from "next/server";
import { handleAnalyzeImage, handleAnalyzePost, handleAnalyzeText, checkBanned } from "./utils";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import verifySession, {verifyCaptchaToken} from "../middleware";
import { authOptions } from "@/lib/auth";
import { JWT as JWTType } from 'next-auth/jwt';
import jwt from "jsonwebtoken";



export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const captchaToken = formData.get("captchaToken")
        const session = await getServerSession(authOptions);
        const token = await getToken({ req });
        let verified = {verification:false, error:""};	
        
        if (captchaToken) {
            const banned = await checkBanned(formData.get("email") as string);
            
            if (banned) {
                return NextResponse.json({ error: "Email is banned" }, { status: 403 });
            }

            verified = await verifyCaptchaToken(captchaToken as string);
        } else {
            verified = await verifySession(session, { ...token, exp: (token as JWTType)?.exp ?? 0 } as JWTType & { exp: number });
        }        
        if (!verified.verification) {
            return NextResponse.json({ error: verified.error }, { status: 401 });
        }
        const type = formData.get('type');
        formData.append("accessToken", (token as JWTType)?.accessToken as string ?? '');
        formData.append("provider", session?.provider ?? '');
        let captchaJWT: string | null = null;

        if(captchaToken) {
        captchaJWT = jwt.sign(
            { captcha: captchaToken },
            process.env.JWT_SECRET as string,
            { expiresIn: "2m" }
        );
        formData.append("captchaJWT", captchaJWT);
    }

        
        switch (type) {
            case 'image': return await handleAnalyzeImage(formData);
            case 'text': return await handleAnalyzeText(formData);
            case 'post': return await handleAnalyzePost(formData);
            default: return NextResponse.json({ error: "Invalid type of report" }, { status: 400 });
        }

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
        } else {
            console.error("Unexpected error", error);
        }
        return NextResponse.json({ error: error }, { status: 500 });
    }
}