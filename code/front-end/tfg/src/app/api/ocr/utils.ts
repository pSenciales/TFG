import { NextResponse } from "next/server";
import { uploadImageBuffer, ocr } from "@/lib/image/utils";
import analizeHateSpeech from "@/lib/analizeHateSpeech";

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
        const context = formData.get('context');
        const text = result.description;
        //TODO: Implementar la llamada a la API de OpenAI o DeepSeek



        return NextResponse.json({ result: result }, { status: 200 });
    }
}


export async function handleAnalizeText(formData: FormData): Promise<NextResponse> {
    const content = formData.get('content') as string || "";
    const context = formData.get('context') as string || "";
    console.log("\n\nENTRAMOS EN EL HANDLEANALIZETEXT\n\n");
    const analize = await analizeHateSpeech(content, context, "en");
    return NextResponse.json(analize, { status: 200 });

}

export async function handleAnalizePost(formData: FormData): Promise<NextResponse> {
    const url = formData.get('text');
    const context = formData.get('context');

    return NextResponse.json({ result: {} }, { status: 200 });

}

