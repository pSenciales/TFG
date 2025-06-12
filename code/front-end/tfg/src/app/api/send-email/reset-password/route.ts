import { NextRequest, NextResponse } from "next/server";
import { compileTemplate, sendMail } from "@/lib/mail/utils";
import jwt from "jsonwebtoken";

const templateName = "resetPassword";
const subject = "Change your password";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email)
            return NextResponse.json({ message: "Email missing!" }, { status: 422 });

        const emailCoded = jwt.sign({email}, process.env.JWT_SECRET as string, { expiresIn: "10m"});
        const link = `${process.env.NEXT_PUBLIC_BASE_URL}/en/reset-password/${emailCoded}`;
        const html = compileTemplate(templateName, {name:email, link});
        await sendMail(email, subject, html);

        return NextResponse.json(
            { message: "Mail sent"},
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in reset password:', error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}



