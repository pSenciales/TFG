"use client"

import React, { useState } from "react"
import axios from "axios"

import { Input } from "@/components/ui/input"

export default function FormHateDetect() {
    const [responseMessage, setResponseMessage] = useState<string>("")
    const [mensaje, setMensaje] = useState<string>("")
    const [contexto, setContexto] = useState<string>("")

    // Función para manejar el envío del formulario
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        const context = contexto ? `context: ${contexto}` : ""
        try {
            setResponseMessage("Loading...")
            const response = await axios.post(
                "https://DeepSeek-HateDetection.eastus2.models.ai.azure.com/v1/chat/completions",
                {
                    messages: [
                        { role: "system", content: "You are an AI assistant that analyzes text. Determine if a message is offensive and return just 'Hate Speech' or 'Not Hate Speech'." },
                        { role: "user", content: `Can you analyze this message for offensive content? '${mensaje}' ${context}` }
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
    
            // 🔹 Filtrar el contenido, eliminando <think>...</think>
            result = result.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

            const responseMessage = result || ""
            setResponseMessage(`Respuesta del servidor: ${responseMessage}`)
        } catch (error) {
            setResponseMessage(`Error: ${(error as Error).message}`)
        }
    }

    return (
        <div className="mt-5 p-4 bg-white rounded-md shadow-md max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">Comprobar mensaje</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                
                <Input
                    type="text"
                    onChange={(e) => setMensaje(e.target.value)}
                    placeholder="Mensaje"
                    required
                />
                <Input
                    type="text"
                    onChange={(e) => setContexto(e.target.value)}
                    placeholder="Contexto"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Comprobar
                </button>
            </form>
            {responseMessage && (
                <div className="mt-4 p-2 bg-gray-100 text-gray-700 rounded-md">
                    {responseMessage}
                </div>
            )}
        </div>
    )
}
