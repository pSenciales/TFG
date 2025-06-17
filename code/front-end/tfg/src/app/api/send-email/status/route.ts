import { NextRequest, NextResponse } from "next/server";
import { compileTemplate, sendMail } from "@/lib/mail/utils";

const templateName = "status";
const subject = "Se ha actualizado el estado de una denuncia";


export async function POST(req: NextRequest) {
    try {
        const { to, name, status} = await req.json();

        if (!templateName) {
            return NextResponse.json({ message: "Template no encontrado" }, { status: 400 });
        }

        const html = compileTemplate(templateName, { name, status: status.ToUpperCase(), statusClass: status.toLowerCase(), link: `${process.env.NEXT_PUBLIC_BASE_URL}/en/my-reports` });
        const res = await sendMail(to, subject, html);

        return NextResponse.json({ message: "Correo enviado", res });


    } catch (error) {
        return NextResponse.json({ message: "Error enviando correo", error }, { status: 500 });
    }
}


