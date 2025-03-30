import { NextResponse } from "next/server";
import { uploadImageBuffer, ocr, caption } from "@/lib/image/utils";
import analizeHateSpeech from "@/lib/analizeHateSpeech";
import axios from "axios";
import { AxiosResponse } from "axios";
import jwt from "jsonwebtoken";

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

        const analize = await analizeHateSpeech(content, context);

        return NextResponse.json(analize, { status: 200 });
    }
}


export async function handleAnalizeText(formData: FormData): Promise<NextResponse> {
    const content = formData.get('content') as string || "";
    const context = formData.get('context') as string || "";
    const analize = await analizeHateSpeech(content, context);
    return NextResponse.json(analize, { status: 200 });
}

export async function handleAnalizePost(formData: FormData): Promise<NextResponse> {
    let context = formData.get('context') as string;
    const url = formData.get('url');
    const captchaToken = formData.get('captchaToken');
    console.log(`TOKEN2: ${captchaToken}`);
    let scrape: AxiosResponse | null = null;
    try {
        if (captchaToken) {
            const captchaJWT = jwt.sign(
                { captcha: captchaToken },
                process.env.JWT_SECRET as string,
                { expiresIn: "1m" }
              );
            scrape = await axios.post(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/scrape_tweets`, { url: url, captchaToken: captchaToken as string, captchaJWT: captchaJWT as string })
        } else {
            const accessToken = formData.get('accessToken');
            const provider = formData.get('provider')
            console.log(`ENTRA AQUI`)
            scrape = await axios.post(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/scrape_tweets`, { url: url }, {
                headers: {
                    Authorization: `Bearer ${accessToken as string}`,
                    "X-Provider": provider as string
                }
            })
        }
        const tweet = scrape?.data?.tweet as string;
        const img = scrape?.data?.img as string;
        if (img) {
            const img_captioned = await caption(img) as unknown as { generated_text: string }[];
            context += `. Also, an image captioned as: ${img_captioned[0]?.generated_text}`;
        }
        const analize = await analizeHateSpeech(tweet, context);
        return NextResponse.json(analize, { status: 200 });
    } catch (error) {
        return NextResponse.json(error, { status: 500 });
    }

}

