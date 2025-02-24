import { NextResponse } from "next/server";
import axios from "axios";

const HF_KEY = process.env.NEXT_PUBLIC_HF_API_KEY;

export async function GET() {
    try {

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
        console.log("✅ Respuesta final:", result);
        return NextResponse.json({ result }, { status: 200 });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
        } else {
            console.error('Unexpected error', error);
        }
    }
}
