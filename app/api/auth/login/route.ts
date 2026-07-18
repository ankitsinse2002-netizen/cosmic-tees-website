import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { setSessionCookie } from "@/lib/auth/session";
import { findUserByEmail, toPublicUser } from "@/lib/auth/store";
import { createSessionCookiePayload } from "@/lib/auth/utils";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const email = body.email?.trim().toLowerCase() || "";
    const password = body.password?.trim() || "";

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    await setSessionCookie(createSessionCookiePayload(user));
    return NextResponse.json({ user: toPublicUser(user) });
  } catch (error) {
    console.error("[/api/auth/login]", error);
    return NextResponse.json({ message: "Unable to login." }, { status: 500 });
  }
}
