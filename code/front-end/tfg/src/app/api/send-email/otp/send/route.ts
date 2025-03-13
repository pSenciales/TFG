import { NextRequest, NextResponse } from "next/server";
import { compileTemplate, sendMail, generateOTP } from "@/lib/mail/utils";


const templateName = "otp";
const subject = "Código de verificación de correo electrónico";	


export async function POST(req: NextRequest) {
    try {
        const { to, name } = await req.json();

        if (!templateName) {
            return NextResponse.json({ message: "Template no encontrado" }, { status: 400 });
        }


        const { token, otp } = generateOTP(to);
        const html = compileTemplate(templateName, { name, otp });
        await sendMail(to, subject, html);

        return NextResponse.json({ message: "Correo enviado", token }, { status: 200 });


    } catch (error) {
        return NextResponse.json({ message: "Error enviando correo", error }, { status: 500 });
    }
}


