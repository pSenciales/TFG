import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import axios from "axios";
import verifyAcessToken  from "@/app/api/middleware";
import { authOptions } from "@/lib/auth";
const HF_KEY = process.env.HF_API_KEY;

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || Date.parse(session.expires) < Date.now()) {
            return NextResponse.redirect("/login");
        }
        console.log("\n"+JSON.stringify(session)+"\n");
        const accessToken = session.accessToken as string;
        const provider = session.provider as string;

        const verification = await verifyAcessToken(provider, accessToken);

        const response = await axios.post(
            "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base",
            {image: "https://pbs.twimg.com/media/GkfPNYBXAAAIaAi?format=jpg&name=small"},
            {
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${HF_KEY}`
                }
            }
            
        );
        const result = await response.data;
        console.log(result);
        console.log("\nRespuesta final:\n", result);
        console.log("\n"+verification+"\n");
        return NextResponse.json({ result }, { status: 200 });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
        } else {
            console.error('Unexpected error', error);
        }
    }
}
