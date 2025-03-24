import { NextRequest, NextResponse } from "next/server";
import vision from "@google-cloud/vision";
import { uploadImageBuffer } from "@/lib/image/utils";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import verifyAcessToken from "../middleware";
import { authOptions } from "@/lib/auth";

const clientGoogle = new vision.v1.ImageAnnotatorClient({
    key: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});



export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const token = await getToken({ req });
        if (!session || !token || Date.parse(session.expires) < Date.now()) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        const verification = await verifyAcessToken("credentials", token.accessToken as string);
        if (!verification) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        const formData = await req.formData();

        const file = formData.get('file');
        if (!file) {
            return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });
        }

        if (!(file instanceof File)) {
            return NextResponse.json({ error: "El archivo recibido no es válido" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Llama a la función que sube el buffer a Cloudinary
        const image_url = await uploadImageBuffer(buffer);


        if (!image_url) {
            throw new Error("Image URL is undefined");
        }

        const [result] = await clientGoogle.textDetection(image_url);
        const annotations = result.textAnnotations;

        // Cogemos los campos de idioma y descripción
        const filteredAnnotations = annotations && annotations.length > 0
            ? {
                locale: annotations[0].locale,
                description: annotations[0].description,
            }
            : null;

        return NextResponse.json({ result: filteredAnnotations }, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
        } else {
            console.error("Unexpected error", error);
        }
        return NextResponse.json({ error: error }, { status: 500 });
    }
}