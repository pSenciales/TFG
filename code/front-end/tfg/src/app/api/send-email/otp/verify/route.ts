import { NextRequest, NextResponse } from "next/server";
import { verifyOTP } from "@/lib/mail/utils";

export async function POST(req: NextRequest) {
    try {
        const { token, mail, otp } = await req.json();

        if (!token || !mail || !otp) {
            return NextResponse.json({ message: "Faltan datos" }, { status: 400 });
        }

        if (verifyOTP(token, otp, mail)!==true) {
            return NextResponse.json({ message: "Código inválido o caducado"  }, { status: 400 });
        }
        return NextResponse.json({ message: "Código verificado"}, { status: 200 });


    } catch (error) {
        return NextResponse.json({ message: "Error enviando correo", error }, { status: 500 });
    }
}


