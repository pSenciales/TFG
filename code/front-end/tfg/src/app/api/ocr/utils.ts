import { NextResponse } from "next/server";
import { uploadImageBuffer, ocr } from "@/lib/image/utils";

export async function handleAnalizeImage(formData: FormData): Promise<NextResponse> {
    const file = formData.get('file');
    if (!file || !(file instanceof File)) {
        return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });
    }
    const image_url = await uploadImageBuffer(file);

    if (!image_url) {
        throw new Error("Image URL is undefined");
    }

    const result = await ocr(image_url) as unknown as { locale: string, description: string };
    const language = result.locale;
    if (!language || (language !== "en" && language !== "es")) {
        return NextResponse.json({ error: "Invalid language" }, { status: 400 });
    } else {
       // const context = formData.get('context');
       // const text = result.description;
        //TODO: Implementar la llamada a la API de OpenAI o DeepSeek
        
        return NextResponse.json({ result: result }, { status: 200 });
    }
}


export async function handleAnalizeText(formData: FormData): Promise<NextResponse> {
  //  const text = formData.get('text');
  //  const context = formData.get('context');

    return NextResponse.json({ result: {} }, { status: 200 });

}

export async function handleAnalizePost(formData: FormData): Promise<NextResponse> {
  //  const text = formData.get('text');
  //  const context = formData.get('context');

    return NextResponse.json({ result: {} }, { status: 200 });

}