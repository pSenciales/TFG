import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const HF_KEY = process.env.HF_API_KEY;

export async function POST(req: NextRequest) {
    try {

        const body = await req.json();
        console.log("Peticion recibida:", body);
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-R1",
            {
                inputs: "Analyze this message: 'Monkeyyyy!!'. Context: 'a man in a white shirt is celebrating'.",
            },
            {
                headers: {
                    "Authorization": `Bearer ${HF_KEY} `,
                    "Content-Type": "application/json"
                }
            }
        );

        const result = response.data;
        console.log("✅ Respuesta final:", result);
        return NextResponse.json({ result }, { status: 200 });

    } catch (error) {
        console.log("Error en la petición:", error);
        return NextResponse.json({ error: "Error en la API: " + error}, { status: 500 });
    }
}
