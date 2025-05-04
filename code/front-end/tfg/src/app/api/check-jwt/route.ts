// app/api/check-jwt/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("jwt");

  if (!token) {
    return NextResponse.json(
      { error: "Missing token" },
      { status: 400 }
    );
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    if (typeof decoded === "string") {
      return NextResponse.json(
        { error: "Invalid token payload" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { status: "ok"},
      { status: 200 }
    );
  } catch (err: unknown) {
    let message = "Invalid token";
    if (err instanceof jwt.TokenExpiredError) {
      message = "Token expired";
    } else if (err instanceof jwt.JsonWebTokenError) {
      message = "Token error";
    }
    return NextResponse.json(
      { error: message },
      { status: 401 }
    );
  }
}
