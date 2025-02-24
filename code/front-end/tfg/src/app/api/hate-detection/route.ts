import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const HF_KEY = process.env.NEXT_PUBLIC_HF_API_KEY;

export async function GET(req: NextRequest) {
    try {
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-R1",
            {
                inputs: "Analyze this message: 'Monkeyyyy!!'. Context: 'a man in a white shirt is celebrating'.",
            },
            {
                headers: {
                    "Authorization": `Bearer ${HF_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        let result = response.data;
        console.log("✅ Respuesta final:", result);
        return NextResponse.json({ result }, { status: 200 });

    } catch (error) {
        console.log("❌ Error en la petición:", (error as any).response);
        return NextResponse.json({ error: "Error en la API: " + (error as any).message }, { status: 500 });
    }
}
