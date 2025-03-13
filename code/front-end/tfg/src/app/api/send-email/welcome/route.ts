import { NextRequest, NextResponse } from "next/server";
import { compileTemplate, sendMail } from "@/lib/mail/utils";

const templateName = "welcome";
const subject = "Beinvenido a Fairplay360";


export async function POST(req: NextRequest) {
    try {
        const { to, name } = await req.json();

        if (!templateName) {
            return NextResponse.json({ message: "Template no encontrado" }, { status: 400 });
        }

        const html = compileTemplate(templateName, { name: name });
        const res = await sendMail(to, subject, html);

        return NextResponse.json({ message: "Correo enviado", res }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Error enviando correo", error }, { status: 500 });
    }
}


