import { NextRequest, NextResponse } from "next/server";
import { compileTemplate, sendMail, generateOTP, verifyCaptcha } from "@/lib/mail/utils";
import axios from "axios"
import jwt from "jsonwebtoken";

const templateName = "otp";
const subject = "Código de verificación de correo electrónico";


export async function POST(req: NextRequest) {
    const { to, captchaRecibed, captchaJWT } = await req.json();
    const captchaSecret = process.env.RECAPTCHA_SECRET || null;
  
    if (!to)
      return NextResponse.json({ message: "Email missing!" }, { status: 422 });
  
    if (!captchaRecibed)
      return NextResponse.json(
        { message: "Captcha verification token missing!" },
        { status: 422 }
      );
  
    let validCaptcha = false;
    let newCaptchaJWT = captchaJWT; // Usaremos el recibido o lo generamos
  
    if (captchaJWT) {
      validCaptcha = verifyCaptcha(captchaJWT, captchaRecibed) === true;
    } else {
      try {
        const response = await axios.post(
          `https://www.google.com/recaptcha/api/siteverify?secret=${captchaSecret}&response=${captchaRecibed}`
        );
        if (response.data.success) {
          newCaptchaJWT = jwt.sign(
            { captcha: captchaRecibed },
            process.env.JWT_SECRET as string,
            { expiresIn: "5m" }
          );
          validCaptcha = true;
        }
      } catch (error) {
        return NextResponse.json(
          { message: "Error verifying captcha", error },
          { status: 500 }
        );
      }
    }
    if (!validCaptcha) {
      return NextResponse.json(
        { message: "Failed to verify the captcha" },
        { status: 405 }
      );
    }
    try {
      const { token, otp } = generateOTP(to);
      const html = compileTemplate(templateName, { otp, name: to });
      await sendMail(to, subject, html);
  
      return NextResponse.json(
        { message: "Mail sent", token, captchaJWT: newCaptchaJWT },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Error sending mail", error },
        { status: 500 }
      );
    }
  }
  


