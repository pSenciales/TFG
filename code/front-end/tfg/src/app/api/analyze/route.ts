import { NextRequest, NextResponse } from "next/server";
import { handleAnalyzeImage, handleAnalyzePost, handleAnalyzeText } from "./utils";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import verifySession, {verifyCaptchaToken} from "../middleware";
import { authOptions } from "@/lib/auth";
import { JWT as JWTType } from 'next-auth/jwt';


export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const captchaToken = formData.get("captchaToken")
        const session = await getServerSession(authOptions);
        const token = await getToken({ req });
        let verified = false;
        if (captchaToken) {
            verified = await verifyCaptchaToken(captchaToken as string);
        } else {
            verified = await verifySession(session, token);
        }

        if (!verified) {
            return NextResponse.json({ error: "Invalid session" }, { status: 401 });
        }

        const type = formData.get('type');
        switch (type) {
            case 'image': return await handleAnalyzeImage(formData);
            case 'text': return await handleAnalyzeText(formData);
            case 'post': {
                formData.append("accessToken", (token as JWTType)?.accessToken as string ?? '');
                formData.append("provider", session?.provider ?? '');
                formData.append("captchaToken", captchaToken ?? '');
                return await handleAnalyzePost(formData);
            }
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