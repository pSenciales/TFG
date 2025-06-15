import { NextRequest, NextResponse } from "next/server";
import { compileTemplate, sendMail } from "@/lib/mail/utils";
import jwt from "jsonwebtoken";
import axios from "axios";

const templateName = "resetPassword";
const subject = "Change your password";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ message: "Email missing!" }, { status: 422 });
        }

        const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/users/email/${email}`);
        const userFound = userResponse.data.success === "User found";

        console.log("USUARIO ENCONTRADO: "+userFound);

        if (userFound) {
            const emailToken = jwt.sign({ email }, process.env.JWT_SECRET as string, { expiresIn: "10m" });
            const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/en/reset-password/${emailToken}`;
            const emailContent = compileTemplate(templateName, { name: email, link: resetLink });
            
            await sendMail(email, subject, emailContent);
        }

        return NextResponse.json({ message: "Mail sent" }, { status: 200 });
    } catch (error) {
        console.error('Error in reset password:', error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}



