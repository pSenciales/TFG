import { NextRequest, NextResponse } from "next/server";
//import {testStorage} from "@/lib/pdf/utils";

export async function GET(req: NextRequest) {
    try {
        //testStorage();
        return NextResponse.json({success: "yeyyy"}, {status: 200})
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
        } else {
            console.error("Unexpected error", error);
        }
        return NextResponse.json({ error: error }, { status: 500 });
    }
}