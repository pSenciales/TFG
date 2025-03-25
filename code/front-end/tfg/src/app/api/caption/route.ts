import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import axios from "axios";
import verifyAcessToken  from "@/app/api/middleware";
import { authOptions } from "@/lib/auth";
import { getToken } from "next-auth/jwt"
const HF_KEY = process.env.HF_API_KEY;

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const token = await getToken({req})
        if (!session || !token || Date.parse(session.expires) < Date.now()) {
            return NextResponse.redirect("/login");
        }
        console.log("\n"+JSON.stringify(token)+"\n");

        const verification = await verifyAcessToken(session, token);
        if (!verification) {
            return NextResponse.redirect("/login");
        }
        const response = await axios.post(
            "https://router.huggingface.co/hf-inference/models/Salesforce/blip-image-captioning-base",
            {image: "https://pbs.twimg.com/media/GkfPNYBXAAAIaAi?format=jpg&name=small"},
            {
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${HF_KEY}`
                }
            }
            
        );
        console.log("\n\nLLEGA AQUI\n\n")
        const result = await response.data;
        console.log(result);
        console.log("\nRespuesta final:\n", result);
        return NextResponse.json({ result }, { status: 200 });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
        } else {
            console.error('Unexpected error', error);
        }
        return NextResponse.json({error:error}, {status:500})
    }
}
