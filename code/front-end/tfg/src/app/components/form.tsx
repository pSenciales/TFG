"use client"

import React, { useState } from "react"
import axios from "axios" // Cambiamos require por import

export default function Form() {
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [responseMessage, setResponseMessage] = useState<string>("")

    // Función para manejar la selección de una imagen
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedImage(event.target.files[0])
        }
    }

    // Función para manejar el envío del formulario
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        if (!selectedImage) {
            setResponseMessage("Por favor, selecciona una imagen antes de enviar.")
            return
        }

        const formData = new FormData()
        formData.append("image", selectedImage)

        try {
            const response = await axios.post("https://hate-speech--s14y1rp.internal.jollystone-6e36ddb6.westeurope.azurecontainerapps.io/ocr", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            // Aquí no necesitas hacer response.ok ni response.json, axios ya maneja esto
            setResponseMessage(`Respuesta del servidor: ${response.data.message || response.data.text}`)
        } catch (error) {
            setResponseMessage(`Error: ${(error as Error).message}`)
        }
    }

    return (
        <div className="mt-5 p-4 bg-white rounded-md shadow-md max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">Subir Imagen</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Enviar Imagen
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
