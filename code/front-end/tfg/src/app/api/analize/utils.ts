import { NextResponse } from "next/server";
import { uploadImageBuffer, ocr, caption } from "@/lib/image/utils";
import analizeHateSpeech from "@/lib/analizeHateSpeech";
import axios from "axios";

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
        const context = formData.get('context') as string || "";
        const content = result.description;

        const analize = await analizeHateSpeech(content, context, "en");

        return NextResponse.json(analize, { status: 200 });
    }
}


export async function handleAnalizeText(formData: FormData): Promise<NextResponse> {
    const content = formData.get('content') as string || "";
    const context = formData.get('context') as string || "";
    const analize = await analizeHateSpeech(content, context, "en");
    return NextResponse.json(analize, { status: 200 });
}

export async function handleAnalizePost(formData: FormData, accessToken: string, provider: string): Promise<NextResponse> {
    const url = formData.get('url');
    let context = formData.get('context') as string;
    try {
        const scrape = await axios.post(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/scrape_tweets`, { url: url }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-Provider": provider
            }
        })

        const tweet = scrape?.data?.tweet as string;
        const img = scrape?.data?.img as string;
        if (img) {
            const img_captioned = await caption(img) as unknown as { generated_text: string }[];
            context += `. Also, an image captioned as: ${img_captioned[0]?.generated_text}`;
        }

        const analize = await analizeHateSpeech(tweet, context, "en");
        return NextResponse.json(analize, { status: 200 });
    } catch (error) {
        return NextResponse.json(error, { status: 500 });
    }

}

