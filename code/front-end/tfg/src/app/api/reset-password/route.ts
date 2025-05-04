// app/api/check-jwt/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import axios from "axios";

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("jwt");
  const { password } = await req.json();
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

    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }


    await axios.put(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/users/reset-password`,
      {
        jwt: token,
        password: password
      });

    return NextResponse.json({ status: 200 });
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
