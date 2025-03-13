import handlerbars from "handlebars";
import nodemailer from "nodemailer";
import welcomeTemplate from "@/lib/mail/templates/welcome";
import otpTemplate from "@/lib/mail/templates/otp";
import statusTemplate from "@/lib/mail/templates/status";
const otpGenerator = require("otp-generator");
import jwt from "jsonwebtoken";

const templates: Record<string, string> = {
    welcome: welcomeTemplate,
    otp: otpTemplate,
    status: statusTemplate,
};

export function compileTemplate(templateName: string, params: Record<string, unknown>) {
    const templateSource = templates[templateName];
    if (!templateSource) {
        throw new Error("Template not found");
    }
    const template = handlerbars.compile(templateSource);
    return template(params);
}

function initTransporter() {
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
    const token = jwt.sign({ otp, to}, process.env.JWT_SECRET, { expiresIn: "10m" });
    return {token, otp};

}

export function verifyOTP(token: string, otp: string, to: string) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.otp === otp && decoded.to === to;
    } catch (error) {
        return error instanceof jwt.TokenExpiredError ? "Token expired" : "Invalid token";
    }
}

