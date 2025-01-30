//WYPCKe0vfVsOCDXP4ggsgTX55kdguNc9
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log("📩 Recibido:", body);

        const response = await axios.post(
            "https://DeepSeek-HateDetection.eastus2.models.ai.azure.com/v1/chat/completions",
            {
                messages: [
                    { role: "system", content: "You are an AI assistant that analyzes text. Determine if a message is offensive and return just 'Hate Speech' or 'Not Hate Speech'." },
                    { role: "user", content: `Can you analyze this message for offensive content? '${body.mensaje}' ${body.context}` }
                ]
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer WYPCKe0vfVsOCDXP4ggsgTX55kdguNc9`,
                }
            }
        );

        let result = response.data.choices[0].message.content;
        console.log("📝 Respuesta antes de limpiar:", result);

        // 🔹 Filtrar el contenido, eliminando <think>...</think>
        result = result.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

        console.log("✅ Respuesta final:", result);
        return NextResponse.json({ result }, { status: 200 });

    } catch (error: string | any) {
        console.error("❌ Error en la API:", error.response?.data || error.message);
        return NextResponse.json({ error: error.response?.data || error.message }, { status: 500 });
    }
}
