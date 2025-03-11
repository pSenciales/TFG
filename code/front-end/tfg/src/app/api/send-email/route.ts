import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import handlerbars from "handlebars";
import welcomeTemplate from "@/lib/templates/welcome";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const templates: Record<string, string> = {
    welcome: welcomeTemplate,
};

export async function POST(req: NextRequest) {
    try {
        const { to, templateName, subject, params } = await req.json();

        if (!templateName || !templates[templateName]) {
            return NextResponse.json({ message: "Template no encontrado" }, { status: 400 });
        }

        const html = compileTemplate(templateName, params);

        const res = await transporter.sendMail({
            from: `Fairplay360 <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });

        return NextResponse.json({ message: "Correo enviado", res });

    } catch (error) {
        return NextResponse.json({ message: "Error enviando correo", error }, { status: 500 });
    }
}

function compileTemplate(templateName: string, params: Record<string, any>) {
    const templateSource = templates[templateName];
    const template = handlerbars.compile(templateSource);
    return template(params);
}
