import handlerbars from "handlebars";
import nodemailer from "nodemailer";
import otpTemplate from "@/lib/mail/templates/otp";
import statusTemplate from "@/lib/mail/templates/status";
import pdfReportTemplate from "@/lib/mail/templates/pdfReport";
import resetPasswordTemplete from "@/lib/mail/templates/resetPassword";
import otpGenerator from "otp-generator";
import jwt from "jsonwebtoken";

const templates: Record<string, string> = {
    otp: otpTemplate,
    status: statusTemplate,
    pdfReport: pdfReportTemplate,
    resetPassword: resetPasswordTemplete
};

export function compileTemplate(templateName: string, params: Record<string, unknown>) {
    const templateSource = templates[templateName];
    if (!templateSource) {
        throw new Error("Template not found");
    }
    const template = handlerbars.compile(templateSource);
    return template(params);
}

export function initTransporter() {
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
}

export async function sendMail(to: string, subject: string, html: string) {
    const transporter = initTransporter();

    return await transporter.sendMail({
        from: `Fairplay360 <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    });
}

export function generateOTP(to: string) {
    const otp = otpGenerator.generate(6, { specialChars: false, lowerCaseAlphabets: false, upperCaseAlphabets: false });
    const token = jwt.sign({ otp, to}, process.env.JWT_SECRET as string, { expiresIn: "2m" });
    return {token, otp};

}

export function verifyOTP(token: string, otp: string, to: string) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        if (typeof decoded !== "object") {
            throw new Error("Invalid token");
        } 
        return decoded.otp === otp && decoded.to === to;
    } catch (error) {
        return error instanceof jwt.TokenExpiredError ? "Token expired" : "Invalid token";
    }
}


export function verifyCaptcha(captchaJWT: string, captchaRecibed: string) {
    try {
            const decoded = jwt.verify(captchaJWT, process.env.JWT_SECRET as string);
            if (typeof decoded !== "object") {
                throw new Error("Invalid token");
            }
            return decoded.captcha === captchaRecibed;

    } catch (error) {
        return error instanceof jwt.TokenExpiredError ? "Token expired" : "Invalid token";
    }
}

