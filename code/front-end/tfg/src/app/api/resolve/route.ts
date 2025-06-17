import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import axios from "axios";
import verifySession from "@/app/api/middleware";
import { authOptions } from "@/lib/auth";
import { getToken } from "next-auth/jwt"
import { JWT as JWTType } from 'next-auth/jwt';

import { compileTemplate, sendMail } from "@/lib/mail/utils";

export async function POST(req: NextRequest) {
    try {

        
        const { resolution, reportId, state, email } = await req.json();
        const session = await getServerSession(authOptions);
        const token = await getToken({ req })

        if(session?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
        if(!resolution || !reportId || !state || !email) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        
        const verification = await verifySession(session, { ...token, exp: (token as JWTType)?.exp ?? 0 } as JWTType & { exp: number });
        if (!verification.verification) {
            return NextResponse.json({ error: verification.error }, { status: 401 });
        }


        const headers = { Authorization: `Bearer ${token?.accessToken}`, "X-Provider": session?.provider, "Content-Type": "application/json" }
        const response = await axios.put(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/reports/${reportId}`, { resolution: resolution, state: state}, { headers: headers });

        if (response instanceof Error) {
            return NextResponse.json({ error: response.message }, { status: 400 });
        } else {
            if (response.status === 200 && response.data.success === "Notificable") {
                const html = compileTemplate("status", {
                    status: state.toUpperCase(),
                    statusClass: state.toLowerCase(),
                    reason: resolution.reason || "No reason provided",
                    name: email,
                    link: `${process.env.NEXT_PUBLIC_BASE_URL}/en/my-reports`
                })

                await sendMail(email, "Report Resolution", html);

            }

            return NextResponse.json(response.data, { status: 200 });
        }

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
        } else {
            console.error('Unexpected error', error);
        }
        return NextResponse.json({ error: error }, { status: 500 })
    }
}
