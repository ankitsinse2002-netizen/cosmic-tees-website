import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { createSessionCookiePayload } from "@/lib/auth/utils";
import { setSessionCookie } from "@/lib/auth/session";
import { createUser, findUserByEmail, toPublicUser } from "@/lib/auth/store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
    };

    const email = body.email?.trim().toLowerCase() || "";
    const password = body.password?.trim() || "";
    const firstName = body.firstName?.trim() || "";
    const lastName = body.lastName?.trim() || "";

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ message: "All required fields must be filled." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters." }, { status: 400 });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json({ message: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({
      email,
      passwordHash,
      firstName,
      lastName,
      phone: body.phone?.trim(),
    });

    await setSessionCookie(createSessionCookiePayload(user));

    return NextResponse.json({ user: toPublicUser(user) }, { status: 201 });
  } catch (error) {
    console.error("[/api/auth/register]", error);
    return NextResponse.json({ message: "Unable to create account." }, { status: 500 });
  }
}
