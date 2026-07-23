import { NextResponse } from "next/server";

import { findUserByEmail } from "@/lib/auth/store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = body.email?.trim().toLowerCase() || "";

    if (!email) {
      return NextResponse.json({ message: "Email is required." }, { status: 400 });
    }

    const user = await findUserByEmail(email);

    // For privacy, always return success regardless of account existence.
    if (!user) {
      return NextResponse.json({
        message: "If an account exists for this email, reset instructions have been sent.",
      });
    }

    return NextResponse.json({
      message: "If an account exists for this email, reset instructions have been sent.",
    });
  } catch (error) {
    console.error("[/api/auth/forgot-password]", error);
    return NextResponse.json({ message: "Unable to process forgot password request." }, { status: 500 });
  }
}
