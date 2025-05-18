import { NextResponse } from "next/server";
import { uploadImageBuffer, ocr, caption } from "@/lib/image/utils";
import generateAndSendPDF from "@/lib/pdf/utils"
import analyzeHateSpeech from "@/lib/analyzeHateSpeech";
import axios, { AxiosError } from "axios";
import { AxiosResponse } from "axios";

export async function handleAnalyzeImage(formData: FormData): Promise<NextResponse> {
    const file = formData.get('file');
    const captchaToken = formData.get('captchaToken');
    const captchaJWT = formData.get('captchaJWT');
    const accessToken = formData.get('accessToken');
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
        const source = formData.get("source") as string || "";
        const email = formData.get("email") as string || "";

        try {
            const analyze = await analyzeHateSpeech(content, context);
            const pdfResponse = await generateAndSendPDF(content, context, source, analyze.content, analyze.reasoning, email);
            if ('message' in pdfResponse && pdfResponse.message === "success") {
                if ('link' in pdfResponse) {
                    const is_hate = analyze.content === "hate speech" ? "true" : "false";
                    const res = await createReport(content, context, source, is_hate, email, formData.get('provider') as string, pdfResponse.link, captchaToken as string || undefined, captchaJWT as string || undefined, accessToken as string || undefined);
                    if (res.status < 200 || res.status >= 300) {
                        return NextResponse.json("Error to create report", { status: 500 });
                    }
                    return NextResponse.json({ analyze, pdfLink: pdfResponse.link }, { status: 200 });
                } else {
                    return NextResponse.json("Error to generate PDF", { status: 500 });
                }
            } else {
                return NextResponse.json("Error to generate PDF", { status: 500 });
            }

        } catch (error) {
            if (error instanceof AxiosError) {
                return NextResponse.json({ error }, { status: 500 });
            }
            return NextResponse.json({ error: "Unexpected error occurred" }, { status: 500 });
        }
    }
}


export async function handleAnalyzeText(formData: FormData): Promise<NextResponse> {
    const content = formData.get('content') as string || "";
    const context = formData.get('context') as string || "";
    const source = formData.get("source") as string || "";
    const email = formData.get("email") as string || "";
    const captchaToken = formData.get('captchaToken');
    const captchaJWT = formData.get('captchaJWT');
    const accessToken = formData.get('accessToken');
    try {
        const analyze = await analyzeHateSpeech(content, context);
        const pdfResponse = await generateAndSendPDF(content, context, source, analyze.content, analyze.reasoning, email);
        if ('message' in pdfResponse && pdfResponse.message === "success") {
            if ('link' in pdfResponse) {
                const is_hate = analyze.content === "hate speech" ? "true" : "false";
                console.log("LLEGA A GENERAR PDF")
                const res = await createReport(content, context, source, is_hate, email, formData.get('provider') as string, pdfResponse.link, captchaToken as string || undefined, captchaJWT as string || undefined, accessToken as string || undefined);
                if (res.status < 200 || res.status >= 300) {
                    console.log("LLEGA A GENERAR PDF")
                    return NextResponse.json("Error to create report", { status: 500 });
                }
                return NextResponse.json({ analyze, pdfLink: pdfResponse.link }, { status: 200 });
            } else {
                return NextResponse.json("Error to generate PDF", { status: 500 });
            }
        } else {
            return NextResponse.json("Error to generate PDF", { status: 500 });
        }
    } catch (error) {
        if (error instanceof AxiosError) {
            return NextResponse.json({ error }, { status: 500 });
        }
        return NextResponse.json({ error: `Unexpected error occurred: ${error}` }, { status: 500 });
    }

}

export async function handleAnalyzePost(formData: FormData): Promise<NextResponse> {
    let context = formData.get('context') as string;
    const url = formData.get('url') as string || "";
    const email = formData.get("email") as string || "";
    const captchaToken = formData.get('captchaToken');
    const captchaJWT = formData.get('captchaJWT');
    const accessToken = formData.get('accessToken');
    let scrape: AxiosResponse | null = null
    try {
        if (captchaToken) {

            scrape = await axios.post(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/scrape_tweets`, { url: url, captchaToken: captchaToken as string, captchaJWT: captchaJWT as string })
        } else {
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
            context += ` Also, an image captioned as: ${img_captioned}`;
        }
        try {
            const analyze = await analyzeHateSpeech(tweet, context);
            const pdfResponse = await generateAndSendPDF(tweet, context, url, analyze.content, analyze.reasoning, email);
            if ('message' in pdfResponse && pdfResponse.message === "success") {
                if ('link' in pdfResponse) {
                    const is_hate = analyze.content === "hate speech" ? "true" : "false";
                    const res = await createReport(tweet, context, url, is_hate, email, formData.get('provider') as string, pdfResponse.link, captchaToken as string || undefined, captchaJWT as string || undefined, accessToken as string || undefined);
                    if (res.status < 200 || res.status >= 300) {
                        return NextResponse.json("Error to create report", { status: 500 });
                    }
                    return NextResponse.json({ analyze, pdfLink: pdfResponse.link }, { status: 200 });
                } else {
                    return NextResponse.json("Error to generate PDF", { status: 500 });
                }
            } else {
                return NextResponse.json("Error to generate PDF", { status: 500 });
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                return NextResponse.json({ error }, { status: 500 });
            }
            return NextResponse.json({ error: "Unexpected error occurred" }, { status: 500 });
        }

    } catch (error) {
        return NextResponse.json(error, { status: 500 });
    }

}


async function createReport(content: string, context: string, source: string, result: string, email: string, provider: string, pdfLink: string, captchaToken?: string, captchaJWT?: string, accessToken?: string) {
    if (!content || !source || !result || !email || !pdfLink) {
        throw new Error("Missing required fields for report creation");
    }

    const data = { content, context, source, is_hate: result, notification_email: email, provider, pdf_link: pdfLink, captchaToken: captchaToken, captchaJWT: captchaJWT };
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}`, "X-Provider": provider } : undefined;
    const res = await axios.post(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/reports`, data, { headers });
    return res;
}



