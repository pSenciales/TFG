import { NextRequest, NextResponse } from "next/server";
import {handleAnalizeImage, handleAnalizePost, handleAnalizeText} from "./utils";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import verifySession from "../middleware";
import { authOptions } from "@/lib/auth";


export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const token = await getToken({ req });
        
        const verified = await verifySession(session, token);
        if (!verified) {
            return NextResponse.json({ error: "Invalid session" }, { status: 401 });
        }

        const formData = await req.formData();
        const type = formData.get('type');
        console.log("\n\nENTRAMOS EN EL ROUTE\n\n");
        switch (type) {
            case 'image': return await handleAnalizeImage(formData);
            case 'text': return await handleAnalizeText(formData);
            case 'post': return await handleAnalizePost(formData);
            default: return NextResponse.json({ error: "Invalid type of report" }, { status: 400 });
        }
       
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
        } else {
            console.error("Unexpected error", error);
        }
        return NextResponse.json({ error: error }, { status: 500 });
    }
}